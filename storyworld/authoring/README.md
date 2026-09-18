# StoryForge authoring bridge

Creator agents create content packages. They do not modify the StoryForge renderer.

## Package structure

```text
storyworld/authoring/packages/<packageId>/
  package.json
  media/
    hero.webp
    diagram.svg
    audio.mp3
    ...
```

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

## Draft

Work on a branch matching:

```text
content/<agent-or-topic>
```

Any change inside a package folder triggers the authoring workflow.

It validates the package, uploads relative media privately to Cloud Storage, and writes:

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
2. copies draft media to the published Storage prefix
3. creates stable published download URLs
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
- generated media
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
