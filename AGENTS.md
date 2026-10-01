# StoryForge Agent Contract

StoryForge is a visualization engine. It is not a content author and it is not a collection of hand-designed story pages.

## Shared design entry point

Before UI, UX, layout, styling, motion or visual-quality work, read `Wolfrine/Central/design/README.md`, `UI_AGENT_PROTOCOL.md`, `EXECUTION_ROUTING.md` and `DESIGN_REVIEW_LOOP.md`, then the nearest local design contract and the harness files below. For design creation/change, assign separate designer and critic agents, verify both loaded the guidance, and follow the current Central evidence and acceptance requirements. Keep the owner’s rejection authoritative; a technical verification result is not design acceptance.

The post-deployment visual workflow checks rendered state identity and technical defects. It does not provide independent aesthetic review or block an already completed deployment. Deterministic review instrumentation and policy maintenance do not require manufacturing cosmetic design cycles.


## Harness routing

Start with `.harness/objective.md` and `.harness/architecture.md`.

For story/content work, use `skills/storyforge-orchestration/SKILL.md`. It defines the structured pipeline:

```text
source / intent
  → semantic story elements
  → presentation plan
  → assets when needed
  → StoryPackage v1
  → validation
  → rendered perceptual review
```

The upstream authoring contracts are:

- `.harness/contracts/story-element-v1.schema.json`
- `.harness/contracts/presentation-plan-v1.schema.json`

Presentation choices come from `.harness/presentation-patterns.yaml`.

These contracts guide agents today; the production runtime still consumes `StoryPackage v1`. Do not bypass the existing package schema or publishing path.

The role boundary matters more than the product performing it:

- Chat: interpretation, direction, architecture, critique.
- Work: long research/synthesis, browser/computer workflows, asset gathering and visual inspection.
- Codex: repository edits, validators, compilers, migrations and reusable engine primitives.

One agent may perform multiple roles, but preserve the structured handoff between meaning, presentation intent and runtime package.


## Creator agents

Creator agents own story packages and media.

Preferred authoring structure:

```text
storyworld/authoring/packages/<stable-id>/
  package.json
  media/
    ...
```

Creator agents may:
- write and revise text
- generate/select images, video, audio and 3D assets
- define the package theme
- create semantic content blocks
- create relationships to other package IDs
- set entry priority, featured or hidden state

Creator agents must not:
- create React components for individual story elements
- create CSS for an individual story element
- depend on one fixed frontend layout
- edit the engine to make their package render

## Mandatory visual-media policy

For creator-authored story content:

- **Never use SVG.**
- When a background, hero image, conceptual illustration, diagram-like image, environment, portrait or supporting visual is needed, use the available **image-generation tool** to create it.
- Save generated story imagery as raster media: prefer **WebP**, otherwise PNG/JPEG/AVIF.
- Do not hand-build decorative SVGs, inline SVG illustrations, or SVG diagrams as substitutes for generated imagery.
- If information needs structural precision, use StoryForge semantic blocks such as graph, comparison, timeline, process, journey or annotations; pair them with generated raster imagery when visual atmosphere is needed.
- A creator may reuse an existing approved raster image when appropriate, but should not fabricate a low-quality placeholder instead of generating the intended visual.
- Background and supporting images should follow the package theme and feel like one coherent visual language.

StoryForge validates this rule and rejects SVG story media.

### Draft

Push package/media changes on a branch matching:

```text
content/<topic>
```

The workflow validates and writes the package to Firestore drafts.

### Publish

Create a publish request on:

```text
publish/<topic>
```

The workflow:
- reads the Firestore draft
- promotes its media
- archives the previous published revision
- writes the new published package

No frontend deployment is required.

## Media

Relative media references are part of the creator contract:

```json
{
  "id": "hero",
  "type": "image",
  "src": "media/hero.webp"
}
```

StoryForge owns persistence.

The active backend is the repository `published-media` branch because Firebase Storage requires project billing. Published files use content-addressed paths so a regenerated asset receives a new URL and cannot be trapped behind an old PWA cache entry.

A Firebase Storage driver is already implemented and can replace the backend later without changing package structure.

## Engine agents

Engine agents own reusable rendering behavior.

They may:
- extend schemas
- add generic block renderers
- improve entry resolution
- improve composition rules
- improve responsive/PWA behavior
- improve media persistence
- add reusable visualization primitives

Engine agents must not:
- create entity-specific components
- invent missing lore
- generate replacement story imagery on behalf of the renderer
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

Themes come from creator packages. StoryForge interprets them.

The runtime currently understands:
- palette
- typography tone
- motion pace
- composition density
- media weight

## Landing

The landing remains a stable centered engine surface.

As content grows, the Entry Resolver keeps a bounded number of directions using:
- creator priority
- featured status
- content richness
- media richness
- relationship richness
- type diversity

## Fallback behavior

Valid content must always render.

Missing optional media, theme fields or specialized visualizations degrade to neutral engine behavior rather than requiring frontend work.
