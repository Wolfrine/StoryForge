import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import {
  FieldValue,
  getFirestore
} from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const projectId = process.env.FIREBASE_PROJECT_ID || 'lumio-forge';
const worldId = process.env.STORYFORGE_WORLD_ID || 'novasaga';
const agentId =
  process.env.STORYFORGE_AGENT_ID ||
  process.env.GITHUB_ACTOR ||
  'storyforge-admin';

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId
  });
}

const db = getFirestore();
const storage = getStorage();

const packageSchema = JSON.parse(
  fs.readFileSync('schema/story-package-v1.schema.json', 'utf8')
);
const sourceSchema = JSON.parse(
  fs.readFileSync('schema/world-source-v1.schema.json', 'utf8')
);

const ajv = new Ajv({ allErrors: true, strict: false });
const validatePackage = ajv.compile(packageSchema);
const validateSource = ajv.compile(sourceSchema);

const MIME_BY_EXTENSION = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

function usage() {
  console.log(`
StoryForge content admin

Commands:
  seed [sourceRoot]
  list [published|draft]
  get <packageId> [published|draft]
  put <packageJsonPath> [published|draft]
  publish <packageId>
  pull [destinationDirectory]

Environment:
  FIREBASE_PROJECT_ID          default: lumio-forge
  STORYFORGE_WORLD_ID          default: novasaga
  STORYFORGE_AGENT_ID          actor recorded in metadata
  STORYFORGE_STORAGE_BUCKET    optional bucket override
  GOOGLE_APPLICATION_CREDENTIALS must point to an authorized service-account JSON
`);
}

function collectionName(mode = 'published') {
  if (mode === 'published') return 'packages';
  if (mode === 'draft') return 'drafts';
  throw new Error(`Unknown content mode: ${mode}`);
}

function packageRef(packageId, mode = 'published') {
  return db
    .collection('storyworlds')
    .doc(worldId)
    .collection(collectionName(mode))
    .doc(packageId);
}

function validatePackageOrThrow(pkg, sourceLabel) {
  if (validatePackage(pkg)) return;

  const details = (validatePackage.errors ?? [])
    .map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ');

  throw new Error(`${sourceLabel}: package schema invalid: ${details}`);
}

function validateSourceOrThrow(source, sourceLabel) {
  if (validateSource(source)) return;

  const details = (validateSource.errors ?? [])
    .map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ');

  throw new Error(`${sourceLabel}: world schema invalid: ${details}`);
}

function cleanDocument(data) {
  if (!data) return null;
  const { _meta: _ignored, ...rest } = data;
  return rest;
}

function isExternalSource(src) {
  return /^(?:https?:|data:|blob:|gs:\/\/|\/)/i.test(src);
}

function normalizeObjectPath(value) {
  return value.replace(/\\/g, '/').replace(/^\/+/, '');
}

function mimeTypeFor(filePath) {
  return MIME_BY_EXTENSION[path.extname(filePath).toLowerCase()] ||
    'application/octet-stream';
}

async function resolveBucketName() {
  if (process.env.STORYFORGE_STORAGE_BUCKET) {
    return process.env.STORYFORGE_STORAGE_BUCKET;
  }

  try {
    const response = await fetch(
      'https://lumio-forge.web.app/__/firebase/init.json',
      { cache: 'no-store' }
    );

    if (response.ok) {
      const config = await response.json();
      if (config.storageBucket) return config.storageBucket;
    }
  } catch {
    // Fall through.
  }

  return `${projectId}-storyforge-media`;
}

function parseGsUrl(value) {
  if (!value.startsWith('gs://')) return null;

  const withoutScheme = value.slice('gs://'.length);
  const slash = withoutScheme.indexOf('/');
  if (slash < 0) return null;

  return {
    bucket: withoutScheme.slice(0, slash),
    objectPath: withoutScheme.slice(slash + 1)
  };
}

function firebaseDownloadUrl(bucketName, objectPath, token) {
  return (
    `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}` +
    `/o/${encodeURIComponent(objectPath)}?alt=media&token=${encodeURIComponent(token)}`
  );
}

