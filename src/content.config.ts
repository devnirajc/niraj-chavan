/**
 * Content model.
 *
 * Every piece of copy on the site lives in src/content/ and is validated here
 * at build time, so a typo in a reference or a missing field fails the build
 * instead of shipping an empty card.
 *
 * Two rules hold across every collection:
 *
 *  1. `draft: true` entries render in `npm run dev` (with a visible Draft
 *     marker) and in `npm run build:drafts`, and are excluded from the
 *     production build. See src/lib/drafts.ts.
 *  2. Published entries may not contain the string TODO — enforced by
 *     scripts/check-content.mjs before every production build — so a
 *     placeholder can never reach the live site by accident.
 */

import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { mediumLoader } from './lib/medium-loader';
import { PROBLEM_DOMAINS, WRITING_CATEGORIES } from './data/taxonomy';

const draft = z.boolean().default(false);

/* ------------------------------------------------------------------ */
/* Shared shapes                                                       */
/* ------------------------------------------------------------------ */

/**
 * Interactive architecture diagram. Nodes sit in columns (layers) left to
 * right; edges are drawn between them; `steps` drives the "walk me through
 * it" mode. Rendered by components/diagram/ArchitectureDiagram.astro.
 */
// strictObject throughout: an unknown key is almost always a YAML slip — a
// comma inside a one-line { … } mapping silently splits the value into a
// second key — so fail loudly instead of rendering half a sentence.
const diagram = z.strictObject({
  title: z.string(),
  caption: z.string().optional(),
  layers: z.array(z.strictObject({ id: z.string(), label: z.string() })).min(1),
  nodes: z
    .array(
      z.strictObject({
        id: z.string(),
        label: z.string().max(24, 'Keep node labels short — they render inside a fixed box'),
        sublabel: z.string().max(30).optional(),
        layer: z.string(),
        detail: z.string(),
      })
    )
    .min(1),
  edges: z
    .array(z.strictObject({ from: z.string(), to: z.string(), label: z.string().optional() }))
    .default([]),
  steps: z
    .array(z.strictObject({ title: z.string(), nodes: z.array(z.string()), detail: z.string() }))
    .default([]),
});

/** A before → after outcome. Values are strings so units stay with them. */
const metric = z.strictObject({
  label: z.string(),
  before: z.string().optional(),
  after: z.string(),
  note: z.string().optional(),
});

/** An architecture decision, written ADR-style. */
const decision = z.strictObject({
  title: z.string(),
  context: z.string(),
  options: z
    .array(z.strictObject({ name: z.string(), chosen: z.boolean().default(false), reason: z.string() }))
    .min(2),
  tradeoff: z.string(),
});

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

/** Long-form engineering stories: /case-study/<id>/ */
const caseStudies = defineCollection({
  loader: glob({ base: './src/content/case-studies', pattern: '*.mdx' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(240),
      draft,
      featured: z.boolean().default(false),
      order: z.number().default(100),
      role: z.string(),
      company: z.string().optional(),
      period: z.string(),
      domains: z.array(z.enum(PROBLEM_DOMAINS)).min(1),
      industry: z.string(),
      stack: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      problem: z.string(),
      goals: z.array(z.string()).default([]),
      constraints: z.array(z.string()).default([]),
      metrics: z.array(metric).default([]),
      architecture: diagram.optional(),
      decisions: z.array(decision).default([]),
      lessons: z.array(z.string()).default([]),
      relatedProjects: z.array(reference('projects')).default([]),
    }),
});

/** Products and client work: /projects/<id>/ */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.mdx' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      summary: z.string().max(240),
      draft,
      featured: z.boolean().default(false),
      order: z.number().default(100),
      kind: z.enum(['personal', 'client']),
      category: z.string(),
      industry: z.string(),
      company: z.string().optional(),
      status: z.enum(['live', 'archived', 'in-progress']).default('live'),
      cover: image(),
      coverAlt: z.string(),
      links: z
        .object({
          live: z.url().optional(),
          liveLabel: z.string().optional(),
          repo: z.url().optional(),
        })
        .default({}),
      stack: z.array(z.string()).default([]),
      features: z.array(z.string()).default([]),
      metrics: z.array(metric).default([]),
      architecture: diagram.optional(),
      timeline: z
        .array(z.object({ date: z.string(), title: z.string(), note: z.string().optional() }))
        .default([]),
      caseStudy: reference('caseStudies').optional(),
    }),
});

