import type { StoryPackage, StoryWorldManifest } from '../domain/story';
import { BlockRenderer } from '../engine/BlockRenderer';
import { composePackage } from '../engine/composition';
import { mergeTheme, themeToStyle } from '../engine/themeRuntime';

interface Props {
  world: StoryWorldManifest;
  pkg: StoryPackage;
  onBack: () => void;
  onOpenPackage: (id: string) => void;
}

export function PackageExperience({
  world,
  pkg,
  onBack,
  onOpenPackage
}: Props) {
  const theme = mergeTheme(world.theme, pkg.theme);
  const composed = composePackage(pkg, theme);

  return (
    <main className="sf-experience" style={themeToStyle(theme)}>
      <header className="sf-experience-chrome">
        <button type="button" onClick={onBack}>
          ← {world.title}
        </button>
        <span>{pkg.kind}</span>
      </header>

      <div className="sf-composition">
        {composed.map(({ block, width, emphasis }) => (
          <div
            className={`sf-composed sf-width-${width} sf-emphasis-${emphasis}`}
            key={block.id}
          >
            <BlockRenderer
              block={block}
              pkg={pkg}
              world={world}
              onOpenPackage={onOpenPackage}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
