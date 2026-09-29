# StoryForge Orchestration

Use this skill when turning source material, a story idea or existing lore into StoryForge content; when selecting how story information should be presented; or when reviewing whether a rendered package communicates its meaning.

## Read first

1. `.harness/objective.md`
2. `.harness/architecture.md`
3. `.harness/presentation-patterns.yaml`
4. `schema/story-package-v1.schema.json`
5. `storyworld/authoring/README.md`

Load the two `.harness/contracts/*.schema.json` files only when producing or validating their outputs.

## Process

### 1. Interpret

Extract a semantic element set using `story-element-v1`.

- Preserve source truth.
- Mark unsupported deductions `inferred` or `speculative`.
- Capture relationships, chronology and spatial structure when they carry meaning.
- Do not choose a presentation pattern yet.

### 2. Direct

Choose the perceptual job from `.harness/presentation-patterns.yaml` and emit `presentation-plan-v1`.

- Choose one primary pattern.
- Use supporting patterns only for a distinct relationship the primary pattern cannot carry cheaply.
- Define section order and controls as data.
- Prefer existing block primitives.

### 3. Produce assets

Create only assets required by the plan.

- Follow the raster-media policy in `AGENTS.md`.
- Use semantic blocks for precise diagrams/relationships; imagery is for atmosphere, context or content that benefits from depiction.
- Keep asset identity stable and references explicit.

### 4. Assemble

Translate the plan into a valid `StoryPackage v1` under `storyworld/authoring/packages/<id>/package.json`.

Until a compiler exists, this translation is an agent responsibility. Presentation controls that have no current runtime field should be expressed through the nearest generic block/theme combination and recorded as an engine gap rather than implemented as a named page.

### 5. Validate

For repository work run the existing validation/build commands appropriate to the change. Do not publish invalid packages.

### 6. Review perceptually

When rendering/browser access is available, inspect the actual result across relevant viewport sizes.

Ask:
- Is the intended hierarchy visible before reading all prose?
- Does the chosen pattern make the core relationship cheap to perceive?
- Are motion and reveal helping rather than decorating?
- Is anything important hidden by density, cropping or layout?
- Could a different pattern communicate the same data better?

Correct upstream first: meaning → plan → asset → package mapping → reusable engine.

## Agent routing

- Chat is appropriate for interpretation, direction, architecture and critique.
- Work is appropriate for long research/synthesis, browser workflows, asset gathering and visual inspection.
- Codex is appropriate for repo edits, validators, compilers, migrations and reusable engine work.

The handoff schema matters more than which product performs the role.

## Harness evolution

Do not add a new rule because one package was awkward. Record repeated failure patterns; only then add or refine a pattern, contract, validator or reusable primitive.
