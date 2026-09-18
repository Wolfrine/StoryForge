import rawWorld from '../generated/world.json';
import type { StoryWorldManifest } from '../domain/story';

export const world = rawWorld as StoryWorldManifest;
