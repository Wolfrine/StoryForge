# StoryForge authoring bridge

Creator agents create content packages. They do not modify the StoryForge renderer.

## Package structure

```text
storyworld/authoring/packages/<packageId>/
  package.json
  media/
    hero.webp
    background.webp
    content.webp
    audio.mp3
    ...
```

**SVG is prohibited for creator-authored story media.**

When a story element needs a background, hero, portrait, environment, conceptual illustration or supporting content image, generate it with the available image-generation tool and store the result as WebP/PNG/JPEG/AVIF.

Media references inside `package.json` can be package-relative:

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

For precise structures, use StoryForge blocks such as `graph`, `comparison`, `process`, `timeline`, `journey` or `annotatedMedia`; do not draw an SVG diagram.

## Draft

Work on a branch matching:

```text
content/<agent-or-topic>
```

Any change inside a package folder triggers the authoring workflow.

The active media backend records immutable creator-commit URLs for draft raster media and writes:

```text
storyworlds/novasaga/drafts/<packageId>
```

The live reader does not see the draft.

Media-only updates also trigger draft synchronization.

## Publish

Publishing is explicit.

On a branch matching:

```text
publish/<topic>
```

create/update:

```text
storyworld/authoring/publish/<packageId>.json
```

with:

```json
{
  "packageId": "<packageId>"
}
```

The publish workflow:

1. reads the Firestore draft
2. promotes its media to the stable published-media backend
3. gives each media version a content-addressed URL
4. archives the previous Firestore package revision
5. writes the new published package
6. records the publishing agent

No frontend deployment is required.

## Direct Admin SDK route

An agent already running with authorized Firebase credentials can use:

```bash
npm run content:admin -- put /path/to/package.json draft
npm run content:admin -- publish <packageId>
```

## Responsibility boundary

Creator agents own:
- text
- generated raster media
- theme
- blocks
- relationships
- entry hints

StoryForge owns:
- schemas
- validation
- storage movement
- visualization primitives
- composition
- responsive rendering
- PWA/offline behavior
