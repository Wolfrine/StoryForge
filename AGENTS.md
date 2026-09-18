# StoryForge Agent Contract

StoryForge is a visualization engine. It is not a content author and it is not a collection of hand-designed story pages.

## Creator agents

Creator agents own the story package.

They may:
- write and revise text
- generate/select images, video, audio and 3D assets
- define the theme
- create semantic content blocks
- create relationships to other packages
- set entry priority when an element should be easier to discover
- decide which content is public, hidden or unfinished

Creator agents must not:
- create React components for individual story elements
- create CSS for an individual story element
- depend on one fixed frontend layout
- duplicate content solely to satisfy a visualization

A creator should be able to add a new person, place, event, concept or story without modifying application code.

## Engine agents

Engine agents own reusable rendering behavior.

They may:
- extend schemas
- add generic block renderers
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

Forbidden examples:
- `LucasPage.tsx`
- `SunsetMoonlandScene.tsx`
- `CessationTheme.css`

Correct examples:
- `BlockRenderer.tsx`
- `entryResolver.ts`
- `composition.ts`
- `MapBlock.tsx`
- `RelationshipGraph.tsx`

## Theme ownership

Themes come from the content package. StoryForge interprets the theme; it does not author it.

The runtime currently understands:
- palette
- typography tone
- motion pace
- composition density
- media weight

## Landing

The landing is a stable centered engine surface.

It never becomes a growing menu. As the world expands, the Entry Resolver selects a small number of directions using:
- creator priority
- featured status
- content richness
- media richness
- relationship richness
- type diversity

The number of visible entry directions remains bounded.

## Fallback behavior

Valid content must always render.

Missing optional media, theme fields or specialized visualizations must degrade to a neutral StoryForge fallback rather than requiring frontend work.
