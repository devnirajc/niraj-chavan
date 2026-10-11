/**
 * Responsive sizing for project covers. An above-the-fold cover is requested
 * twice — the <img> (ThemeImage) and its head preload (ThemeImagePreload) —
 * and the browser reuses the preload only if both ask for the same widths
 * and sizes, so both read them from here.
 */
export const coverSizes = {
  /** Project page hero, full container width. */
  hero: { widths: [640, 960, 1280, 1600, 2200], sizes: '(min-width: 72rem) 69rem, 100vw' },
  /** ProjectCard thumbnail in a one-, two- or three-column grid. */
  card: { widths: [400, 640, 960], sizes: '(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 100vw' },
};
