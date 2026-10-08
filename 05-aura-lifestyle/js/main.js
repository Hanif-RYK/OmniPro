/**
 * Aura Lifestyle - Commercial Front-End Script & Cart Engine
 * Author: Aura Lifestyle Design Systems
 * Licensed for Commercial Distribution
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Accessible Mobile Menu Navigation ───
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

    document.addEventListener('click', (event) => {
      if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
        mobileMenuBtn.focus();
      }
    });
  }

  // ─── 2. Smooth In-Page Anchor Scrolling ───
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

  // ─── 3. Scroll Reveal Observer ───
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

  // ─── 4. Interactive Cart Drawer & State Management ───
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartTriggerBtns = document.querySelectorAll('[data-cart-trigger]');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartCountEls = document.querySelectorAll('[data-cart-count]');
  const cartHeaderCount = document.getElementById('cartHeaderCount');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutSuccess = document.getElementById('checkoutSuccess');

  // Load initial cart from sessionStorage
  let cart = [];
  try {
    const saved = sessionStorage.getItem('aura_cart');
    if (saved) {
      cart = JSON.parse(saved);
    } else {
      cart = [
        { id: 'komorebi-set', name: 'Komorebi Pour-Over Set', price: 78, quantity: 1, category: 'ceramics' }
      ];
    }
  } catch (e) {
    cart = [{ id: 'komorebi-set', name: 'Komorebi Pour-Over Set', price: 78, quantity: 1, category: 'ceramics' }];
  }

  const saveCart = () => {
    try {
      sessionStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {}
  };

  const openCart = () => {
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.remove('drawer-backdrop-closed');
      cartDrawer.classList.remove('drawer-closed');
      document.body.style.overflow = 'hidden';
      if (closeCartBtn) closeCartBtn.focus();
    }
  };

  const closeCart = () => {
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.add('drawer-backdrop-closed');
      cartDrawer.classList.add('drawer-closed');
      document.body.style.overflow = '';
    }
  };

  if (cartTriggerBtns) {
    cartTriggerBtns.forEach((btn) => btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    }));
  }

  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && !cartDrawer.classList.contains('drawer-closed')) {
      closeCart();
    }
  });

  const renderCart = () => {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update counter badges
    cartCountEls.forEach((el) => {
      el.textContent = totalCount;
      if (totalCount > 0) {
        el.classList.remove('scale-0');
        el.classList.add('scale-100');
      } else {
        el.classList.add('scale-0');
      }
    });

    if (cartHeaderCount) {
      cartHeaderCount.textContent = totalCount === 1 ? '1 item' : `${totalCount} items`;
    }

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="py-12 text-center text-slate-400">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-2xl">🛍️</div>
          <p class="text-sm font-semibold text-slate-700">Your bag is empty</p>
          <p class="text-xs text-slate-400 mt-1">Discover handcrafted artisanal goods in our collections.</p>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cartItemsContainer.innerHTML = cart.map((item) => `
      <div class="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4 transition-all">
        <div class="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-2xl flex-shrink-0">
          ${item.category === 'ceramics' ? '🏺' : item.category === 'apparel' ? '👘' : '💡'}
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-slate-900 truncate font-display">${item.name}</h4>
          <span class="text-xs font-semibold text-primary block mt-0.5">$${item.price.toFixed(2)}</span>
          <div class="flex items-center gap-3 mt-2">
            <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50">
              <button type="button" data-qty-btn="minus" data-id="${item.id}" aria-label="Decrease quantity" class="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-200 rounded-l transition-colors">−</button>
              <span class="px-2 py-0.5 text-xs font-semibold text-slate-800">${item.quantity}</span>
              <button type="button" data-qty-btn="plus" data-id="${item.id}" aria-label="Increase quantity" class="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-200 rounded-r transition-colors">+</button>
            </div>
            <button type="button" data-remove-item="${item.id}" class="text-[11px] text-rose-500 hover:text-rose-700 font-medium transition-colors">Remove</button>
          </div>
        </div>
        <div class="text-right flex-shrink-0 font-bold text-sm text-slate-900">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    `).join('');

    // Attach quantity event listeners
    cartItemsContainer.querySelectorAll('[data-qty-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-qty-btn');
        const targetItem = cart.find((i) => i.id === id);
        if (targetItem) {
          if (action === 'plus') {
            targetItem.quantity += 1;
          } else if (action === 'minus') {
            targetItem.quantity -= 1;
            if (targetItem.quantity <= 0) {
              cart = cart.filter((i) => i.id !== id);
            }
          }
          saveCart();
          renderCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('[data-remove-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove-item');
        cart = cart.filter((i) => i.id !== id);
        saveCart();
        renderCart();
      });
    });
  };

  // Add to Cart Buttons
  document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price')) || 0;
      const category = btn.getAttribute('data-category') || 'general';

      const existing = cart.find((i) => i.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1, category });
      }

      saveCart();
      renderCart();

      // Visual feedback on button
      const origText = btn.innerHTML;
      btn.innerHTML = '<span>Added to Bag ✓</span>';
      btn.classList.add('bg-emerald-600');
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.classList.remove('bg-emerald-600');
        openCart();
      }, 400);
    });
  });

  // Simulated Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Processing Order...';

      setTimeout(() => {
        cart = [];
        saveCart();
        renderCart();
        if (checkoutSuccess) {
          checkoutSuccess.classList.remove('hidden');
          setTimeout(() => {
            checkoutSuccess.classList.add('hidden');
            closeCart();
          }, 2500);
        }
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
      }, 1000);
    });
  }

  // Initial cart render
  renderCart();

  // ─── 5. Interactive Category Filter (Services / Catalog Page) ───
  const categoryTabs = document.querySelectorAll('[data-category-tab]');
  const productCards = document.querySelectorAll('[data-product-card]');

  if (categoryTabs.length > 0 && productCards.length > 0) {
    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetCategory = tab.getAttribute('data-category-tab');

        // Update active tab styling
        categoryTabs.forEach((t) => {
          t.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30');
          t.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
        });
        tab.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
        tab.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30');

        // Filter cards with smooth fade
        productCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (targetCategory === 'all' || cardCategory === targetCategory) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // ─── 6. Client-Side Contact / Concierge Form Validation ───
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
      let firstInvalid = null;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, nameError, 'Please enter your full name.');
        isValid = false;
        if (!firstInvalid) firstInvalid = nameInput;
      } else {
        clearFieldError(nameInput, nameError);
      }

      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, emailError, 'Please provide a valid email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, subjectError, 'Please select an inquiry topic.');
        isValid = false;
        if (!firstInvalid) firstInvalid = subjectInput;
      } else {
        clearFieldError(subjectInput, subjectError);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(messageInput, messageError, 'Please provide message details (minimum 10 characters).');
        isValid = false;
        if (!firstInvalid) firstInvalid = messageInput;
      } else {
        clearFieldError(messageInput, messageError);
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      
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

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Transmitting Concierge Request...</span>';
      }

      setTimeout(() => {
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
          formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Inquiries</span> <span aria-hidden="true">→</span>';
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
      document.title = data.brandName + ' | Modern Lifestyle Store';
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
