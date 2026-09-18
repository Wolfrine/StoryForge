# StoryForge content storage

## Storage ownership

StoryForge separates engine code, structured content and media.

### GitHub

Owns:
- engine code
- schemas
- creator contracts
- workflows
- offline/PWA snapshot
- optional content exports

### Firestore

Owns live structured content:

```text
storyworlds/
  novasaga/
    packages/<packageId>    ← published
    drafts/<packageId>      ← private authoring
```

### Cloud Storage

Owns binary creator media:

```text
storyworlds/
  novasaga/
    drafts/<packageId>/...      ← private draft objects
    packages/<packageId>/...    ← published objects
```

## Media lifecycle

Creator package:

```text
package.json
media/
  diagram.svg
  portrait.webp
  scene.webp
```

The package can reference relative media:

```json
{
  "id": "hero",
  "type": "image",
  "src": "media/hero.webp",
  "role": "hero"
}
```

When a draft is synced:

1. package schema is validated
2. relative media files are uploaded to the private draft Storage prefix
3. Firestore draft media references become `gs://...`
4. the browser cannot read the draft

When published:

1. draft media is copied into the published package prefix
2. each published object receives a stable Firebase download token
3. the published Firestore package is rewritten with HTTPS media URLs
4. previous published Firestore revision is archived
5. StoryForge can render the update immediately without web deployment

Published media uses long immutable cache headers. Draft media is private/no-cache.

## Creator agent: GitHub bridge

Creator agents do not need Firebase credentials.

Use a branch matching:

```text
content/<agent-or-topic>
```

and create:

```text
storyworld/authoring/packages/<packageId>/
  package.json
  media/
    ...
```

A push automatically writes that package to Firestore drafts and uploads its media.

Publishing is separate. On a branch matching:

```text
publish/<topic>
```

create/update:

```text
storyworld/authoring/publish/<packageId>.json
```

containing:

```json
{
  "packageId": "<packageId>"
}
```

The publish workflow promotes the Firestore draft and media to published state.

## Creator agent: direct Admin SDK

Agents already running with an authorized service account can use:

```bash
npm run content:list
npm run content:admin -- get <packageId> published
npm run content:admin -- put /path/to/package.json draft
npm run content:admin -- publish <packageId>
```

## Runtime

```text
online
  → Firestore published packages
  → published Cloud Storage URLs

offline / source failure
  → bundled PWA snapshot
  → bundled snapshot media
```

The reader never needs Firebase write credentials.
