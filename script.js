/* =========================================================
   PORTFOLIO SCRIPT
   Handles: theme toggle, typing animation, scroll reveal,
   active nav highlight, smooth scroll, back-to-top,
   animated skill bars, contact form validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. DARK / LIGHT MODE TOGGLE
     Persists preference for the session (no localStorage
     used per environment constraints — falls back to
     system preference on load).
  --------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) root.setAttribute('data-theme', 'dark');

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });

  /* ---------------------------------------------------
     2. MOBILE NAV (hamburger toggle)
  --------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav after clicking a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------------------------------------------------
     3. TYPING ANIMATION (Hero subtitle)
  --------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const phrases = [
    'Software Developer',
    'AI Enthusiast',
    'Problem Solver',
    'Lifelong Learner'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1500); // pause at full phrase
        return;
      }
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 40 : 90;
    setTimeout(typeLoop, speed);
  }
  typeLoop();

  /* ---------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     5. ANIMATED SKILL PROGRESS BARS
     Triggers fill animation once the skills section
     scrolls into view.
  --------------------------------------------------- */
  const progressFills = document.querySelectorAll('.progress-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('data-progress');
        fill.style.width = targetWidth + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  progressFills.forEach(fill => skillObserver.observe(fill));

  /* ---------------------------------------------------
     6. ANIMATED STAT COUNTERS (About section)
  --------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 30));

        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          el.textContent = current;
        }, 50);

        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));

  /* ---------------------------------------------------
     7. ACTIVE NAVBAR HIGHLIGHT ON SCROLL
  --------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.section === sectionId);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav);
  highlightNav();

  /* ---------------------------------------------------
     8. NAVBAR BACKGROUND ON SCROLL + BACK TO TOP BUTTON
  --------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function handleScrollUI() {
    const scrolled = window.scrollY > 60;
    navbar.style.boxShadow = scrolled ? '0 8px 24px -12px rgba(0,0,0,0.15)' : 'none';
    backToTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', handleScrollUI);
  handleScrollUI();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------
     9. CURSOR GLOW EFFECT (desktop only, decorative)
  --------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  /* ---------------------------------------------------
     10. CONTACT FORM VALIDATION
  --------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formName = document.getElementById('formName');
  const formEmail = document.getElementById('formEmail');
  const formMessage = document.getElementById('formMessage');
  const errorName = document.getElementById('errorName');
  const errorEmail = document.getElementById('errorEmail');
  const errorMessage = document.getElementById('errorMessage');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field, errorEl, rule, message) {
    if (!rule(field.value.trim())) {
      field.classList.add('invalid');
      errorEl.textContent = message;
      return false;
    }
    field.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
  }

  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');

    const validName = validateField(
      formName, errorName,
      (v) => v.length >= 2,
      'Please enter your name (at least 2 characters).'
    );

    const validEmail = validateField(
      formEmail, errorEmail,
      isEmailValid,
      'Please enter a valid email address.'
    );

    const validMessage = validateField(
      formMessage, errorMessage,
      (v) => v.length >= 10,
      'Message should be at least 10 characters long.'
    );

    if (validName && validEmail && validMessage) {
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }
  });

  // Clear individual field errors as the user types
  [
    [formName, errorName],
    [formEmail, errorEmail],
    [formMessage, errorMessage]
  ].forEach(([field, errorEl]) => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      errorEl.textContent = '';
    });
  });

  /* ---------------------------------------------------
     11. FOOTER YEAR
  --------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------
     12. RESUME DOWNLOAD BUTTON (placeholder behavior)
     Replace href in HTML with an actual resume PDF path
     to enable real downloads.
  --------------------------------------------------- */
  const resumeBtn = document.getElementById('resumeBtn');
  resumeBtn.addEventListener('click', (e) => {
    if (resumeBtn.getAttribute('href') === '#') {
      e.preventDefault();
      alert('Add your resume PDF to the project folder and update the Download Resume button link in index.html.');
    }
  });

});
