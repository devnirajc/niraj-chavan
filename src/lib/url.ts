/**
 * Internal links.
 *
 * The site is served under a base path (/niraj-chavan/) with trailing
 * slashes, so a hand-written "/about" would 404 locally and redirect in
 * production. Every internal href goes through `href()`.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** `href('/about')` → `/niraj-chavan/about/`; keeps #hash and ?query intact. */
export function href(path = '/'): string {
  const [, pathname = '', suffix = ''] = path.match(/^([^?#]*)(.*)$/) ?? [];
  const trimmed = pathname.replace(/^\/+/, '');
  const looksLikeFile = /\.[a-z0-9]+$/i.test(trimmed);
  const withSlash = trimmed === '' || looksLikeFile || trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
  return `${BASE}${withSlash}${suffix}`;
}

/** Absolute URL for canonical tags, Open Graph and JSON-LD. */
export function absolute(path: string, site: URL | undefined): string {
  return new URL(href(path), site).toString();
}

/** True when `current` is `target` or one of its sub-pages. */
export function isCurrent(current: string, target: string): boolean {
  const normalise = (p: string) => p.replace(/\/?$/, '/');
  const a = normalise(current);
  const b = normalise(href(target));
  return b === normalise(BASE) ? a === b : a.startsWith(b);
}
