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

const kindRadius: Record<string, number> = {
  faction: 228,
  event: 300,
  concept: 182,
  place: 322,
  person: 360,
  story: 260,
  object: 240,
  species: 300,
  ability: 246
};

export function WorldAtlas({ world, selectedId, onSelectEntity, onExit }: Props) {
  const points = useMemo<Point[]>(() => {
    const centerX = 600;
    const centerY = 390;
    const count = Math.max(world.entities.length, 1);

    return world.entities.map((entity, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      const radius = kindRadius[entity.kind] ?? 280;
      return {
        id: entity.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * 0.72
      };
    });
  }, [world.entities]);

  const byId = new Map(points.map((point) => [point.id, point]));
  const selected = world.entities.find((entity) => entity.id === selectedId) ?? world.entities[0];

  return (
    <section className="atlas-shell">
      <div className="atlas-paper" aria-hidden="true" />
      <div className="atlas-heading">
        <span>Atlas / {world.name}</span>
        <h2>Everything touches something else.</h2>
        <p>Select a thread, then enter it. There is no required reading order.</p>
      </div>

      <button className="atlas-exit" type="button" onClick={onExit}>
        Return to current thread
      </button>

      <div className="atlas-canvas-wrap">
        <svg className="atlas-canvas" viewBox="0 0 1200 780" role="img" aria-label="Storyworld relationship atlas">
          <circle className="atlas-ring" cx="600" cy="390" r="160" />
          <ellipse className="atlas-ring" cx="600" cy="390" rx="310" ry="224" />
          <ellipse className="atlas-ring" cx="600" cy="390" rx="455" ry="308" />

          {world.relationships.map((relationship) => {
            const source = byId.get(relationship.sourceId);
            const target = byId.get(relationship.targetId);
            if (!source || !target) return null;
            const active =
              relationship.sourceId === selectedId || relationship.targetId === selectedId;

            return (
              <line
                key={relationship.id}
                className={active ? 'atlas-link active' : 'atlas-link'}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
              />
            );
          })}

          <text className="atlas-center-small" x="600" y="380" textAnchor="middle">WORLD</text>
          <text className="atlas-center-name" x="600" y="416" textAnchor="middle">{world.name}</text>

          {points.map((point) => {
            const entity = world.entities.find((candidate) => candidate.id === point.id);
            if (!entity) return null;
            const active = entity.id === selectedId;

            return (
              <g
                key={entity.id}
                className={active ? `atlas-node active kind-${entity.kind}` : `atlas-node kind-${entity.kind}`}
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
                <circle r={active ? 29 : 20} />
                <circle className="node-core" r="4" />
                <text className="node-kind" y={active ? 49 : 41} textAnchor="middle">{entity.kind}</text>
                <text className="node-name" y={active ? 69 : 61} textAnchor="middle">{entity.name}</text>
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
          <span>Selected thread · {selected.kind}</span>
          <strong>{selected.name}</strong>
          <small>{selected.summary}</small>
          <i>Enter thread ↗</i>
        </button>
      ) : null}
    </section>
  );
}
