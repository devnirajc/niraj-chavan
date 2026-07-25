/**
 * Scroll reveal
 *
 * Elements marked `data-animate` start at opacity 0, so a failure here would
 * leave content permanently invisible. Both the unsupported-API path and the
 * reduced-motion path therefore reveal everything immediately rather than
 * doing nothing.
 */

const REVEALED = 'is-visible';

export function initScrollReveal() {
  const targets = document.querySelectorAll('[data-animate]');
  if (targets.length === 0) return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealAll(targets);
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(REVEALED);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );

  targets.forEach((element) => observer.observe(element));
  return observer;
}

export function revealAll(targets = document.querySelectorAll('[data-animate]')) {
  targets.forEach((element) => element.classList.add(REVEALED));
}
