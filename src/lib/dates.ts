/**
 * Date and career-length helpers. Career length is derived from a single
 * start date in src/data/profile.ts, so no copy on the site ever goes stale.
 */

// 365.25 rather than 365, so leap days don't accumulate into an early rollover.
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

export function yearsSince(isoDate: string, now = Date.now()): number {
  return Math.max(0, Math.floor((now - new Date(isoDate).getTime()) / MS_PER_YEAR));
}

const MONTH_YEAR = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2021-12" → "Dec 2021" */
export function formatMonth(yyyyMm: string): string {
  return MONTH_YEAR.format(new Date(`${yyyyMm}-01T00:00:00Z`));
}

/** "Dec 2021 – Present" */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}

/** Whole months between two YYYY-MM values (end exclusive of nothing: Jan–Dec = 12). */
export function monthsBetween(start: string, end: string | null): number {
  const [sy, sm] = start.split('-').map(Number);
  const endDate = end ? end.split('-').map(Number) : [new Date().getUTCFullYear(), new Date().getUTCMonth() + 1];
  return (endDate[0] - sy) * 12 + (endDate[1] - sm) + 1;
}

/** 41 → "3 yrs 5 mos" */
export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return DAY_MONTH_YEAR.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
