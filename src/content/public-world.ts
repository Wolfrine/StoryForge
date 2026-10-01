import type { StoryPackage, StoryWorldManifest } from '../domain/story';

type JsonObject = Record<string, unknown>;
type Fetcher = typeof fetch;

function object(value: unknown): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid Firestore document value.');
  return value as JsonObject;
}

export function decodeFirestoreValue(value: unknown): unknown {
  const field = object(value);
  if ('mapValue' in field) return decodeFields(object(field.mapValue).fields ?? {});
  if ('arrayValue' in field) {
    const values = object(field.arrayValue).values ?? [];
    if (!Array.isArray(values)) throw new Error('Invalid Firestore array.');
    return values.map(decodeFirestoreValue);
  }
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return field.doubleValue;
  if ('booleanValue' in field) return field.booleanValue;
  if ('nullValue' in field) return null;
  for (const key of ['stringValue', 'timestampValue', 'bytesValue', 'referenceValue', 'geoPointValue']) {
    if (key in field) return field[key];
  }
  throw new Error('Unsupported Firestore field value.');
}

function decodeFields(fields: unknown): JsonObject {
  return Object.fromEntries(Object.entries(object(fields)).map(([key, value]) => [key, decodeFirestoreValue(value)]));
}

function documentData(document: unknown): JsonObject {
  const {_meta: _ignored, ...data} = decodeFields(object(document).fields);
  return data;
}

async function readJson(url: string, fetcher: Fetcher, signal: AbortSignal): Promise<JsonObject> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    signal.throwIfAborted();
    let response: Response;
    try {
      response = await fetcher(url, {signal, cache:'no-store', headers:{Accept:'application/json'}});
    } catch (error) {
      signal.throwIfAborted();
      if (attempt === 0 && error instanceof TypeError) continue;
      throw error;
    }
    if (!response.ok) {
      // Retry a transient response once; permission/config/content failures remain failures.
      const transient = response.status === 408 || response.status === 429 || response.status >= 500;
      await response.body?.cancel();
      if (attempt === 0 && transient) continue;
      throw new Error('Published content request failed (' + response.status + '): ' + url);
    }
    return object(await response.json());
  }
  throw new Error('Published content request exhausted its retry.');
}

export async function loadPublicWorld(options: {
  worldId: string;
  fallback: StoryWorldManifest;
  signal?: AbortSignal;
  fetcher?: Fetcher;
  timeoutMs?: number;
}): Promise<StoryWorldManifest> {
  const {worldId, fallback, signal, fetcher = fetch, timeoutMs = 20_000} = options;
  const controller = new AbortController();
  const cancel = () => controller.abort(signal?.reason);
  if (signal?.aborted) cancel();
  else signal?.addEventListener('abort', cancel, {once:true});
  const timer = setTimeout(() => controller.abort(new Error('Published content load exceeded its deadline.')), timeoutMs);
  try {
    // Same Hosting project discovery as before; local previews without Hosting use their fixture.
    const config = await readJson('/__/firebase/init.json', fetcher, controller.signal);
    if (typeof config.projectId !== 'string' || !config.projectId.trim()) throw new Error('Firebase Hosting project ID is unavailable.');
    const root = 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(config.projectId) + '/databases/(default)/documents/storyworlds/' + encodeURIComponent(worldId);
    const [worldDocument, firstPage] = await Promise.all([
      readJson(root, fetcher, controller.signal),
      readJson(root + '/packages?pageSize=100', fetcher, controller.signal)
    ]);
    const worldData = documentData(worldDocument);
    const packages: StoryPackage[] = [];
    const tokens = new Set<string>();
    let page = firstPage;
    while (true) {
      const documents = page.documents ?? [];
      if (!Array.isArray(documents)) throw new Error('Invalid published package list.');
      for (const document of documents) {
        const pkg = documentData(document);
        if (pkg.schemaVersion === '1.0') packages.push(pkg as unknown as StoryPackage);
      }
      if (!page.nextPageToken) break;
      if (typeof page.nextPageToken !== 'string' || tokens.has(page.nextPageToken)) throw new Error('Invalid or repeated published package page token.');
      tokens.add(page.nextPageToken);
      page = await readJson(root + '/packages?pageSize=100&pageToken=' + encodeURIComponent(page.nextPageToken), fetcher, controller.signal);
    }
    if (!packages.length) throw new Error('Published Firestore world contains no supported packages.');
    return {
      schemaVersion:'1.0',
      id:typeof worldData.id === 'string' ? worldData.id : worldId,
      title:typeof worldData.title === 'string' ? worldData.title : fallback.title,
      subtitle:typeof worldData.subtitle === 'string' ? worldData.subtitle : undefined,
      theme:(worldData.theme ?? fallback.theme) as StoryWorldManifest['theme'],
      entryPolicy:worldData.entryPolicy as StoryWorldManifest['entryPolicy'],
      packages
    };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
    controller.abort();
  }
}
