import { useMemo, useState } from 'react';
import { ImmersiveEntity } from './components/ImmersiveEntity';
import { WorldAtlas } from './components/WorldAtlas';
import { sampleWorld } from './content/loadWorld';

type Mode = 'world' | 'atlas' | 'studio';

function App() {
  const [selectedId, setSelectedId] = useState(sampleWorld.entities[0]?.id ?? '');
  const [mode, setMode] = useState<Mode>('world');

  const selected = useMemo(
    () => sampleWorld.entities.find((entity) => entity.id === selectedId) ?? sampleWorld.entities[0],
    [selectedId]
  );

  const selectEntity = (id: string, enterWorld = true) => {
    const update = () => {
      setSelectedId(id);
      if (enterWorld) setMode(mode === 'studio' ? 'studio' : 'world');
    };

    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(update);
    } else {
      update();
    }

    if (enterWorld) {
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
    }
  };

  if (!selected) {
    return <main className="empty-state">No storyworld entities are available.</main>;
  }

  return (
    <main className="storyforge-shell">
      <header className="floating-chrome">
        <button
          className="wordmark"
          type="button"
          onClick={() => setMode('world')}
          aria-label="Return to current story thread"
        >
          <span>SF</span>
          <strong>StoryForge</strong>
        </button>

        <div className="mode-switch">
          <button
            type="button"
            className={mode === 'world' ? 'active' : ''}
            onClick={() => setMode('world')}
          >
            World
          </button>
          <button
            type="button"
            className={mode === 'atlas' ? 'active' : ''}
            onClick={() => setMode('atlas')}
          >
            Atlas
          </button>
          <button
            type="button"
            className={mode === 'studio' ? 'active' : ''}
            onClick={() => setMode('studio')}
          >
            Studio
          </button>
        </div>
      </header>

      {mode === 'atlas' ? (
        <WorldAtlas
          world={sampleWorld}
          selectedId={selected.id}
          onSelectEntity={(id) => selectEntity(id, false)}
          onExit={() => setMode('world')}
        />
      ) : (
        <ImmersiveEntity
          world={sampleWorld}
          entity={selected}
          studio={mode === 'studio'}
          onSelectEntity={(id) => selectEntity(id, true)}
        />
      )}
    </main>
  );
}

export default App;
