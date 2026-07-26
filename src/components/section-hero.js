/**
 * Hero Section
 *
 * Typographic full-height opener. Deliberately no background photograph: text
 * over an image cannot guarantee a contrast ratio, so the headline sits on a
 * solid canvas token instead.
 */

import { icon } from '../scripts/utils/icons.js';
import { yearsOfExperience } from '../scripts/utils/experience.js';
import { SOCIAL_LINKS, NEW_TAB_HINT } from '../scripts/data/social.js';
import { FEATURES } from '../scripts/config/features.js';

// Vite's configured `base`, so a change of deploy path stays in one place.
const BASE = import.meta.env.BASE_URL;

class SectionHero extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const years = yearsOfExperience();

    this.innerHTML = `
      <section class="hero" id="home" data-nav-section="home" aria-labelledby="hero-title">
        <div class="hero__glow" aria-hidden="true"></div>
        <div class="hero__grid" aria-hidden="true"></div>

        <div class="container hero__inner">
          <img
            class="hero__avatar"
            src="${BASE}assets/images/avatar.webp"
            alt=""
            width="88"
            height="88"
            decoding="async"
          >

          ${
            FEATURES.openToOpportunities
              ? `
                <p class="hero__status">
                  <span class="hero__status-dot" aria-hidden="true"></span>
                  Open to new opportunities
                </p>
              `
              : ''
          }

          <h1 class="hero__title" id="hero-title">
            Hi, I&rsquo;m <em>Niraj Chavan</em>
          </h1>

          <p class="hero__subtitle">
            Software engineer building fast, accessible web products &mdash;
            currently at JP Morgan Chase &amp; Co. in Pune.
          </p>

          <div class="hero__actions">
            <a class="btn btn--primary" href="${BASE}assets/documents/Niraj-Chavan.pdf" download>
              ${icon('download', { size: 18 })}
              Download CV
            </a>
            <a class="btn btn--outline" href="#contact">
              Get in touch
              ${icon('arrow-right', { size: 18 })}
            </a>
          </div>

          <dl class="hero__facts">
            <div class="hero__fact">
              <dt>Experience</dt>
              <dd>${years}+ years</dd>
            </div>
            <div class="hero__fact">
              <dt>Focus</dt>
              <dd>Front end &amp; full stack</dd>
            </div>
            <div class="hero__fact">
              <dt>Based in</dt>
              <dd>Pune, India</dd>
            </div>
          </dl>

          <ul class="social-row hero__social">
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

        <a class="hero__scroll" href="#about">
          Explore my work
          ${icon('arrow-down', { size: 16 })}
        </a>
      </section>
    `;
  }
}

customElements.define('section-hero', SectionHero);
