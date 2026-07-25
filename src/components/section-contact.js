/**
 * Contact Section
 *
 * The emoji icons are replaced with inline SVG marked `aria-hidden`; every
 * detail keeps a visible text label, and the phone/email values are real
 * `tel:`/`mailto:` links.
 */

import { icon } from '../scripts/utils/icons.js';
import { SOCIAL_LINKS, NEW_TAB_HINT } from '../scripts/data/social.js';

const DETAILS = [
  {
    icon: 'mail',
    label: 'Email',
    value: 'nirajd327@gmail.com',
    href: 'mailto:nirajd327@gmail.com',
  },
  {
    icon: 'phone',
    label: 'Phone',
    value: '+91 96071 95436',
    href: 'tel:+919607195436',
  },
  {
    icon: 'map-pin',
    label: 'Location',
    value: 'Pune, Maharashtra, India',
    href: null,
  },
];

class SectionContact extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section
        class="section section--alt"
        id="contact"
        data-nav-section="contact"
        aria-labelledby="contact-title"
      >
        <div class="container">
          <header class="section-header" data-animate="fade-in-up">
            <span class="eyebrow">Get in touch</span>
            <h2 class="section-title" id="contact-title">Let&rsquo;s work together</h2>
            <hr class="section-rule">
            <p class="section-intro">
              I&rsquo;m open to interesting engineering roles and collaborations.
              The quickest way to reach me is email.
            </p>
          </header>

          <div class="contact-layout">
            <ul class="contact-list">
              ${DETAILS.map(
                (detail, i) => `
                  <li
                    class="card contact-card"
                    data-animate="fade-in-up"
                    data-animate-delay="${(i + 1) * 50}"
                  >
                    <span class="card-icon">${icon(detail.icon, { size: 20 })}</span>
                    <div>
                      <p class="contact-card__label">${detail.label}</p>
                      <p class="contact-card__value">
                        ${
                          detail.href
                            ? `<a href="${detail.href}">${detail.value}</a>`
                            : detail.value
                        }
                      </p>
                    </div>
                  </li>
                `
              ).join('')}
            </ul>

            <div class="contact-social" data-animate="fade-in-up" data-animate-delay="200">
              <h3>Elsewhere on the web</h3>
              <ul class="social-links">
                ${SOCIAL_LINKS.map(
                  (link) => `
                    <li>
                      <a class="social-link" href="${link.url}" target="_blank" rel="noopener noreferrer">
                        ${icon(link.id, { size: 20 })}
                        <span>${link.label}<span class="sr-only">${NEW_TAB_HINT}</span></span>
                        <span class="social-link__handle">${link.handle}</span>
                      </a>
                    </li>
                  `
                ).join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('section-contact', SectionContact);
