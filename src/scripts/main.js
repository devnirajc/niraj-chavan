/**
 * Main entry point
 * Portfolio — Niraj Chavan
 */

import '../styles/main.css';

import { initThemeManager } from './utils/theme-manager.js';
import { initSmoothScroll } from './utils/smooth-scroll.js';
import { initScrollReveal, revealAll } from './utils/intersection-observer.js';
import { hidePageLoader } from './utils/page-loader.js';

import '../components/theme-toggle.js';
import '../components/app-sidebar.js';
import '../components/section-hero.js';
import '../components/section-about.js';
import '../components/section-skills.js';
import '../components/section-education.js';
import '../components/section-experience.js';
import '../components/section-portfolio.js';
import '../components/section-contact.js';

function initApp() {
  try {
    initThemeManager();
    initSmoothScroll();
    initScrollReveal();
    initScrollIndicator();
    setCurrentYear();
    applyInitialHash();
  } catch (error) {
    // Never leave reveal-animated content stranded at opacity 0 because some
    // unrelated initialiser threw.
    revealAll();
    console.error('Portfolio initialisation failed:', error);
  } finally {
    // Whichever branch we came from, the overlay comes down: a broken
    // initialiser must not leave the visitor watching a spinner.
    hidePageLoader();
  }
}

/**
 * Decorative progress bar. Driven by `transform` rather than `width` so it
 * stays on the compositor, and throttled to one update per frame.
 */
function initScrollIndicator() {
  const bar = document.querySelector('.scroll-indicator__bar');
  if (!bar) return;

  let ticking = false;

  const update = () => {
    const scrollable =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    ticking = false;
  };

  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });

  // Document height changes without a scroll — orientation change, a late font
  // swap, images settling — would otherwise leave the bar showing a stale
  // fraction until the next scroll event.
  window.addEventListener('resize', schedule, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(schedule).observe(document.body);
  }

  update();
}

/**
 * Re-applies the URL fragment after the components have rendered.
 *
 * Every section is created by a custom element, so when the browser first tries
 * to resolve a URL like `/#education` the target does not exist yet and the
 * jump is either skipped or lands in the wrong place. Doing it again here — now
 * that the DOM is complete — makes deep links and refreshes land correctly, and
 * picks up the `scroll-margin` offsets the CSS defines.
 */
function applyInitialHash() {
  const { hash } = window.location;
  if (!hash || hash === '#') return;

  let target = null;
  try {
    target = document.querySelector(hash);
  } catch {
    return; // Not a valid selector — nothing to jump to.
  }

  if (target) {
    // 'instant' rather than 'auto': 'auto' defers to `scroll-behavior: smooth`
    // on <html>, which would animate a deep link down from the top on load.
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
}

function setCurrentYear() {
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
