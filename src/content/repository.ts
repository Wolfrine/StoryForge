import type { FirebaseOptions } from 'firebase/app';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import type { StoryPackage, StoryWorldManifest } from '../domain/story';
import fallbackWorld from '../generated/world.json';

export type ContentSource = 'firestore' | 'snapshot';

export interface LoadedStoryWorld {
  world: StoryWorldManifest;
  source: ContentSource;
}

const FALLBACK_WORLD = fallbackWorld as StoryWorldManifest;
const FIRESTORE_WORLD_ID =
  import.meta.env.VITE_STORYFORGE_WORLD_ID || 'novasaga';

function stripSystemFields<T extends Record<string, unknown>>(value: T): T {
  const { _meta: _ignored, ...rest } = value;
  return rest as T;
}

async function firebaseOptions(): Promise<FirebaseOptions> {
  const response = await fetch('/__/firebase/init.json', {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Firebase Hosting init configuration unavailable.');
  }

  return (await response.json()) as FirebaseOptions;
}

async function loadFirestoreWorld(): Promise<StoryWorldManifest> {
  const options = await firebaseOptions();
  const app = getApps().length ? getApp() : initializeApp(options);
  const db = getFirestore(app);

  const worldRef = doc(db, 'storyworlds', FIRESTORE_WORLD_ID);
  const worldSnapshot = await getDoc(worldRef);

  if (!worldSnapshot.exists()) {
    throw new Error(`Published StoryForge world not found: ${FIRESTORE_WORLD_ID}`);
  }

  const packageSnapshots = await getDocs(
    collection(db, 'storyworlds', FIRESTORE_WORLD_ID, 'packages')
  );

  const worldData = stripSystemFields(
    worldSnapshot.data() as Record<string, unknown>
  );

  const packages = packageSnapshots.docs
    .map((snapshot) =>
      stripSystemFields(snapshot.data() as Record<string, unknown>)
    )
    .filter((pkg) => pkg.schemaVersion === '1.0') as unknown as StoryPackage[];

  if (!packages.length) {
    throw new Error('Published Firestore world contains no packages.');
  }

  return {
    schemaVersion: '1.0',
    id:
      typeof worldData.id === 'string'
        ? worldData.id
        : FIRESTORE_WORLD_ID,
    title:
      typeof worldData.title === 'string'
        ? worldData.title
        : FALLBACK_WORLD.title,
    subtitle:
      typeof worldData.subtitle === 'string'
        ? worldData.subtitle
        : undefined,
    theme: (worldData.theme ?? FALLBACK_WORLD.theme) as StoryWorldManifest['theme'],
    entryPolicy: worldData.entryPolicy as StoryWorldManifest['entryPolicy'],
    packages
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      window.setTimeout(
        () => reject(new Error('StoryForge content source timed out.')),
        timeoutMs
      )
    )
  ]);
}

export async function loadStoryWorld(): Promise<LoadedStoryWorld> {
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const world = await withTimeout(loadFirestoreWorld(), 2600);
      return {
        world,
        source: 'firestore'
      };
    } catch {
      // Offline snapshot is an intentional PWA fallback.
    }
  }

  return {
    world: FALLBACK_WORLD,
    source: 'snapshot'
  };
}

export function fallbackStoryWorld(): StoryWorldManifest {
  return FALLBACK_WORLD;
}
