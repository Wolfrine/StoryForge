# StoryForge

StoryForge is a data-driven storyworld visualization and experience engine.

It is intentionally not a hand-built encyclopedia and not a set of bespoke pages. Creator agents write structured world data; the engine decides how that data should be visualized and progressively experienced.

## Current status

v0.1 foundation:
- React + TypeScript + Vite
- generic entity renderer
- relationship-aware composition
- timeline and process visual modules
- semantic theme resolver
- reader depth controls
- Studio-only meaning/provenance views
- JSON schema contract
- NovaSaga sample fixture
- Firebase Hosting deployment through GitHub Actions

## Architecture

```text
Creator agents
    ↓
Storyworld schema
    ↓
World graph / normalized content
    ↓
Visualization resolver
    ↓
Theme + experience resolvers
    ↓
Generic rendering engine
```

See `docs/ENGINE_V0.md` and `AGENTS.md`.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Deployment

Pushes to `main` validate/build the application and deploy Firebase Hosting to project:

```text
lumio-forge
```

The GitHub repository secret `FIREBASE_SERVICE_ACCOUNT` must contain the Firebase service-account JSON.

## Content ownership

The sample data in `storyworld/sample/world.json` demonstrates the engine contract. It is not intended to replace the canonical NovaSaga source repository.
