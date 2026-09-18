import { useEffect, useMemo, useState } from 'react';
import { initializeAnalytics, track } from './analytics/analytics';
import { StatsView } from './analytics/StatsView';
import { PackageExperience } from './components/PackageExperience';
import { WorldLanding } from './components/WorldLanding';
import { world } from './content/world';

const statsMode =
  new URLSearchParams(window.location.search).get('stats') === '1';

function App() {
  const [activePackageId, setActivePackageId] = useState<string | null>(null);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  const activePackage = useMemo(
    () =>
      activePackageId
        ? world.packages.find((pkg) => pkg.id === activePackageId) ?? null
        : null,
    [activePackageId]
  );

  if (statsMode) {
    return <StatsView />;
  }

  if (!activePackage) {
    return (
      <WorldLanding
        world={world}
        onOpenPackage={(id) => setActivePackageId(id)}
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
      }}
      onOpenPackage={(id) => {
        setActivePackageId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}

export default App;
