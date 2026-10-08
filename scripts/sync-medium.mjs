/**
 * Refresh the committed Medium snapshot.
 *
 *   npm run sync:medium
 *
 * The build always tries the live feed first; this snapshot is only the
 * fallback for when Medium cannot be reached. Re-run after publishing a post
 * and commit src/data/medium-snapshot.json so offline builds stay current.
 * Prints each post's id — the key used for overrides in src/data/writing.ts.
 */

import { writeFile } from 'node:fs/promises';
import { fetchFeed } from '../src/lib/medium-feed.js';

const USERNAME = 'nirajd327';
const OUT = new URL('../src/data/medium-snapshot.json', import.meta.url);

const articles = await fetchFeed(USERNAME, { timeoutMs: 20_000 });
await writeFile(OUT, `${JSON.stringify(articles, null, 2)}\n`);

console.log(`Saved ${articles.length} articles to src/data/medium-snapshot.json\n`);
for (const a of articles) {
  console.log(`  ${a.id.padEnd(14)} ${a.published.slice(0, 10)}  ${a.title}`);
}
