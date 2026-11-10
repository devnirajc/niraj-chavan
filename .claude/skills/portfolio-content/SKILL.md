---
name: portfolio-content
description: Add, update or publish content on Niraj Chavan's Astro portfolio — case studies, projects, enterprise problem write-ups, approach playbooks, "now" changelog entries, testimonials, talks/certifications, tech radar, skills, experience, and the Medium writing feed. Use this whenever the user wants to add or edit anything that appears on the site, write up a project or case study (including interviewing them to draft one), turn a draft into a published entry, add a LinkedIn recommendation, log what they shipped, feature a Medium article, or asks "what's still unfinished on the site" — even if they don't mention files, frontmatter or collections.
---

# Portfolio content

All copy on the site lives in `src/content/` (plus identity facts in `src/data/profile.ts`) and is validated by the schemas in `src/content.config.ts`. Pages never hard-code content; adding an entry is enough to make it appear everywhere it belongs (home chapters, index pages, search, nav, sitemap).

For the exact fields of every collection, read `references/content-model.md` before writing an entry.

## The one rule: never invent facts

This is a professional portfolio read by recruiters and hiring managers. A made-up metric, an inflated title, a fabricated testimonial or a confidently-described architecture that never existed is worse than an empty section — it can cost Niraj a job if questioned. So:

- **Only publish what Niraj has told you or what is verifiable** (his own files, his live sites, git history, public profiles).
- **Anything else goes in as a draft**: `draft: true` on the entry, or wrapped in `<Draft>…</Draft>` inside an MDX body, with `TODO` where a fact is missing. Drafts render in `npm run dev` with an amber Draft marker and are excluded from production.
- **Never replace a `TODO` with a plausible guess.** Ask, or leave it.
- Metrics need a source in Niraj's own words ("roughly 40% faster" is fine if he said it). Don't round, extrapolate or "improve" numbers.
- Testimonials must be real quotes with permission. Never write one.
- Client and employer work (JP Morgan Chase, Schlumberger…): describe patterns and outcomes, not internal system names, hosts or confidential numbers. Flag anything that might breach an employer's disclosure policy and ask. JP Morgan Chase has stricter rules of its own; see the next section.

The build enforces part of this: `npm run check:content` fails if a **published** entry contains `TODO` (text inside `<Draft>` blocks is exempt). Don't work around it — finish the content or keep it a draft.

## JP Morgan Chase: publish only what needs no approval

Niraj still works at JP Morgan Chase (JPMC) and has **not** asked for or received the firm's approval for anything in this portfolio. So everything about JPMC must be something an employee could publish without approval. The firm's Code of Conduct asks employees to protect confidential information and to use good judgment online (section 3.5.1). It also says not to speak for the firm without authorisation (section 3.5.2). Its internal social media policy isn't public. Where a rule below is unclear, take the cautious reading and ask Niraj. This is a cautious reading, not legal advice, and the final call is his.

**It applies everywhere, not only to live pages.** The repository is public on GitHub, so it covers published pages, `<Draft>` blocks, TODO questions, frontmatter, Now entries, the AI page, the résumé (`resume/resume.html` and its PDF) and commit messages. Never park a confidential detail in a draft "for later".

**Fine to publish:**

- His title, dates, the teams he was on and when, and the public product. Frame his JPMC work around Chase Travel.
- His own role and responsibilities in general terms: what he led, designed or built.
- Technologies and engineering patterns he used, described generically (Angular, micro-frontends, role-based access, WCAG 2.1 AA). Listing a commercial tool as one of his skills is fine (Dynatrace, Kibana).
- Qualitative outcomes ("settings changes take effect immediately", "three squads render promotions with one shared library").
- Anything JPMC has itself announced publicly. Note the public source.

**Never publish, not even in a draft:**

- Business figures: bookings, revenue, conversion or uplift, customer, user or traffic numbers, incident counts.
- Where a figure came from inside the firm, such as an internal dashboard, log query or ticket.
- Team headcount, org structure, and the names of colleagues or internal teams beyond the product.
- Internal system, service, repository, host or tool names. Internal architecture detail, such as registries, loaders or configuration. Security controls in detail. Screenshots of internal tools or code.
- Which vendors, AI tools or models the firm uses, how they are set up there, or what they're used for. Niraj's own AI tool use is written employer-neutral ("GitHub Copilot with Claude Opus and GPT"), never "at JP Morgan Chase" or "at work".
- Anything that reads as the firm's view, an endorsement, or a statement made for the firm. Unreleased products, roadmaps, customers and partners.

**Engineering figures from his JPMC work** (load times, before-and-after timings, error rates) are kept off too. Describe the improvement in words, such as "the dashboard loads and responds noticeably faster". Niraj removed the Site Manager load-time figures and the access-control incident claim everywhere on 2026-11-11. Don't re-add them. Counting his own engineering work ("fixed three rendering bottlenecks") is fine.

**How to apply:**

- Check content against these lists before writing or publishing anything that mentions JPMC, Chase, Chase Travel, Site Manager or his work there. When unsure, leave it out and ask.
- Every JPMC project page ends with the own-views note: *This page describes my own work in general terms. The views are my own and are not endorsed by JP Morgan Chase & Co.*
- If Niraj offers a detail from the "never" list, say why it's risky and offer a general version instead of publishing it.

## Every content update also updates the Now page

Niraj's standing instruction: whenever any content on the site changes — a project, case study, problem, skill, experience entry, profile fact, page copy — update `/now/` in the same piece of work. Its header ("What I'm building now … Last updated <date>") shows the date of the newest changelog entry, so a content change without an entry leaves the page saying the site is older than it is.

