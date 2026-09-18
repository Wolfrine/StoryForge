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
  angle: number;
}

const kindRadius: Record<string, number> = {
  faction: 235,
  event: 285,
  concept: 185,
  place: 315,
  person: 350,
  story: 260,
  object: 220,
  species: 300,
  ability: 245
};

export function WorldAtlas({ world, selectedId, onSelectEntity, onExit }: Props) {
  const points = useMemo<Point[]>(() => {
    const centerX = 600;
    const centerY = 365;
    const count = Math.max(world.entities.length, 1);

    return world.entities.map((entity, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      const radius = kindRadius[entity.kind] ?? 280;
      return {
        id: entity.id,
        angle,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * 0.74
      };
    });
  }, [world.entities]);

  const byId = new Map(points.map((point) => [point.id, point]));
  const selected = world.entities.find((entity) => entity.id === selectedId) ?? world.entities[0];

  return (
    <section className="atlas-shell">
      <div className="atlas-atmosphere" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="atlas-heading">
        <span>StoryForge / World Atlas</span>
        <h2>{world.name}</h2>
        <p>There is no required reading order. Enter through any thread.</p>
      </div>

      <button className="atlas-exit" type="button" onClick={onExit}>
        Return to world
      </button>

      <div className="atlas-canvas-wrap">
        <svg className="atlas-canvas" viewBox="0 0 1200 730" role="img" aria-label="Storyworld relationship atlas">
          <defs>
            <radialGradient id="atlas-glow">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle className="atlas-ring ring-a" cx="600" cy="365" r="165" />
          <ellipse className="atlas-ring ring-b" cx="600" cy="365" rx="312" ry="225" />
          <ellipse className="atlas-ring ring-c" cx="600" cy="365" rx="450" ry="300" />

          {world.relationships.map((relationship) => {
            const source = byId.get(relationship.sourceId);
            const target = byId.get(relationship.targetId);
            if (!source || !target) return null;

            return (
              <line
                key={relationship.id}
                className={
                  relationship.sourceId === selectedId || relationship.targetId === selectedId
                    ? 'atlas-link active'
                    : 'atlas-link'
                }
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
              />
            );
          })}

          <circle className="atlas-center-glow" cx="600" cy="365" r="138" fill="url(#atlas-glow)" />
          <text className="atlas-center-label" x="600" y="356" textAnchor="middle">
            STORYWORLD
          </text>
          <text className="atlas-center-name" x="600" y="390" textAnchor="middle">
            {world.name}
          </text>

          {points.map((point) => {
            const entity = world.entities.find((candidate) => candidate.id === point.id);
            if (!entity) return null;
            const active = entity.id === selectedId;

            return (
              <g
                className={active ? 'atlas-node active' : 'atlas-node'}
                key={entity.id}
                role="button"
                tabIndex={0}
                transform={`translate(${point.x} ${point.y})`}
                onClick={() => onSelectEntity(entity.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectEntity(entity.id);
                  }
                }}
              >
                <circle r={active ? 26 : 18} />
                <circle className="atlas-node-core" r={4} />
                <text className="atlas-node-kind" y={active ? 46 : 38} textAnchor="middle">
                  {entity.kind.toUpperCase()}
                </text>
                <text className="atlas-node-name" y={active ? 66 : 57} textAnchor="middle">
                  {entity.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected ? (
        <button
          className="atlas-selection"
          type="button"
          onClick={() => {
            onSelectEntity(selected.id);
            onExit();
          }}
        >
          <span>Selected thread</span>
          <strong>{selected.name}</strong>
          <small>{selected.summary}</small>
          <i>enter ↗</i>
        </button>
      ) : null}
    </section>
  );
}
