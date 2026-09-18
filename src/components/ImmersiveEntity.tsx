import type { CSSProperties } from 'react';
import type { Storyworld, StoryworldEntity } from '../domain/types';
import { entityById, relationshipsFor } from '../domain/storyworld';
import { resolveTheme } from '../engine/resolveTheme';
import { AmbientField } from './AmbientField';

interface Props {
  world: Storyworld;
  entity: StoryworldEntity;
  studio: boolean;
  onSelectEntity: (id: string) => void;
}

const orbitPositions = [
  { x: 8, y: 24 },
  { x: 79, y: 17 },
  { x: 86, y: 59 },
  { x: 9, y: 68 },
  { x: 45, y: 8 },
  { x: 48, y: 82 }
];

export function ImmersiveEntity({ world, entity, studio, onSelectEntity }: Props) {
  const theme = resolveTheme(entity);
  const relationships = relationshipsFor(world, entity.id);
  const related = relationships
    .map((relationship) => {
      const otherId =
        relationship.sourceId === entity.id ? relationship.targetId : relationship.sourceId;
      const other = entityById(world, otherId);
      return other ? { entity: other, relationship } : null;
    })
    .filter((value) => value !== null);

  const style = {
    '--sf-bg': theme.background,
    '--sf-surface': theme.surface,
    '--sf-surface-strong': theme.surfaceStrong,
    '--sf-text': theme.text,
    '--sf-muted': theme.muted,
    '--sf-border': theme.border,
    '--sf-accent': theme.accent,
    '--sf-accent-soft': theme.accentSoft
  } as CSSProperties;

  return (
    <article className={`immersive-entity kind-${entity.kind}`} style={style}>
      <section className="world-stage">
        <AmbientField entity={entity} />

        <div className="stage-coordinate stage-coordinate-left">
          <span>{entity.kind}</span>
          <span>{entity.status}</span>
        </div>

        <div className="stage-coordinate stage-coordinate-right">
          <span>{world.name}</span>
          <span>{world.version}</span>
        </div>

        <div className="stage-copy">
          <div className="stage-index">STORYWORLD / {entity.kind.toUpperCase()}</div>
          <h1>{entity.name}</h1>
          {entity.subtitle && <p className="stage-subtitle">{entity.subtitle}</p>}
          <p className="stage-summary">{entity.summary}</p>

          {entity.tags?.length ? (
            <div className="stage-tags">
              {entity.tags.slice(0, 4).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="orbit-navigation" aria-label="Connected story elements">
          {related.slice(0, orbitPositions.length).map(({ entity: other, relationship }, index) => {
            const position = orbitPositions[index] ?? orbitPositions[0]!;
            return (
              <button
                key={relationship.id}
                type="button"
                className="orbit-node"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                onClick={() => onSelectEntity(other.id)}
              >
                <span>{relationship.label}</span>
                <strong>{other.name}</strong>
              </button>
            );
          })}
        </div>

        <a className="descend-cue" href="#experience">
          <span>enter this thread</span>
          <i />
        </a>
      </section>

      <div id="experience" className="experience-flow">
        {entity.body?.length ? (
          <section className="prose-field">
            <div className="section-number">01</div>
            <div className="section-label">Presence</div>
            <div className="prose-copy">
              {entity.body.map((paragraph, index) => (
                <p className={index === 0 ? 'lead' : ''} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {entity.timeline?.length ? (
          <section className="sequence-field">
            <div className="section-number">02</div>
            <div className="section-label">Trace through time</div>
            <div className="sequence-line">
              {[...entity.timeline]
                .sort((a, b) => a.order - b.order)
                .map((item, index, all) => (
                  <div className="sequence-moment" key={item.id}>
                    <div className="moment-axis">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {index < all.length - 1 && <i />}
                    </div>
                    <div className="moment-copy">
                      {item.dateLabel && <small>{item.dateLabel}</small>}
                      <h3>{item.title}</h3>
                      {item.summary && <p>{item.summary}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ) : null}

        {entity.process?.length ? (
          <section className="ritual-field">
            <div className="section-number">02</div>
            <div className="section-label">How it unfolds</div>
            <div className="ritual-track">
              {entity.process.map((step, index) => (
                <div className="ritual-step" key={step.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{step.title}</h3>
                    {step.summary && <p>{step.summary}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="thread-field">
            <div className="section-number">
              {entity.timeline?.length || entity.process?.length ? '03' : '02'}
            </div>
            <div className="section-label">Threads leaving here</div>
            <div className="thread-list">
              {related.map(({ entity: other, relationship }, index) => (
                <button
                  className="thread-row"
                  type="button"
                  key={relationship.id}
                  onClick={() => onSelectEntity(other.id)}
                >
                  <span className="thread-order">{String(index + 1).padStart(2, '0')}</span>
                  <span className="thread-relation">{relationship.label}</span>
                  <strong>{other.name}</strong>
                  <span className="thread-kind">{other.kind}</span>
                  <span className="thread-arrow">↗</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {studio ? (
          <section className="studio-field">
            <div className="studio-heading">
              <span>Studio layer</span>
              <strong>What the reader should never be told directly.</strong>
            </div>

            <div className="studio-grid">
              {entity.meaning?.tensions?.length ? (
                <div>
                  <small>Tensions</small>
                  <p>{entity.meaning.tensions.join(' / ')}</p>
                </div>
              ) : null}

              {entity.meaning?.desiredFeelings?.length ? (
                <div>
                  <small>Desired emotional movement</small>
                  <p>{entity.meaning.desiredFeelings.join(' → ')}</p>
                </div>
              ) : null}

              {entity.meaning?.realization ? (
                <div>
                  <small>Underlying realization</small>
                  <p>{entity.meaning.realization}</p>
                </div>
              ) : null}

              {entity.sourceRefs?.length ? (
                <div className="studio-sources">
                  <small>Provenance</small>
                  {entity.sourceRefs.map((source) => (
                    <p key={source.id}>
                      <strong>{source.label}</strong>
                      <span>{source.kind}</span>
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="next-thread">
            <span>Continue wandering</span>
            <button type="button" onClick={() => onSelectEntity(related[0]!.entity.id)}>
              <small>{related[0]!.relationship.label}</small>
              <strong>{related[0]!.entity.name}</strong>
              <i>↗</i>
            </button>
          </section>
        ) : null}
      </div>
    </article>
  );
}
