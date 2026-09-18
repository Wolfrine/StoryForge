# StoryForge Engine v0.2

## Purpose

StoryForge turns structured storyworld data into an automatically composed visual experience.

It is not a dashboard and not an encyclopedia with decorated pages. Navigation is part of the world itself.

The system answers two different questions:

- Visualization Engine: what representation best expresses the available information?
- Experience Engine: how should the reader encounter and move through that information?

## V0.2 experience grammar

The first shell deliberately removes permanent menus and entity lists.

### World mode

The selected entity becomes a visual stage.

- atmosphere is generated from semantic visual metadata
- nearby relationships become spatial entry points
- the reader descends into narrative, chronology, process and connected threads
- there is no required chapter order

### Atlas mode

The world graph itself becomes navigation.

- entities are nodes
- relationships are visible edges
- selecting a node changes the active thread
- entering the node returns to immersive World mode

### Studio mode

The same experience is retained, but hidden authoring information becomes visible:

- meaning/tension metadata
- desired emotional movement
- underlying realization
- provenance

## Visual grammar in v0.2

1. Semantic ambient field
2. Focal story stage
3. Spatial relationship orbit
4. Narrative field
5. Temporal trace
6. Process / ritual sequence
7. Thread field
8. World Atlas graph
9. Studio meaning layer
10. Studio provenance layer

No visual module is named after a specific NovaSaga entity.

## Data pipeline

Structured storyworld data
→ integrity validation
→ relationship resolution
→ semantic theme resolution
→ type-aware visual grammar
→ immersive composition
→ reader / atlas / studio experience

## Semantic theming

Content supplies cues such as:

- atmosphere
- luminosity
- density
- motion
- materiality

The engine converts those cues into presentation. Content must not supply CSS values or layout instructions.

## Next engine milestones

- persistent media model and image pipeline
- richer visualizers by entity type
- real map visualizer
- spoiler and discovery state
- narrative reveal conditions
- source adapters for NovaSaga and curated content
- search that returns entry points rather than document hits
- richer graph layout and relationship semantics
