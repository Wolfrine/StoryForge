import { useMemo } from 'react';
import type { Storyworld } from '../domain/types';

interface Props {
  world: Storyworld;
  selectedId: string;
  onSelectEntity: (id: string) => void;
  onExit: () => void;
}

interface Point {
  id: string;
  x: number;
  y: number;
}

const radiusByKind: Record<string, number> = {
  concept: 178,
  faction: 238,
  event: 300,
  story: 280,
  place: 332,
  person: 360,
  object: 250,
  species: 325,
  ability: 264
};

export function WorldAtlas({ world, selectedId, onSelectEntity, onExit }: Props) {
  const points = useMemo<Point[]>(() => {
    const total = Math.max(world.entities.length, 1);
    return world.entities.map((entity, index) => {
      const angle = ((Math.PI * 2) / total) * index - Math.PI / 2;
      const radius = radiusByKind[entity.kind] ?? 285;
      return {
        id: entity.id,
        x: 650 + Math.cos(angle) * radius,
        y: 410 + Math.sin(angle) * radius * 0.72
      };
    });
  }, [world.entities]);

  const pointById = new Map(points.map((point) => [point.id, point]));
  const selected = world.entities.find((entity) => entity.id === selectedId) ?? world.entities[0];

  return (
    <section className="atlas-v06">
      <div className="atlas-v06-paper" aria-hidden="true" />

      <header className="atlas-v06-heading">
        <span>WORLD ATLAS / {world.name}</span>
        <h1>Follow the<br />connections.</h1>
        <p>
          The story is not a sequence of pages.
          Every node is somewhere you can enter.
        </p>
      </header>

      <button className="atlas-v06-exit" type="button" onClick={onExit}>
        Return to thread
      </button>

      <div className="atlas-v06-map">
        <svg viewBox="0 0 1300 820" role="img" aria-label="NovaSaga relationship atlas">
          <defs>
            <radialGradient id="atlas-v06-glow">
              <stop offset="0%" stopColor="#e7c477" stopOpacity=".25"/>
              <stop offset="100%" stopColor="#e7c477" stopOpacity="0"/>
            </radialGradient>
          </defs>

          <circle cx="650" cy="410" r="150" className="atlas-v06-orbit" />
          <ellipse cx="650" cy="410" rx="325" ry="235" className="atlas-v06-orbit faded" />
          <ellipse cx="650" cy="410" rx="465" ry="315" className="atlas-v06-orbit faint" />

          {world.relationships.map((relationship) => {
            const source = pointById.get(relationship.sourceId);
            const target = pointById.get(relationship.targetId);
            if (!source || !target) return null;
            const active =
              relationship.sourceId === selectedId || relationship.targetId === selectedId;

            return (
              <path
                key={relationship.id}
                d={`M ${source.x} ${source.y} Q 650 410 ${target.x} ${target.y}`}
                className={active ? 'atlas-v06-link active' : 'atlas-v06-link'}
              />
            );
          })}

          <circle cx="650" cy="410" r="126" fill="url(#atlas-v06-glow)" />
          <text x="650" y="401" textAnchor="middle" className="atlas-v06-center-kicker">STORYWORLD</text>
          <text x="650" y="437" textAnchor="middle" className="atlas-v06-center-title">{world.name}</text>

          {points.map((point) => {
            const entity = world.entities.find((candidate) => candidate.id === point.id);
            if (!entity) return null;
            const active = entity.id === selectedId;

            return (
              <g
                key={entity.id}
                transform={`translate(${point.x} ${point.y})`}
                className={active ? `atlas-v06-node active kind-${entity.kind}` : `atlas-v06-node kind-${entity.kind}`}
                role="button"
                tabIndex={0}
                onClick={() => onSelectEntity(entity.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectEntity(entity.id);
                  }
                }}
              >
                <circle className="node-halo" r={active ? 32 : 22} />
                <circle className="node-ring" r={active ? 23 : 16} />
                <circle className="node-core-v06" r="4" />
                <text y={active ? 49 : 41} textAnchor="middle" className="node-type-v06">{entity.kind}</text>
                <text y={active ? 69 : 61} textAnchor="middle" className="node-label-v06">{entity.name}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected ? (
        <aside className="atlas-v06-focus">
          <span>SELECTED / {selected.kind}</span>
          <h2>{selected.name}</h2>
          <p>{selected.summary}</p>
          <button
            type="button"
            onClick={() => {
              onSelectEntity(selected.id);
              onExit();
            }}
          >
            Enter this thread ↗
          </button>
        </aside>
      ) : null}

      <div className="atlas-v06-legend">
        <span><i className="person" />person</span>
        <span><i className="place" />place</span>
        <span><i className="event" />event</span>
        <span><i className="concept" />concept</span>
      </div>
    </section>
  );
}
