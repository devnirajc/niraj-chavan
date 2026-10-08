// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * The site is served from GitHub Pages as a project page, so every URL lives
 * under /niraj-chavan/. `site` + `base` are the only two places that fact is
 * written down — components build links through `href()` in src/lib/url.ts,
 * never by hand.
 *
 * (The previous build advertised https://niraj-chavan.github.io/ in its
 * canonical and Open Graph tags; that host 404s. The live site has always been
 * the devnirajc account.)
 */
export default defineConfig({
  site: 'https://devnirajc.github.io',
  base: '/niraj-chavan',
  trailingSlash: 'always',

  /*
    Astro 7 changed the default to 'jsx', which drops the whitespace between
    inline elements written on separate lines ("<a>Read</a>\n<span>more</span>"
    renders as "Readmore"). The components here are written as HTML, so keep
    HTML's whitespace rules.
  */
  compressHTML: true,

  integrations: [
    mdx(),
    sitemap({
      // The 404 page is served for unknown URLs; it is not a page to index.
      filter: (page) => !page.includes('/404'),
    }),
  ],

  /*
    Self-hosted, subset, metric-matched fonts. Astro downloads them at build
    time, emits @font-face with a size-adjusted local fallback (so the swap
    causes no layout shift) and preloads only what <Font preload> asks for.
  */
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],

  markdown: {
    shikiConfig: {
      // Both palettes are emitted as CSS variables; global.css picks one per
      // data-theme, so code blocks follow the theme toggle.
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
    },
  },

  prefetch: {
    // Hover/focus prefetch makes cross-page navigation feel instant without
    // shipping a client-side router.
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
