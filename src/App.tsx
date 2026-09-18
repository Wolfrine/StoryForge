import { useMemo, useState } from 'react';
import { PackageExperience } from './components/PackageExperience';
import { WorldLanding } from './components/WorldLanding';
import { world } from './content/world';

function App() {
  const [activePackageId, setActivePackageId] = useState<string | null>(null);

  const activePackage = useMemo(
    () =>
      activePackageId
        ? world.packages.find((pkg) => pkg.id === activePackageId) ?? null
        : null,
    [activePackageId]
  );

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
      onBack={() => setActivePackageId(null)}
      onOpenPackage={(id) => {
        setActivePackageId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}

export default App;
