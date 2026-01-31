import portfolioData from '../scripts/data/portfolio.json';

class Sectionportfolio extends HTMLElement {
  connectedCallback() {
    this.data = portfolioData;
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="portfolio-section" id="work" data-nav-section="work">
        <div class="container">
          <div class="section-header" data-animate="fade-in-up">
            <span class="section-subtitle">${this.data.subheading}</span>
            <h2 class="section-title">${this.data.heading}</h2>
          </div>
          <div class="portfolio-grid">
            ${this.data.projects.map((project, i) => `
              <div class="portfolio-item" data-animate="scale-in" data-animate-delay="${i * 50}">
                <div class="portfolio-image">
                  <img src="/niraj-chavan/assets/images/${project.image}" alt="${project.title}" loading="lazy">
                </div>
                <div class="portfolio-overlay">
                  <div class="portfolio-content">
                    <h3>${project.title}</h3>
                    <p>${project.category}</p>
                    ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener" class="portfolio-link">View Project →</a>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('section-portfolio', Sectionportfolio);
