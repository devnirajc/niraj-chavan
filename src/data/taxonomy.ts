/**
 * Shared vocabularies. Collections validate against these lists, so a
 * misspelt domain fails the build rather than creating a stray filter chip.
 */

export const PROBLEM_DOMAINS = [
  'auth-security',
  'performance',
  'accessibility',
  'design-systems',
  'api-integration',
  'quality-cicd',
  'cloud',
  'legacy-modernisation',
  'scalability',
  'data-reporting',
] as const;

export type ProblemDomain = (typeof PROBLEM_DOMAINS)[number];

export const DOMAIN_LABELS: Record<ProblemDomain, string> = {
  'auth-security': 'Authentication & security',
  performance: 'Performance',
  accessibility: 'Accessibility',
  'design-systems': 'Design systems',
  'api-integration': 'API integration',
  'quality-cicd': 'Quality & CI/CD',
  cloud: 'Cloud & deployment',
  'legacy-modernisation': 'Legacy modernisation',
  scalability: 'Scalability',
  'data-reporting': 'Data & reporting',
};

export const WRITING_CATEGORIES = [
  'Angular',
  'JavaScript',
  'Architecture',
  'Performance',
  'Accessibility',
  'Cloud',
  'DevOps',
  'Career Growth',
] as const;

export type WritingCategory = (typeof WRITING_CATEGORIES)[number];

export const RADAR_RINGS = {
  adopt: { label: 'Adopt', blurb: 'What I reach for by default.' },
  trial: { label: 'Trial', blurb: 'Using on real work and forming an opinion.' },
  assess: { label: 'Assess', blurb: 'Reading about and prototyping.' },
  hold: { label: 'Hold', blurb: 'Deliberately not starting new work with.' },
} as const;

export const RADAR_QUADRANTS = {
  'languages-frameworks': 'Languages & frameworks',
  tools: 'Tools',
  platforms: 'Platforms',
  techniques: 'Techniques',
} as const;
