/**
 * Experience Section
 *
 * An ordered list of roles, newest first. Heading levels run h2 (section) →
 * h3 (role title) with the employer as a paragraph rather than an h4, so the
 * outline stays clean and no level is skipped (WCAG 1.3.1).
 */

import experienceData from '../scripts/data/experience.json';
import { icon } from '../scripts/utils/icons.js';

class SectionExperience extends HTMLElement {
  connectedCallback() {
    this.data = experienceData;
    this.render();
  }

  render() {
    this.innerHTML = `
      <section
        class="section section--alt"
        id="experience"
        data-nav-section="experience"
        aria-labelledby="experience-title"
      >
        <div class="container">
          <header class="section-header" data-animate="fade-in-up">
            <span class="eyebrow">${this.data.subheading}</span>
            <h2 class="section-title" id="experience-title">${this.data.heading}</h2>
            <hr class="section-rule">
          </header>

          <ol class="timeline">
            ${this.data.positions
              .map(
                (position, i) => `
                  <li class="timeline-item" data-animate="fade-in-up" data-animate-delay="${Math.min(
                    (i + 1) * 50,
                    200
                  )}">
                    <article class="card timeline-card">
                      <div class="timeline-head">
                        <span class="timeline-icon">${icon(position.icon || 'briefcase', {
                          size: 20,
                        })}</span>
                        <div>
                          <h3 class="timeline-title">${position.title}</h3>
                          <p class="timeline-org">${position.company}</p>
                        </div>
                      </div>

                      <p class="timeline-duration">${position.duration}</p>

                      <div class="prose">
                        <p>${position.description}</p>
                        <ul>
                          ${position.responsibilities.map((item) => `<li>${item}</li>`).join('')}
                        </ul>
                      </div>
                    </article>
                  </li>
                `
              )
              .join('')}
          </ol>
        </div>
      </section>
    `;
  }
}

customElements.define('section-experience', SectionExperience);
