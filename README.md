# StoryForge

StoryForge is a visualization and experience runtime for AI-authored storyworld packages.

Its core rule is simple:

> Creators create. StoryForge visualizes.

Creator agents provide structured text, media, relationships and theme definitions. StoryForge validates those packages, chooses entry directions, interprets themes, composes semantic blocks and renders a responsive experience.

## v1 foundation

- Story Package Schema v1
- World Manifest Schema v1
- schema validation with relationship/media integrity checks
- bounded Entry Resolver
- fixed centered non-scrollable world landing
- creator-defined Theme Runtime
- generic Composition Engine
- generic block registry:
  - hero
  - prose
  - quote
  - gallery
  - timeline
  - process
  - relationships
- neutral fallback behavior
- engine testbench

There are no named story-element page components in the v1 architecture.

## Structure

```text
schema/
  story-package-v1.schema.json
  world-manifest-v1.schema.json

src/
  domain/
    story.ts
  engine/
    entryResolver.ts
    themeRuntime.ts
    composition.ts
    BlockRenderer.tsx
  components/
    WorldLanding.tsx
    PackageExperience.tsx
  content/
    world.ts

storyworld/
  testbench/
    world.json
```

See `docs/ENGINE_V1.md` and `AGENTS.md`.

## Local

```bash
npm install
npm run build
npm run dev
```

The current testbench is deliberately not a replacement for canonical NovaSaga data. Creator pipelines will eventually emit v1 packages directly.
