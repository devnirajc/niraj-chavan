/**
 * App Sidebar Component
 * Fixed navigation sidebar with profile info
 */

class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
    this.updateActiveSection();
  }

  render() {
    this.innerHTML = `
      <button class="sidebar-toggle" aria-label="Toggle navigation menu" aria-expanded="${this.isOpen}">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside class="app-sidebar" role="navigation" aria-label="Main navigation">
        <div class="sidebar-content">
          <div class="sidebar-header">
            <div class="profile-image">
              <img src="/niraj-chavan/assets/images/about.jpg" alt="Niraj Chavan Profile Photo" loading="lazy">
            </div>
            <h1 class="sidebar-title">
              <a href="#home">Niraj Chavan</a>
            </h1>
            <p class="sidebar-subtitle">Software Engineer in Pune</p>
          </div>

          <nav class="sidebar-nav">
            <ul role="list">
              <li><a href="#home" data-nav-section="home" class="active">Home</a></li>
              <li><a href="#about" data-nav-section="about">About</a></li>
              <li><a href="#skills" data-nav-section="skills">Skills</a></li>
              <li><a href="#education" data-nav-section="education">Education</a></li>
              <li><a href="#experience" data-nav-section="experience">Experience</a></li>
              <li><a href="#work" data-nav-section="work">Work</a></li>
              <li><a href="#contact" data-nav-section="contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </aside>
    `;
  }

  attachEvents() {
    // Mobile toggle
    const toggle = this.querySelector('.sidebar-toggle');
    toggle?.addEventListener('click', () => this.toggleSidebar());

    // Close on outside click
    const sidebar = this.querySelector('.app-sidebar');
    document.addEventListener('click', (e) => {
      const toggle = this.querySelector('.sidebar-toggle');
      if (this.isOpen && !sidebar?.contains(e.target) && !toggle?.contains(e.target)) {
        this.closeSidebar();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeSidebar();
      }
    });

    // Update active state on scroll
    window.addEventListener('scroll', () => this.updateActiveSection());

    // Listen for close mobile menu event
    document.addEventListener('close-mobile-menu', () => this.closeSidebar());
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    const sidebar = this.querySelector('.app-sidebar');
    sidebar?.classList.toggle('open', this.isOpen);
    const toggle = this.querySelector('.sidebar-toggle');
    toggle?.setAttribute('aria-expanded', this.isOpen);
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeSidebar() {
    this.isOpen = false;
    const sidebar = this.querySelector('.app-sidebar');
    sidebar?.classList.remove('open');
    const toggle = this.querySelector('.sidebar-toggle');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('section[data-nav-section]');
    const navLinks = this.querySelectorAll('.sidebar-nav a');

    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('data-nav-section');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav-section') === current) {
        link.classList.add('active');
      }
    });
  }
}

customElements.define('app-sidebar', AppSidebar);
