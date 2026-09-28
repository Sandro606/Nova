/**
 * Nexus Landing Page - Interactive Logic & UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. DOM Elements
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const newsletterForm = document.getElementById('newsletter-form');
  const toastContainer = document.getElementById('toast-container');

  // 3. Navbar Scroll Effect & Back-to-Top Visibility
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header background blur
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Active Navigation Link on Scroll
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger on load

  // 4. Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      const menuIcon = menuToggle.querySelector('i, svg');
      if (menuIcon && typeof lucide !== 'undefined') {
        menuToggle.innerHTML = isOpen
          ? '<i data-lucide="x"></i>'
          : '<i data-lucide="menu"></i>';
        lucide.createIcons();
      }
    });

    // Close menu when clicking navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuToggle.innerHTML = '<i data-lucide="menu"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      });
    });
  }

  // 5. Back to Top Scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Animated Metrics Counter on View
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  const animateMetrics = () => {
    metricNumbers.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing function: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = easeProgress * target;

        el.textContent = isDecimal
          ? currentValue.toFixed(1)
          : Math.floor(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const metricsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateMetrics();
        }
      });
    },
    { threshold: 0.4 }
  );

  const heroMetricsSection = document.querySelector('.hero-metrics');
  if (heroMetricsSection) {
    metricsObserver.observe(heroMetricsSection);
  }

  // 7. Interactive Mouse Glow on Bento Cards
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 8. Bento Interactive Filter Chips
  const pillChips = document.querySelectorAll('.pill-chip');
  pillChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      pillChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      showToast('რეჟიმი გააქტიურებულია', `არჩეულია: ${chip.textContent.trim()}`, 'success');
    });
  });

  // 9. Toast Notification System
  function showToast(title, message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${iconName}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // 10. Contact Form Validation & Submission
  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('submit-btn');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const clearErrors = () => {
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      [nameInput, emailInput, messageInput].forEach((input) => {
        input.closest('.form-group').classList.remove('has-error');
      });
    };

    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
        const errSpan = input.closest('.form-group').querySelector('.error-msg');
        if (errSpan) errSpan.textContent = '';
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'გთხოვთ მიუთითოთ თქვენი სახელი';
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან';
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'გთხოვთ მიუთითოთ ელ-ფოსტის მისამართი';
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის ფორმატი';
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'გთხოვთ დაწეროთ შეტყობინება';
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else if (messageInput.value.trim().length < 8) {
        messageError.textContent = 'შეტყობინება უნდა იყოს უფრო ვრცელი (მინ. 8 სიმბოლო)';
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        showToast('შეცდომა ფორმაში', 'გთხოვთ შეასწოროთ მითითებული ველები', 'error');
        return;
      }

      // Simulate sending with loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>იგზავნება...</span> <i data-lucide="loader-2" class="spin-icon"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Switch to success card
        contactForm.style.display = 'none';
        formSuccess.classList.add('active');

        showToast(
          'წარმატება!',
          'თქვენი შეტყობინება წარმატებით გაიგზავნა. მალე დაგიკავშირდებით!',
          'success'
        );
      }, 900);
    });

    // Reset Form button
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        clearErrors();
        formSuccess.classList.remove('active');
        contactForm.style.display = 'flex';
      });
    }
  }

  // 11. Newsletter Form Submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailEl = document.getElementById('newsletter-email');
      if (emailEl && emailEl.value.trim()) {
        showToast(
          'მადლობა გამოწერისთვის!',
          `${emailEl.value.trim()} დაემატა ჩვენს საინფორმაციო ბაზას.`,
          'success'
        );
        emailEl.value = '';
      }
    });
  }

  // 12. Dynamic Live Chart Animation in Hero Mockup
  const bars = document.querySelectorAll('.chart-bars .bar');
  if (bars.length > 0) {
    setInterval(() => {
      bars.forEach((bar) => {
        // Subtle random fluctuation between 35% and 100%
        const randomHeight = Math.floor(Math.random() * 65) + 35;
        bar.style.setProperty('--height', `${randomHeight}%`);
      });
    }, 3500);
  }
});
