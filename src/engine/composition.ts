import type { StoryBlock, StoryPackage, StoryTheme } from '../domain/story';

export interface ComposedBlock {
  block: StoryBlock;
  width: 'narrow' | 'medium' | 'wide' | 'full';
  emphasis: 'quiet' | 'normal' | 'strong';
}

export function composePackage(pkg: StoryPackage, theme: StoryTheme): ComposedBlock[] {
  const mediaWeight = theme.composition?.mediaWeight ?? 'balanced';

  return pkg.blocks.map((block) => {
    if (block.type === 'hero') {
      return {
        block,
        width: mediaWeight === 'dominant' ? 'full' : 'wide',
        emphasis: 'strong'
      };
    }

    if (block.type === 'gallery') {
      return {
        block,
        width: block.mediaIds.length > 2 ? 'full' : 'wide',
        emphasis: mediaWeight === 'dominant' ? 'strong' : 'normal'
      };
    }

    if (block.type === 'timeline' || block.type === 'process') {
      return {
        block,
        width: 'wide',
        emphasis: 'normal'
      };
    }

    if (block.type === 'relationships') {
      return {
        block,
        width: 'wide',
        emphasis: 'quiet'
      };
    }

    return {
      block,
      width: 'narrow',
      emphasis: block.type === 'quote' ? 'strong' : 'normal'
    };
  });
}
