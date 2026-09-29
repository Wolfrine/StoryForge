# Objective

**Status:** Active

## Ultimate objective

Turn storyworld information into dynamic perceptual experiences where agents provide structured meaning and presentation intent, while StoryForge renders them through reusable patterns and generic engine primitives.

## Desired outcome

A creator should be able to provide source material or a story element and have agents produce:

1. structured story elements,
2. a presentation plan chosen from reusable patterns,
3. media/assets where needed,
4. a valid StoryForge package,
5. evidence that the rendered experience communicates the intended meaning.

The site must remain a dynamic renderer. New ordinary story content must not require a new React page, CSS file or named component.

## What excellent looks like

- Meaning is understood before a visual form is chosen.
- The same story data can be represented differently by changing presentation data.
- Presentation patterns describe perceptual intent, not rigid page templates.
- Motion, density, emphasis, reveal and interaction are controllable as data.
- Agents exchange strict structured outputs rather than prose handoffs.
- Source facts, inference and speculation stay distinguishable.
- Visual review uses rendered evidence and corrects the right layer: content, plan, asset or reusable engine primitive.

## Constraints

- Preserve the creator/engine boundary in `AGENTS.md`.
- Preserve `StoryPackage v1` as the production runtime contract until a deliberate migration.
- No entity-specific renderer components.
- No creator-authored SVG story media.
- Do not grow the harness with one-off rules; add knowledge only when repeated work proves it useful.
