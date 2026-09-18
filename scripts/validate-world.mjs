import fs from 'node:fs';

const worldPath = new URL('../storyworld/sample/world.json', import.meta.url);
const world = JSON.parse(fs.readFileSync(worldPath, 'utf8'));

const errors = [];
const ids = new Set();

if (!world.id || !world.name || !world.version) {
  errors.push('World requires id, name and version.');
}

for (const entity of world.entities ?? []) {
  if (!entity.id || !entity.kind || !entity.name || !entity.status || !entity.summary) {
    errors.push(`Invalid entity: ${JSON.stringify(entity)}`);
    continue;
  }
  if (ids.has(entity.id)) errors.push(`Duplicate entity id: ${entity.id}`);
  ids.add(entity.id);
}

const relationshipIds = new Set();
for (const relationship of world.relationships ?? []) {
  if (relationshipIds.has(relationship.id)) {
    errors.push(`Duplicate relationship id: ${relationship.id}`);
  }
  relationshipIds.add(relationship.id);

  if (!ids.has(relationship.sourceId)) {
    errors.push(`Relationship ${relationship.id} has missing source ${relationship.sourceId}`);
  }
  if (!ids.has(relationship.targetId)) {
    errors.push(`Relationship ${relationship.id} has missing target ${relationship.targetId}`);
  }
}

if (errors.length) {
  console.error('Storyworld validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Storyworld valid: ${world.entities.length} entities, ${world.relationships.length} relationships.`
);
