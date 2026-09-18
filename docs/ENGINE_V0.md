# StoryForge Engine v0.1

## Purpose

StoryForge turns structured storyworld data into an automatically composed visual experience.

The system answers two different questions:

- Visualization Engine: what representation best expresses the available information?
- Experience Engine: how much should be exposed now, and in what depth?

## V0 pipeline

Structured storyworld data
→ schema contract
→ relationship resolution
→ visualization resolution
→ semantic theme resolution
→ generic component composition
→ reader or studio experience

## Current visual grammar

V0 intentionally starts small:

1. Hero / atmosphere
2. Narrative
3. Connections
4. Timeline
5. Process
6. Studio meaning model
7. Studio provenance

These are resolved from data, not assigned by hard-coded entity page routes.

## Experience depth

- Overview: identity, atmosphere, summary and core narrative
- Explore: relationships, chronology and process become visible
- Deep: all reader modules; Studio may additionally expose meaning and provenance

## Semantic theming

Content supplies cues such as:
- atmosphere
- luminosity
- density
- motion
- materiality

The theme engine converts cues into presentation tokens. Content must not supply CSS.

## Next engine milestones

- JSON Schema validation in CI
- world graph visualizer
- map visualizer
- media and gallery pipeline
- semantic search
- richer type extensions
- progressive reveal rules
- spoiler/visibility model
- source adapters for NovaSaga/Notion exports
- automated normalized-content build
