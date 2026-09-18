import { useMemo, useState } from 'react';
import { EntityRenderer } from './components/EntityRenderer';
import { sampleWorld } from './content/loadWorld';
import type { ExperienceDepth } from './domain/types';

const depthOptions: ExperienceDepth[] = ['overview', 'explore', 'deep'];

function App() {
  const [selectedId, setSelectedId] = useState(sampleWorld.entities[0]?.id ?? '');
  const [depth, setDepth] = useState<ExperienceDepth>('explore');
  const [studio, setStudio] = useState(false);

  const selected = useMemo(
    () => sampleWorld.entities.find((entity) => entity.id === selectedId) ?? sampleWorld.entities[0],
    [selectedId]
  );

  if (!selected) {
    return <main className="empty-state">No storyworld entities are available.</main>;
  }

  return (
    <main className="app-shell">
      <aside className="world-nav">
        <div className="brand">
          <span className="brand-mark">SF</span>
          <div>
            <strong>StoryForge</strong>
            <small>{sampleWorld.name} · engine v0.1</small>
          </div>
        </div>

        <div className="engine-note">
          <span>Data-driven prototype</span>
          <p>No entity-specific page components. The engine composes the experience from structure.</p>
        </div>

        <nav aria-label="Storyworld entities">
          {sampleWorld.entities.map((entity) => (
            <button
              className={entity.id === selected.id ? 'entity-nav active' : 'entity-nav'}
              key={entity.id}
              type="button"
              onClick={() => setSelectedId(entity.id)}
            >
              <span>{entity.kind}</span>
              <strong>{entity.name}</strong>
            </button>
          ))}
        </nav>
      </aside>

      <section className="experience-shell">
        <div className="experience-toolbar">
          <div className="segmented" aria-label="Experience depth">
            {depthOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={depth === option ? 'active' : ''}
                onClick={() => setDepth(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            className={studio ? 'studio-toggle active' : 'studio-toggle'}
            type="button"
            onClick={() => {
              setStudio((current) => !current);
              if (!studio) setDepth('deep');
            }}
          >
            {studio ? 'Studio on' : 'Reader mode'}
          </button>
        </div>

        <EntityRenderer
          world={sampleWorld}
          entity={selected}
          depth={depth}
          studio={studio}
          onSelectEntity={setSelectedId}
        />
      </section>
    </main>
  );
}

export default App;
