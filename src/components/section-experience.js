import experienceData from '../scripts/data/experience.json';

class Sectionexperience extends HTMLElement {
  connectedCallback() {
    this.data = experienceData;
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="experience-section" id="experience" data-nav-section="experience">
        <div class="container">
          <div class="section-header" data-animate="fade-in-up">
            <span class="section-subtitle">${this.data.subheading}</span>
            <h2 class="section-title">${this.data.heading}</h2>
          </div>
          <div class="timeline">
            ${this.data.positions.map((pos, i) => `
              <div class="timeline-item ${pos.color}" data-animate="fade-in-left" data-animate-delay="${i * 100}">
                <div class="timeline-icon">💼</div>
                <div class="timeline-content">
                  <h3>${pos.title}</h3>
                  <h4>${pos.company}</h4>
                  <p class="timeline-duration">${pos.duration}</p>
                  <p>${pos.description}</p>
                  <ul>
                    ${pos.responsibilities.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('section-experience', Sectionexperience);
