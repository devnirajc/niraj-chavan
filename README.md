# Niraj Chavan — portfolio

Source for **[devnirajc.github.io/niraj-chavan](https://devnirajc.github.io/niraj-chavan/)**: case studies, enterprise problem write-ups, projects, writing and the thinking behind them.

Astro 7 · TypeScript · Tailwind CSS 4 · MDX · statically generated · GitHub Pages. Why Astro rather than Next.js: [docs/adr/0001-astro-over-nextjs.md](docs/adr/0001-astro-over-nextjs.md).

## Quality bar

- **WCAG 2.2 AA.** Semantic landmarks, skip link, keyboard-operable everything, visible focus, reduced-motion support. Every colour pair is contrast-checked by `scripts/check-contrast.mjs`, and the build fails if one drops below its threshold.
- **Lighthouse** Performance ≥ 95 on mobile and 100 for Accessibility, Best Practices and SEO. Pages are static HTML with under 8 kB (about 3 kB gzipped) of progressive-enhancement JavaScript.
- **No placeholder ships.** `scripts/check-content.mjs` fails the build if published content still says `TODO`.

## Getting started

Requires Node 22.12+.

```bash
npm install
npm run dev               # http://localhost:4321/niraj-chavan/ — drafts visible, marked
npm run dev:published     # exactly what production shows
npm run build             # contrast audit → content guard → static build in dist/
npm run build:drafts      # build including drafts, into dist-drafts/
npm run check             # types, content schemas, contrast, content guard
npm run content:status    # every draft and TODO still to finish
npm run sync:medium       # refresh the Medium fallback snapshot
npm run og                # regenerate the social preview card
```

## How content works

Everything on the site is data in `src/content/`, validated by `src/content.config.ts`:

| Collection | Files | Route |
| --- | --- | --- |
| Case studies | `case-studies/*.mdx` | `/case-study/<id>/` |
| Projects | `projects/*.mdx` | `/projects/<id>/` |
| Enterprise problems | `problems/*.yaml` | `/problems/` |
| Playbooks (how I think) | `playbooks/*.mdx` | `/approach/` |
| Experience, education, skills | `*.yaml` | `/experience/`, `/skills/` |
| Now (changelog), radar | `now/*.md`, `radar.yaml` | `/now/` |
| Testimonials, community | `testimonials/*.yaml`, `community.yaml` | home, about |
| Articles | Medium RSS at build time | `/writing/` |

**Drafts.** `draft: true` on an entry, or `<Draft>…</Draft>` around part of an MDX body, shows in development with an amber marker and is left out of production. Sections, nav items and index pages appear on their own once a collection has a published entry.

Identity facts (role, employer, email, availability, scheduling link, contact-form endpoint) live in `src/data/profile.ts`. Years of experience are derived from one start date, so they never go stale.

## Interactive pieces

- **Architecture diagrams.** Built from case-study frontmatter. Select a component, or step through "Walk me through it". A text reference is included for screen readers and no-JS.
- **Problem explorer, project and article filters.** Toggle chips with a live result count, mirrored to the URL.
- **Search.** Press Ctrl/⌘ K or `/`. The index is built at build time and fetched on first open.
- **Career timeline.** Filter by technology; expand each role.
- **Tech radar and changelog** on `/now/`.

## Deploy

`.github/workflows/deploy.yml` runs `astro check` and `npm run build`, then publishes `dist/` to GitHub Pages. It triggers on every push to `master`, weekly (to pick up new Medium posts), and on demand.

`public/sw.js` retires the service worker that the previous version of the site installed. Without it, returning visitors would keep seeing the old cached site.

## Working on it with Claude Code

Two project skills in `.claude/skills/`:

- **portfolio-content** adds and publishes content. It interviews you to draft case studies, and it never invents facts.
- **portfolio-dev** covers architecture, conventions, Astro 7 gotchas and how to verify changes, with a bundled axe audit script.
