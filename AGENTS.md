# StoryForge Agent Contract

StoryForge is a visualization engine. It is not a content author and it is not a collection of hand-designed story pages.

## Creator agents

Creator agents own story packages.

Each ordinary story element lives independently:

```text
storyworld/<world>/
  world.json
  packages/
    <stable-id>/
      package.json
      media/
        ...
```

Adding a package folder is enough. The compiler discovers it automatically.

Creator agents may:
- write and revise text
- generate/select images, video, audio and 3D assets
- save those assets in the package's media folder or reference a supported external asset
- define the package theme
- create semantic content blocks
- create relationships to other package IDs
- set entry priority when an element should be easier to discover
- decide whether a package is hidden or featured

Creator agents must not:
- create React components for individual story elements
- create CSS for an individual story element
- depend on one fixed frontend layout
- edit the engine to make their package render

A creator should be able to add a new person, place, event, concept or story without modifying application code or a central package registry.

## Engine agents

Engine agents own reusable rendering behavior.

They may:
- extend schemas
- add generic block renderers
- improve the compiler
- improve entry resolution
- improve composition rules
- improve responsive behavior
- add reusable visualization primitives such as maps, timelines, graphs and galleries
- improve asset loading, transitions and accessibility

Engine agents must not:
- create entity-specific components
- invent missing lore
- generate replacement story imagery
- hardcode the visual identity of a named story element
- add a layout because one specific entity needs it

Forbidden:
- `LucasPage.tsx`
- `SunsetMoonlandScene.tsx`
- `CessationTheme.css`

Correct:
- `BlockRenderer.tsx`
- `entryResolver.ts`
- `composition.ts`
- `MapBlock.tsx`
- `RelationshipGraph.tsx`

## Theme ownership

Themes come from creator packages. StoryForge interprets them; it does not author them.

The runtime currently understands:
- palette
- typography tone
- motion pace
- composition density
- media weight

## Landing

The landing is a stable centered engine surface.

It never becomes a growing menu. As the world expands, the Entry Resolver selects a bounded number of directions using:
- creator priority
- featured status
- content richness
- media richness
- relationship richness
- type diversity

## Build/compiler contract

`scripts/compile-world.mjs` discovers every package directory and generates the runtime world consumed by the web app.

Creators never edit the generated runtime file.

## Fallback behavior

Valid content must always render.

Missing optional media, theme fields or specialized visualizations must degrade to a neutral StoryForge fallback rather than requiring frontend work.
