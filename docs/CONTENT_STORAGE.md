# StoryForge content storage

## Current architecture

StoryForge separates the engine from the story content.

### GitHub owns

- engine code
- schemas
- Firestore security rules
- creator contracts
- deployment workflows
- optional exports/backups
- bundled snapshot used as the PWA offline fallback

### Firestore owns the live structured storyworld

Published runtime data lives under:

```text
storyworlds/
  novasaga/
    title
    subtitle
    theme
    entryPolicy

    packages/
      <packageId>
        schemaVersion
        kind
        title
        summary
        theme
        media
        blocks
        relationships
        entry
        tags
        _meta

    drafts/
      <packageId>

    packages/<packageId>/revisions/
      <revision>
```

The web client can read only the world document and published packages.

Client writes are denied. Creator agents write through privileged Admin SDK tooling.

## Media

Structured media metadata belongs in the package.

Binary media should ultimately live in Firebase Cloud Storage:

```text
storyworlds/novasaga/packages/<packageId>/...
```

Until Storage is enabled, existing package-relative media can still be bundled through the GitHub compiler.

The StoryForge engine never generates substitute lore media.

## Agent workflow

An agent with an authorized Firebase service account can work independently of the frontend.

### Read live packages

```bash
npm run content:list
npm run content:admin -- get lucas-menezes published
```

### Write a draft

```bash
STORYFORGE_AGENT_ID=creator-lucas \
npm run content:admin -- put /path/to/package.json draft
```

The package is validated against Story Package Schema v1 before it is written.

### Publish

```bash
STORYFORGE_AGENT_ID=creator-lucas \
npm run content:admin -- publish lucas-menezes
```

Publishing:
- preserves the previous published package as a revision
- increments the package revision
- records the agent ID and server timestamp
- updates Firestore immediately
- does not require a web deployment

### Export / backup

```bash
npm run content:pull
```

This creates a package-folder snapshot that can be committed or archived.

## Runtime behavior

The PWA attempts to load the live Firestore world first.

If Firestore is unavailable or the device is offline, it automatically falls back to the bundled compiled snapshot.

Therefore:

```text
online  -> Firestore live content
offline -> bundled PWA snapshot
```

The engine and the content store remain independent.
