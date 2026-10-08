/**
 * Draft visibility.
 *
 *   npm run dev              drafts visible, marked with a Draft badge
 *   npm run dev:published    exactly what production will show
 *   npm run build:drafts     a full build including drafts, for review
 *   npm run build            production: drafts excluded
 *
 * Every page and listing filters through `published()` — never through a
 * hand-written `!data.draft` — so there is one rule and one place to change it.
 */

import { getCollection, getEntries, type CollectionKey, type CollectionEntry } from 'astro:content';

export const SHOW_DRAFTS = import.meta.env.DEV
  ? import.meta.env.MODE !== 'published'
  : import.meta.env.MODE === 'drafts';

type WithDraft = { data: { draft?: boolean } };

export function isVisible(entry: WithDraft): boolean {
  return SHOW_DRAFTS || !entry.data.draft;
}

/** getCollection() with drafts removed unless drafts are being shown. */
export async function published<C extends CollectionKey>(collection: C): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  return entries.filter((entry) => isVisible(entry as WithDraft));
}

/**
 * Resolves references and drops any that point at a hidden draft — so a
 * published skill can cite a draft case study without linking to a 404.
 */
export async function visibleRefs<C extends CollectionKey>(
  refs: { collection: C; id: string }[]
): Promise<CollectionEntry<C>[]> {
  if (refs.length === 0) return [];
  const entries = (await getEntries(refs as never)) as CollectionEntry<C>[];
  return entries.filter((entry) => entry && isVisible(entry as WithDraft));
}

export const isDraft = (entry: WithDraft) => Boolean(entry.data.draft);

/**
 * getStaticPaths() for a section index that should only exist while its
 * collection has something visible. Used by rest-parameter routes such as
 * src/pages/problems/[...index].astro, where `index: undefined` generates the
 * bare /problems/ URL — so production never serves (or lists in the sitemap)
 * an empty page while every entry is still a draft.
 */
export async function pathsWhenVisible(collection: CollectionKey) {
  return (await published(collection)).length > 0 ? [{ params: { index: undefined } }] : [];
}

/**
 * Drops MDX headings that sit inside <Draft> blocks when drafts are hidden.
 * render() reports every heading in the source, but <Draft> renders nothing
 * in production — so a table of contents built from render().headings would
 * link to anchors that are not on the page.
 */
export function headingsOutsideDrafts<H extends { text: string }>(body: string | undefined, headings: H[]): H[] {
  if (SHOW_DRAFTS || !body) return headings;
  const hidden = new Set<string>();
  for (const block of body.match(/<Draft\b[\s\S]*?<\/Draft>/g) ?? []) {
    for (const [, text] of block.matchAll(/^#{2,6}\s+(.+?)\s*$/gm)) hidden.add(text.trim());
  }
  return headings.filter((h) => !hidden.has(h.text.trim()));
}
