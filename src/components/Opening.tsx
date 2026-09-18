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

  return (
    <section className="opening opening-v05">
      <div className="opening-art">
        <SceneArtwork entity={backdrop} />
      </div>
      <div className="opening-wash" />

      <div className="opening-topline">
        <span>STORYFORGE</span>
        <span>NOVASAGA / EXPLORE BY CURIOSITY</span>
      </div>

      <div className="opening-copy">
        <span>THE WORLD AFTER THE CESSATION</span>
        <h1>The wires went quiet.<br />The world did not.</h1>
        <p>
          Begin somewhere that should not have survived.
          Follow whatever catches your attention from there.
        </p>
      </div>

      <div className="opening-entry">
        {place ? (
          <button className="opening-primary" type="button" onClick={() => onEnter(place.id)}>
            <small>YOUR FIRST THREAD</small>
            <strong>{place.name}</strong>
            <span>Enter the place ↗</span>
          </button>
        ) : null}

        <div className="opening-alternates">
          {person ? (
            <button type="button" onClick={() => onEnter(person.id)}>
              <small>OR MEET</small>
              <strong>{person.name}</strong>
            </button>
          ) : null}
          {event ? (
            <button type="button" onClick={() => onEnter(event.id)}>
              <small>OR WITNESS</small>
              <strong>{event.name}</strong>
            </button>
          ) : null}
        </div>
      </div>

      <div className="opening-coordinate">
        <span>01</span>
        <p>A world does not need to be understood before it can be felt.</p>
      </div>
    </section>
  );
}
