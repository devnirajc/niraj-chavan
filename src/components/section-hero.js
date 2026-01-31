/**
 * Hero Section Component
 * Full-screen hero with animated text
 */

class Sectionhero extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="hero-section" id="home" data-nav-section="home">
        <div class="hero-background">
          <img src="/niraj-chavan/assets/images/computer.jpg" alt="Background" loading="eager">
        </div>
        <div class="hero-overlay"></div>
        <div class="hero-content" data-animate="fade-in-up">
          <h1 class="hero-title">
            Hi!<br>
            I am <span class="text-gradient">Niraj Chavan</span>
          </h1>
          <p class="hero-subtitle">Software Engineer | Full Stack Developer</p>
          <div class="hero-cta">
            <a href="/niraj-chavan/assets/documents/Niraj-Chavan.pdf" download class="btn btn-primary">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L9 8.586V1a1 1 0 112 0v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"/>
                <path d="M17 14a1 1 0 011 1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a1 1 0 112 0v2h12v-2a1 1 0 011-1z"/>
              </svg>
              Download CV
            </a>
          </div>
        </div>
        <div class="hero-scroll-indicator">
          <div class="scroll-arrow"></div>
        </div>
      </section>
    `;
  }
}

customElements.define('section-hero', Sectionhero);
