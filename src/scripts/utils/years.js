/**
 * Elapsed-years arithmetic, deliberately kept free of imports so it can run
 * both in the browser bundle and inside vite.config.js, which pre-renders the
 * SEO meta tags at build time. Anything that needs about.json belongs in
 * experience.js instead.
 */

// 365.25 rather than 365, so leap days don't accumulate into an early rollover.
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

/**
 * @param {string} startDate ISO date the career began.
 * @param {number} [now] Epoch milliseconds; injectable for tests.
 * @returns {number} Whole years elapsed, never negative.
 */
export function yearsSince(startDate, now = Date.now()) {
  const elapsed = (now - new Date(startDate).getTime()) / MS_PER_YEAR;
  return Math.max(0, Math.floor(elapsed));
}
