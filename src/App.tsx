import { useEffect, useMemo, useState } from 'react';
import { initializeAnalytics, track } from './analytics/analytics';
import { StatsView } from './analytics/StatsView';
import { PackageExperience } from './components/PackageExperience';
import { WorldLanding } from './components/WorldLanding';
import type { StoryWorldManifest } from './domain/story';
import {
  fallbackStoryWorld,
  loadStoryWorld,
  type ContentSource
} from './content/repository';

const params = new URLSearchParams(window.location.search);
const statsMode = params.get('stats') === '1';
const requestedPackageId = params.get('package');

function App() {
  const [world, setWorld] = useState<StoryWorldManifest>(
    fallbackStoryWorld()
  );
  const [contentSource, setContentSource] =
    useState<ContentSource>('snapshot');
  const [contentReady, setContentReady] = useState(false);
  const [activePackageId, setActivePackageId] = useState<string | null>(
    requestedPackageId
  );

  useEffect(() => {
    initializeAnalytics();

    let cancelled = false;

    void loadStoryWorld().then((loaded) => {
      if (cancelled) return;

      setWorld(loaded.world);
      setContentSource(loaded.source);
      setContentReady(true);

      track('content_source_ready', {
        content_source: loaded.source,
        package_count: loaded.world.packages.length
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const activePackage = useMemo(
    () =>
      activePackageId
        ? world.packages.find((pkg) => pkg.id === activePackageId) ?? null
        : null,
    [activePackageId, world]
  );

  if (statsMode) {
    return <StatsView />;
  }

  if (!contentReady) {
    return (
      <main className="sf-loading">
        <div>
          <span>StoryForge</span>
          <strong>{world.title}</strong>
          <i />
        </div>
      </main>
    );
  }

  if (!activePackage) {
    return (
      <WorldLanding
        world={world}
        onOpenPackage={(id) => setActivePackageId(id)}
        contentSource={contentSource}
      />
    );
  }

  return (
    <PackageExperience
      world={world}
      pkg={activePackage}
      onBack={() => {
        track('return_to_world', {
          package_id: activePackage.id,
          package_kind: activePackage.kind
        });
        setActivePackageId(null);
        window.history.replaceState({}, '', window.location.pathname);
      }}
      onOpenPackage={(id) => {
        setActivePackageId(id);
        window.history.replaceState(
          {},
          '',
          `?package=${encodeURIComponent(id)}`
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}

export default App;
