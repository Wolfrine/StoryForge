# StoryForge Engine v1

## Product boundary

Creators create. StoryForge visualizes.

```text
Creator agents
    ↓
Story packages
(text + media + theme + relationships + semantic blocks)
    ↓
Schema validation
    ↓
Entry Resolver
    ↓
Theme Runtime
    ↓
Composition Engine
    ↓
Block / Visualization Registry
    ↓
Responsive Experience
```

## World manifest

A world contains:
- world identity
- world-level fallback theme
- entry policy
- packages

The world manifest does not prescribe pages.

## Story package

A package is the smallest independently explorable unit.

Examples can include:
- person
- place
- event
- concept
- faction
- object
- story
- collection

Kind is metadata. It does not select a page template.

The actual presentation comes from:
- semantic blocks
- available media
- creator-defined theme
- composition rules

## Semantic blocks v1

Initial registry:
- hero
- prose
- quote
- gallery
- timeline
- process
- relationships

Future reusable blocks can include:
- map
- journey
- comparison
- diagram
- graph
- layered image
- before/after
- audio scene
- 3D viewer

Adding a new block renderer improves every compatible story package.

## Entry Resolver

The centered landing deliberately shows only a few directions.

It scores packages from:
- explicit creator priority
- featured flag
- semantic block richness
- media richness
- relationship richness

If diversity is enabled, the resolver prefers different kinds before filling the remaining slots.

Therefore 20, 200 or 2,000 story packages do not turn the landing into a menu.

## Theme Runtime

Creators provide semantic/direct theme information.

The engine converts it to shared CSS variables and reusable behavior.

Current theme contract:
- palette
- typography tone
- motion pace
- density
- media weight

The runtime supplies neutral fallbacks for omitted optional values.

## Composition Engine

The engine composes blocks according to what exists.

Examples:
- hero/media → wide or full composition
- prose → narrower reading measure
- gallery → wider responsive grid
- timeline/process → wide structured region
- relationship block → connected navigation surface

No rule references a named story element.

## Testbench

`storyworld/testbench/world.json` is not canonical lore.

It is a structural fixture used to prove that the same runtime can accept heterogeneous packages without custom frontend development.

## Success criterion

A creator agent should be able to add a complete story element by writing data and assets only.

If frontend code must be changed for an ordinary new story element, the engine abstraction is incomplete.
