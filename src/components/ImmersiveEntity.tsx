import type { CSSProperties } from 'react';
import type { Storyworld, StoryworldEntity } from '../domain/types';
import { entityById, relationshipsFor } from '../domain/storyworld';
import { resolveTheme } from '../engine/resolveTheme';
import { SceneArtwork } from './SceneArtwork';

interface Props {
  world: Storyworld;
  entity: StoryworldEntity;
  studio: boolean;
  onSelectEntity: (id: string) => void;
}

export function ImmersiveEntity({ world, entity, studio, onSelectEntity }: Props) {
  const theme = resolveTheme(entity);
  const family = entity.visual?.sceneFamily ?? 'abstract';
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
    <article
      className={`immersive-entity scene-${family} kind-${entity.kind}`}
      style={style}
    >
      <section className="cinematic-stage">
        <div className="stage-art" aria-hidden="true">
          <SceneArtwork entity={entity} />
        </div>
        <div className="stage-light" />

        <div className="stage-meta">
          <span>{entity.kind}</span>
          <span>{entity.status}</span>
          <span>{world.name}</span>
        </div>

        <div className="stage-title">
          <span className="stage-kicker">{entity.tags?.[0] ?? 'Storyworld thread'}</span>
          <h1>{entity.name}</h1>
          {entity.subtitle && <p>{entity.subtitle}</p>}
          <a href="#deeper">Discover this thread <i>↓</i></a>
        </div>

        {related.length ? (
          <div className="stage-threads" aria-label="Nearby story threads">
            {related.slice(0, 3).map(({ entity: other, relationship }, index) => (
              <button
                key={relationship.id}
                type="button"
                onClick={() => onSelectEntity(other.id)}
              >
                <span>{String(index + 1).padStart(2, '0')} · {relationship.label}</span>
                <strong>{other.name}</strong>
              </button>
            ))}
          </div>
        ) : null}

        <div className="stage-caption">
          <span>{entity.visual?.atmosphere ?? 'world'}</span>
          <span>{entity.visual?.materiality ?? 'presence'}</span>
        </div>
      </section>

      <div id="deeper" className="story-layer">
        <section className="meaning-entry">
          <div className="meaning-label">What you notice first</div>
          <p>{entity.summary}</p>
        </section>

        {entity.body?.length ? (
          <section className="editorial-story">
            <div className="editorial-aside">
              <span>Presence</span>
              <small>Stay with it before looking for an explanation.</small>
            </div>
            <div className="editorial-copy">
              {entity.body.map((paragraph, index) => (
                <p className={index === 0 ? 'lead' : ''} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {entity.timeline?.length ? (
          <section className="timeline-story">
            <div className="story-heading">
              <span>Trace through time</span>
              <h2>Not one moment.<br />A sequence of consequences.</h2>
            </div>
            <div className="timeline-ribbon">
              {[...entity.timeline]
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <div className="timeline-beat" key={item.id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item.dateLabel && <small>{item.dateLabel}</small>}
                    <h3>{item.title}</h3>
                    {item.summary && <p>{item.summary}</p>}
                  </div>
                ))}
            </div>
          </section>
        ) : null}

        {entity.process?.length ? (
          <section className="process-story">
            <div className="story-heading">
              <span>How it unfolds</span>
              <h2>A rule only becomes real through what it asks of people.</h2>
            </div>
            <div className="process-path">
              {entity.process.map((step, index) => (
                <div className="process-beat" key={step.id}>
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
          <section className="connections-story">
            <div className="story-heading">
              <span>Follow what touches this</span>
              <h2>The world is not organised into chapters.</h2>
            </div>
            <div className="connection-lines">
              {related.map(({ entity: other, relationship }, index) => (
                <button
                  type="button"
                  key={relationship.id}
                  onClick={() => onSelectEntity(other.id)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <small>{relationship.label}</small>
                  <strong>{other.name}</strong>
                  <em>{other.kind}</em>
                  <i>↗</i>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {studio ? (
          <section className="studio-layer">
            <div className="story-heading">
              <span>Studio layer</span>
              <h2>The machinery underneath the feeling.</h2>
            </div>
            <div className="studio-columns">
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
                <div>
                  <small>Provenance</small>
                  {entity.sourceRefs.map((source) => (
                    <p className="source-note" key={source.id}>
                      <strong>{source.label}</strong>
                      <span>{source.kind}</span>
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {related[0] ? (
          <section className="continue-story">
            <span>Let the world pull you sideways</span>
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
