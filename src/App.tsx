import { useMemo, useState } from 'react';
import { ImmersiveEntity } from './components/ImmersiveEntity';
import { Opening } from './components/Opening';
import { WorldAtlas } from './components/WorldAtlas';
import { sampleWorld } from './content/loadWorld';

type Mode = 'world' | 'atlas' | 'studio';

const params = new URLSearchParams(window.location.search);
const qaMode = params.get('qa') === '1';
const requestedEntity = params.get('entity');
const requestedMode = params.get('mode') as Mode | null;

function App() {
  const defaultEntity =
    sampleWorld.entities.find((entity) => entity.id === requestedEntity) ??
    sampleWorld.entities.find((entity) => entity.kind === 'place') ??
    sampleWorld.entities[0];

  const [selectedId, setSelectedId] = useState(defaultEntity?.id ?? '');
  const [mode, setMode] = useState<Mode>(requestedMode ?? 'world');
  const [entered, setEntered] = useState(qaMode || Boolean(requestedEntity) || Boolean(requestedMode));

  const selected = useMemo(
    () => sampleWorld.entities.find((entity) => entity.id === selectedId) ?? sampleWorld.entities[0],
    [selectedId]
  );

  const selectEntity = (id: string, enterWorld = true) => {
    const update = () => {
      setSelectedId(id);
      setEntered(true);
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

  if (!entered) {
    return <Opening world={sampleWorld} onEnter={(id) => selectEntity(id, true)} />;
  }

  return (
    <main className="storyforge-shell">
      <header className="floating-chrome">
        <button
          className="wordmark"
          type="button"
          onClick={() => setEntered(false)}
          aria-label="Return to the opening"
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