1. **Changelog entry, dated today.** If `src/content/now/` already has an entry for today, extend its title and body to cover the new change; otherwise create one (see *Log something on the "Now" page* below). One entry per day keeps the changelog readable. Describe what a visitor can now see, in Niraj's voice, and set `link` to the main page it concerns. Small corrections (a typo, a broken link) get a clause in the day's entry, not an entry of their own.
2. **"Currently" card.** If the change touches his job, title, focus or availability, check the card: company, role and availability come from `src/data/profile.ts`; the *Focus* line is hard-coded in `src/pages/now.astro`.
3. **Tech radar.** If a technology was added to or dropped from skills or projects, check `src/content/radar.yaml` still agrees (Adopt/Trial notes name real work).

The same never-invent rule applies: only log what was actually published. Drafts and `<Draft>` sections aren't visible to visitors, so don't announce them — log them when they go live. The dashboard counts (projects, case studies, problems, articles) are computed and need no edit.

## Workflows

### Write up a case study by interviewing Niraj

Case studies are the core of the site and only Niraj knows the facts, so interview rather than draft from imagination. Ask a few questions at a time, conversationally, and build `src/content/case-studies/<slug>.mdx` as answers come in. Cover, roughly in order:

1. **Context** — company, team, users, his role, dates. What was the product?
2. **Problem** — the business issue in one or two sentences. Who was hurting and what did it cost?
3. **Goals & constraints** — what "fixed" meant; what couldn't change (legacy APIs, deadlines, compliance).
4. **Analysis** — how he found the root cause: tools, data, what surprised him.
5. **Architecture** — the moving parts and how they talk. Sketch the diagram data (layers → nodes → edges) and play it back to him for correction. Then 2–5 walkthrough `steps`.
6. **Decisions** — 2–3 real choices with the options he rejected and why, and what each cost (ADR style).
7. **Outcome** — numbers he can stand behind, before → after. If none, qualitative outcomes are fine; don't invent metrics.
8. **Lessons** — what he'd do differently.
9. **Visuals** — screenshots or diagrams he can share (put images in `src/assets/case-studies/` and use `<Figure>`).

Keep `draft: true` until he has read the full page in `npm run dev` and said it's accurate. `src/content/case-studies/authentication-platform.mdx` is the reference for structure.

### Add a project

1. Covers are abstract UI illustrations, not screenshots: one 1600×900 board per project, in light and dark, in the Claude Design project *Project Covers v2*. Export both at 2× into `src/assets/projects/<name>-cover-light.png` / `-dark.png` and set `cover` and `coverDark` (Astro generates responsive WebP).
2. **Look at the cover** and write `coverAlt` describing what it actually shows, ending with "It is not a screenshot of <product>."
3. Create `src/content/projects/<slug>.mdx`. Verified facts go in frontmatter (`features`, `stack`, `links`); anything inferred or still unknown goes in a `<Draft>` block in the body under headings like *Architecture*, *Challenges solved*, *Performance*, *Accessibility*, *What's next*.
4. For his own live apps you can verify the stack by fetching the deployed bundle and looking for library fingerprints — state only what you found.

### Add an enterprise problem

One YAML file per problem in `src/content/problems/`, told in seven beats (problem, challenge, analysis, solution, stack, results, lessons). Link `caseStudy:` if a long version exists. Use block-style YAML (see the YAML trap below).

### Log something on the "Now" page

Create `src/content/now/YYYY-MM-<slug>.md` with `date`, `title`, `kind` (shipped / building / learning / writing / milestone) and a one-or-two sentence body. Medium articles appear in the changelog automatically — don't duplicate them.

Put site links in `link` (a path like `/projects/rxbit/` gets the `/niraj-chavan/` base added), not in the body: Markdown links in the body are printed as written, so a root-relative path there breaks on GitHub Pages.

### Publish a draft

1. Run `npm run content:status` to see what is blocking it.
2. Resolve every `TODO` with Niraj; remove or finish `<Draft>` blocks he wants live.
3. Set `draft: false` (or delete the line).
4. Run `npm run dev:published` and look at the page as production will show it, then `npm run build`.

Sections and nav items appear on their own once a collection has a published entry (e.g. the first published case study adds "Case studies" to the nav, a home chapter and `/case-study/`).

### Writing (Medium)

The writing page reads Medium's RSS at build time (`@nirajd327`) and falls back to `src/data/medium-snapshot.json`. To feature a post, recategorise it or fix its display title, edit the `OVERRIDES` map in `src/data/writing.ts` (keyed by Medium post id — `npm run sync:medium` prints them). Run `npm run sync:medium` after he publishes, and commit the snapshot. The deploy workflow also rebuilds weekly.

### Identity, availability and contact

`src/data/profile.ts` holds name, role, current job, career start date (years of experience are derived from it — never hard-code a number), email, socials, availability wording, `calendlyUrl`, `contactFormEndpoint` and preferred `workTypes` (currently a draft). Update the social card afterwards with `npm run og` if the role or headline changes.

## YAML trap

In a one-line mapping, a comma inside a value silently ends it:

```yaml
- { id: x, note: Builds, audits and deploys this site. }   # note becomes "Builds"
```

Use block style for anything with prose:

```yaml
- id: x
  note: Builds, audits and deploys this site.
```

Diagram, metric and decision objects are strict, so this mistake fails the build there; elsewhere it fails silently — so prefer block style everywhere. Also, `- TODO: something` parses as a mapping — write `- TODO — something`.

## Before you finish

Check that `src/content/now/` has an entry dated today covering this change (see *Every content update also updates the Now page*). Then run these and fix anything they report:

```bash
npm run check:content      # published content has no TODO
npm run build              # schemas, references, contrast audit, full build
npm run content:status     # tell Niraj what is still draft
```

Then tell Niraj exactly which entries are still drafts and what each needs from him.
