/**
 * Site navigation. An item with `requires` is shown only while that
 * collection has at least one visible entry, so the nav never leads to an
 * empty page while case studies or playbooks are still drafts.
 */

import type { CollectionKey } from 'astro:content';

export interface NavItem {
  label: string;
  href: string;
  requires?: CollectionKey;
  description?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'About', href: '/about/' },
  { label: 'Approach', href: '/approach/', requires: 'playbooks' },
  { label: 'Problems', href: '/problems/', requires: 'problems' },
  { label: 'Case studies', href: '/case-study/', requires: 'caseStudies' },
  { label: 'Projects', href: '/projects/', requires: 'projects' },
  { label: 'Writing', href: '/writing/', requires: 'articles' },
  { label: 'Now', href: '/now/' },
];

/** Secondary navigation inside the About section. */
export const ABOUT_NAV: NavItem[] = [
  { label: 'Story', href: '/about/' },
  { label: 'Experience', href: '/experience/' },
  { label: 'Expertise', href: '/skills/' },
  { label: 'Approach', href: '/approach/', requires: 'playbooks' },
];

export const FOOTER_NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Work',
    items: [
      { label: 'Case studies', href: '/case-study/', requires: 'caseStudies' },
      { label: 'Problems solved', href: '/problems/', requires: 'problems' },
      { label: 'Projects', href: '/projects/', requires: 'projects' },
    ],
  },
  {
    heading: 'About',
    items: [
      { label: 'Story', href: '/about/' },
      { label: 'Experience', href: '/experience/' },
      { label: 'Expertise', href: '/skills/' },
      { label: 'Approach', href: '/approach/', requires: 'playbooks' },
    ],
  },
  {
    heading: 'Elsewhere',
    items: [
      { label: 'Writing', href: '/writing/', requires: 'articles' },
      { label: 'Now', href: '/now/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];
