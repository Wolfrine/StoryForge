import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const root = process.env.STORYWORLD_ROOT || 'storyworld/testbench';
const sourcePath = path.join(root, 'world.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const sourceSchema = JSON.parse(fs.readFileSync('schema/world-source-v1.schema.json', 'utf8'));
const packageSchema = JSON.parse(fs.readFileSync('schema/story-package-v1.schema.json', 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
const validateSource = ajv.compile(sourceSchema);
const validatePackage = ajv.compile(packageSchema);
const errors = [];

const isExternalAsset = (src) => /^(?:https?:|data:|blob:|\/)/i.test(src);

if (!validateSource(source)) {
  for (const error of validateSource.errors ?? []) {
    errors.push(`world${error.instancePath || '/'} ${error.message}`);
  }
}

const packageRoot = path.join(root, source.packageDirectory ?? 'packages');
const packageDirs = fs.existsSync(packageRoot)
  ? fs.readdirSync(packageRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];

const packages = [];

for (const dir of packageDirs) {
  const packageDir = path.join(packageRoot, dir.name);
  const packagePath = path.join(packageDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    errors.push(`${dir.name}: package.json missing`);
    continue;
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packages.push(pkg);

  if (!validatePackage(pkg)) {
    for (const error of validatePackage.errors ?? []) {
      errors.push(`${dir.name}${error.instancePath || '/'} ${error.message}`);
    }
  }

  if (pkg.id !== dir.name) {
    errors.push(`${dir.name}: folder name must match package id ${pkg.id}`);
  }

  for (const media of pkg.media ?? []) {
    if (isExternalAsset(media.src)) continue;

    const assetPath = path.resolve(packageDir, media.src);
    const packagePathRoot = path.resolve(packageDir);

    if (!assetPath.startsWith(packagePathRoot + path.sep)) {
      errors.push(`${pkg.id}: media path escapes package directory: ${media.src}`);
    } else if (!fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
      errors.push(`${pkg.id}: local media file missing: ${media.src}`);
    }
  }
}

if (!packages.length) {
  errors.push('world contains no packages');
}

const packageIds = new Set();
for (const pkg of packages) {
  if (packageIds.has(pkg.id)) errors.push(`duplicate package id: ${pkg.id}`);
  packageIds.add(pkg.id);

  const mediaIds = new Set((pkg.media ?? []).map((media) => media.id));
  const blockIds = new Set();

  for (const block of pkg.blocks ?? []) {
    if (blockIds.has(block.id)) errors.push(`${pkg.id}: duplicate block id ${block.id}`);
    blockIds.add(block.id);

    if (block.type === 'hero' && block.mediaId && !mediaIds.has(block.mediaId)) {
      errors.push(`${pkg.id}: hero references missing media ${block.mediaId}`);
    }

    if (block.type === 'gallery') {
      for (const mediaId of block.mediaIds) {
        if (!mediaIds.has(mediaId)) {
          errors.push(`${pkg.id}: gallery references missing media ${mediaId}`);
        }
      }
    }
  }
}

for (const pkg of packages) {
  for (const relationship of pkg.relationships ?? []) {
    if (!packageIds.has(relationship.targetId)) {
      errors.push(`${pkg.id}: relationship points to missing package ${relationship.targetId}`);
    }
  }
}

if (errors.length) {
  console.error('StoryForge world validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `StoryForge source valid: ${packages.length} packages, ${packages.reduce(
    (sum, pkg) => sum + (pkg.relationships?.length ?? 0),
    0
  )} outgoing relationships.`
);
