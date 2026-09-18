# StoryForge Agent Contract

StoryForge is an engine, not a collection of hand-built story pages.

## Separation of responsibilities

### Creator / lore agents
Creator agents may:
- create and refine storyworld entities
- create relationships, events, chronology, media references, meaning metadata and provenance
- update canon/developing/legacy/conflict state
- add semantic visual identity cues

Creator agents must not:
- create entity-specific React pages
- choose pixel layouts, CSS values or frontend component composition
- duplicate facts just to make a particular view easier to render
- modify engine behavior to accommodate one lore element

### Engine / UI agents
Engine agents may:
- add reusable visualizers
- improve visualization resolution
- improve theme and experience rules
- add schema validation, search, map, graph, timeline, media and rendering infrastructure

Engine agents must not:
- rewrite lore because a visualizer expects a different shape
- silently change canon state
- infer missing canon facts and persist them as truth

## Content model

All storyworld data follows the schemas in /schema.

Core primitives:
1. Entity
2. Relationship
3. Event/sequence data
4. Media
5. Meaning metadata
6. Provenance/canon metadata

The engine must degrade gracefully. If a specialized visualization is unavailable, a valid entity must still render through generic visual modules.

## Meaning metadata

Meaning metadata is primarily for the experience engine and Studio mode. It should not be printed as a moral or lesson in ordinary reader mode.

## Source boundaries

- StoryForge owns the engine and normalized rendering contract.
- NovaSaga and other story repositories own their source material.
- The /storyworld/sample dataset is a test fixture, not an authoritative replacement for NovaSaga canon.

## UI rule

Do not create components named after individual entities such as LucasPage, SunsetMoonlandPage or CessationPage.

Generic examples are acceptable:
- EntityRenderer
- TimelineVisualizer
- RelationshipVisualizer
- PlaceVisualizer
- CharacterVisualizer

## Deployment

Production deployment targets Firebase project lumio-forge through GitHub Actions.
