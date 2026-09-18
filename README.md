# StoryForge

StoryForge is a visualization and experience runtime for AI-authored storyworld packages.

> Creators create. StoryForge visualizes.

Creator agents provide structured text, media, relationships and theme definitions. StoryForge validates those packages, stores live structured content in Firestore, persists published media through a pluggable media backend, chooses entry directions, interprets themes and composes generic visualization blocks.

## Production architecture

```text
Creator agents
   ↓
Draft package + media
   ↓
Schema validation
   ↓
Firestore drafts
   ↓ publish
Firestore published package
   +
Published media backend
   ↓
StoryForge PWA
```

The PWA reads Firestore first and falls back to its bundled snapshot offline.

## Creator workflow

Preferred GitHub bridge:

```text
content/<topic>
└── storyworld/authoring/packages/<packageId>/
    ├── package.json
    └── media/
        └── ...
```

Any package/media change on a `content/` branch is validated and synced to a Firestore draft.

Publishing is separate:

```text
publish/<topic>
└── storyworld/authoring/publish/<packageId>.json
```

The publish workflow archives the previous revision, promotes media, and writes the new published Firestore package. No frontend deployment is required.

See `storyworld/authoring/README.md` and `docs/CONTENT_STORAGE.md`.

## Media backend

The media layer is pluggable.

- **Active:** GitHub `published-media` branch. The Firebase project currently has no billing account, so Cloud Storage bucket creation is unavailable.
- **Ready:** Firebase Storage driver. After billing/Blaze is enabled, set `STORYFORGE_MEDIA_BACKEND=firebase-storage`; creator packages do not change.

## Engine foundation

- fixed centered non-scrollable world landing
- bounded Entry Resolver
- Theme Runtime
- generic Composition Engine
- PWA/mobile/offline shell
- usage analytics and diagnostics
- generic visualization registry:
  - hero
  - prose
  - quote
  - gallery
  - annotated media
  - timeline
  - process
  - journey
  - comparison
  - graph
  - relationships

There are no named story-element page components.

## Direct package links

Published packages can be opened generically with:

```text
?package=<packageId>
```

This is useful for packages intentionally hidden from the landing resolver.

## Local engine development

```bash
npm install
npm run build
npm run dev
```
