# StoryForge Engine v1

## Product boundary

Creators create. StoryForge visualizes.

```text
Creator agent
   ↓
independent package folder
(text + media + theme + relationships + semantic blocks)
   ↓
source validation
   ↓
world compiler / automatic package discovery
   ↓
asset pipeline
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

## Stable source structure

```text
storyworld/<world>/
  world.json
  packages/
    element-a/
      package.json
      media/
        hero.webp
        detail.webp
    element-b/
      package.json
      media/
    ...
```

The world source does not list packages. The compiler discovers package folders.

This is deliberate: 10, 100 or 5,000 elements do not require maintaining a central content index.

## Media handoff

Creator agents can use package-relative media references:

```json
{
  "media": [
    {
      "id": "hero",
      "type": "image",
      "src": "media/hero.webp",
      "role": "hero"
    }
  ]
}
```

At build time StoryForge:
1. verifies that the file exists inside the package
2. prevents paths from escaping the package
3. copies the asset into the web build's generated storyworld media directory
4. rewrites the runtime URL

External HTTPS/data assets can also be referenced directly.

The renderer never generates a substitute story image.

## World source

`world.json` contains only:
- world identity
- world-level fallback theme
- entry policy
- package directory

## Story package

A package is the smallest independently explorable unit.

Kind can describe a person, place, event, concept, faction, object, story, collection or other element, but kind does not select a page template.

Presentation comes from:
- semantic blocks
- available media
- creator-defined theme
- engine composition rules

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

Adding one renderer improves every compatible package.

## Entry Resolver

The centered landing deliberately shows only a few directions.

It scores packages from:
- explicit creator priority
- featured flag
- semantic block richness
- media richness
- relationship richness

With diversity enabled, the resolver prefers different kinds before filling remaining slots.

The landing therefore remains visually stable while content volume grows.

## Theme Runtime

Creators provide theme information.

The engine converts it into shared visual tokens and behavior:
- palette
- typography tone
- motion pace
- density
- media weight

Neutral fallback values cover omitted optional fields.

## Composition Engine

The engine composes blocks according to content.

Examples:
- hero/media → wide/full composition
- prose → narrower reading measure
- gallery → responsive media field
- timeline/process → wide structured region
- relationships → contextual navigation

No rule references a named story element.

## Testbench

`storyworld/testbench` is a structural fixture only.

It proves the engine can discover heterogeneous packages and render them without custom frontend work.

## Success criterion

A creator agent should be able to create a complete new element by adding one package folder containing data and assets.

If ordinary content growth requires a frontend change, the engine abstraction is incomplete.