async function uploadLocalMedia(pkg, packageJsonPath, mode) {
  if (!pkg.media?.length) return pkg;

  const packageDir = path.resolve(path.dirname(packageJsonPath));
  const bucketName = await resolveBucketName();
  const bucket = storage.bucket(bucketName);

  const updated = structuredClone(pkg);

  for (const asset of updated.media) {
    if (isExternalSource(asset.src)) continue;

    const localPath = path.resolve(packageDir, asset.src);

    if (!localPath.startsWith(packageDir + path.sep)) {
      throw new Error(
        `${pkg.id}: media path escapes package folder: ${asset.src}`
      );
    }

    if (!fs.existsSync(localPath) || !fs.statSync(localPath).isFile()) {
      throw new Error(
        `${pkg.id}: media file does not exist: ${asset.src}`
      );
    }

    const relative = normalizeObjectPath(asset.src);
    const destination =
      `storyworlds/${worldId}/${mode === 'draft' ? 'drafts' : 'packages'}/` +
      `${pkg.id}/${relative}`;

    if (mode === 'draft') {
      await bucket.upload(localPath, {
        destination,
        resumable: false,
        metadata: {
          contentType: mimeTypeFor(localPath),
          cacheControl: 'private,max-age=0,no-store',
          metadata: {
            storyforgePackageId: pkg.id,
            storyforgeStatus: 'draft',
            storyforgeSourcePath: relative
          }
        }
      });

      asset.src = `gs://${bucketName}/${destination}`;
      console.log(`draft media uploaded: ${pkg.id}/${asset.id} -> ${destination}`);
      continue;
    }

    const token = crypto.randomUUID();

    await bucket.upload(localPath, {
      destination,
      resumable: false,
      metadata: {
        contentType: mimeTypeFor(localPath),
        cacheControl: 'public,max-age=31536000,immutable',
        metadata: {
          firebaseStorageDownloadTokens: token,
          storyforgePackageId: pkg.id,
          storyforgeStatus: 'published',
          storyforgeSourcePath: relative
        }
      }
    });

    asset.src = firebaseDownloadUrl(bucketName, destination, token);
    console.log(`published media uploaded: ${pkg.id}/${asset.id} -> ${destination}`);
  }

  return updated;
}

async function publishDraftMedia(pkg) {
  if (!pkg.media?.length) return pkg;

  const updated = structuredClone(pkg);
  const defaultBucketName = await resolveBucketName();

  for (const asset of updated.media) {
    const parsed = parseGsUrl(asset.src);
    if (!parsed) continue;

    const expectedPrefix = `storyworlds/${worldId}/drafts/${pkg.id}/`;
    if (!parsed.objectPath.startsWith(expectedPrefix)) {
      throw new Error(
        `${pkg.id}: draft media object is outside expected draft prefix: ${asset.src}`
      );
    }

    const bucketName = parsed.bucket || defaultBucketName;
    const bucket = storage.bucket(bucketName);
    const sourceFile = bucket.file(parsed.objectPath);

    const sourceSuffix = parsed.objectPath.slice(expectedPrefix.length);
    const publishedPath =
      `storyworlds/${worldId}/packages/${pkg.id}/${sourceSuffix}`;
    const destinationFile = bucket.file(publishedPath);

    await sourceFile.copy(destinationFile);

    const [sourceMetadata] = await sourceFile.getMetadata();
    const token = crypto.randomUUID();

    await destinationFile.setMetadata({
      contentType: sourceMetadata.contentType,
      cacheControl: 'public,max-age=31536000,immutable',
      metadata: {
        ...(sourceMetadata.metadata ?? {}),
        firebaseStorageDownloadTokens: token,
        storyforgePackageId: pkg.id,
        storyforgeStatus: 'published'
      }
    });

    asset.src = firebaseDownloadUrl(bucketName, publishedPath, token);

    console.log(
      `draft media published: ${pkg.id}/${asset.id} -> ${publishedPath}`
    );
  }

  return updated;
}

async function writePackage(pkg, mode = 'published') {
  validatePackageOrThrow(pkg, pkg.id);

  const ref = packageRef(pkg.id, mode);
  const existing = await ref.get();
  const currentRevision = existing.exists
    ? Number(existing.data()?._meta?.revision ?? 0)
    : 0;
  const nextRevision = currentRevision + 1;

  const batch = db.batch();

  if (existing.exists) {
    const previous = cleanDocument(existing.data());
    const revisionRef = ref.collection('revisions').doc(String(currentRevision));

    batch.set(revisionRef, {
      package: previous,
      _meta: {
        revision: currentRevision,
        archivedAt: FieldValue.serverTimestamp(),
        archivedBy: agentId
      }
    });
  }

  batch.set(ref, {
    ...pkg,
    _meta: {
      revision: nextRevision,
      status: mode,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: agentId
    }
  });

  await batch.commit();

  console.log(
    `${mode} package written: ${pkg.id} revision ${nextRevision}`
  );
}

