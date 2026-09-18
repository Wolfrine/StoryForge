export type PackageKind =
  | 'person'
  | 'place'
  | 'event'
  | 'concept'
  | 'faction'
  | 'object'
  | 'species'
  | 'story'
  | 'collection'
  | 'other';

export type MediaType = 'image' | 'video' | 'audio' | 'model';

export interface ThemePalette {
  background: string;
  foreground: string;
  surface: string;
  muted: string;
  accent: string;
}

export interface StoryTheme {
  palette: ThemePalette;
  typography?: {
    tone?: 'editorial' | 'humanist' | 'modern' | 'technical';
  };
  motion?: {
    pace?: 'still' | 'slow' | 'medium' | 'active';
  };
  composition?: {
    density?: 'airy' | 'balanced' | 'dense';
    mediaWeight?: 'low' | 'balanced' | 'dominant';
  };
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  src: string;
  alt?: string;
  caption?: string;
  role?: 'hero' | 'supporting' | 'portrait' | 'environment' | 'detail' | 'diagram';
  focalPoint?: {
    x: number;
    y: number;
  };
}

export type StoryBlock =
  | {
      id: string;
      type: 'hero';
      title?: string;
      subtitle?: string;
      mediaId?: string;
    }
  | {
      id: string;
      type: 'prose';
      heading?: string;
      paragraphs: string[];
    }
  | {
      id: string;
      type: 'quote';
      text: string;
      attribution?: string;
    }
  | {
      id: string;
      type: 'gallery';
      mediaIds: string[];
      heading?: string;
    }
  | {
      id: string;
      type: 'timeline';
      heading?: string;
      items: Array<{
        id: string;
        label?: string;
        title: string;
        summary?: string;
      }>;
    }
  | {
      id: string;
      type: 'process';
      heading?: string;
      items: Array<{
        id: string;
        title: string;
        summary?: string;
      }>;
    }
  | {
      id: string;
      type: 'relationships';
      heading?: string;
    };

export interface StoryRelationship {
  id: string;
  targetId: string;
  label: string;
  summary?: string;
  weight?: number;
}

export interface StoryPackage {
  schemaVersion: '1.0';
  id: string;
  kind: PackageKind;
  title: string;
  summary: string;
  theme?: Partial<StoryTheme>;
  media?: MediaAsset[];
  blocks: StoryBlock[];
  relationships?: StoryRelationship[];
  entry?: {
    priority?: number;
    featured?: boolean;
    hidden?: boolean;
  };
  tags?: string[];
}

export interface StoryWorldManifest {
  schemaVersion: '1.0';
  id: string;
  title: string;
  subtitle?: string;
  theme: StoryTheme;
  entryPolicy?: {
    maxDirections?: number;
    preferDiversity?: boolean;
  };
  packages: StoryPackage[];
}
