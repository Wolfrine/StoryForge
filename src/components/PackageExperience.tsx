import type { StoryPackage, StoryWorldManifest } from '../domain/story';
import type { ContentSource } from '../content/repository';
import { usePackageTelemetry } from '../analytics/usePackageTelemetry';
import { BlockRenderer } from '../engine/BlockRenderer';
import { composePackage } from '../engine/composition';
import { mergeTheme, themeToStyle } from '../engine/themeRuntime';

interface Props {
  world: StoryWorldManifest;
  pkg: StoryPackage;
  contentSource: ContentSource;
  onBack: () => void;
  onOpenPackage: (id: string) => void;
}

export function PackageExperience({
  world,
  pkg,
  contentSource,
  onBack,
  onOpenPackage
}: Props) {
  const theme = mergeTheme(world.theme, pkg.theme);
  const composed = composePackage(pkg, theme);

  usePackageTelemetry(pkg);

  return (
    <main
      className="sf-experience"
      style={themeToStyle(theme)}
      data-storyforge-state="package"
      data-package-id={pkg.id}
      data-world-id={world.id}
      data-content-source={contentSource}
    >
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
            data-story-block="true"
            data-block-id={block.id}
            data-block-type={block.type}
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
