import skillsData from '../scripts/data/skills.json';

class Sectionskills extends HTMLElement {
  connectedCallback() {
    this.data = skillsData;
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="skills-section" id="skills" data-nav-section="skills">
        <div class="container">
          <div class="section-header" data-animate="fade-in-up">
            <span class="section-subtitle">${this.data.subheading}</span>
            <h2 class="section-title">${this.data.heading}</h2>
          </div>
          <p class="skills-description" data-animate="fade-in-left">${this.data.description}</p>
          ${this.data.categories.map(cat => `
            <div class="skills-category" data-animate="fade-in-up">
              <h3 class="category-title">${cat.name}</h3>
              <div class="skills-grid">
                ${cat.skills.map(skill => `
                  <div class="skill-item">
                    <div class="skill-header">
                      <span class="skill-name">${skill.name}</span>
                      <span class="skill-badge skill-badge-${skill.proficiency.toLowerCase()}">${skill.proficiency}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
}
customElements.define('section-skills', Sectionskills);
