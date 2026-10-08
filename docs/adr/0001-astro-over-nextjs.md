# ADR 0001 — Rebuild on Astro rather than Next.js

**Status:** Accepted · October 2026

## Context

The previous site was a single page of vanilla Web Components rendered on the client from JSON (Vite 7, GitHub Pages). It was fast and carefully accessible, but it could not support the redesign:

- **No server or static rendering.** Every section was built by JavaScript after load, so crawlers and link previews saw an empty `<main>`, and a loading overlay had to cover the page until components rendered.
- **One page, no routing.** Case studies and projects need their own URLs (`/case-study/…`, `/projects/…`) with their own metadata.
- **No content pipeline.** Long-form case studies want Markdown/MDX with validated frontmatter, cross-references and draft handling — not hand-maintained JSON.

So the stack had to change. The candidates were **Next.js 16** (App Router, React, deployed to Vercel or as a static export) and **Astro 7** (static-first, islands).

## Decision

Astro 7 + TypeScript + Tailwind CSS 4 + MDX, statically generated and still deployed to GitHub Pages.

## Why

| Concern | Astro 7 | Next.js 16 |
| --- | --- | --- |
| JavaScript shipped | None by default; this site ships under 8 kB per page (about 3 kB gzipped) for search, filters, theme, menu and the diagram | React runtime and hydration on every page, even for static content |
| Content | Content collections with Zod schemas, references between collections, custom loaders (the Medium feed), MDX built in | MDX via add-ons; content validation is yours to build |
| Hosting | Plain static output to the existing GitHub Pages setup | Static export loses image optimisation, route handlers and ISR; the full feature set wants Vercel |
| Images & fonts | Build-time responsive WebP; self-hosted subset fonts with metric-matched fallbacks | `next/image` needs a server or a custom loader under static export |
| Page transitions | Native cross-document View Transitions, no client router | Client router required |
| Interactivity later | React (or any framework) islands per component when a feature needs it | Native |

The site is overwhelmingly content — the interactive parts are small and self-contained — which is exactly the shape Astro is built for. Shipping almost no JavaScript is what makes Lighthouse 95–100 the default rather than a tuning exercise.

## Trade-offs accepted

- **Less React on show.** Next.js would demonstrate React and Server Components directly. Mitigated by the React side projects linked from the site, and by islands if a feature ever warrants React.
- **No server features on GitHub Pages.** A contact form needs a hosted endpoint (Formspree-compatible, configured in `src/data/profile.ts`); AI-powered search would need a serverless function. If those become important, add an Astro adapter (Vercel or Netlify) — pages stay static, only the endpoints become functions.
- **Hand-written interactions.** The filters, search palette and diagram are small vanilla TypeScript modules rather than library components. They are progressive enhancements over working HTML, which is also what keeps them accessible without JavaScript.
- **Astro 7 is recent.** It brings a Rust compiler that rejects invalid HTML and a new whitespace default; both are handled in `astro.config.mjs` and documented in `.claude/skills/portfolio-dev`.

## Measured outcome

Production build, Lighthouse (mobile, simulated throttling): Performance 98–100, Accessibility 100, Best Practices 100, SEO 100 on every audited page; CLS 0, total blocking time 0 ms. axe-core: no violations on any route, light and dark, at 390 px and 1440 px.
