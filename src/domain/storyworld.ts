import type { Relationship, Storyworld, StoryworldEntity } from './types';

export function entityById(world: Storyworld, id: string): StoryworldEntity | undefined {
  return world.entities.find((entity) => entity.id === id);
}

export function relationshipsFor(world: Storyworld, entityId: string): Relationship[] {
  return world.relationships.filter(
    (relationship) =>
      relationship.sourceId === entityId || relationship.targetId === entityId
  );
}

export function relatedEntities(world: Storyworld, entityId: string): StoryworldEntity[] {
  const ids = relationshipsFor(world, entityId).map((relationship) =>
    relationship.sourceId === entityId ? relationship.targetId : relationship.sourceId
  );

  return ids
    .map((id) => entityById(world, id))
    .filter((entity): entity is StoryworldEntity => Boolean(entity));
}
