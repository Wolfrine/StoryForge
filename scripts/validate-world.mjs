import fs from 'node:fs';
import Ajv from 'ajv';

const readJson = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));

const packageSchema = readJson('../schema/story-package-v1.schema.json');
const worldSchema = readJson('../schema/world-manifest-v1.schema.json');
const world = readJson('../storyworld/testbench/world.json');

const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addSchema(packageSchema);
const validateWorld = ajv.compile(worldSchema);

const errors = [];

if (!validateWorld(world)) {
  for (const error of validateWorld.errors ?? []) {
    errors.push(`${error.instancePath || '/'} ${error.message}`);
  }
}

const packageIds = new Set();
for (const pkg of world.packages ?? []) {
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

for (const pkg of world.packages ?? []) {
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
  `StoryForge v1 world valid: ${world.packages.length} packages, ${world.packages.reduce(
    (sum, pkg) => sum + (pkg.relationships?.length ?? 0),
    0
  )} outgoing relationships.`
);
