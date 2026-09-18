# StoryForge Engine v0.3

## Principle

StoryForge does not render lore as pages. It renders structured world information as scenes.

The creator describes what an element means, how it relates to other elements and the emotional/visual cues attached to it. The engine decides how to compose the experience.

## Experience grammar

1. Guided opening — the reader enters through a place, person or rupture.
2. Visual scene — image/scene dominates the first impression.
3. Sparse cue — title and one emotional line, not an encyclopedia summary.
4. Progressive depth — explanation appears only after the reader chooses to descend.
5. Sideways movement — related entities are available as threads rather than menu items.
6. Atlas — unrestricted world-graph exploration.
7. Studio — meaning, emotional intent and provenance become visible to creators only.

## Generic scene families

- landscape
- portrait
- rupture
- ritual
- civilization
- abstract
- distortion

These are reusable visualization strategies, not entity-specific implementations.

A future media resolver can supersede or blend these with high-quality generated images, video, maps or 3D while preserving the same content contract.

## Design direction

- living / luminous / organic foundation
- cinematic / editorial presentation
- surreal / conceptual only where meaning calls for it
- imagery generally owns 60–80% of the first impression
- no global dark-lore theme
- no permanent side navigation
- no requirement that all entity types share the same composition

## Validation

Every production build verifies:
- unique entity IDs
- valid relationship endpoints
- world identity/version fields

Full JSON Schema validation is a later hardening step.
