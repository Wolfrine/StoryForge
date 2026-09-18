import type { StoryBlock, StoryTheme } from '../domain/story';

export type BlockWidth = 'narrow' | 'medium' | 'wide' | 'full';
export type BlockEmphasis = 'quiet' | 'normal' | 'strong';

export interface BlockVisualSpec {
  width: BlockWidth;
  emphasis: BlockEmphasis;
  interaction: 'passive' | 'explore' | 'navigate';
}

export function resolveBlockVisualSpec(
  block: StoryBlock,
  theme: StoryTheme
): BlockVisualSpec {
  const mediaWeight = theme.composition?.mediaWeight ?? 'balanced';

  switch (block.type) {
    case 'hero':
      return {
        width: mediaWeight === 'dominant' ? 'full' : 'wide',
        emphasis: 'strong',
        interaction: 'passive'
      };

    case 'gallery':
      return {
        width: block.mediaIds.length > 2 ? 'full' : 'wide',
        emphasis: mediaWeight === 'dominant' ? 'strong' : 'normal',
        interaction: 'explore'
      };

    case 'annotatedMedia':
      return {
        width: mediaWeight === 'low' ? 'wide' : 'full',
        emphasis: 'strong',
        interaction: 'explore'
      };

    case 'timeline':
    case 'process':
    case 'journey':
    case 'comparison':
      return {
        width: 'wide',
        emphasis: 'normal',
        interaction: block.type === 'journey' ? 'navigate' : 'explore'
      };

    case 'graph':
      return {
        width: 'full',
        emphasis: 'strong',
        interaction: 'explore'
      };

    case 'relationships':
      return {
        width: 'wide',
        emphasis: 'quiet',
        interaction: 'navigate'
      };

    case 'quote':
      return {
        width: 'narrow',
        emphasis: 'strong',
        interaction: 'passive'
      };

    case 'prose':
    default:
      return {
        width: 'narrow',
        emphasis: 'normal',
        interaction: 'passive'
      };
  }
}
