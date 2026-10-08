---
name: portfolio-dev
description: Build, change or fix pages, components, styles and tooling in Niraj Chavan's Astro 7 portfolio (static site on GitHub Pages under /niraj-chavan/). Use this whenever the user wants a new page, section, interactive feature or component; a design, theme, colour or layout change; a bug fixed; dependencies upgraded; or the site checked for accessibility (WCAG 2.2 AA), Lighthouse performance, SEO or deploy problems — even for a "small tweak", because the site has conventions (semantic tokens, href(), draft gating, contrast audit) that a quick edit can silently break.
---

# Portfolio development

Astro 7 + TypeScript + Tailwind CSS 4, statically generated, deployed to GitHub Pages at `https://devnirajc.github.io/niraj-chavan/`. Content lives in collections (see the `portfolio-content` skill for adding entries); this skill is about the code around them.

The bar the site is held to — keep it there with every change:

- **WCAG 2.2 AA**, axe-clean in both themes at desktop and mobile widths.
- **Lighthouse** Performance ≥ 95 (mobile), Accessibility, Best Practices and SEO 100.
- **Near-zero JavaScript**: every page is static HTML; scripts are small, progressive enhancements.

## Map

```
astro.config.mjs        site + base, fonts (Geist via fontsource), MDX, sitemap, Shiki themes
src/content.config.ts   every collection's schema; Medium loader
src/content/            all copy (MDX/YAML)
src/data/               profile.ts (identity), nav.ts, taxonomy.ts, writing.ts (Medium overrides)
src/lib/                drafts.ts (published(), visibleRefs(), pathsWhenVisible()), url.ts (href()),
                        nav.ts (visibleNav()), dates.ts, medium-feed.js / medium-loader.ts
src/styles/tokens.css   the only file with colour literals (light + [data-theme=dark])
src/styles/global.css   Tailwind theme mapped to tokens, primitives (.btn, .chip, .card, .prose…), motion
src/layouts/BaseLayout.astro   head/SEO, theme bootstrap, header, footer, search palette
src/components/         layout/, ui/, cards/, content/, diagram/, home/, mdx/
src/pages/              routes; gated section indexes are [...index].astro
scripts/                check-contrast.mjs, check-content.mjs, sync-medium.mjs, generate-og.js, generate-icons.js
public/sw.js            retires the old site's service worker — keep until early 2027
```

## Conventions (and why)

- **Links go through `href()`** from `@/lib/url`. The site lives under a base path with trailing slashes; a hand-written `/about` 404s locally and redirects in production.
- **Content goes through `published()`**, never `getCollection()` + a hand-written draft filter, and references through `visibleRefs()`. That is the single rule deciding what production shows.
- **A section index that can be empty is a rest route** — `src/pages/<section>/[...index].astro` with `export const getStaticPaths = () => pathsWhenVisible('<collection>')`. A plain `.astro` page can't opt out of being built, so it would ship (and enter the sitemap) empty while its entries are drafts. Nav items for such sections set `requires:` in `src/data/nav.ts`.
- **Colour only via semantic utilities** — `bg-surface`, `text-fg-muted`, `border-line`, `text-accent-fg`, etc. Tailwind's default palette is deliberately cleared. New colour = new token in `tokens.css` (both themes) **plus** a pair in `scripts/check-contrast.mjs`; the build fails if any pair drops below its WCAG threshold. Text uses `accent-fg`, never `accent` (decorative only).
- **Icons**: `<Icon name="…" />` (inline SVG, always `aria-hidden`). Add new glyphs to `src/components/ui/Icon.astro` (Lucide geometry). Every icon-only control needs an `sr-only` label.
- **Interactive bits are progressive enhancement.** Ship real HTML first (`<details>`, links, lists), then a small `<script>` in the component. Patterns already in the codebase — reuse them:
  - filter chips: `FilterBar.astro` + `[data-filter-root]` / `[data-filter-item]` / `data-filter-tags`
  - disclosure menu: `SiteHeader.astro`; modal: native `<dialog>` + `showModal()` (`CommandPalette.astro`)
  - toggle buttons use `aria-pressed`; current page uses `aria-current="page"`; live results use a `role="status"` region
  - don't disable a button that may hold focus — use `aria-disabled` (see `ArchitectureDiagram.astro`)
