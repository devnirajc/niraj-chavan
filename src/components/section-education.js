/**
 * Education Section
 *
 * Rendered as an ordered list so the sequence is part of the semantics, not
 * just the visual rail. The emoji that previously marked each entry is gone —
 * screen readers announce emoji by their Unicode name ("books"), which was
 * noise in front of every qualification.
 */

import educationData from '../scripts/data/education.json';
import { icon } from '../scripts/utils/icons.js';

class SectionEducation extends HTMLElement {
  connectedCallback() {
    this.data = educationData;
    this.render();
  }

  render() {
    this.innerHTML = `
      <section
        class="section"
        id="education"
        data-nav-section="education"
        aria-labelledby="education-title"
      >
        <div class="container">
          <header class="section-header" data-animate="fade-in-up">
            <span class="eyebrow">${this.data.subheading}</span>
            <h2 class="section-title" id="education-title">${this.data.heading}</h2>
            <hr class="section-rule">
          </header>

          <ol class="timeline">
            ${this.data.items
              .map(
                (item, i) => `
                  <li class="timeline-item" data-animate="fade-in-up" data-animate-delay="${Math.min(
                    (i + 1) * 50,
                    200
                  )}">
                    <article class="card timeline-card">
                      <div class="timeline-head">
                        <span class="timeline-icon">${icon(item.icon, { size: 20 })}</span>
                        <div>
                          <h3 class="timeline-title">${item.degree}</h3>
                          <p class="timeline-org">${item.institution}</p>
                        </div>
                      </div>
                      <p class="timeline-duration">${item.duration}</p>
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

customElements.define('section-education', SectionEducation);
