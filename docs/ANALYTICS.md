# StoryForge Usage Analytics

StoryForge records usage at the engine level so design decisions can be based on behavior rather than only visual opinion.

## What is measured

The current telemetry vocabulary is deliberately generic:

- session start
- landing view and surfaced direction IDs
- entry direction selected and its resolver rank/score
- package viewed
- active dwell time
- package depth reached: 25 / 50 / 75 / 100%
- block exposure after a block is at least 55% visible for 700 ms
- relationship followed
- return to world

No story prose, image contents, personal name, email address or account identity is included in analytics events.

## Own-usage inspector

Open:

```text
/?stats=1
```

The inspector reads only this browser's StoryForge local analytics history and shows:

- sessions
- landing views
- entry choices
- relationship follows
- package views
- average active dwell
- maximum depth
- block-type exposure

It can export the underlying event history as JSON for deeper analysis.

## Storage

Every event is written to localStorage first, capped at 2,500 events.

This means the user's own browser usage remains measurable even if no remote analytics backend is configured.

## Firebase / Google Analytics

On Firebase Hosting, StoryForge checks the reserved Firebase init config.

If a `measurementId` exists, the engine loads Google Analytics dynamically and mirrors the same anonymous engine events remotely.

If no measurement ID exists, remote analytics is skipped and local measurement continues normally.

## Interpretation

Useful signals:

- high entry clicks + low dwell: the entry promise is attractive but the experience disappoints
- low entry clicks + high dwell: good content, poor discovery/positioning
- high views + low depth: above-the-fold presentation may work but deeper composition may not
- low block exposure: the block is too deep, too weak, or unnecessary
- high relationship follows: the world graph is successfully encouraging exploration
- repeated return-to-world behavior: landing navigation is functioning as a useful orientation point
