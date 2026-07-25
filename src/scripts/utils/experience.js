/**
 * Career length, derived from the start date in about.json rather than being
 * hard-coded, so the page never goes stale.
 */

import aboutData from '../data/about.json';

const START_DATE = aboutData.experienceStartDate || '2014-07-01';
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

/** @returns {number} Whole years since the career start date. */
export function yearsOfExperience() {
  const elapsed = (Date.now() - new Date(START_DATE).getTime()) / MS_PER_YEAR;
  return Math.max(0, Math.floor(elapsed));
}
