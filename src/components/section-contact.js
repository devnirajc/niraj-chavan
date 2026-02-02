class Sectioncontact extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="contact-section" id="contact" data-nav-section="contact">
        <div class="container">
          <div class="section-header" data-animate="fade-in-up">
            <span class="section-subtitle">Get In Touch</span>
            <h2 class="section-title">Contact</h2>
          </div>
          <div class="contact-content">
            <div class="contact-item" data-animate="fade-in-up" data-animate-delay="0">
              <div class="contact-icon">✉️</div>
              <h3>Email</h3>
              <p><a href="mailto:nirajd327@gmail.com">nirajd327@gmail.com</a></p>
            </div>
            <div class="contact-item" data-animate="fade-in-up" data-animate-delay="100">
              <div class="contact-icon">📍</div>
              <h3>Location</h3>
              <p>Pune, Maharashtra, India</p>
            </div>
            <div class="contact-item" data-animate="fade-in-up" data-animate-delay="200">
              <div class="contact-icon">📱</div>
              <h3>Phone</h3>
              <p><a href="tel:+919607195436">+91 9607195436</a></p>
            </div>
          </div>
          <div class="contact-social" data-animate="fade-in-up" data-animate-delay="300">
            <h3>Connect With Me</h3>
            <div class="social-links">
              <a href="https://www.linkedin.com/in/niraj-chavan-8267bb98/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" class="social-link">
                <i class="fab fa-linkedin"></i>
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/devnirajc" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" class="social-link">
                <i class="fab fa-github"></i>
                <span>GitHub</span>
              </a>
              <a href="https://medium.com/@nirajd327" target="_blank" rel="noopener noreferrer" aria-label="Medium Blog" class="social-link">
                <i class="fab fa-medium"></i>
                <span>Medium</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('section-contact', Sectioncontact);
