/**
 * Career length, derived from the start date in about.json rather than being
 * hard-coded, so the page never goes stale.
 */

import aboutData from '../data/about.json';
import { yearsSince } from './years.js';

const START_DATE = aboutData.experienceStartDate || '2014-07-01';

/** @returns {number} Whole years since the career start date. */
export function yearsOfExperience() {
  return yearsSince(START_DATE);
}

/**
 * Fills the `{years}` placeholder used by the copy in about.json and
 * skills.json, so the prose stays in the data files while the number stays
 * derived. Every piece of copy that quotes a career length should go through
 * here rather than spelling the number out.
 *
 * @param {string} text Copy containing a `{years}` placeholder.
 * @returns {string}
 */
export function withYears(text) {
  return text.replace('{years}', `${yearsOfExperience()} years`);
}
