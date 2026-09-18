import type { CSSProperties } from 'react';
import type { ExperienceDepth, Storyworld, StoryworldEntity } from '../domain/types';
import { entityById, relationshipsFor } from '../domain/storyworld';
import { resolveTheme } from '../engine/resolveTheme';
import { resolveVisualizations } from '../engine/resolveVisualizations';

interface Props {
  world: Storyworld;
  entity: StoryworldEntity;
  depth: ExperienceDepth;
  studio: boolean;
  onSelectEntity: (id: string) => void;
}

export function EntityRenderer({ world, entity, depth, studio, onSelectEntity }: Props) {
  const relationships = relationshipsFor(world, entity.id);
  const modules = resolveVisualizations(entity, depth, {
    relationshipCount: relationships.length,
    studio
  });
  const theme = resolveTheme(entity);

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
    <article className="entity-experience" style={style}>
      {modules.map((module) => {
        if (module.type === 'hero') {
          return (
            <header className="hero" key={module.id}>
              <div className="eyebrow">
                <span>{entity.kind}</span>
                <span className={`status status-${entity.status}`}>{entity.status}</span>
              </div>
              <h1>{entity.name}</h1>
              {entity.subtitle && <p className="subtitle">{entity.subtitle}</p>}
              <p className="summary">{entity.summary}</p>
              {entity.tags?.length ? (
                <div className="tag-row">
                  {entity.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </header>
          );
        }

        if (module.type === 'narrative') {
          return (
            <section className="module narrative" key={module.id}>
              <div className="module-kicker">Context</div>
              {entity.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          );
        }

        if (module.type === 'relationships') {
          return (
            <section className="module" key={module.id}>
              <div className="module-kicker">Connections</div>
              <div className="relationship-grid">
                {relationships.map((relationship) => {
                  const otherId =
                    relationship.sourceId === entity.id
                      ? relationship.targetId
                      : relationship.sourceId;
                  const other = entityById(world, otherId);
                  if (!other) return null;

                  return (
                    <button
                      className="relationship"
                      key={relationship.id}
                      type="button"
                      onClick={() => onSelectEntity(other.id)}
                    >
                      <span className="relationship-type">{relationship.label}</span>
                      <strong>{other.name}</strong>
                      {relationship.description && <small>{relationship.description}</small>}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        }

        if (module.type === 'timeline') {
          return (
            <section className="module" key={module.id}>
              <div className="module-kicker">Sequence</div>
              <ol className="timeline">
                {[...(entity.timeline ?? [])]
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <li key={item.id}>
                      <span className="timeline-marker" />
                      <div>
                        {item.dateLabel && <small>{item.dateLabel}</small>}
                        <strong>{item.title}</strong>
                        {item.summary && <p>{item.summary}</p>}
                      </div>
                    </li>
                  ))}
              </ol>
            </section>
          );
        }

        if (module.type === 'process') {
          return (
            <section className="module" key={module.id}>
              <div className="module-kicker">Process</div>
              <div className="process">
                {entity.process?.map((step, index) => (
                  <div className="process-step" key={step.id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step.title}</strong>
                    {step.summary && <p>{step.summary}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (module.type === 'meaning') {
          return (
            <section className="module studio-module" key={module.id}>
              <div className="module-kicker">Studio · Meaning model</div>
              {entity.meaning?.tensions?.length ? (
                <div className="studio-line">
                  <strong>Tensions</strong>
                  <span>{entity.meaning.tensions.join(' · ')}</span>
                </div>
              ) : null}
              {entity.meaning?.desiredFeelings?.length ? (
                <div className="studio-line">
                  <strong>Desired feelings</strong>
                  <span>{entity.meaning.desiredFeelings.join(' · ')}</span>
                </div>
              ) : null}
              {entity.meaning?.realization ? (
                <div className="studio-line">
                  <strong>Underlying realization</strong>
                  <span>{entity.meaning.realization}</span>
                </div>
              ) : null}
            </section>
          );
        }

        if (module.type === 'provenance') {
          return (
            <section className="module studio-module" key={module.id}>
              <div className="module-kicker">Studio · Provenance</div>
              <div className="source-list">
                {entity.sourceRefs?.map((source) => (
                  <div key={source.id}>
                    <strong>{source.label}</strong>
                    <span>{source.kind}</span>
                    {source.note && <small>{source.note}</small>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}
    </article>
  );
}
