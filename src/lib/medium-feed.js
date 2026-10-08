/**
 * Medium RSS → article records.
 *
 * Plain JavaScript (typed with JSDoc) because it is shared by two runtimes:
 * the content loader in src/lib/medium-loader.ts, which runs inside the Astro
 * build, and scripts/sync-medium.mjs, which runs under bare Node to refresh
 * the committed snapshot.
 */

import { XMLParser } from 'fast-xml-parser';

/**
 * @typedef {object} Article
 * @property {string} id            Medium's post id (stable across renames)
 * @property {string} title
 * @property {string} url           Canonical post URL, tracking params removed
 * @property {string} published     ISO date
 * @property {string} excerpt       First paragraph, plain text, ≤ 220 chars
 * @property {string[]} tags        Medium tags as authored
 * @property {number} readingMinutes
 */

const WORDS_PER_MINUTE = 230;

/** @param {string} username */
export const feedUrl = (username) => `https://medium.com/feed/@${username}`;

/** @param {string} html */
function stripTags(html) {
  return html
    .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    // &amp; last, so an escaped entity ("&amp;lt;") decodes once, not twice.
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {string} text @param {number} max */
function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  // Break at a word boundary when there is one; a long unbroken run (a URL)
  // is cut at the limit instead.
  return `${space > 0 ? cut.slice(0, space) : cut}…`;
}

/**
 * The first real paragraph — skipping a heading that merely repeats the
 * title, which Medium often emits as the first block.
 *
 * @param {string} html @param {string} title
 */
function firstParagraph(html, title) {
  for (const [, inner] of html.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const text = stripTags(inner);
    if (text.length > 40 && text !== title) return text;
  }
  return stripTags(html).slice(0, 220);
}

/** @param {string} url */
function cleanUrl(url) {
  const u = new URL(url);
  u.search = '';
  return u.toString();
}

/**
 * @param {string} xml Raw RSS document
 * @returns {Article[]}
 */
export function parseFeed(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: false,
    isArray: (name) => name === 'item' || name === 'category',
  });
  const doc = parser.parse(xml);
  const items = doc?.rss?.channel?.item ?? [];

  return items.map((item) => {
    const html = String(item['content:encoded'] ?? '');
    const title = String(item.title).trim();
    const words = stripTags(html).split(' ').filter(Boolean).length;
    const guid = typeof item.guid === 'object' ? item.guid['#text'] : item.guid;

    return {
      id: guid ? String(guid).split('/').pop() : cleanUrl(item.link),
      title,
      url: cleanUrl(item.link),
      published: new Date(item.pubDate).toISOString(),
      excerpt: truncate(firstParagraph(html, title), 220),
      tags: (item.category ?? []).map(String),
      readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    };
  });
}

/**
 * @param {string} username
 * @param {{ timeoutMs?: number }} [options]
 * @returns {Promise<Article[]>}
 */
export async function fetchFeed(username, { timeoutMs = 10_000 } = {}) {
  const response = await fetch(feedUrl(username), {
    // Medium rejects requests without a browser-ish user agent.
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio-build)' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`Medium feed responded ${response.status}`);
  return parseFeed(await response.text());
}
