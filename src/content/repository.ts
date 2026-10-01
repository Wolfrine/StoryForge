import type { StoryWorldManifest } from '../domain/story';
import fallbackWorld from '../generated/world.json';
import { loadPublicWorld } from './public-world';

export type ContentSource = 'firestore' | 'snapshot';

export interface LoadedStoryWorld {
  world: StoryWorldManifest;
  source: ContentSource;
}

const FALLBACK_WORLD = fallbackWorld as StoryWorldManifest;
const FIRESTORE_WORLD_ID = import.meta.env.VITE_STORYFORGE_WORLD_ID || 'novasaga';

export async function loadStoryWorld(signal?: AbortSignal): Promise<LoadedStoryWorld> {
  signal?.throwIfAborted();
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const world = await loadPublicWorld({worldId:FIRESTORE_WORLD_ID, fallback:FALLBACK_WORLD, signal});
      return {world, source:'firestore'};
    } catch (error) {
      signal?.throwIfAborted();
      // Keep offline/local preview behavior, but make the cause observable instead of silent.
      console.warn('[StoryForge] Published content unavailable; using bundled snapshot.', error);
    }
  }
  return {world:FALLBACK_WORLD, source:'snapshot'};
}

export function fallbackStoryWorld(): StoryWorldManifest {
  return FALLBACK_WORLD;
}
