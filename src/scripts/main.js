/**
 * Main JavaScript Entry Point
 * Portfolio - Niraj Chavan
 */

// Import styles
import '../styles/main.css';

// Import utility functions
import { initThemeManager } from './utils/theme-manager.js';
import { initSmoothScroll } from './utils/smooth-scroll.js';
import { initIntersectionObserver } from './utils/intersection-observer.js';

// Import Web Components
import '../components/theme-toggle.js';
import '../components/app-sidebar.js';
import '../components/section-hero.js';
import '../components/section-about.js';
import '../components/section-skills.js';
import '../components/section-education.js';
import '../components/section-experience.js';
import '../components/section-portfolio.js';
import '../components/section-contact.js';

/**
 * Initialize the application
 */
async function initApp() {
  console.log('🚀 Initializing portfolio...');

  try {
    // Remove loading class
    document.body.classList.remove('loading');

    // Initialize theme manager (dark mode)
    initThemeManager();
    console.log('✅ Theme manager initialized');

    // Initialize smooth scrolling
    initSmoothScroll();
    console.log('✅ Smooth scroll initialized');

    // Initialize intersection observer for scroll animations
    initIntersectionObserver();
    console.log('✅ Intersection observer initialized');

    // Initialize scroll indicator
    initScrollIndicator();
    console.log('✅ Scroll indicator initialized');

    console.log('🎉 Portfolio initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing portfolio:', error);
  }
}

/**
 * Initialize scroll progress indicator
 */
function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator__bar');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    indicator.style.width = `${scrolled}%`;

    // Update ARIA value
    const progressBar = document.querySelector('.scroll-indicator');
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
    }
  });
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Log version info
console.log('%c Portfolio v2.0.0 ', 'background: #6366F1; color: white; padding: 4px 8px; border-radius: 4px;');
console.log('Built with ❤️ using Vite + Web Components');
