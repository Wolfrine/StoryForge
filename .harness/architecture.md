# StoryForge Harness Architecture

## Core pipeline

```text
Source / intent
    ↓
Story Interpreter
    ↓  story-element-v1
Semantic story elements
    ↓
Presentation Director
    ↓  presentation-plan-v1 + presentation-patterns
Presentation intent
    ↓
Asset Producer (only when needed)
    ↓  raster / video / audio / model assets
Package Assembler
    ↓  StoryPackage v1
Schema + source validation
    ↓
Draft / Firestore
    ↓
StoryForge runtime
    ↓
Rendered experience
    ↓
Perceptual Review
    ↺ correct content / plan / asset / reusable engine primitive
```

`StoryPackage v1` remains the production boundary today. The two harness contracts are upstream authoring contracts: they make agent work structured and repeatable now, and can later be compiled directly into a richer runtime schema.

## Roles

Roles are capability contracts, not permanent model assignments.

### Story Interpreter
Extracts characters, places, events, objects, concepts, relationships, chronology, spatial context, narrative role and uncertainty. Emits `story-element-v1` data. Does not choose UI because it happens to be easy to code.

### Presentation Director
Chooses one primary presentation pattern and optional supporting patterns based on what the audience needs to perceive. Emits `presentation-plan-v1`. Controls sequence, emphasis, density, motion pace, reveal and interaction as data.

### Asset Producer
Creates only the media needed by the plan. Creator-authored visual media follows the raster-media policy in `AGENTS.md`. It does not replace precise semantic structures with decorative images.

### Package Assembler
Maps the plan into the current generic StoryForge block registry and produces a valid `StoryPackage v1`. It must prefer an existing reusable primitive. A runtime change is justified only when the missing capability is generic across future packages.

### Perceptual Reviewer
Inspects the rendered result, not only the JSON/code. Checks whether hierarchy, sequence, spatial relationships, motion and interaction communicate the intended meaning. It returns corrections to the correct upstream layer.

## Product routing

Use the environment best suited to the role; do not encode model names into content data.

- **Chat:** intent clarification, story interpretation, pattern selection, architecture and critique.
- **Work:** long multi-source research, source synthesis, browser/computer workflows, asset gathering and rendered visual inspection.
- **Codex:** repository changes, validators, compilers, migrations, reusable rendering primitives, tests and build repair.

A single capable agent may perform several roles. Preserve the structured contracts between stages even when the same agent performs them.

## Presentation is not a page template

A presentation pattern states a perceptual job such as `temporal-arc`, `relationship-web` or `transformation`. It may resolve to different block combinations depending on available story data and media.

```text
same semantic elements
      ↓
 different presentation plan
      ↓
 different block sequence / controls
      ↓
 same generic runtime
```

This lets the experience change without story-specific frontend code.

## Current-to-future boundary

### Now
`story-element-v1` + `presentation-plan-v1` guide agents, then the assembler emits existing `StoryPackage v1` blocks.

### Next
Add a deterministic compiler and persist the authoring contracts beside packages. The site can then interpret richer presentation controls directly while retaining block fallbacks.

### Later
Close the visual loop: render → inspect screenshots/video/interaction → critique → revise. Add reusable spatial, motion and 3D primitives only when a pattern cannot be expressed adequately by the current registry.

## Change rule

When output is weak, correct in this order:

1. source/semantic interpretation,
2. presentation pattern and controls,
3. media asset,
4. package mapping,
5. reusable engine primitive.

Never start with a named component for one story element.
