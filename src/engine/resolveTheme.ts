import type { StoryworldEntity, VisualIdentity } from '../domain/types';
import type { ThemeTokens } from './types';

const palettes: Record<NonNullable<VisualIdentity['atmosphere']>, ThemeTokens> = {
  warm: {
    background: '#f6efe1',
    surface: '#efe4d1',
    surfaceStrong: '#e8dcc7',
    text: '#26332f',
    muted: '#66736c',
    border: '#d2c5b0',
    accent: '#b96f47',
    accentSoft: 'rgba(185, 111, 71, 0.12)',
    skyTop: '#dbe8e6',
    skyBottom: '#f6d2ad',
    sceneA: '#687f72',
    sceneB: '#a69b72',
    sceneC: '#d6b06d',
    glow: '#efb45e'
  },
  serene: {
    background: '#eef3ef',
    surface: '#e5ede7',
    surfaceStrong: '#d9e5de',
    text: '#213637',
    muted: '#647a78',
    border: '#c8d6cf',
    accent: '#4f817b',
    accentSoft: 'rgba(79, 129, 123, 0.12)',
    skyTop: '#d5e7e4',
    skyBottom: '#eee8d9',
    sceneA: '#71958c',
    sceneB: '#a0b9ae',
    sceneC: '#d2bf7a',
    glow: '#e4c15f'
  },
  mysterious: {
    background: '#eeece6',
    surface: '#e5e1db',
    surfaceStrong: '#dcd8d2',
    text: '#272936',
    muted: '#6d6d79',
    border: '#cfcbc3',
    accent: '#6c678f',
    accentSoft: 'rgba(108, 103, 143, 0.12)',
    skyTop: '#d9dbe7',
    skyBottom: '#eadfd7',
    sceneA: '#596775',
    sceneB: '#8d839e',
    sceneC: '#a7a58a',
    glow: '#d3b66f'
  },
  tense: {
    background: '#eee8e2',
    surface: '#e4ddd8',
    surfaceStrong: '#d9d2ce',
    text: '#2a2d37',
    muted: '#726a6c',
    border: '#d2c6c0',
    accent: '#a6544b',
    accentSoft: 'rgba(166, 84, 75, 0.12)',
    skyTop: '#cbd8df',
    skyBottom: '#e9b9aa',
    sceneA: '#4e6270',
    sceneB: '#826067',
    sceneC: '#c57b65',
    glow: '#efc46d'
  },
  austere: {
    background: '#f0eee8',
    surface: '#e8e5de',
    surfaceStrong: '#dfdbd2',
    text: '#2d312f',
    muted: '#72766f',
    border: '#d0ccc1',
    accent: '#7c725d',
    accentSoft: 'rgba(124, 114, 93, 0.11)',
    skyTop: '#dde2dc',
    skyBottom: '#eee7da',
    sceneA: '#717d75',
    sceneB: '#9d9f91',
    sceneC: '#c3b88e',
    glow: '#dcc47d'
  },
  playful: {
    background: '#f7ede5',
    surface: '#f0ded2',
    surfaceStrong: '#e9d3c7',
    text: '#373132',
    muted: '#7c6a69',
    border: '#dbc6bc',
    accent: '#b45b50',
    accentSoft: 'rgba(180, 91, 80, 0.12)',
    skyTop: '#d9e5e2',
    skyBottom: '#f0c7ae',
    sceneA: '#687e79',
    sceneB: '#a87970',
    sceneC: '#d6aa72',
    glow: '#f0b25d'
  }
};

export function resolveTheme(entity: StoryworldEntity): ThemeTokens {
  const atmosphere = entity.visual?.atmosphere ?? 'serene';
  return palettes[atmosphere];
}
