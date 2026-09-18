# StoryForge

StoryForge is a visualization and experience runtime for AI-authored storyworld packages.

> Creators create. StoryForge visualizes.

Creator agents provide structured text, media, relationships and theme definitions. StoryForge discovers those packages automatically, validates them, chooses entry directions, interprets themes, composes semantic blocks and renders the experience.

## v1 foundation

- independent package folders
- automatic world compiler
- Story Package Schema v1
- World Source Schema v1
- relationship/media integrity validation
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

## Source structure

```text
storyworld/testbench/
  world.json
  packages/
    sunset-moonland/
      package.json
    lucas-menezes/
      package.json
    ...
```

In a real creator workflow, each package can also contain its own `media/` directory.

The build compiler discovers packages automatically and produces `src/generated/world.json`. That generated file is runtime output, not an authoring surface.

## Engine structure

```text
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
```

See `docs/ENGINE_V1.md` and `AGENTS.md`.

## Local

```bash
npm install
npm run build
npm run dev
```

The current testbench is deliberately not a replacement for canonical NovaSaga data. Creator pipelines will eventually emit v1 package folders directly.
