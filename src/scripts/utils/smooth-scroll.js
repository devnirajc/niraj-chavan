/**
 * Smooth Scroll
 *
 * Scrolls in-page links and, crucially, moves keyboard focus to the
 * destination. Scrolling alone leaves focus behind at the link, so the next
 * Tab press sends the user back to wherever they came from instead of into the
 * content they just jumped to (WCAG 2.4.3).
 *
 * Honours `prefers-reduced-motion` by jumping instead of animating.
 */

export function initSmoothScroll() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;

    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
      block: 'start',
    });

    focusWithoutScrolling(target);
    history.pushState(null, '', hash);
  });
}

/**
 * Sections are not focusable by default, so a temporary `tabindex` is added
 * and removed again on blur to keep them out of the tab order.
 */
function focusWithoutScrolling(element) {
  const hadTabIndex = element.hasAttribute('tabindex');

  if (!hadTabIndex) {
    element.setAttribute('tabindex', '-1');
    element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true });
  }

  element.focus({ preventScroll: true });
}
