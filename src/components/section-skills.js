/**
 * Skills Section
 *
 * Proficiency is written out in text next to every skill. The dot meter is a
 * redundant visual aid and is hidden from assistive tech, so the level is never
 * conveyed by colour or shape alone (WCAG 1.4.1).
 */

import skillsData from '../scripts/data/skills.json';
import { withYears } from '../scripts/utils/experience.js';

const LEVELS = {
  expert: 3,
  advanced: 2,
  intermediate: 1,
};

class SectionSkills extends HTMLElement {
  connectedCallback() {
    this.data = skillsData;
    this.render();
  }

  /** Three dots, filled to the skill's tier — decorative only. */
  static meter(level) {
    const filled = LEVELS[level] || 1;
    const dots = [1, 2, 3]
      .map((step) => `<i class="${step <= filled ? 'is-filled' : ''}"></i>`)
      .join('');
    return `<span class="skill-meter" aria-hidden="true">${dots}</span>`;
  }

  render() {
    this.innerHTML = `
      <section
        class="section section--alt"
        id="skills"
        data-nav-section="skills"
        aria-labelledby="skills-title"
      >
        <div class="container">
          <header class="section-header" data-animate="fade-in-up">
            <span class="eyebrow">${this.data.subheading}</span>
            <h2 class="section-title" id="skills-title">${this.data.heading}</h2>
            <hr class="section-rule">
            <p class="section-intro">${withYears(this.data.description)}</p>
          </header>

          <div class="skills-groups">
            ${this.data.categories
              .map((category, i) => {
                const groupId = `skills-${slug(category.name)}`;
                return `
                  <section
                    class="card skill-group"
                    aria-labelledby="${groupId}"
                    data-animate="fade-in-up"
                    data-animate-delay="${Math.min((i % 3) * 50 + 50, 200)}"
                  >
                    <h3 id="${groupId}">
                      ${category.name}
                      <!-- Hidden from AT: the heading names the region, and a
                           screen reader already announces "list, N items". -->
                      <span class="skill-group__count" aria-hidden="true">${
                        category.skills.length
                      }</span>
                    </h3>
                    <ul class="skill-chips">
                      ${category.skills.map((skill) => renderChip(skill)).join('')}
                    </ul>
                  </section>
                `;
              })
              .join('')}
          </div>
        </div>
      </section>
    `;
  }
}

function renderChip(skill) {
  const level = skill.proficiency.toLowerCase();
  return `
    <li class="skill-chip skill-chip--${level}">
      ${skill.name}
      ${SectionSkills.meter(level)}
      <span class="skill-chip__level">${skill.proficiency}</span>
    </li>
  `;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

customElements.define('section-skills', SectionSkills);
