/**
 * Editorial control over the Medium feed.
 *
 * Medium tags are free-form, and some posts carry none, so categories are
 * resolved in two passes: an explicit per-post override wins; otherwise each
 * tag (and the title) is matched against the keyword table below.
 */

import type { WritingCategory } from './taxonomy';

interface ArticleLike {
  id: string;
  title: string;
  tags: string[];
}

/**
 * Keyed by Medium post id — the last path segment of
 * https://medium.com/p/<id>, also printed by `npm run sync:medium`.
 */
const OVERRIDES: Record<
  string,
  { title?: string; categories?: WritingCategory[]; featured?: boolean }
> = {
  // "Ivy — New compiler and rendering engine"
  '2d91b8559e4a': { categories: ['Angular', 'Performance'], featured: true },
  // "flux" — published lower-case and without tags
  '164885369aa': { title: 'Flux', categories: ['Architecture', 'JavaScript'] },
};

const KEYWORDS: Array<[RegExp, WritingCategory]> = [
  [/\b(angular|ivy|rxjs|ngrx|signals?)\b/i, 'Angular'],
  [/\b(javascript|typescript|react|redux|node|es\d+)\b/i, 'JavaScript'],
  [/\b(architecture|design[- ]patterns?|flux|micro-?frontends?|system design)\b/i, 'Architecture'],
  [/\b(performance|tree[- ]shaking|bundle|lighthouse|core web vitals)\b/i, 'Performance'],
  [/\b(a11y|accessibility|wcag|aria)\b/i, 'Accessibility'],
  [/\b(aws|azure|gcp|cloud|serverless)\b/i, 'Cloud'],
  [/\b(devops|ci\/?cd|docker|kubernetes|github actions|pipelines?)\b/i, 'DevOps'],
  [/\b(career|mentoring|leadership|interview)\b/i, 'Career Growth'],
];

export function categoriesFor(article: ArticleLike): WritingCategory[] {
  const override = OVERRIDES[article.id]?.categories;
  if (override) return override;

  const haystack = [article.title, ...article.tags].join(' ');
  const found = KEYWORDS.filter(([pattern]) => pattern.test(haystack)).map(([, category]) => category);
  return [...new Set(found)];
}

export function titleFor(article: ArticleLike): string {
  return OVERRIDES[article.id]?.title ?? article.title;
}

export function isFeatured(id: string): boolean {
  return OVERRIDES[id]?.featured ?? false;
}
