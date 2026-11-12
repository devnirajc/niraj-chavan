import { published } from '@/lib/drafts';

/**
 * The "Right now" list (src/content/focus.yaml) in display order, plus the
 * newest `updated` date — the "Last updated" shown on /now/ and the home page.
 */
export async function getFocus() {
  const items = (await published('focus')).sort((a, b) => a.data.order - b.data.order);
  const updated = items.reduce<Date | undefined>(
    (latest, item) => (!latest || item.data.updated > latest ? item.data.updated : latest),
    undefined
  );
  return { items, updated };
}
