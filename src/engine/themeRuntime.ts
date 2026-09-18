import type { CSSProperties } from 'react';
import type { StoryTheme } from '../domain/story';

export const neutralTheme: StoryTheme = {
  palette: {
    background: '#f3efe7',
    foreground: '#263a47',
    surface: '#fffdf8',
    muted: '#71808a',
    accent: '#9a674e'
  },
  typography: {
    tone: 'editorial'
  },
  motion: {
    pace: 'slow'
  },
  composition: {
    density: 'airy',
    mediaWeight: 'balanced'
  }
};

export function mergeTheme(
  worldTheme: StoryTheme,
  localTheme?: Partial<StoryTheme>
): StoryTheme {
  return {
    ...worldTheme,
    ...localTheme,
    palette: {
      ...worldTheme.palette,
      ...(localTheme?.palette ?? {})
    },
    typography: {
      ...worldTheme.typography,
      ...(localTheme?.typography ?? {})
    },
    motion: {
      ...worldTheme.motion,
      ...(localTheme?.motion ?? {})
    },
    composition: {
      ...worldTheme.composition,
      ...(localTheme?.composition ?? {})
    }
  };
}

const typographyMap: Record<
  'editorial' | 'humanist' | 'modern' | 'technical',
  string
> = {
  editorial: 'Iowan Old Style, Baskerville, Georgia, serif',
  humanist: 'Aptos, Segoe UI, sans-serif',
  modern: 'Inter, ui-sans-serif, system-ui, sans-serif',
  technical: 'IBM Plex Mono, ui-monospace, SFMono-Regular, monospace'
};

export function themeToStyle(theme: StoryTheme): CSSProperties {
  const tone = theme.typography?.tone ?? 'editorial';

  return {
    '--sf-background': theme.palette.background,
    '--sf-foreground': theme.palette.foreground,
    '--sf-surface': theme.palette.surface,
    '--sf-muted': theme.palette.muted,
    '--sf-accent': theme.palette.accent,
    '--sf-display-font': typographyMap[tone],
    '--sf-density': theme.composition?.density ?? 'airy',
    '--sf-media-weight': theme.composition?.mediaWeight ?? 'balanced',
    '--sf-motion-pace': theme.motion?.pace ?? 'slow'
  } as CSSProperties;
}
