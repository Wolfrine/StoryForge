import type { StoryworldEntity } from '../domain/types';
import type { ThemeTokens } from './types';

const themes: Record<string, ThemeTokens> = {
  warm: {
    background: '#f7ecdc',
    surface: '#fffaf1',
    surfaceStrong: '#ffffff',
    text: '#263947',
    muted: '#63737e',
    border: '#d9cbbb',
    accent: '#b85f42',
    accentSoft: 'rgba(184, 95, 66, 0.13)'
  },
  serene: {
    background: '#e8f3f0',
    surface: '#f7fbfa',
    surfaceStrong: '#ffffff',
    text: '#1f4148',
    muted: '#5e777a',
    border: '#c5d9d5',
    accent: '#2f847d',
    accentSoft: 'rgba(47, 132, 125, 0.12)'
  },
  mysterious: {
    background: '#eeeaf6',
    surface: '#f9f7fc',
    surfaceStrong: '#ffffff',
    text: '#302d48',
    muted: '#6e6885',
    border: '#d3cce1',
    accent: '#725da8',
    accentSoft: 'rgba(114, 93, 168, 0.12)'
  },
  tense: {
    background: '#f3eae2',
    surface: '#fbf6f1',
    surfaceStrong: '#ffffff',
    text: '#362f31',
    muted: '#776867',
    border: '#dccac2',
    accent: '#bd4f3f',
    accentSoft: 'rgba(189, 79, 63, 0.12)'
  },
  austere: {
    background: '#eceae4',
    surface: '#f7f5f0',
    surfaceStrong: '#ffffff',
    text: '#303638',
    muted: '#6e7475',
    border: '#d2d0c8',
    accent: '#69757c',
    accentSoft: 'rgba(105, 117, 124, 0.11)'
  },
  playful: {
    background: '#fff0d7',
    surface: '#fff8ec',
    surfaceStrong: '#ffffff',
    text: '#463a34',
    muted: '#806e63',
    border: '#e6d0ad',
    accent: '#d07743',
    accentSoft: 'rgba(208, 119, 67, 0.13)'
  }
};

export function resolveTheme(entity: StoryworldEntity): ThemeTokens {
  const atmosphere = entity.visual?.atmosphere ?? 'serene';
  return { ...themes[atmosphere] };
}
