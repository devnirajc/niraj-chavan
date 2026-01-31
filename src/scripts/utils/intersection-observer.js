/**
 * Intersection Observer
 * Handles scroll-triggered animations
 */

export function initIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        if (entry.target.dataset.animateOnce !== 'false') {
          observer.unobserve(entry.target);
        }
      }
    });
  }, options);

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el);
  });

  return observer;
}