async function seed(sourceRoot = 'storyworld/testbench') {
  const sourcePath = path.join(sourceRoot, 'world.json');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  validateSourceOrThrow(source, sourcePath);

  const packagesRoot = path.join(sourceRoot, source.packageDirectory);
  const packageDirs = fs
    .readdirSync(packagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const worldRef = db.collection('storyworlds').doc(worldId);
  await worldRef.set(
    {
      schemaVersion: '1.0',
      id: worldId,
      title: source.title,
      subtitle: source.subtitle ?? null,
      theme: source.theme,
      entryPolicy: source.entryPolicy ?? null,
      _meta: {
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: agentId,
        source: 'seed'
      }
    },
    { merge: true }
  );

  let published = 0;
  let skippedHidden = 0;

  for (const dir of packageDirs) {
    const packagePath = path.join(packagesRoot, dir.name, 'package.json');
    if (!fs.existsSync(packagePath)) continue;

    let pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    validatePackageOrThrow(pkg, packagePath);

    if (
      pkg.entry?.hidden &&
      process.env.STORYFORGE_SEED_INCLUDE_HIDDEN !== 'true'
    ) {
      skippedHidden += 1;
      continue;
    }

    pkg = await uploadLocalMedia(pkg, packagePath, 'published');
    await writePackage(pkg, 'published');
    published += 1;
  }

  console.log(
    `Seed complete: world=${worldId}, published=${published}, hidden skipped=${skippedHidden}`
  );
}

async function list(mode = 'published') {
  const snapshot = await db
    .collection('storyworlds')
    .doc(worldId)
    .collection(collectionName(mode))
    .get();

  const rows = snapshot.docs
    .map((document) => {
      const data = document.data();
      return {
        id: document.id,
        title: data.title,
        kind: data.kind,
        mediaCount: Array.isArray(data.media) ? data.media.length : 0,
        revision: data._meta?.revision ?? 0,
        updatedBy: data._meta?.updatedBy ?? null
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  console.log(JSON.stringify(rows, null, 2));
}

async function get(packageId, mode = 'published') {
  const snapshot = await packageRef(packageId, mode).get();

  if (!snapshot.exists) {
    throw new Error(`${mode} package not found: ${packageId}`);
  }

  console.log(JSON.stringify(cleanDocument(snapshot.data()), null, 2));
}

async function put(packageJsonPath, mode = 'draft') {
  let pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  validatePackageOrThrow(pkg, packageJsonPath);

  pkg = await uploadLocalMedia(pkg, packageJsonPath, mode);
  await writePackage(pkg, mode);
}

async function publish(packageId) {
  const draftRef = packageRef(packageId, 'draft');
  const draft = await draftRef.get();

  if (!draft.exists) {
    throw new Error(`Draft package not found: ${packageId}`);
  }

  let pkg = cleanDocument(draft.data());
  pkg = await publishDraftMedia(pkg);
  validatePackageOrThrow(pkg, packageId);

  await writePackage(pkg, 'published');

  await draftRef.set(
    {
      _meta: {
        ...(draft.data()?._meta ?? {}),
        lastPublishedAt: FieldValue.serverTimestamp(),
        lastPublishedBy: agentId
      }
    },
    { merge: true }
  );

  console.log(`Published draft: ${packageId}`);
}

async function pull(destination = 'storyworld/firestore-export') {
  const worldSnapshot = await db.collection('storyworlds').doc(worldId).get();

  if (!worldSnapshot.exists) {
    throw new Error(`World not found: ${worldId}`);
  }

  const packagesSnapshot = await db
    .collection('storyworlds')
    .doc(worldId)
    .collection('packages')
    .get();

  const worldData = cleanDocument(worldSnapshot.data());

  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.join(destination, 'packages'), { recursive: true });

  fs.writeFileSync(
    path.join(destination, 'world.json'),
    JSON.stringify(
      {
        schemaVersion: '1.0',
        id: worldId,
        title: worldData.title,
        subtitle: worldData.subtitle ?? undefined,
        theme: worldData.theme,
        entryPolicy: worldData.entryPolicy ?? undefined,
        packageDirectory: 'packages'
      },
      null,
      2
    ) + '\n'
  );

  for (const document of packagesSnapshot.docs) {
    const packageDir = path.join(destination, 'packages', document.id);
    fs.mkdirSync(packageDir, { recursive: true });
    fs.writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify(cleanDocument(document.data()), null, 2) + '\n'
    );
  }

  console.log(
    `Pulled ${packagesSnapshot.size} published packages into ${destination}`
  );
}

const [command, ...args] = process.argv.slice(2);

try {
  switch (command) {
    case 'seed':
      await seed(args[0]);
      break;
    case 'list':
      await list(args[0] ?? 'published');
      break;
    case 'get':
      if (!args[0]) throw new Error('get requires packageId');
      await get(args[0], args[1] ?? 'published');
      break;
    case 'put':
      if (!args[0]) throw new Error('put requires packageJsonPath');
      await put(args[0], args[1] ?? 'draft');
      break;
    case 'publish':
      if (!args[0]) throw new Error('publish requires packageId');
      await publish(args[0]);
      break;
    case 'pull':
      await pull(args[0]);
      break;
    default:
      usage();
      process.exit(command ? 1 : 0);
  }
} catch (error) {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
}
