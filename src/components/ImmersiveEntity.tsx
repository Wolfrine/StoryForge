import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Storyworld, StoryworldEntity } from '../domain/types';
import { entityById, relationshipsFor } from '../domain/storyworld';
import { resolveTheme } from '../engine/resolveTheme';
import { SceneArtwork } from './SceneArtwork';

interface Props {
  world: Storyworld;
  entity: StoryworldEntity;
  studio: boolean;
  onSelectEntity: (id: string) => void;
  onOpenAtlas: () => void;
}

export function ImmersiveEntity({
  world,
  entity,
  studio,
  onSelectEntity,
  onOpenAtlas
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const theme = resolveTheme(entity);
  const relationships = relationshipsFor(world, entity.id);
  const related = relationships
    .map((relationship) => {
      const otherId =
        relationship.sourceId === entity.id ? relationship.targetId : relationship.sourceId;
      const other = entityById(world, otherId);
      return other ? { entity: other, relationship } : null;
    })
    .filter((item) => item !== null);

  const style = {
    '--sf-bg': theme.background,
    '--sf-surface': theme.surface,
    '--sf-surface-strong': theme.surfaceStrong,
    '--sf-text': theme.text,
    '--sf-muted': theme.muted,
    '--sf-border': theme.border,
    '--sf-accent': theme.accent,
    '--sf-accent-soft': theme.accentSoft,
    '--sf-sky-top': theme.skyTop,
    '--sf-sky-bottom': theme.skyBottom,
    '--sf-scene-a': theme.sceneA,
    '--sf-scene-b': theme.sceneB,
    '--sf-scene-c': theme.sceneC,
    '--sf-glow': theme.glow
  } as CSSProperties;

  return (
    <article className={`immersive-entity kind-${entity.kind}`} style={style} data-qa-ready="true">
      <section className="entity-stage">
        <div className="entity-art">
          <SceneArtwork entity={entity} />
          <div className="art-wash" />
          <div className="art-caption">
            <span>{entity.kind}</span>
            <span>{entity.status}</span>
          </div>
        </div>

        <div className="entity-intro">
          <div className="entity-breadcrumb">
            <button type="button" onClick={onOpenAtlas}>NovaSaga</button>
            <span>/</span>
            <span>{entity.kind}</span>
          </div>

          <h1>{entity.name}</h1>
          {entity.subtitle && <p className="entity-subtitle">{entity.subtitle}</p>}
          <p className="entity-summary">{entity.summary}</p>

          {entity.tags?.length ? (
            <div className="entity-tags">
              {entity.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}

          <div className="intro-actions">
            <button
              type="button"
              className="discover-button"
              onClick={() => setExpanded((value) => !value)}
            >
              <span>{expanded ? 'Hide deeper layer' : 'Look beneath the surface'}</span>
              <i>{expanded ? '−' : '+'}</i>
            </button>
            <button className="atlas-text-button" type="button" onClick={onOpenAtlas}>
              See where this sits in the world ↗
            </button>
          </div>
        </div>

        {related.length ? (
          <div className="stage-threads" aria-label="Connected threads">
            {related.slice(0, 3).map(({ entity: other, relationship }) => (
              <button
                key={relationship.id}
                type="button"
                onClick={() => onSelectEntity(other.id)}
              >
                <small>{relationship.label}</small>
                <strong>{other.name}</strong>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className={expanded ? 'deep-layer open' : 'deep-layer'}>
        <div className="deep-layer-heading">
          <span>Below the first impression</span>
          <h2>{entity.body?.[0] ?? entity.summary}</h2>
        </div>

        {entity.body && entity.body.length > 1 ? (
          <div className="deep-copy">
            {entity.body.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        ) : null}

        {entity.timeline?.length ? (
          <div className="story-trace">
            <div className="trace-heading">
              <span>Trace through time</span>
              <p>Move through the moments that changed what this became.</p>
            </div>
            <div className="trace-track">
              {[...entity.timeline]
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <article className="trace-moment" key={item.id}>
                    <div className="trace-index">{String(index + 1).padStart(2, '0')}</div>
                    {item.dateLabel && <small>{item.dateLabel}</small>}
                    <h3>{item.title}</h3>
                    {item.summary && <p>{item.summary}</p>}
                  </article>
                ))}
            </div>
          </div>
        ) : null}

        {entity.process?.length ? (
          <div className="story-trace">
            <div className="trace-heading">
              <span>How it unfolds</span>
              <p>The structure exists underneath the story, not on top of it.</p>
            </div>
            <div className="trace-track">
              {entity.process.map((step, index) => (
                <article className="trace-moment" key={step.id}>
                  <div className="trace-index">{String(index + 1).padStart(2, '0')}</div>
                  <h3>{step.title}</h3>
                  {step.summary && <p>{step.summary}</p>}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {related.length ? (
          <div className="related-river">
            <div className="river-heading">
              <span>Follow another current</span>
              <p>The story keeps going sideways as often as it goes forward.</p>
            </div>
            <div className="river-items">
              {related.map(({ entity: other, relationship }) => (
                <button
                  key={relationship.id}
                  type="button"
                  onClick={() => onSelectEntity(other.id)}
                >
                  <small>{relationship.label}</small>
                  <strong>{other.name}</strong>
                  <span>{other.kind} ↗</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {studio ? (
          <aside className="studio-layer">
            <header>
              <span>Studio / hidden authoring layer</span>
              <h3>This shapes the experience without being stated to the reader.</h3>
            </header>
            <div className="studio-columns">
              {entity.meaning?.tensions?.length ? (
                <div>
                  <small>Tensions</small>
                  <p>{entity.meaning.tensions.join(' · ')}</p>
                </div>
              ) : null}
              {entity.meaning?.desiredFeelings?.length ? (
                <div>
                  <small>Emotional movement</small>
                  <p>{entity.meaning.desiredFeelings.join(' → ')}</p>
                </div>
              ) : null}
              {entity.meaning?.realization ? (
                <div>
                  <small>Underlying realization</small>
                  <p>{entity.meaning.realization}</p>
                </div>
              ) : null}
            </div>
          </aside>
        ) : null}
      </section>
    </article>
  );
}
