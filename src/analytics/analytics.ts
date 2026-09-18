export type AnalyticsEventName =
  | 'session_start'
  | 'content_source_ready'
  | 'landing_view'
  | 'entry_open'
  | 'package_view'
  | 'package_dwell'
  | 'package_depth'
  | 'block_exposed'
  | 'relationship_open'
  | 'return_to_world';

export type AnalyticsPrimitive = string | number | boolean;

export interface StoryForgeAnalyticsEvent {
  id: string;
  timestamp: number;
  sessionId: string;
  name: AnalyticsEventName;
  properties: Record<string, AnalyticsPrimitive>;
}

const STORAGE_KEY = 'storyforge.analytics.events.v1';
const SESSION_KEY = 'storyforge.analytics.session.v1';
const SESSION_STARTED_KEY = 'storyforge.analytics.session-started.v1';
const REMOTE_STATUS_KEY = 'storyforge.analytics.remote-status.v1';
const MAX_EVENTS = 2500;

type Gtag = (
  command: 'js' | 'config' | 'event',
  targetOrDate: string | Date,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

function isInspector(): boolean {
  return new URLSearchParams(window.location.search).get('stats') === '1';
}

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `sf-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

function safeProperties(
  properties: Record<string, AnalyticsPrimitive>
): Record<string, AnalyticsPrimitive> {
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.slice(0, 100) : value
    ])
  );
}

function readEvents(): StoryForgeAnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(event: StoryForgeAnalyticsEvent): void {
  const events = readEvents();
  events.push(event);

  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Analytics must never interfere with the experience.
  }
}

let remoteInitialization: Promise<boolean> | null = null;

async function initializeRemoteAnalytics(): Promise<boolean> {
  if (remoteInitialization) return remoteInitialization;

  remoteInitialization = (async () => {
    if (
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    ) {
      localStorage.setItem(REMOTE_STATUS_KEY, 'local-development');
      return false;
    }

    try {
      const response = await fetch('/__/firebase/init.json', {
        cache: 'no-store'
      });

      if (!response.ok) {
        localStorage.setItem(REMOTE_STATUS_KEY, 'local-only');
        return false;
      }

      const config = (await response.json()) as {
        measurementId?: string;
      };

      if (!config.measurementId) {
        localStorage.setItem(REMOTE_STATUS_KEY, 'local-only');
        return false;
      }

      const measurementId = config.measurementId;

      window.dataLayer = window.dataLayer ?? [];
      window.gtag =
        window.gtag ??
        ((...args: Parameters<Gtag>) => {
          window.dataLayer?.push(args);
        });

      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
          'script[data-storyforge-analytics]'
        );

        if (existing) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.dataset.storyforgeAnalytics = 'true';
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          measurementId
        )}`;
        script.addEventListener('load', () => resolve(), { once: true });
        script.addEventListener('error', () => reject(new Error('gtag load failed')), {
          once: true
        });
        document.head.appendChild(script);
      });

      window.gtag?.('js', new Date());
      window.gtag?.('config', measurementId, {
        send_page_view: false,
        anonymize_ip: true
      });

      localStorage.setItem(REMOTE_STATUS_KEY, 'firebase-analytics');
      return true;
    } catch {
      localStorage.setItem(REMOTE_STATUS_KEY, 'local-only');
      return false;
    }
  })();

  return remoteInitialization;
}

async function sendRemote(event: StoryForgeAnalyticsEvent): Promise<void> {
  const available = await initializeRemoteAnalytics();
  if (!available || !window.gtag) return;

  window.gtag('event', event.name, {
    ...event.properties,
    sf_session_id: event.sessionId
  });
}

export function track(
  name: AnalyticsEventName,
  properties: Record<string, AnalyticsPrimitive> = {}
): void {
  if (typeof window === 'undefined' || isInspector()) return;

  const event: StoryForgeAnalyticsEvent = {
    id:
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    name,
    properties: safeProperties(properties)
  };

  writeLocal(event);
  void sendRemote(event);
}

export function initializeAnalytics(): void {
  if (typeof window === 'undefined' || isInspector()) return;

  if (!sessionStorage.getItem(SESSION_STARTED_KEY)) {
    sessionStorage.setItem(SESSION_STARTED_KEY, '1');
    track('session_start', {
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    });
  }

  void initializeRemoteAnalytics();
}

export function getStoredAnalyticsEvents(): StoryForgeAnalyticsEvent[] {
  return readEvents();
}

export function getRemoteAnalyticsStatus(): string {
  return localStorage.getItem(REMOTE_STATUS_KEY) ?? 'checking';
}

export function clearStoredAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportStoredAnalytics(): void {
  const events = readEvents();
  const blob = new Blob(
    [
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          eventCount: events.length,
          events
        },
        null,
        2
      )
    ],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `storyforge-usage-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
