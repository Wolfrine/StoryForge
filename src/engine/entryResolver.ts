import type { StoryPackage, StoryWorldManifest } from '../domain/story';

function blockScore(pkg: StoryPackage): number {
  return pkg.blocks.reduce((score, block) => {
    switch (block.type) {
      case 'hero':
        return score + 4;
      case 'gallery':
        return score + 3 + Math.min(block.mediaIds.length, 4);
      case 'timeline':
      case 'process':
        return score + 4 + Math.min(block.items.length, 5) * 0.35;
      case 'relationships':
        return score + 3;
      case 'quote':
        return score + 2;
      case 'prose':
        return score + 2 + Math.min(block.paragraphs.length, 4) * 0.3;
      default:
        return score;
    }
  }, 0);
}

function mediaScore(pkg: StoryPackage): number {
  return (pkg.media ?? []).reduce((score, media) => {
    const roleBoost =
      media.role === 'hero' || media.role === 'portrait' || media.role === 'environment'
        ? 2
        : 0.7;
    return score + roleBoost;
  }, 0);
}

export function packageEntryScore(pkg: StoryPackage): number {
  if (pkg.entry?.hidden) return Number.NEGATIVE_INFINITY;

  const priority = pkg.entry?.priority ?? 0;
  const featured = pkg.entry?.featured ? 10 : 0;
  const relationships = Math.min(pkg.relationships?.length ?? 0, 8) * 0.8;

  return priority * 2 + featured + blockScore(pkg) + mediaScore(pkg) + relationships;
}

export function resolveEntryDirections(world: StoryWorldManifest): StoryPackage[] {
  const maxDirections = Math.max(3, Math.min(world.entryPolicy?.maxDirections ?? 5, 7));
  const candidates = world.packages
    .filter((pkg) => !pkg.entry?.hidden)
    .map((pkg) => ({ pkg, score: packageEntryScore(pkg) }))
    .sort((a, b) => b.score - a.score);

  if (!world.entryPolicy?.preferDiversity) {
    return candidates.slice(0, maxDirections).map((item) => item.pkg);
  }

  const selected: StoryPackage[] = [];
  const usedKinds = new Set<string>();

  for (const candidate of candidates) {
    if (selected.length >= maxDirections) break;
    if (!usedKinds.has(candidate.pkg.kind)) {
      selected.push(candidate.pkg);
      usedKinds.add(candidate.pkg.kind);
    }
  }

  for (const candidate of candidates) {
    if (selected.length >= maxDirections) break;
    if (!selected.some((pkg) => pkg.id === candidate.pkg.id)) {
      selected.push(candidate.pkg);
    }
  }

  return selected;
}
