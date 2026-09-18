# StoryForge content storage

## Active storage layout

StoryForge keeps the engine and content independent.

### GitHub

Owns:
- StoryForge engine and schemas
- authoring workflows
- PWA/offline snapshot
- published binary media while Firebase Storage billing is unavailable

### Firestore

Owns live structured content:
- published packages
- private drafts
- revision history
- world theme / entry policy

## Media backend

StoryForge has a pluggable media backend.

### Active now: GitHub published-media branch

The Firebase project currently has no billing account attached, and Google Cloud Storage bucket creation returns:

```text
billing account ... state absent
```

Therefore StoryForge automatically uses a repository media driver without blocking creators.

Published media is copied to:

```text
published-media branch

storyworld/
  published-media/
    novasaga/
      <packageId>/
        media/
          ...
```

Firestore stores stable `raw.githubusercontent.com` URLs to those published assets.

The PWA caches those published-media URLs for offline/repeat use.

### Future: Firebase Storage

The same content-admin pipeline already contains a `firebase-storage` backend.

After billing/Blaze is enabled, set:

```text
STORYFORGE_MEDIA_BACKEND=firebase-storage
```

Creator package structure and Firestore documents do not change.

## Creator lifecycle

### 1. Create

```text
storyworld/authoring/packages/<packageId>/
  package.json
  media/
    image.webp
    diagram.svg
    ...
```

The package references media relatively:

```json
{
  "media": [
    {
      "id": "hero",
      "type": "image",
      "src": "media/hero.webp"
    }
  ]
}
```

### 2. Draft

Push on:

```text
content/<topic>
```

The draft workflow:
- validates the package
- records immutable creator-commit media URLs
- writes the structured package to Firestore drafts

### 3. Publish

Push a publish request on:

```text
publish/<topic>
```

The publish workflow:
- reads the Firestore draft
- copies its media to the stable `published-media` branch
- rewrites media URLs to the published location
- archives the previous Firestore revision
- writes the new published package

No StoryForge frontend deployment is required.

## Reader runtime

```text
online:
  Firestore published package
    + published media URL

offline/source failure:
  bundled PWA snapshot
```

Published media is cached by the PWA.

## Direct package links

The generic reader supports:

```text
?package=<packageId>
```

This is useful for previewing an element that is intentionally hidden from the landing resolver.

## Responsibility boundary

Creator agents own:
- text
- generated media
- theme
- semantic blocks
- relationships
- entry hints

StoryForge owns:
- schemas
- validation
- draft/publish lifecycle
- media persistence
- composition
- visualization
- responsive/PWA behavior
