import { useEffect } from 'react';
import type { StoryPackage } from '../domain/story';
import { track } from './analytics';

const DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

export function usePackageTelemetry(pkg: StoryPackage): void {
  useEffect(() => {
    const reached = new Set<number>();
    let activeSegmentStartedAt: number | null = performance.now();

    track('package_view', {
      package_id: pkg.id,
      package_kind: pkg.kind,
      block_count: pkg.blocks.length,
      media_count: pkg.media?.length ?? 0,
      relationship_count: pkg.relationships?.length ?? 0
    });

    const reportDepth = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollable <= 0) {
        if (!reached.has(100)) {
          reached.add(100);
          track('package_depth', {
            package_id: pkg.id,
            depth_percent: 100
          });
        }
        return;
      }

      const percent = Math.min(
        100,
        Math.round((window.scrollY / scrollable) * 100)
      );

      for (const threshold of DEPTH_THRESHOLDS) {
        if (percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          track('package_depth', {
            package_id: pkg.id,
            depth_percent: threshold
          });
        }
      }
    };

    const exposedBlocks = new Set<string>();
    const timers = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const blockId = element.dataset.blockId;
          const blockType = element.dataset.blockType;

          if (!blockId || !blockType || exposedBlocks.has(blockId)) continue;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            if (timers.has(blockId)) continue;

            const timer = window.setTimeout(() => {
              exposedBlocks.add(blockId);
              timers.delete(blockId);
              track('block_exposed', {
                package_id: pkg.id,
                block_id: blockId,
                block_type: blockType
              });
            }, 700);

            timers.set(blockId, timer);
          } else {
            const timer = timers.get(blockId);
            if (timer) {
              window.clearTimeout(timer);
              timers.delete(blockId);
            }
          }
        }
      },
      {
        threshold: [0.55]
      }
    );

    document
      .querySelectorAll<HTMLElement>('[data-story-block]')
      .forEach((element) => observer.observe(element));

    window.addEventListener('scroll', reportDepth, { passive: true });
    reportDepth();

    const flushActiveSegment = () => {
      if (activeSegmentStartedAt === null) return;

      const dwellMs = Math.max(
        0,
        Math.round(performance.now() - activeSegmentStartedAt)
      );

      if (dwellMs >= 250) {
        track('package_dwell', {
          package_id: pkg.id,
          package_kind: pkg.kind,
          dwell_ms: dwellMs,
          max_depth_percent: Math.max(0, ...reached)
        });
      }

      activeSegmentStartedAt = null;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushActiveSegment();
      } else if (activeSegmentStartedAt === null) {
        activeSegmentStartedAt = performance.now();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('scroll', reportDepth);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      flushActiveSegment();
    };
  }, [pkg.id]);
}
