import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import {
  FieldValue,
  getFirestore
} from 'firebase-admin/firestore';

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
const packageSchema = JSON.parse(
  fs.readFileSync('schema/story-package-v1.schema.json', 'utf8')
);
const sourceSchema = JSON.parse(
  fs.readFileSync('schema/world-source-v1.schema.json', 'utf8')
);
const ajv = new Ajv({ allErrors: true, strict: false });
const validatePackage = ajv.compile(packageSchema);
const validateSource = ajv.compile(sourceSchema);

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
  FIREBASE_PROJECT_ID      default: lumio-forge
  STORYFORGE_WORLD_ID      default: novasaga
  STORYFORGE_AGENT_ID      actor recorded in metadata
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

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    validatePackageOrThrow(pkg, packagePath);

    if (pkg.entry?.hidden && process.env.STORYFORGE_SEED_INCLUDE_HIDDEN !== 'true') {
      skippedHidden += 1;
      continue;
    }

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
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        kind: data.kind,
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
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  await writePackage(pkg, mode);
}

async function publish(packageId) {
  const draftRef = packageRef(packageId, 'draft');
  const draft = await draftRef.get();

  if (!draft.exists) {
    throw new Error(`Draft package not found: ${packageId}`);
  }

  const pkg = cleanDocument(draft.data());
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
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
