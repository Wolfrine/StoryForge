import type { Storyworld, StoryworldEntity } from '../domain/types';
import { SceneArtwork } from './SceneArtwork';

interface Props {
  world: Storyworld;
  onEnter: (entityId: string) => void;
}

function firstOfKind(world: Storyworld, kind: StoryworldEntity['kind']) {
  return world.entities.find((entity) => entity.kind === kind);
}

export function Opening({ world, onEnter }: Props) {
  const place = firstOfKind(world, 'place');
  const person = firstOfKind(world, 'person');
  const event = firstOfKind(world, 'event');
  const backdrop = place ?? world.entities[0];

  if (!backdrop) return null;

  const paths = [
    place ? { entity: place, cue: 'Begin with a place', note: 'Belonging before explanation' } : null,
    person ? { entity: person, cue: 'Begin with a person', note: 'A human thread through the world' } : null,
    event ? { entity: event, cue: 'Begin with a rupture', note: 'See what changed everything' } : null
  ].filter((value) => value !== null);

  return (
    <section className="opening">
      <div className="opening-art">
        <SceneArtwork entity={backdrop} />
      </div>
      <div className="opening-wash" />
      <div className="opening-copy">
        <span>NovaSaga / a world to be discovered</span>
        <h1>Don’t start with the explanation.</h1>
        <p>Start with something you notice. The world will reveal itself from there.</p>
      </div>
      <div className="opening-paths">
        {paths.map(({ entity, cue, note }, index) => (
          <button type="button" key={entity.id} onClick={() => onEnter(entity.id)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <small>{cue}</small>
              <strong>{entity.name}</strong>
              <em>{note}</em>
            </div>
            <i>↗</i>
          </button>
        ))}
      </div>
      <div className="opening-mark">STORYFORGE</div>
    </section>
  );
}
