import type { CollectionKey } from 'astro:content';
import type { NavItem } from '@/data/nav';
import { published } from './drafts';

const counts = new Map<CollectionKey, Promise<number>>();

/**
 * Visible-entry count per collection. Memoised for the production build,
 * where every page asks the same question; never in dev, where flipping a
 * draft flag must show up on the next request.
 */
function countOf(collection: CollectionKey): Promise<number> {
  if (import.meta.env.DEV) return published(collection).then((entries) => entries.length);
  if (!counts.has(collection)) {
    counts.set(
      collection,
      published(collection).then((entries) => entries.length)
    );
  }
  return counts.get(collection)!;
}

/** Drops nav items whose collection has nothing visible to show. */
export async function visibleNav(items: NavItem[]): Promise<NavItem[]> {
  const keep = await Promise.all(items.map((item) => (item.requires ? countOf(item.requires).then((n) => n > 0) : true)));
  return items.filter((_, i) => keep[i]);
}

export async function hasVisible(collection: CollectionKey): Promise<boolean> {
  return (await countOf(collection)) > 0;
}
