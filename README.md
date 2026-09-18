# StoryForge

StoryForge is a data-driven storyworld visualization and experience engine.

It is intentionally not a hand-built encyclopedia and not a set of bespoke pages. Creator agents write structured world data; the engine decides how that data should be visualized and experienced.

## Current status — v0.2

The first dashboard-like prototype has been replaced by a world-first experience shell:

- no permanent side navigation
- semantic ambient visual generation
- focal entity stage
- relationships as spatial entry points
- narrative, timeline and process fields
- Atlas mode where the world graph itself is navigation
- Studio mode layered onto the same experience
- automatic integrity validation before every build
- semantic theme resolver
- Firebase Hosting deployment through GitHub Actions

No entity-specific pages are used.

## Architecture

```text
Creator agents
    ↓
Storyworld schema
    ↓
World graph / normalized content
    ↓
Semantic + relationship resolution
    ↓
Visual grammar
    ↓
Experience grammar
    ↓
World / Atlas / Studio
```

See `docs/ENGINE_V0.md` and `AGENTS.md`.

## Local development

```bash
npm install
npm run dev
```

Validation and production build:

```bash
npm run build
```

## Deployment

Pushes to `main` validate/build the application and deploy Firebase Hosting to:

```text
lumio-forge
```

## Content ownership

The sample data in `storyworld/sample/world.json` demonstrates the engine contract. It does not replace the canonical NovaSaga source repository.
