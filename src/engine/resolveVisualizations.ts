import type { ExperienceDepth, StoryworldEntity } from '../domain/types';
import type { ResolvedVisualModule } from './types';

const depthRank: Record<ExperienceDepth, number> = {
  overview: 0,
  explore: 1,
  deep: 2
};

export interface ResolveOptions {
  relationshipCount: number;
  studio: boolean;
}

export function resolveVisualizations(
  entity: StoryworldEntity,
  depth: ExperienceDepth,
  options: ResolveOptions
): ResolvedVisualModule[] {
  const candidates: ResolvedVisualModule[] = [
    { id: 'hero', type: 'hero', minDepth: 'overview', priority: 10 },
    ...(entity.body?.length
      ? [{ id: 'narrative', type: 'narrative' as const, minDepth: 'overview' as const, priority: 20 }]
      : []),
    ...(options.relationshipCount > 0
      ? [{ id: 'relationships', type: 'relationships' as const, minDepth: 'explore' as const, priority: 30 }]
      : []),
    ...(entity.timeline?.length
      ? [{ id: 'timeline', type: 'timeline' as const, minDepth: 'explore' as const, priority: 40 }]
      : []),
    ...(entity.process?.length
      ? [{ id: 'process', type: 'process' as const, minDepth: 'explore' as const, priority: 50 }]
      : []),
    ...(options.studio && entity.meaning
      ? [{ id: 'meaning', type: 'meaning' as const, minDepth: 'deep' as const, priority: 80 }]
      : []),
    ...(options.studio && entity.sourceRefs?.length
      ? [{ id: 'provenance', type: 'provenance' as const, minDepth: 'deep' as const, priority: 90 }]
      : [])
  ];

  return candidates
    .filter((module) => depthRank[module.minDepth] <= depthRank[depth])
    .sort((a, b) => a.priority - b.priority);
}
