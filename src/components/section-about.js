import aboutData from '../scripts/data/about.json';

class Sectionabout extends HTMLElement {
  connectedCallback() {
    this.data = aboutData;
    this.render();
  }

  calculateYears() {
    const start = new Date('2014-07-01');
    const now = new Date();
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    return years.toFixed(1);
  }

  render() {
    const years = this.calculateYears();
    const description = this.data.description.map(p => p.replace('{years}', years + ' years')).join('</p><p>');

    this.innerHTML = `
      <section class="about-section" id="about" data-nav-section="about">
        <div class="container">
          <div class="section-header" data-animate="fade-in-up">
            <span class="section-subtitle">${this.data.subheading}</span>
            <h2 class="section-title">${this.data.heading}</h2>
          </div>
          <div class="about-content">
            <div class="about-text" data-animate="fade-in-left">
              <p><strong>${this.data.intro}.</strong> ${description}</p>
            </div>
            <div class="services-grid">
              ${this.data.services.map((service, i) => `
                <div class="service-card ${service.color}" data-animate="fade-in-up" data-animate-delay="${i * 100}">
                  <div class="service-icon">
                    <i class="${service.icon}"></i>
                  </div>
                  <h3>${service.title}</h3>
                  <p>${service.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('section-about', Sectionabout);