/** Enterprise problems, structured Problem → Lessons: /problems/ */
const problems = defineCollection({
  loader: glob({ base: './src/content/problems', pattern: '*.yaml' }),
  schema: z.object({
    title: z.string(),
    draft,
    order: z.number().default(100),
    domain: z.enum(PROBLEM_DOMAINS),
    context: z.string(),
    problem: z.string(),
    challenge: z.string(),
    analysis: z.string(),
    solution: z.string(),
    stack: z.array(z.string()).default([]),
    results: z.array(z.string()).min(1),
    lessons: z.array(z.string()).default([]),
    caseStudy: reference('caseStudies').optional(),
  }),
});

/** How I work — methodology pages: /approach/ */
const playbooks = defineCollection({
  loader: glob({ base: './src/content/playbooks', pattern: '*.mdx' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    draft,
    order: z.number(),
    steps: z.array(z.object({ title: z.string(), detail: z.string() })).default([]),
  }),
});

/** Career history: /experience/ */
const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM'),
    end: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .nullable(),
    industry: z.string(),
    summary: z.string(),
    achievements: z.array(z.string()).min(1),
    stack: z.array(z.string()).default([]),
    projects: z.array(reference('projects')).default([]),
    caseStudies: z.array(reference('caseStudies')).default([]),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.yaml'),
  schema: z.object({
    qualification: z.string(),
    institution: z.string(),
    start: z.string(),
    end: z.string(),
  }),
});

/** Expertise areas with context and evidence: /skills/ */
const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    area: z.string(),
    summary: z.string(),
    order: z.number(),
    skills: z.array(
      z.object({
        name: z.string(),
        // Optional: only skills I have actually rated carry a level.
        level: z.enum(['Expert', 'Advanced', 'Intermediate']).optional(),
        context: z.string().optional(),
        roles: z.array(reference('experience')).default([]),
        projects: z.array(reference('projects')).default([]),
        caseStudies: z.array(reference('caseStudies')).default([]),
      })
    ),
  }),
});

/** "What I'm building now" changelog: /now/ */
const now = defineCollection({
  loader: glob({ base: './src/content/now', pattern: '*.md' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    kind: z.enum(['shipped', 'building', 'learning', 'writing', 'milestone']),
    link: z.string().optional(),
    draft,
  }),
});

/** Tech radar: /now/ */
const radar = defineCollection({
  loader: file('src/content/radar.yaml'),
  schema: z.object({
    name: z.string(),
    ring: z.enum(['adopt', 'trial', 'assess', 'hold']),
    quadrant: z.enum(['languages-frameworks', 'tools', 'platforms', 'techniques']),
    note: z.string(),
    draft,
  }),
});

const testimonials = defineCollection({
  loader: glob({ base: './src/content/testimonials', pattern: '*.yaml' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    title: z.string(),
    company: z.string(),
    relationship: z.enum(['manager', 'client', 'peer', 'report']),
    source: z.enum(['linkedin', 'direct']).default('linkedin'),
    url: z.url().optional(),
    draft,
  }),
});

/** Talks, certifications, open source, hackathons, workshops. */
const community = defineCollection({
  loader: file('src/content/community.yaml'),
  schema: z.object({
    kind: z.enum(['talk', 'certification', 'open-source', 'hackathon', 'workshop', 'writing', 'community']),
    title: z.string(),
    org: z.string(),
    date: z.string(),
    url: z.url().optional(),
    note: z.string().optional(),
    draft,
  }),
});

/** Medium articles, fetched at build time with a committed snapshot fallback. */
const articles = defineCollection({
  loader: mediumLoader({ username: 'nirajd327' }),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    published: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    categories: z.array(z.enum(WRITING_CATEGORIES)),
    readingMinutes: z.number(),
    featured: z.boolean(),
  }),
});

export const collections = {
  caseStudies,
  projects,
  problems,
  playbooks,
  experience,
  education,
  skills,
  now,
  radar,
  testimonials,
  community,
  articles,
};
