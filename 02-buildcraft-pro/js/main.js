/**
 * BuildCraft Pro - Commercial Front-End Script
 * Author: BuildCraft Pro Design Systems
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

  // 5. Interactive Construction Project Cost Estimator Calculator
  const estimator = document.getElementById('constructionEstimator');
  if (estimator) {
    const projectType = document.getElementById('projectType');
    const squareFootage = document.getElementById('squareFootage');
    const sqftDisplay = document.getElementById('sqftDisplay');
    const qualityTier = document.getElementById('qualityTier');
    const estimatedCostRange = document.getElementById('estimatedCostRange');
    const estimatedDuration = document.getElementById('estimatedDuration');
    const structuralEstimate = document.getElementById('structuralEstimate');

    const updateEstimate = () => {
      const type = projectType ? projectType.value : 'commercial';
      const sqft = squareFootage ? parseInt(squareFootage.value, 10) : 25000;
      const tier = qualityTier ? qualityTier.value : 'standard';

      if (sqftDisplay) {
        sqftDisplay.textContent = `${sqft.toLocaleString()} sq. ft.`;
      }

      // Cost per sq ft based on type
      let baseRate = 180; // Commercial
      let monthFactor = 0.00035;

      if (type === 'industrial') {
        baseRate = 145;
        monthFactor = 0.00028;
      } else if (type === 'residential') {
        baseRate = 220;
        monthFactor = 0.00042;
      } else if (type === 'civic') {
        baseRate = 290;
        monthFactor = 0.00048;
      }

      // Quality tier multiplier
      let tierMultiplier = 1.0;
      if (tier === 'premium') {
        tierMultiplier = 1.25;
      } else if (tier === 'leed') {
        tierMultiplier = 1.45;
      }

      const totalBase = sqft * baseRate * tierMultiplier;
      const lowRange = Math.round((totalBase * 0.92) / 10000) * 10000;
      const highRange = Math.round((totalBase * 1.12) / 10000) * 10000;

      const formatCurrency = (val) => {
        if (val >= 1000000) {
          return `$${(val / 1000000).toFixed(2)}M`;
        }
        return `$${(val / 1000).toFixed(0)}k`;
      };

      if (estimatedCostRange) {
        estimatedCostRange.textContent = `${formatCurrency(lowRange)} - ${formatCurrency(highRange)}`;
      }

      const months = Math.max(4, Math.round(6 + (sqft * monthFactor * tierMultiplier)));
      if (estimatedDuration) {
        estimatedDuration.textContent = `${months} - ${months + 3} Months`;
      }

      if (structuralEstimate) {
        const steelTons = Math.round(sqft * 0.0048 * tierMultiplier);
        structuralEstimate.textContent = `~${steelTons} tons steel / ${(sqft * 0.04).toFixed(0)} yd³ concrete`;
      }
    };

    [projectType, squareFootage, qualityTier].forEach((control) => {
      if (control) {
        control.addEventListener('input', updateEstimate);
        control.addEventListener('change', updateEstimate);
      }
    });

    updateEstimate();
  }

  // 6. Construction Tender / Inquiry Form Validation
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
        setFieldError(nameInput, nameError, 'Please enter project contact name (minimum 2 characters).');
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
        setFieldError(emailInput, emailError, 'Please enter a valid commercial email address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, subjectError, 'Please select a construction / project discipline.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = subjectInput;
      } else {
        clearFieldError(subjectInput, subjectError);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(messageInput, messageError, 'Please provide project specifications, site location, or scope (minimum 10 characters).');
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
        submitBtn.innerHTML = '<span>Submitting Tender Details...</span>';
      }

      setTimeout(() => {
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
          formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Project Tender</span> <span aria-hidden="true">→</span>';
        }
      }, 500);
    });
  }


  // ─── OmniPro Live Studio Customizer Listener (postMessage + Smooth Navigation) ───
  function applyStudioCustomization(data) {
    if (!data) return;
    // Values come from the URL hash or another window, so accept safe formats only.
    if (data.color && !/^#[0-9a-f]{3,8}$/i.test(data.color)) data.color = null;
    if (data.font && !/^[a-z0-9 ]{1,40}$/i.test(data.font)) data.font = null;
    if (data.brandName) data.brandName = String(data.brandName).slice(0, 60);
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
    // Only the OmniPro preview hub (the parent frame) may customize this page.
    if (window.parent === window || e.source !== window.parent) return;
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
