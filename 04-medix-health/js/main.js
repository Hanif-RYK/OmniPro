/**
 * Medix Health - Commercial Front-End Script
 * Author: Medix Clinical Systems
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

  // 5. Interactive Doctor Booking System (Services / Booking Page)
  const bookingForm = document.getElementById('appointmentBookingForm');
  if (bookingForm) {
    const departmentSelect = document.getElementById('bookingDepartment');
    const doctorSelect = document.getElementById('bookingDoctor');
    const bookingDate = document.getElementById('bookingDate');
    const slotButtons = document.querySelectorAll('[data-slot-time]');
    const bookingReceipt = document.getElementById('bookingReceipt');
    const receiptDoctor = document.getElementById('receiptDoctor');
    const receiptDept = document.getElementById('receiptDept');
    const receiptDateTime = document.getElementById('receiptDateTime');
    const receiptCode = document.getElementById('receiptCode');
    const selectedSlotInput = document.getElementById('selectedSlotTime');

    // Doctors by department
    const doctorsData = {
      cardiology: [
        { id: 'dr-chen', name: 'Dr. Evelyn Chen, MD, FACC (Cardiology Lead)' },
        { id: 'dr-marcus', name: 'Dr. Marcus Vance, MD (Interventional Cardiology)' }
      ],
      neurology: [
        { id: 'dr-arora', name: 'Dr. Priya Arora, MD (Chief of Neurology)' },
        { id: 'dr-holloway', name: 'Dr. Thomas Holloway, MD (Spine & Neurovascular)' }
      ],
      orthopedics: [
        { id: 'dr-sanders', name: 'Dr. Robert Sanders, MD (Sports Medicine)' },
        { id: 'dr-kim', name: 'Dr. Sarah Kim, MD (Joint Reconstruction)' }
      ],
      pediatrics: [
        { id: 'dr-foster', name: 'Dr. Claire Foster, MD (Pediatric Medicine)' }
      ],
      general: [
        { id: 'dr-wright', name: 'Dr. David Wright, MD (Internal Medicine)' }
      ]
    };

    if (departmentSelect && doctorSelect) {
      departmentSelect.addEventListener('change', () => {
        const dept = departmentSelect.value;
        doctorSelect.innerHTML = '<option value="">Select physician...</option>';
        if (doctorsData[dept]) {
          doctorsData[dept].forEach((doc) => {
            const opt = document.createElement('option');
            opt.value = doc.name;
            opt.textContent = doc.name;
            doctorSelect.appendChild(opt);
          });
          doctorSelect.selectedIndex = 1;
        }
      });
    }

    // Initialize minimum date as today
    if (bookingDate) {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      bookingDate.min = today;
      if (!bookingDate.value) {
        bookingDate.value = today;
      }
    }

    // Time slot button selection
    slotButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        slotButtons.forEach((b) => {
          b.classList.remove('bg-teal-600', 'text-white', 'border-teal-600');
          b.classList.add('bg-white', 'text-slate-700', 'border-slate-300');
        });
        btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-300');
        btn.classList.add('bg-teal-600', 'text-white', 'border-teal-600');
        if (selectedSlotInput) {
          selectedSlotInput.value = btn.getAttribute('data-slot-time');
        }
      });
    });

    // Form submission
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patientName');
      const patientPhone = document.getElementById('patientPhone');
      const selectedSlot = selectedSlotInput ? selectedSlotInput.value : '10:00 AM';

      if (!patientName || !patientName.value.trim()) {
        if (patientName) {
          patientName.setCustomValidity('Please provide patient name.');
          patientName.reportValidity();
          patientName.addEventListener('input', () => patientName.setCustomValidity(''), { once: true });
        }
        return;
      }
      if (!doctorSelect || !doctorSelect.value) {
        if (doctorSelect) {
          doctorSelect.setCustomValidity('Please select a physician.');
          doctorSelect.reportValidity();
          doctorSelect.addEventListener('change', () => doctorSelect.setCustomValidity(''), { once: true });
        }
        return;
      }

      
      /* 
       * ─────────────────────────────────────────────────────────────
       * 🔌 APPOINTMENT BOOKING ENDPOINT INTEGRATION
       * ─────────────────────────────────────────────────────────────
       * The booking system creates a local confirmation receipt with refCode.
       * To sync appointments with your CRM, Google Calendar, or database:
       * 
       * fetch('https://api.yourclinic.com/v1/appointments', {
       *   method: 'POST',
       *   headers: { 'Content-Type': 'application/json' },
       *   body: JSON.stringify({
       *     refCode,
       *     patientName: patientName.value.trim(),
       *     patientPhone: patientPhone.value.trim(),
       *     department: departmentSelect.value,
       *     doctor: doctorSelect.value,
       *     date: dateVal,
       *     slot: selectedSlot
       *   })
       * });
       * ─────────────────────────────────────────────────────────────
       */

      const refCode = 'MDX-' + Math.floor(100000 + Math.random() * 900000);
      const dateVal = bookingDate ? bookingDate.value : 'Upcoming';

      if (receiptDoctor) receiptDoctor.textContent = doctorSelect.value;
      if (receiptDept) receiptDept.textContent = departmentSelect.options[departmentSelect.selectedIndex].text;
      if (receiptDateTime) receiptDateTime.textContent = `${dateVal} at ${selectedSlot}`;
      if (receiptCode) receiptCode.textContent = refCode;

      if (bookingReceipt) {
        bookingReceipt.classList.remove('hidden');
        bookingReceipt.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      bookingForm.reset();
      if (bookingDate) bookingDate.value = bookingDate.min;
      if (departmentSelect) {
        departmentSelect.dispatchEvent(new Event('change'));
      }
    });
  }

  // 6. Medical Clinic Contact & Inquiries Form Validation
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
        setFieldError(nameInput, nameError, 'Please enter patient / guardian name.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearFieldError(nameInput, nameError);
      }

      if (!emailInput.value.trim()) {
        setFieldError(emailInput, emailError, 'Contact email address is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, subjectError, 'Please select a clinical department or inquiry area.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = subjectInput;
      } else {
        clearFieldError(subjectInput, subjectError);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(messageInput, messageError, 'Please summarize your consultation symptoms, timeframe, or medical inquiry (minimum 10 characters).');
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
        submitBtn.innerHTML = '<span>Submitting Consultation Request...</span>';
      }

      setTimeout(() => {
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
          formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Clinical Consultation</span> <span aria-hidden="true">→</span>';
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
