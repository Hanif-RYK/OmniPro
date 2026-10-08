/**
 * Apex Advisory - Commercial Front-End Script
 * Author: Apex Advisory Design Systems
 * Licensed for Commercial Distribution
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Accessible Mobile Menu Navigation
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;

      mobileMenuBtn.setAttribute('aria-expanded', String(nextState));

      if (nextState) {
        mobileNav.classList.remove('hidden');
        mobileNav.classList.add('flex');
      } else {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
      }
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (event) => {
      if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
        mobileMenuBtn.focus();
      }
    });
  }

  // 2. Smooth In-Page Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 3. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('revealed'));
    }
  }

  // 4. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('[data-faq-item]');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('[data-faq-trigger]');
    const answer = item.querySelector('[data-faq-answer]');

    if (trigger && answer) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close other items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('[data-faq-answer]');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 5. Strategic Advisory ROI / Impact Calculator (Services Page)
  const roiCalculator = document.getElementById('advisoryCalculator');
  if (roiCalculator) {
    const enterpriseScale = document.getElementById('enterpriseScale');
    const advisoryScope = document.getElementById('advisoryScope');
    const projectTimeline = document.getElementById('projectTimeline');
    const calculatedRoi = document.getElementById('calculatedRoi');
    const calculatedEfficiency = document.getElementById('calculatedEfficiency');
    const recommendedTeam = document.getElementById('recommendedTeam');

    const updateCalculations = () => {
      const scale = enterpriseScale ? enterpriseScale.value : 'mid';
      const scope = advisoryScope ? advisoryScope.value : 'capital';
      const timeline = projectTimeline ? parseInt(projectTimeline.value, 10) : 6;

      let baseRoiMultiplier = 3.2;
      let efficiencyGain = 28;
      let teamSize = '4 Senior Partners + 2 Analysts';

      if (scale === 'enterprise') {
        baseRoiMultiplier = 4.8;
        efficiencyGain = 38;
        teamSize = '6 Managing Directors + 4 Quantitative Analysts';
      } else if (scale === 'growth') {
        baseRoiMultiplier = 2.7;
        efficiencyGain = 22;
        teamSize = '2 Practice Leads + 2 Associate Advisors';
      }

      if (scope === 'ma') {
        baseRoiMultiplier += 1.4;
        efficiencyGain += 10;
      } else if (scope === 'transformation') {
        baseRoiMultiplier += 0.8;
        efficiencyGain += 16;
      }

      const finalRoi = (baseRoiMultiplier * (timeline / 6)).toFixed(1);
      const finalEfficiency = Math.min(65, Math.round(efficiencyGain * (1 + timeline * 0.05)));

      if (calculatedRoi) calculatedRoi.textContent = `${finalRoi}x`;
      if (calculatedEfficiency) calculatedEfficiency.textContent = `+${finalEfficiency}%`;
      if (recommendedTeam) recommendedTeam.textContent = teamSize;
    };

    [enterpriseScale, advisoryScope, projectTimeline].forEach((control) => {
      if (control) control.addEventListener('change', updateCalculations);
      if (control) control.addEventListener('input', updateCalculations);
    });

    updateCalculations();
  }

  // 6. Client-Side Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    const setFieldError = (inputEl, errorEl, message) => {
      inputEl.classList.add('border-rose-500');
      inputEl.classList.remove('border-slate-300');
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    };

    const clearFieldError = (inputEl, errorEl) => {
      inputEl.classList.remove('border-rose-500');
      inputEl.classList.add('border-slate-300');
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    };

    [
      { input: nameInput, error: nameError },
      { input: emailInput, error: emailError },
      { input: subjectInput, error: subjectError },
      { input: messageInput, error: messageError }
    ].forEach(({ input, error }) => {
      if (input && error) {
        input.addEventListener('input', () => clearFieldError(input, error));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidInput = null;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, nameError, 'Please enter your full name (minimum 2 characters).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearFieldError(nameInput, nameError);
      }

      if (!emailInput.value.trim()) {
        setFieldError(emailInput, emailError, 'Email address is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, emailError, 'Please provide a valid corporate email address (e.g. name@company.com).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, subjectError, 'Please select an advisory area.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = subjectInput;
      } else {
        clearFieldError(subjectInput, subjectError);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(messageInput, messageError, 'Please provide project details (minimum 10 characters).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else {
        clearFieldError(messageInput, messageError);
      }

      if (!isValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        submittedAt: new Date().toISOString()
      };
      /* 
       * ─────────────────────────────────────────────────────────────
       * 🔌 PLUG IN YOUR FORM ENDPOINT HERE
       * ─────────────────────────────────────────────────────────────
       * Currently, this form validates inputs on the client and displays
       * a simulated confirmation message without sending data externally.
       * 
       * To dispatch submissions directly to your email or backend,
       * choose one of the following integration methods:
       * 
       * OPTION 1: Formspree / Web3Forms / Formkeep (AJAX API)
       * fetch('https://formspree.io/f/YOUR_FORM_ID', {
       *   method: 'POST',
       *   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
       *   body: JSON.stringify(formData)
       * }).then(response => {
       *   if (response.ok) {
       *     // Show success message
       *     if (formSuccessMessage) formSuccessMessage.classList.remove('hidden');
       *     contactForm.reset();
       *   } else {
       *     alert('Submission failed. Please try again.');
       *   }
       * }).catch(error => {
       *   console.error('Error:', error);
       * });
       * 
       * OPTION 2: EmailJS (Direct browser email dispatch)
       * // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
       * //   .then(() => { ...show success banner... });
       * 
       * OPTION 3: Native Backend / PHP mail script
       * Add action="contact-process.php" method="POST" to your <form> tag
       * in contact.html, and comment out 'e.preventDefault()' at the start
       * of this listener to let the browser submit normally.
       * ─────────────────────────────────────────────────────────────
       */

      // (Retaining local UI confirmation below:)
      const _dummy = {
      };


      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Transmitting Inquiry...</span>';
      }

      setTimeout(() => {
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
          formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Transmit Executive Inquiry</span> <span aria-hidden="true">→</span>';
        }
      }, 500);
    });
  }


  // ─── OmniPro Live Studio Customizer Listener (postMessage + Smooth Navigation) ───
  function applyStudioCustomization(data) {
    if (!data) return;
    if (data.color) {
      document.documentElement.style.setProperty('--primary-color', data.color);
      document.documentElement.style.setProperty('--primary-hover', data.color);
    }
    if (data.font) {
      let fontLink = document.getElementById('customStudioFontLink');
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'customStudioFontLink';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      fontLink.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(data.font) + ':ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap';

      let fontStyle = document.getElementById('customStudioFontStyle');
      if (!fontStyle) {
        fontStyle = document.createElement('style');
        fontStyle.id = 'customStudioFontStyle';
        document.head.appendChild(fontStyle);
      }
      const fontFallback = data.font === 'Playfair Display' ? 'serif' : 'sans-serif';
      fontStyle.textContent = `
        :root { --font-display: '${data.font}', ${fontFallback} !important; }
        h1, h2, h3, h4, .font-display, [class*="font-['Outfit']"] {
          font-family: '${data.font}', ${fontFallback} !important;
        }
      `;
    }
    // Brand Name: NEVER touch the logo icon mark! Only update the brand text span on the right!
    if (data.brandName) {
      document.title = data.brandName + ' | Commercial Solution';
      const brandSpans = document.querySelectorAll('[data-brand-title], header a.flex > span:not([class*="w-10"]):not([class*="w-8"]):not([class*="w-7"]):not([class*="w-9"]):not([class*="rounded-xl"]):not([class*="rounded-lg"]):not([class*="rounded-full"]), footer [data-brand-title]');
      brandSpans.forEach((span) => {
        if (!span.classList.contains('w-10') && !span.classList.contains('w-8') && !span.classList.contains('w-7') && !span.classList.contains('w-9')) {
          span.textContent = data.brandName;
        }
      });
    }
  }

  // Smooth in-frame navigation: notify parent container for seamless cross-fade
  document.querySelectorAll('header nav a, header a[href$=".html"], footer a[href$=".html"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && !link.target) {
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'OMNI_NAV_START' }, '*');
          }
        } catch (err) {}
      }
    });
  });

  // Mobile horizontal scroll drag support (smooth mouse navigation for desktop previewers)
  const navScrollContainer = document.querySelector('header nav:not(#mobileNav)');
  if (navScrollContainer) {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    navScrollContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - navScrollContainer.offsetLeft;
      scrollStart = navScrollContainer.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    navScrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - navScrollContainer.offsetLeft;
      navScrollContainer.scrollLeft = scrollStart - (x - startX);
    });
  }

  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'OMNI_CUSTOMIZE') {
      applyStudioCustomization(e.data);
    }
  });

  try {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const color = hashParams.get('color');
    const font = hashParams.get('font');
    const brand = hashParams.get('brand');
    if (color || font || brand) {
      applyStudioCustomization({ color, font, brandName: brand });
    }
  } catch (err) {}

});
