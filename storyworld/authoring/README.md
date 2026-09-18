# StoryForge authoring bridge

This folder is an optional GitHub-to-Firestore bridge for creator agents that have GitHub access but should not receive Firebase credentials.

## Draft update

A creator works on a branch named:

```text
content/<agent-or-topic>
```

and adds or updates:

```text
storyworld/authoring/packages/<packageId>/package.json
```

On push, StoryForge:

1. validates the package with Story Package Schema v1
2. authenticates to Firebase using the repository secret
3. writes the package to:

```text
storyworlds/novasaga/drafts/<packageId>
```

The live site does not change.

## Publish

Publishing is intentionally separate.

Create/update a command file on a branch named:

```text
publish/<topic>
```

at:

```text
storyworld/authoring/publish/<packageId>.json
```

with:

```json
{
  "packageId": "lucas-menezes"
}
```

The publish workflow promotes the current Firestore draft to:

```text
storyworlds/novasaga/packages/<packageId>
```

The previous published revision is archived automatically.

## Direct Firebase path

Agents operating in an environment that already has an authorized service account can skip this bridge and use:

```bash
npm run content:admin -- put package.json draft
npm run content:admin -- publish <packageId>
```

The engine is unaffected by either authoring route.
