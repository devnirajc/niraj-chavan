/**
 * Feature flags — small on/off switches for content that comes and goes, kept
 * in one file so toggling one is a single obvious edit rather than a hunt
 * through markup.
 */

export const FEATURES = {
  /**
   * Shows the "Open to new opportunities" badge in the hero.
   * Flip to `false` once the job search is closed; the surrounding layout
   * collapses cleanly because the badge carries its own spacing.
   */
  openToOpportunities: false,
};
