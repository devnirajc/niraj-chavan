/**
 * Theme Manager
 * Handles dark/light mode switching and persistence
 */

export function initThemeManager() {
  // Get saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const initialTheme = savedTheme || systemPreference;

  // Apply initial theme
  applyTheme(initialTheme);

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Listen for theme toggle events from theme-toggle component
  document.addEventListener('theme-changed', (e) => {
    applyTheme(e.detail.theme);
  });
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  return newTheme;
}

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}
