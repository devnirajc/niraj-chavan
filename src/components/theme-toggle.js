/**
 * Theme Toggle
 *
 * A single button whose accessible name describes what activating it will do
 * ("Switch to dark theme"), and whose `aria-pressed` reports the current
 * state. The change is also announced through a polite live region, because
 * repainting the page is otherwise silent for a screen-reader user.
 */

import { toggleTheme, getTheme } from '../scripts/utils/theme-manager.js';
import { icon } from '../scripts/utils/icons.js';

class ThemeToggle extends HTMLElement {
  connectedCallback() {
    this.render();
    this.button = this.querySelector('button');
    this.status = this.querySelector('[data-theme-status]');
    this.button.addEventListener('click', () => this.onToggle());
  }

  render() {
    const theme = getTheme();

    this.innerHTML = `
      <button
        class="theme-toggle"
        type="button"
        aria-pressed="${theme === 'dark'}"
        aria-label="${labelFor(theme)}"
      >
        ${icon('sun', { size: 20, className: 'icon-sun' })}
        ${icon('moon', { size: 20, className: 'icon-moon' })}
      </button>
      <p class="sr-only" role="status" data-theme-status></p>
    `;
  }

  onToggle() {
    const theme = toggleTheme();

    this.button.setAttribute('aria-pressed', String(theme === 'dark'));
    this.button.setAttribute('aria-label', labelFor(theme));
    this.status.textContent = `${theme === 'dark' ? 'Dark' : 'Light'} theme enabled`;

    document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }
}

/** Names the action, not the state — that is what the user is about to do. */
function labelFor(theme) {
  return theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
}

customElements.define('theme-toggle', ThemeToggle);