- **Headings**: one `<h1>` per page (PageHeader or the hero); never skip levels — components that render sub-headings take a `headingLevel` prop.
- **Motion**: compositor-only, subtle, and off under `prefers-reduced-motion`. Reveals use the `.reveal` class (CSS scroll-driven animation — no JS). Page transitions are native cross-document View Transitions. No parallax, particles or animation libraries.
- **Images**: masters in `src/assets/`, rendered with `<Image>` from `astro:assets` with `widths`/`sizes`. Above-the-fold images get `loading="eager" fetchpriority="high"`; everything else stays lazy. Decorative images get `alt=""`.
- **Hairline grids** (`gap-px` on a `bg-line` container) show a grey hole when the last row is short — size columns to the item count, or add `span-odd-last` for two-column layouts.

## Astro 7 specifics that bite

- `compressHTML: true` is set on purpose: Astro 7's default `'jsx'` drops whitespace between inline elements on separate lines ("Read more" → "Readmore").
- The Rust compiler rejects unclosed tags and won't fix invalid nesting (`<div>` inside `<p>`) — write valid HTML.
- `z` comes from `astro/zod` (Zod 4: `z.url()`, `z.strictObject()`); render entries with `render(entry)` from `astro:content`; `entry.id`, not `entry.slug`.
- `getStaticPaths` runs in its own scope: it can use imports, not variables from the page script.
- Only one `astro preview` per project. To serve a second build (e.g. `dist-drafts`), use the static server in `scripts/serve-static.mjs` of this skill. In Git Bash, prefix with `MSYS_NO_PATHCONV=1` or `/niraj-chavan/` arguments get rewritten into Windows paths.
- YAML: commas inside one-line `{ … }` mappings silently cut values short; use block style.

## Commands

```bash
npm run dev               # drafts visible, marked
npm run dev:published     # exactly what production shows
npm run check             # astro check (types + content schemas) + contrast + content guard
npm run build             # contrast audit → TODO guard → astro build (what CI runs)
npm run build:drafts      # full build including drafts, into dist-drafts/
npm run preview           # serve dist at http://localhost:4321/niraj-chavan/
npm run og / icons        # regenerate the social card / favicons after brand changes
```

## Verify before you call it done

1. `npm run check` and `npm run build` — both clean.
2. Look at it. Screenshot the changed pages in light and dark, at 1440px and 390px (Playwright with `channel: 'chrome'` works on this machine), and actually inspect them.
3. Accessibility: copy `scripts/a11y-audit.mjs` from this skill into a scratch folder with `playwright` and `@axe-core/playwright` installed, and run it against the preview server (instructions at the top of the file). Expect zero violations; it audits both themes and widths with every `<details>` opened. For interactive changes, also drive them by keyboard (Tab, Enter/Space, Escape, arrows) and check focus never lands on `<body>`.
4. Performance: Lighthouse against `npm run preview`:
   ```bash
   CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" \
     npx lighthouse http://127.0.0.1:4321/niraj-chavan/<route> --quiet \
     --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo
   ```
   Mobile Performance should stay ≥ 95 with CLS 0. If JS grows, check `dist/_astro/*.js` sizes.
5. If you touched draft gating, build both modes and confirm the route list differs only by the draft pages.

## Deploy

`.github/workflows/deploy.yml` builds on push to `master` (and `redesign`), weekly on Mondays (to pick up new Medium posts) and on demand; it runs `astro check`, then `npm run build`, adds `.nojekyll` (Jekyll would drop `_astro/`), and publishes `dist/` to Pages. Node 22+ is required.
