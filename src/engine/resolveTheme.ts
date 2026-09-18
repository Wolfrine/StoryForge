import type { StoryworldEntity, VisualIdentity } from '../domain/types';
import type { ThemeTokens } from './types';

const base: ThemeTokens = {
  background: '#0b0d12',
  surface: '#11151d',
  surfaceStrong: '#171d28',
  text: '#f4f5f7',
  muted: '#a3acbb',
  border: '#2a3342',
  accent: '#aebed8',
  accentSoft: 'rgba(174, 190, 216, 0.14)'
};

const atmosphereAccent: Record<NonNullable<VisualIdentity['atmosphere']>, [string, string]> = {
  serene: ['#b9d9d1', 'rgba(185, 217, 209, 0.14)'],
  tense: ['#d6a5a5', 'rgba(214, 165, 165, 0.14)'],
  mysterious: ['#b8addb', 'rgba(184, 173, 219, 0.14)'],
  warm: ['#e2c89c', 'rgba(226, 200, 156, 0.14)'],
  austere: ['#b9c1cd', 'rgba(185, 193, 205, 0.12)'],
  playful: ['#dbc2a7', 'rgba(219, 194, 167, 0.14)']
};

export function resolveTheme(entity: StoryworldEntity): ThemeTokens {
  const tokens = { ...base };
  const atmosphere = entity.visual?.atmosphere;

  if (atmosphere) {
    const [accent, accentSoft] = atmosphereAccent[atmosphere];
    tokens.accent = accent;
    tokens.accentSoft = accentSoft;
  }

  if (entity.visual?.luminosity === 'bright') {
    tokens.background = '#f1efe9';
    tokens.surface = '#f8f6f1';
    tokens.surfaceStrong = '#ffffff';
    tokens.text = '#20242c';
    tokens.muted = '#667080';
    tokens.border = '#d7d4cc';
  }

  return tokens;
}
