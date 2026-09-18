import type { StoryBlock, StoryPackage, StoryTheme } from '../domain/story';
import {
  resolveBlockVisualSpec,
  type BlockEmphasis,
  type BlockWidth
} from './blockRegistry';

export interface ComposedBlock {
  block: StoryBlock;
  width: BlockWidth;
  emphasis: BlockEmphasis;
  interaction: 'passive' | 'explore' | 'navigate';
}

export function composePackage(
  pkg: StoryPackage,
  theme: StoryTheme
): ComposedBlock[] {
  return pkg.blocks.map((block) => ({
    block,
    ...resolveBlockVisualSpec(block, theme)
  }));
}
