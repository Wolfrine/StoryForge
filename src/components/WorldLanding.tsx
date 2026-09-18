import type { CSSProperties } from 'react';
import type { StoryPackage, StoryWorldManifest } from '../domain/story';
import { resolveEntryDirections } from '../engine/entryResolver';
import { themeToStyle } from '../engine/themeRuntime';

interface Props {
  world: StoryWorldManifest;
  onOpenPackage: (id: string) => void;
}

function positionFor(index: number, total: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
  return {
    left: 50 + Math.cos(angle) * 34,
    top: 50 + Math.sin(angle) * 31
  };
}

export function WorldLanding({ world, onOpenPackage }: Props) {
  const directions = resolveEntryDirections(world);
  const style = themeToStyle(world.theme);

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
            '--entry-index': index
          } as CSSProperties;

          return (
            <DirectionNode
              key={pkg.id}
              pkg={pkg}
              style={nodeStyle}
              onOpen={() => onOpenPackage(pkg.id)}
            />
          );
        })}
      </div>

      <div className="sf-landing-footer">
        <span>ENTRY RESOLVER v1</span>
        <span>content chooses the directions</span>
      </div>
    </main>
  );
}

function DirectionNode({
  pkg,
  style,
  onOpen
}: {
  pkg: StoryPackage;
  style: CSSProperties;
  onOpen: () => void;
}) {
  return (
    <button className="sf-direction" type="button" style={style} onClick={onOpen}>
      <span>{pkg.kind}</span>
      <strong>{pkg.title}</strong>
      <small>{pkg.summary}</small>
    </button>
  );
}
