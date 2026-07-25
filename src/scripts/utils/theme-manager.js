/**
 * Theme Manager
 *
 * `data-theme` is set on <html> by the inline bootstrap in index.html before
 * first paint; this module only handles changes afterwards.
 *
 * Note the `persist` flag: the previous version wrote to localStorage on every
 * apply, including the initial one. That silently pinned a first-time visitor
 * to whatever their OS preference happened to be at that moment, so the site
 * stopped following later system changes. Only an explicit user choice is
 * stored now.
 */

const STORAGE_KEY = 'theme';

export function initThemeManager() {
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  media.addEventListener('change', (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? 'dark' : 'light', { persist: false });
    }
  });
}

export function applyTheme(theme, { persist = true } = {}) {
  document.documentElement.setAttribute('data-theme', theme);

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* Private mode or blocked storage — the theme still applies for this visit. */
    }
  }
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function getStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}
