import educationData from '../scripts/data/education.json';

class Sectioneducation extends HTMLElement {
  connectedCallback() {
    this.data = educationData;
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="education-section" id="education" data-nav-section="education">
        <div class="container">
          <div class="section-header" data-animate="fade-in-up">
            <span class="section-subtitle">${this.data.subheading}</span>
            <h2 class="section-title">${this.data.heading}</h2>
          </div>
          <div class="timeline">
            ${this.data.items.map((item, i) => `
              <div class="timeline-item" data-animate="fade-in-left" data-animate-delay="${i * 100}">
                <div class="timeline-icon">📚</div>
                <div class="timeline-content">
                  <h3>${item.degree}</h3>
                  <p class="timeline-institution">${item.institution}</p>
                  <p class="timeline-duration">${item.duration}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('section-education', Sectioneducation);
