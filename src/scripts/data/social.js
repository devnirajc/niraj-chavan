/**
 * Social profiles — one definition, used by the hero, the sidebar and the
 * contact section so the three can never drift apart.
 */

export const SOCIAL_LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'in/niraj-chavan',
    url: 'https://www.linkedin.com/in/niraj-chavan-8267bb98/',
  },
  {
    id: 'github',
    label: 'GitHub',
    handle: '@devnirajc',
    url: 'https://github.com/devnirajc',
  },
  {
    id: 'medium',
    label: 'Medium',
    handle: '@nirajd327',
    url: 'https://medium.com/@nirajd327',
  },
];

/**
 * Appended to the accessible name of every link that opens a new tab, so the
 * context change is announced before activation (WCAG 3.2.5).
 */
export const NEW_TAB_HINT = ' (opens in a new tab)';
