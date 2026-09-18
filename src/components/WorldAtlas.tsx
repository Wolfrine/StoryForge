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
  concept: 190,
  faction: 235,
  event: 280,
  story: 300,
  place: 330,
  person: 360,
  object: 250,
  species: 325,
  ability: 260
};

export function WorldAtlas({ world, selectedId, onSelectEntity, onExit }: Props) {
  const points = useMemo<Point[]>(() => {
    const total = Math.max(world.entities.length, 1);
    return world.entities.map((entity, index) => {
      const angle = ((Math.PI * 2) / total) * index - Math.PI / 2;
      const radius = radiusByKind[entity.kind] ?? 285;
      return {
        id: entity.id,
        x: 600 + Math.cos(angle) * radius,
        y: 380 + Math.sin(angle) * radius * 0.72
      };
    });
  }, [world.entities]);

  const pointById = new Map(points.map((point) => [point.id, point]));
  const selected = world.entities.find((entity) => entity.id === selectedId) ?? world.entities[0];

  return (
    <section className="atlas-page" data-qa-ready="true">
      <header className="atlas-header">
        <div>
          <span>World atlas</span>
          <h1>NovaSaga is not a line.</h1>
          <p>Every node is an entrance. Connections are the actual navigation.</p>
        </div>
        <button type="button" onClick={onExit}>Return to current thread</button>
      </header>

      <div className="atlas-paper">
        <svg viewBox="0 0 1200 760" className="atlas-svg" role="img" aria-label="NovaSaga relationship atlas">
          <defs>
            <radialGradient id="atlasPaperGlow">
              <stop offset="0%" stopColor="#e7c57c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e7c57c" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="600" cy="380" r="180" className="atlas-orbit" />
          <ellipse cx="600" cy="380" rx="340" ry="245" className="atlas-orbit soft" />
          <ellipse cx="600" cy="380" rx="465" ry="315" className="atlas-orbit softer" />

          {world.relationships.map((relationship) => {
            const source = pointById.get(relationship.sourceId);
            const target = pointById.get(relationship.targetId);
            if (!source || !target) return null;
            const active =
              relationship.sourceId === selectedId || relationship.targetId === selectedId;

            return (
              <path
                key={relationship.id}
                d={`M ${source.x} ${source.y} Q 600 380 ${target.x} ${target.y}`}
                className={active ? 'atlas-connection active' : 'atlas-connection'}
              />
            );
          })}

          <circle cx="600" cy="380" r="128" fill="url(#atlasPaperGlow)" />
          <text x="600" y="372" textAnchor="middle" className="atlas-center-small">STORYWORLD</text>
          <text x="600" y="408" textAnchor="middle" className="atlas-center-title">NovaSaga</text>

          {points.map((point) => {
            const entity = world.entities.find((candidate) => candidate.id === point.id);
            if (!entity) return null;
            const active = entity.id === selectedId;

            return (
              <g
                key={entity.id}
                transform={`translate(${point.x} ${point.y})`}
                className={active ? 'atlas-node active' : 'atlas-node'}
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
                <circle r={active ? 24 : 16} />
                <circle r="4" className="atlas-node-dot" />
                <text y={active ? 46 : 38} textAnchor="middle" className="atlas-node-type">
                  {entity.kind.toUpperCase()}
                </text>
                <text y={active ? 66 : 57} textAnchor="middle" className="atlas-node-label">
                  {entity.name}
                </text>
              </g>
            );
          })}
        </svg>

        {selected ? (
          <button
            className="atlas-selected-card"
            type="button"
            onClick={() => {
              onSelectEntity(selected.id);
              onExit();
            }}
          >
            <span>{selected.kind}</span>
            <strong>{selected.name}</strong>
            <p>{selected.summary}</p>
            <i>Enter this thread ↗</i>
          </button>
        ) : null}
      </div>
    </section>
  );
}
