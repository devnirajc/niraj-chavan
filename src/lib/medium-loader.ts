/**
 * Content loader for Medium articles.
 *
 * Tries the live RSS feed first so every deploy picks up new posts (the
 * deploy workflow also rebuilds weekly for this reason). If Medium is
 * unreachable — offline dev, rate limiting, an outage — it falls back to
 * src/data/medium-snapshot.json, so a flaky third party can never break or
 * empty the build. Refresh the snapshot with `npm run sync:medium`.
 *
 * Medium's tags are free-form; src/data/writing.ts maps them onto the site's
 * fixed categories and lets individual posts be featured or recategorised.
 */

import type { Loader } from 'astro/loaders';
import { fetchFeed, type Article } from './medium-feed.js';
import { categoriesFor, isFeatured, titleFor } from '../data/writing';
// Imported rather than read from disk, so it is bundled with the loader and
// the path cannot drift when Vite moves the compiled code.
import snapshot from '../data/medium-snapshot.json';

export function mediumLoader({ username }: { username: string }): Loader {
  return {
    name: 'medium',
    async load({ store, logger, parseData }) {
      let articles: Article[];
      try {
        articles = await fetchFeed(username);
        // A 200 that parses to nothing (a challenge page, an empty channel)
        // would otherwise wipe the writing section; treat it as a failure.
        if (articles.length === 0) throw new Error('feed returned no articles');
        logger.info(`Fetched ${articles.length} articles from Medium`);
      } catch (error) {
        articles = snapshot as Article[];
        logger.warn(
          `Medium feed unavailable (${(error as Error).message}); using snapshot with ${articles.length} articles`
        );
      }

      store.clear();
      for (const article of articles) {
        const data = await parseData({
          id: article.id,
          data: {
            title: titleFor(article),
            url: article.url,
            published: article.published,
            excerpt: article.excerpt,
            tags: article.tags,
            categories: categoriesFor(article),
            readingMinutes: article.readingMinutes,
            featured: isFeatured(article.id),
          },
        });
        store.set({ id: article.id, data });
      }
    },
  };
}
