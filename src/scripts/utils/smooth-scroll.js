/**
 * Smooth Scroll
 * Handles smooth scrolling to sections
 */

export function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    e.preventDefault();

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const offsetTop = targetElement.offsetTop - 80;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });

    history.pushState(null, null, targetId);
    document.dispatchEvent(new CustomEvent('close-mobile-menu'));
  });
}
