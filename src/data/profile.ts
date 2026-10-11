/**
 * Who I am, in one place. Hero, about, contact, footer, JSON-LD and the
 * social card all read from here, so they can never disagree.
 *
 * Long-form content (case studies, projects, problems, experience) lives in
 * src/content/ instead — see src/content.config.ts.
 */

import { yearsSince } from '@/lib/dates';

const CAREER_START = '2014-07-01';

export const profile = {
  name: 'Niraj Chavan',
  firstName: 'Niraj',
  initials: 'NC',
  /** How I describe my discipline. */
  role: 'Senior Software Engineer',
  /** My current title and employer, as on the payroll. */
  current: { title: 'Software Development Engineer III', company: 'JP Morgan Chase & Co.', since: '2021-12' },
  location: 'Pune, India',
  timezone: 'IST · UTC+5:30',
  careerStart: CAREER_START,
  get years() {
    return yearsSince(CAREER_START);
  },

  email: 'nirajd327@gmail.com',
  phone: { display: '+91 96071 95436', href: 'tel:+919607195436' },
  resume: '/assets/documents/Niraj-Chavan.pdf',

  socials: [
    { id: 'linkedin', label: 'LinkedIn', handle: 'in/niraj-chavan', url: 'https://www.linkedin.com/in/niraj-chavan-8267bb98/' },
    { id: 'github', label: 'GitHub', handle: '@devnirajc', url: 'https://github.com/devnirajc' },
    { id: 'medium', label: 'Medium', handle: '@nirajd327', url: 'https://medium.com/@nirajd327' },
  ],

  /**
   * Shown on the contact page and in the closing call to action.
   * status: 'open' (actively looking), 'selective' (happy to talk),
   * 'unavailable'. `detail` is the wording from the previous site's contact
   * section. `showInHero` mirrors the old openToOpportunities flag, which kept
   * the hero badge off — the hero states where I work instead.
   */
  availability: {
    status: 'selective' as 'open' | 'selective' | 'unavailable',
    label: 'Open to interesting roles and collaborations',
    detail: "I'm open to interesting engineering roles and collaborations. The quickest way to reach me is email.",
    showInHero: false,
  },

  /**
   * Scheduling link, e.g. 'https://calendly.com/<handle>/30min'.
   * Empty hides the scheduling card entirely.
   */
  calendlyUrl: '',

  /**
   * A Formspree-compatible endpoint (POST, JSON response). Empty hides the
   * contact form in production; email and LinkedIn remain.
   */
  contactFormEndpoint: '',

  /**
   * DRAFT — these are a starting point, not something I have confirmed.
   * Rendered only while drafts are visible until `draft` is set to false.
   */
  workTypes: {
    draft: true,
    items: [
      { title: 'Senior or lead front-end roles', detail: 'Owning UI architecture, standards and mentoring on a product team.' },
      { title: 'Front-end architecture reviews', detail: 'A second opinion on structure, performance and scalability.' },
      { title: 'Accessibility audits', detail: 'WCAG 2.2 AA reviews with fixes prioritised by user impact.' },
      { title: 'Design system work', detail: 'Component libraries and tokens that several teams build on.' },
    ],
  },
} as const;

/** What I specialise in — the hero and about page lead with these. */
export const specialties = [
  {
    title: 'Front-end architecture',
    body: 'Angular, React and TypeScript applications structured to stay maintainable as teams and features grow.',
    icon: 'layers',
  },
  {
    title: 'Shared component libraries',
    body: 'Angular component libraries that other squads build on. The promotion library I architected on Chase Travel is used by three of them.',
    icon: 'grid',
  },
  {
    title: 'Accessibility',
    body: 'I led the WCAG 2.1 AA audit and remediation across Chase Travel, covering keyboard navigation, ARIA landmarks and screen-reader support.',
    icon: 'accessibility',
  },
  {
    title: 'Performance',
    body: 'Lazy loading, code splitting and change-detection tuning for interfaces that stay fast on any device.',
    icon: 'gauge',
  },
  {
    title: 'Technical leadership',
    body: 'Weekly design and code reviews for a team of six on Chase Travel, and mentoring junior engineers on TypeScript and Angular component architecture.',
    icon: 'compass',
  },
] as const;

/** Industries I have shipped software for, with where. */
export const domains = [
  { name: 'Banking & travel', where: 'Chase Travel, JP Morgan Chase & Co.' },
  { name: 'Energy & oilfield logistics', where: 'Schlumberger' },
  { name: 'Cybersecurity', where: 'K7 Security' },
  { name: 'Cruise & travel e-commerce', where: 'Holland America Line' },
  { name: 'Retail', where: 'Scope Retail' },
  { name: 'E-commerce', where: 'Connect 91, Whitecode' },
  { name: 'Accounting & professional services', where: 'Deshmukh & Deshpande Associates' },
] as const;

/**
 * Headline achievements for the hero. Each is a claim made elsewhere on the
 * site (about copy, experience entries) — keep them in step.
 */
export const highlights = [
  { value: '10+', label: 'enterprise applications shipped' },
  { value: `${yearsSince(CAREER_START)} yrs`, label: 'building for the web' },
  { value: '5', label: 'companies, from agency to bank' },
  { value: 'WCAG', label: '2.1 AA audit and remediation led on Chase Travel' },
] as const;
