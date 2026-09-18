import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { StoryPackage, StoryWorldManifest } from '../domain/story';
import type { ContentSource } from '../content/repository';
import { track } from '../analytics/analytics';
import {
  packageEntryScore,
  resolveEntryDirections
} from '../engine/entryResolver';
import { themeToStyle } from '../engine/themeRuntime';

interface Props {
  world: StoryWorldManifest;
  contentSource: ContentSource;
  onOpenPackage: (id: string) => void;
}

function positionFor(index: number, total: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
  return {
    left: 50 + Math.cos(angle) * 34,
    top: 50 + Math.sin(angle) * 31,
    mobileLeft: 50 + Math.cos(angle) * 38,
    mobileTop: 50 + Math.sin(angle) * 37
  };
}

export function WorldLanding({
  world,
  contentSource,
  onOpenPackage
}: Props) {
  const directions = resolveEntryDirections(world);
  const style = themeToStyle(world.theme);

  useEffect(() => {
    track('landing_view', {
      world_id: world.id,
      content_source: contentSource,
      direction_count: directions.length,
      direction_ids: directions.map((pkg) => pkg.id).join(',')
    });
  }, [world.id, contentSource]);

  return (
    <main className="sf-landing" style={style}>
      <div className="sf-landing-ambient" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="sf-center">
        <span className="sf-center-kicker">StoryForge</span>
        <h1>{world.title}</h1>
        {world.subtitle ? <p>{world.subtitle}</p> : null}
        <small>{directions.length} directions surfaced by the engine</small>
      </div>

      <div className="sf-directions" aria-label="Suggested entry directions">
        {directions.map((pkg, index) => {
          const pos = positionFor(index, directions.length);
          const nodeStyle = {
            '--node-left': `${pos.left}%`,
            '--node-top': `${pos.top}%`,
            '--node-mobile-left': `${pos.mobileLeft}%`,
            '--node-mobile-top': `${pos.mobileTop}%`,
            '--entry-index': index
          } as CSSProperties;

          return (
            <DirectionNode
              key={pkg.id}
              pkg={pkg}
              rank={index + 1}
              style={nodeStyle}
              onOpen={() => {
                track('entry_open', {
                  package_id: pkg.id,
                  package_kind: pkg.kind,
                  content_source: contentSource,
                  entry_rank: index + 1,
                  entry_score: Number(packageEntryScore(pkg).toFixed(2))
                });
                onOpenPackage(pkg.id);
              }}
            />
          );
        })}
      </div>

      <div className="sf-landing-footer">
        <span>ENTRY RESOLVER v1</span>
        <span>{contentSource === 'firestore' ? 'live content' : 'offline snapshot'}</span>
      </div>
    </main>
  );
}

function DirectionNode({
  pkg,
  rank,
  style,
  onOpen
}: {
  pkg: StoryPackage;
  rank: number;
  style: CSSProperties;
  onOpen: () => void;
}) {
  return (
    <button
      className="sf-direction"
      type="button"
      style={style}
      onClick={onOpen}
      data-entry-rank={rank}
    >
      <span>{pkg.kind}</span>
      <strong>{pkg.title}</strong>
      <small>{pkg.summary}</small>
    </button>
  );
}
