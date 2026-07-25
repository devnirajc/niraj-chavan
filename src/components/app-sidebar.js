/**
 * App Sidebar
 *
 * A persistent nav rail on wide screens, an off-canvas drawer below 1024px.
 *
 * Accessibility notes:
 * - Renders a real `<nav>` (the previous `<aside role="navigation">` gave the
 *   region two conflicting roles).
 * - While closed on narrow screens the drawer is `visibility: hidden`, which
 *   removes its links from the tab order and the accessibility tree in every
 *   browser. Previously they stayed focusable off-screen, so keyboard users
 *   tabbed into an invisible menu.
 * - While open it traps Tab, closes on Escape or an outside click, and returns
 *   focus to the button that opened it.
 * - The current section is marked with `aria-current`, not just a class.
 * - The scrim carries no `hidden` attribute: its resting state is already
 *   `visibility: hidden`, which keeps it out of both the hit-testing layer and
 *   the accessibility tree, so no timer is needed to hide it after the fade.
 *
 * Note for editors: `render()` is a template literal — backticks inside the
 * markup (including in HTML comments) terminate the string.
 */

import { icon } from '../scripts/utils/icons.js';
import { SOCIAL_LINKS, NEW_TAB_HINT } from '../scripts/data/social.js';

// Vite's configured `base`, so a change of deploy path stays in one place.
const BASE = import.meta.env.BASE_URL;
const DRAWER_QUERY = '(max-width: 1023px)';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.drawerMedia = window.matchMedia(DRAWER_QUERY);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
  }

  connectedCallback() {
    this.render();
    this.cacheNodes();
    this.attachEvents();

    // The sections are rendered by sibling custom elements that have not been
    // upgraded yet at this point (this element is defined first). Waiting a
    // frame means the observer is not silently set up against an empty list.
    requestAnimationFrame(() => this.observeSections());
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onKeydown);
    this.drawerMedia.removeEventListener('change', this.onBreakpointChange);
    this.sectionObserver?.disconnect();
  }

  render() {
    this.innerHTML = `
      <button
        class="sidebar-toggle"
        type="button"
        aria-controls="site-nav"
        aria-expanded="false"
      >
        ${icon('menu', { size: 22, className: 'icon-menu' })}
        ${icon('close', { size: 22, className: 'icon-close' })}
        <span class="sr-only">Open navigation menu</span>
      </button>

      <div class="sidebar-scrim"></div>

      <nav class="app-sidebar" id="site-nav" aria-label="Section navigation">
        <div class="sidebar-content">
          <div class="sidebar-header">
            <div class="profile-image">
              <img
                src="${BASE}assets/images/about.jpg"
                alt="Niraj Chavan"
                width="64"
                height="64"
                decoding="async"
              >
            </div>
            <p class="sidebar-title"><a href="#home">Niraj Chavan</a></p>
            <p class="sidebar-subtitle">Software Engineer &middot; Pune, India</p>
          </div>

          <div class="sidebar-nav">
            <ul>
              ${NAV_ITEMS.map(
                (item) => `
                  <li>
                    <a href="#${item.id}" data-nav-link="${item.id}">${item.label}</a>
                  </li>
                `
              ).join('')}
            </ul>
          </div>

          <div class="sidebar-footer">
            <ul class="social-row">
              ${SOCIAL_LINKS.map(
                (link) => `
                  <li>
                    <a class="icon-link" href="${link.url}" target="_blank" rel="noopener noreferrer">
                      ${icon(link.id, { size: 20 })}
                      <span class="sr-only">${link.label}${NEW_TAB_HINT}</span>
                    </a>
                  </li>
                `
              ).join('')}
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  cacheNodes() {
    this.toggleButton = this.querySelector('.sidebar-toggle');
    this.toggleLabel = this.querySelector('.sidebar-toggle .sr-only');
    this.drawer = this.querySelector('.app-sidebar');
    this.scrim = this.querySelector('.sidebar-scrim');
    this.navLinks = Array.from(this.querySelectorAll('[data-nav-link]'));
  }

  attachEvents() {
    this.toggleButton.addEventListener('click', () => this.toggle());
    this.scrim.addEventListener('click', () => this.close());

    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeydown);
    this.drawerMedia.addEventListener('change', this.onBreakpointChange);

    // Following a link inside the drawer should dismiss it.
    this.drawer.addEventListener('click', (event) => {
      if (event.target.closest('a[href^="#"]') && this.drawerMedia.matches) {
        this.close({ restoreFocus: false });
      }
    });
  }

  /* ============================================
     OPEN / CLOSE
     ============================================ */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.drawer.classList.add('is-open');
    this.toggleButton.setAttribute('aria-expanded', 'true');
    this.toggleLabel.textContent = 'Close navigation menu';
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      // Give the transition a starting state to animate from.
      this.scrim.classList.add('is-visible');

      // Focus has to wait a frame: the drawer is `visibility: hidden` until
      // the new class is applied, and a hidden element cannot take focus, so
      // calling focus() synchronously here would silently do nothing.
      this.drawer.querySelector(FOCUSABLE)?.focus();
    });
  }

  close({ restoreFocus = true } = {}) {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.drawer.classList.remove('is-open');
    this.scrim.classList.remove('is-visible');
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.toggleLabel.textContent = 'Open navigation menu';
    document.body.style.overflow = '';

    if (restoreFocus) {
      this.toggleButton.focus();
    }
  }

  onDocumentClick(event) {
    if (!this.isOpen) return;
    if (this.drawer.contains(event.target) || this.toggleButton.contains(event.target)) return;
    this.close();
  }

  onKeydown(event) {
    if (!this.isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  /** Keeps Tab and Shift+Tab cycling inside the open drawer. */
  trapFocus(event) {
    // `offsetParent` would be the obvious check but it ignores `visibility`,
    // which is exactly what hides this drawer.
    const focusables = Array.from(this.drawer.querySelectorAll(FOCUSABLE)).filter((el) =>
      el.checkVisibility
        ? el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true })
        : el.offsetParent !== null
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    const outside = !this.drawer.contains(active);

    // Both directions have to handle focus already being outside the drawer,
    // otherwise a forward Tab from anywhere else walks into the page behind
    // the scrim instead of cycling.
    if (event.shiftKey && (active === first || outside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || outside)) {
      event.preventDefault();
      first.focus();
    }
  }

  /** Growing past the drawer breakpoint must not leave the page scroll-locked. */
  onBreakpointChange(event) {
    if (!event.matches && this.isOpen) {
      this.close({ restoreFocus: false });
    }
  }

  /* ============================================
     ACTIVE SECTION
     ============================================
     An IntersectionObserver replaces the previous scroll handler, which ran
     layout-reading code on every scroll event. */
  observeSections() {
    const sections = document.querySelectorAll('section[data-nav-section]');
    if (sections.length === 0 || !('IntersectionObserver' in window)) {
      this.setCurrent('home');
      return;
    }

    const visible = new Set();

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.navSection;
          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        });

        // The first section in document order that is currently on screen.
        const current = NAV_ITEMS.map((item) => item.id).find((id) => visible.has(id));
        if (current) this.setCurrent(current);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => this.sectionObserver.observe(section));
  }

  setCurrent(id) {
    this.navLinks.forEach((link) => {
      if (link.dataset.navLink === id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}

customElements.define('app-sidebar', AppSidebar);
