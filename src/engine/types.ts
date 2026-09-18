import type { ExperienceDepth, StoryworldEntity } from '../domain/types';

export type VisualModuleType =
  | 'hero'
  | 'narrative'
  | 'relationships'
  | 'timeline'
  | 'process'
  | 'meaning'
  | 'provenance';

export interface ResolvedVisualModule {
  id: string;
  type: VisualModuleType;
  minDepth: ExperienceDepth;
  priority: number;
  title?: string;
}

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceStrong: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentSoft: string;
}

export interface RenderContext {
  entity: StoryworldEntity;
  depth: ExperienceDepth;
}
