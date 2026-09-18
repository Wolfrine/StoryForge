export type EntityKind =
  | 'person'
  | 'place'
  | 'concept'
  | 'event'
  | 'faction'
  | 'object'
  | 'species'
  | 'story'
  | 'ability';

export type CanonState = 'canon' | 'developing' | 'legacy' | 'conflict';

export type ExperienceDepth = 'overview' | 'explore' | 'deep';

export type SceneFamily =
  | 'landscape'
  | 'portrait'
  | 'rupture'
  | 'ritual'
  | 'civilization'
  | 'abstract'
  | 'distortion';

export interface SourceRef {
  id: string;
  label: string;
  kind: 'github' | 'notion' | 'chat' | 'manual';
  url?: string;
  note?: string;
}

export interface VisualIdentity {
  atmosphere?: 'serene' | 'tense' | 'mysterious' | 'warm' | 'austere' | 'playful';
  luminosity?: 'bright' | 'balanced' | 'dark';
  density?: 'spacious' | 'balanced' | 'dense';
  motion?: 'still' | 'gentle' | 'active';
  materiality?: 'natural' | 'architectural' | 'ethereal' | 'industrial';
  sceneFamily?: SceneFamily;
}

export interface MeaningModel {
  tensions?: string[];
  desiredFeelings?: string[];
  questions?: string[];
  realization?: string;
  explicit?: boolean;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  label: string;
  description?: string;
  strength?: 'weak' | 'normal' | 'strong';
}

export interface TimelineEvent {
  id: string;
  title: string;
  order: number;
  dateLabel?: string;
  summary?: string;
  placeId?: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  summary?: string;
}

export interface MediaRef {
  id: string;
  kind: 'image' | 'video' | 'audio' | 'diagram' | 'model';
  src: string;
  alt: string;
  caption?: string;
}

export interface StoryworldEntity {
  id: string;
  kind: EntityKind;
  name: string;
  subtitle?: string;
  status: CanonState;
  summary: string;
  body?: string[];
  tags?: string[];
  visual?: VisualIdentity;
  meaning?: MeaningModel;
  relationshipIds?: string[];
  timeline?: TimelineEvent[];
  process?: ProcessStep[];
  media?: MediaRef[];
  sourceRefs?: SourceRef[];
  metadata?: Record<string, string | number | boolean | string[]>;
}

export interface Storyworld {
  id: string;
  name: string;
  version: string;
  entities: StoryworldEntity[];
  relationships: Relationship[];
}
