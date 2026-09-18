import { useMemo, useState } from 'react';
import { ImmersiveEntity } from './components/ImmersiveEntity';
import { WorldAtlas } from './components/WorldAtlas';
import { WorldPrelude } from './components/WorldPrelude';
import { sampleWorld } from './content/loadWorld';

type Mode = 'prelude' | 'world' | 'atlas' | 'studio';

const params = new URLSearchParams(window.location.search);
const requestedEntity = params.get('entity');
const requestedMode = params.get('mode') as Mode | null;
const skipPrelude = params.get('skipPrelude') === '1';

function App() {
  const defaultEntity =
    sampleWorld.entities.find((entity) => entity.id === requestedEntity)?.id ??
    'sunset-moonland';

  const [selectedId, setSelectedId] = useState(defaultEntity);
  const [mode, setMode] = useState<Mode>(
    requestedMode ?? (skipPrelude ? 'world' : 'prelude')
  );

  const selected = useMemo(
    () => sampleWorld.entities.find((entity) => entity.id === selectedId) ?? sampleWorld.entities[0],
    [selectedId]
  );

  const transition = (update: () => void) => {
    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  const openEntity = (id: string) => {
    transition(() => {
      setSelectedId(id);
      setMode(mode === 'studio' ? 'studio' : 'world');
    });
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
  };

  if (!selected) {
    return <main className="empty-state">No storyworld entities are available.</main>;
  }

  if (mode === 'prelude') {
    return (
      <main className="storyforge-shell">
        <WorldPrelude
          onEnter={() => transition(() => {
            setSelectedId('sunset-moonland');
            setMode('world');
          })}
          onAtlas={() => transition(() => setMode('atlas'))}
        />
      </main>
    );
  }

  return (
    <main className="storyforge-shell">
      <header className="floating-nav">
        <button className="nav-mark" type="button" onClick={() => setMode('prelude')}>
          <span>SF</span>
          <strong>NovaSaga</strong>
        </button>

        <nav aria-label="Experience mode">
          <button
            type="button"
            className={mode === 'world' ? 'active' : ''}
            onClick={() => setMode('world')}
          >
            Thread
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
        </nav>
      </header>

      {mode === 'atlas' ? (
        <WorldAtlas
          world={sampleWorld}
          selectedId={selected.id}
          onSelectEntity={setSelectedId}
          onExit={() => setMode('world')}
        />
      ) : (
        <ImmersiveEntity
          world={sampleWorld}
          entity={selected}
          studio={mode === 'studio'}
          onSelectEntity={openEntity}
          onOpenAtlas={() => setMode('atlas')}
        />
      )}
    </main>
  );
}

export default App;
