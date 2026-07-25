/**
 * About Section
 *
 * Prose column plus capability cards. Each section labels its own landmark
 * via `aria-labelledby`, so a screen reader's region list reads
 * "About, region" rather than an unnamed run of sections.
 */

import aboutData from '../scripts/data/about.json';
import { icon } from '../scripts/utils/icons.js';
import { yearsOfExperience } from '../scripts/utils/experience.js';

class SectionAbout extends HTMLElement {
  connectedCallback() {
    this.data = aboutData;
    this.render();
  }

  render() {
    const years = `${yearsOfExperience()} years`;
    const paragraphs = this.data.description
      .map((text) => `<p>${text.replace('{years}', years)}</p>`)
      .join('');

    this.innerHTML = `
      <section class="section" id="about" data-nav-section="about" aria-labelledby="about-title">
        <div class="container">
          <header class="section-header" data-animate="fade-in-up">
            <span class="eyebrow">${this.data.subheading}</span>
            <h2 class="section-title" id="about-title">${this.data.heading}</h2>
            <hr class="section-rule">
          </header>

          <div class="about-layout">
            <div class="about-text prose" data-animate="fade-in-up">
              <p><strong>${this.data.intro}.</strong></p>
              ${paragraphs}
            </div>

            <ul class="services-grid">
              ${this.data.services
                .map(
                  (service, i) => `
                    <li class="card service-card" data-animate="fade-in-up" data-animate-delay="${Math.min(
                      (i + 1) * 50,
                      200
                    )}">
                      <span class="card-icon">${icon(service.icon, { size: 20 })}</span>
                      <h3>${service.title}</h3>
                      <p>${service.description}</p>
                    </li>
                  `
                )
                .join('')}
            </ul>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('section-about', SectionAbout);
