/**
 * Portfolio Section
 *
 * Previously the title, category and link lived inside a `:hover`-only
 * overlay, which meant keyboard and screen-reader users could not reach the
 * project links at all. Everything is now permanently visible; the whole card
 * is clickable through a stretched pseudo-element on the title link, so the
 * link's accessible name stays the project name.
 */

import portfolioData from '../scripts/data/portfolio.json';
import { icon } from '../scripts/utils/icons.js';
import { NEW_TAB_HINT } from '../scripts/data/social.js';

// Vite's configured `base`, so a change of deploy path stays in one place.
const BASE = import.meta.env.BASE_URL;

class SectionPortfolio extends HTMLElement {
  connectedCallback() {
    this.data = portfolioData;
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="section" id="work" data-nav-section="work" aria-labelledby="work-title">
        <div class="container">
          <header class="section-header" data-animate="fade-in-up">
            <span class="eyebrow">${this.data.subheading}</span>
            <h2 class="section-title" id="work-title">${this.data.heading}</h2>
            <hr class="section-rule">
          </header>

          <ul class="portfolio-grid">
            ${this.data.projects.map((project, i) => renderCard(project, i)).join('')}
          </ul>
        </div>
      </section>
    `;
  }
}

function renderCard(project, index) {
  const title = project.link
    ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">
         ${project.title}<span class="sr-only">${NEW_TAB_HINT}</span>
       </a>`
    : project.title;

  const cue = project.link
    ? `<p class="portfolio-card__cue">
         <span aria-hidden="true">View project</span>
         ${icon('arrow-up-right', { size: 16 })}
       </p>`
    : '';

  return `
    <li>
      <article
        class="card card--interactive portfolio-card"
        data-animate="scale-in"
        data-animate-delay="${Math.min((index % 3) * 50 + 50, 200)}"
      >
        <div class="portfolio-card__media">
          <img
            src="${BASE}assets/images/${project.image}"
            alt="Screenshot of the ${project.title} interface"
            loading="lazy"
            decoding="async"
            width="640"
            height="400"
          >
        </div>
        <div class="portfolio-card__body">
          <p class="portfolio-card__category">${project.category}</p>
          <h3 class="portfolio-card__title">${title}</h3>
          <p class="portfolio-card__desc">${project.description}</p>
          ${cue}
        </div>
      </article>
    </li>
  `;
}

customElements.define('section-portfolio', SectionPortfolio);
