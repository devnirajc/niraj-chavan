# Content model reference

Source of truth: `src/content.config.ts`. This file mirrors it for quick lookup — if they disagree, the config wins (and update this file).

Every collection accepts `draft: true` unless noted. Entry ids come from file names (glob collections) or the `id` field (single-file YAML collections). Ids are what you put in references.

## Contents

- [caseStudies](#casestudies) — `src/content/case-studies/*.mdx` → `/case-study/<id>/`
- [projects](#projects) — `src/content/projects/*.mdx` → `/projects/<id>/`
- [problems](#problems) — `src/content/problems/*.yaml` → `/problems/#<id>`
- [playbooks](#playbooks) — `src/content/playbooks/*.mdx` → `/approach/#<id>`
- [experience, education](#experience) — single YAML files → `/experience/`
- [skills](#skills) — `src/content/skills.yaml` → `/skills/`
- [now, radar](#now-and-radar) — `/now/`
- [testimonials, community](#testimonials-and-community)
- [articles](#articles) — Medium, not hand-edited
- [Shared shapes: diagram, metric, decision](#shared-shapes)
- [MDX components](#mdx-components)

## caseStudies

```yaml
title: string                 # the page H1
summary: string               # ≤ 240 chars; cards, meta description, search
draft: boolean
featured: boolean             # shown on the home page
order: number                 # lower first
role: string
company: string               # optional
period: string                # "2017 – 2019"
domains: [auth-security | performance | accessibility | design-systems | api-integration
          | quality-cicd | cloud | legacy-modernisation | scalability | data-reporting]
industry: string
stack: [string]
cover: ../../assets/…         # optional image
coverAlt: string              # optional
problem: string               # the business problem
goals: [string]
constraints: [string]
metrics: [metric]             # see shared shapes
architecture: diagram         # optional; renders the interactive diagram
decisions: [decision]
lessons: [string]
relatedProjects: [project id]
```

The MDX body is the narrative (Context, How I approached it, Implementation, Challenges…). Its `##` headings join the page's "On this page" nav automatically.

## projects

```yaml
title: string
tagline: string               # one line under the title
summary: string               # ≤ 240 chars
draft, featured, order
kind: personal | client
category: string              # "Prescription builder"
industry: string
company: string               # client or employer, optional
status: live | archived | in-progress
cover: ../../assets/projects/<file>   # required
coverAlt: string                       # required — describe what the image shows
links: { live?: url, liveLabel?: string, repo?: url }
stack: [string]
features: [string]
metrics: [metric]
architecture: diagram         # optional
timeline: [{ date, title, note? }]   # "how it evolved"
caseStudy: case study id      # optional
```

Body: Overview prose first (rendered under an "Overview" heading), then optional sections. Unverified sections go in `<Draft>`.

## problems

```yaml
title: string
draft, order
domain: one of the domains above
context: string               # "Company · product area"
problem, challenge, analysis, solution: string
stack: [string]
results: [string]             # ≥ 1; the first is the headline result on the card
lessons: [string]
caseStudy: case study id      # optional
```

## playbooks

```yaml
title: string
summary: string
draft
order: number
steps: [{ title, detail }]
```

Body: a short intro paragraph.

## experience

`src/content/experience.yaml` — a list, newest first:

```yaml
- id: jpmc
  company, role, industry, summary: string
  start: YYYY-MM
  end: YYYY-MM | null        # null = present
  achievements: [string]
  stack: [string]            # also drives the technology filter chips
  projects: [project id]
  caseStudies: [case study id]
```

`education.yaml`: `id, qualification, institution, start, end`.

## skills

`src/content/skills.yaml` — one item per area:

```yaml
- id: frontend
  area: string
  summary: string
  order: number
  skills:
    - name: string
      level: Expert | Advanced | Intermediate   # optional — omit if Niraj hasn't rated it
      context: string                            # where/how he used it; restate known facts only
      roles: [experience id]
      projects: [project id]
      caseStudies: [case study id]
```

## now and radar

`src/content/now/*.md`: `date` (YYYY-MM-DD), `title`, `kind` (shipped | building | learning | writing | milestone), `link` (site path or URL, optional), body = 1–2 sentences.

`src/content/radar.yaml`: `id, name, ring (adopt | trial | assess | hold), quadrant (languages-frameworks | tools | platforms | techniques), note`. Adopt/Trial notes should say where he uses it.

## testimonials and community

`src/content/testimonials/<name>.yaml`: `quote, name, title, company, relationship (manager | client | peer | report), source (linkedin | direct), url?`. Real quotes only, with permission.

`src/content/community.yaml`: `id, kind (talk | certification | open-source | hackathon | workshop | writing | community), title, org, date, url?, note?`.

## articles

Loaded from Medium by `src/lib/medium-loader.ts`; not edited by hand. Control featuring, categories (`Angular, JavaScript, Architecture, Performance, Accessibility, Cloud, DevOps, Career Growth`) and display titles in `src/data/writing.ts`.

## Shared shapes

```yaml
metric:   { label, before?, after, note? }        # strings, keep units: "4.8 s"

decision:
  title: string
  context: string
  options:                                        # ≥ 2
    - name: string
      chosen: boolean
      reason: string
  tradeoff: string

diagram:
  title: string
  caption: string               # optional; shown as the overview text
  layers: [{ id, label }]       # columns, left → right
  nodes:
    - id: string
      label: string             # ≤ 24 chars (fixed box)
      sublabel: string          # ≤ 30 chars, optional
      layer: layer id
      detail: string            # shown when the node is selected
  edges: [{ from, to, label? }] # label ≤ ~12 chars renders on the line
  steps: [{ title, nodes: [node id], detail }]   # "Walk me through it"
```

Diagram, metric and decision objects are strict: an unknown key fails the build.

## MDX components

Available in every `.mdx` entry without importing:

- `<Draft note="…">…</Draft>` — hidden in production; exempt from the TODO check.
- `<Callout kind="note | tradeoff | lesson" title?>…</Callout>`
- `<Steps label="…" steps={[{ title, detail }]} />`
- `<Figure src={img} alt="…" caption="…" />` — import the image at the top of the MDX file: `import shot from '../../assets/case-studies/x.png';`
