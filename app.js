/* ==========================================================================
   Aditya Chouhan — Luxury Portfolio Interactions & Micro-physics
   Resilient vanilla JavaScript. All enhancements fail soft if CDN libraries
   are blocked or fail to load.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ------------------------------ Lucide Icons ---------------------------------- */
  function initIcons() {
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
  initIcons();

  /* ------------------------------ Footer Year ----------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================ Hero Role Typewriter ============================ */
  var roleRotator = document.getElementById('roleRotator');
  if (roleRotator) {
    var roles = [
      'Java Developer (Fresher)',
      'Spring Boot 3.3 Engineer',
      'Backend & Microservices Builder',
      'Relational Schemas & 3NF Specialist',
      'Kafka Streams & Redis Caching'
    ];
    var currentRoleIdx = 0;
    var currentCharIdx = roles[0].length;
    var isDeleting = true;
    var typeSpeed = 70;

    function tickRole() {
      var fullText = roles[currentRoleIdx];

      if (isDeleting) {
        currentCharIdx--;
      } else {
        currentCharIdx++;
      }

      roleRotator.textContent = fullText.substring(0, currentCharIdx);

      var nextDelay = isDeleting ? 30 : typeSpeed;

      if (!isDeleting && currentCharIdx === fullText.length) {
        nextDelay = 2200;
        isDeleting = true;
      } else if (isDeleting && currentCharIdx === 0) {
        isDeleting = false;
        currentRoleIdx = (currentRoleIdx + 1) % roles.length;
        nextDelay = 400;
      }

      setTimeout(tickRole, nextDelay);
    }

    setTimeout(tickRole, 2000);
  }

  /* ===================== Smooth Scrolling (Lenis + GSAP) =================== */
  var lenis = null;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    if (window.gsap) {
      lenis.on('scroll', function () {
        if (window.ScrollTrigger) ScrollTrigger.update();
      });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      });
    }
  }

  function scrollToTarget(target) {
    var offset = -84;
    if (lenis) {
      lenis.scrollTo(target, { offset: offset });
    } else {
      var top = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }

  /* In-page anchor links: close drawer if open and scroll smoothly */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeDrawer();
    scrollToTarget(target);
    history.pushState(null, '', id);
  });

  /* ============================ Mobile Drawer Navigation ============================= */
  var drawer = document.getElementById('mobileDrawer');
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var focusTarget = menuClose || drawer.querySelector('a, button');
    if (focusTarget) focusTarget.focus();
  }

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.focus();
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (menuClose) menuClose.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ======================= Active Nav Link on Scroll ======================= */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ============================ Scroll Reveal Animations ============================ */
  var revealEls = document.querySelectorAll('[data-reveal="section"]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ===================== Hero Load-in Orchestration ===================== */
  var heroCopy = document.querySelector('.hero-copy');
  var heroVisual = document.querySelector('.hero-visual');

  if (window.gsap && !prefersReducedMotion) {
    if (heroCopy && heroCopy.children.length) {
      gsap.from(heroCopy.children, {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }
    if (heroVisual) {
      gsap.from(heroVisual, {
        opacity: 0,
        y: 30,
        scale: 0.98,
        duration: 0.95,
        delay: 0.2,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }

    /* Subtle ambient scroll-linked parallax on the gradient background orbs */
    if (window.ScrollTrigger) {
      gsap.to('.orb-violet', { y: 160, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
      gsap.to('.orb-blue', { y: -190, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
      gsap.to('.orb-mint', { y: 120, x: 50, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
      gsap.to('.orb-silver', { y: 80, x: -70, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
    }
  }

  /* =============================== Interactive Ambient Cursor Glow ========================= */
  if (!isTouch && !prefersReducedMotion) {
    var cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    var curX = window.innerWidth / 2;
    var curY = window.innerHeight / 2;
    var targetX = curX;
    var targetY = curY;

    window.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      cursorGlow.style.opacity = '0';
    });

    function renderCursor() {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      cursorGlow.style.transform = 'translate3d(' + (curX - 240) + 'px, ' + (curY - 240) + 'px, 0)';
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  /* =============================== Magnetic Button Physics ========================= */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var strength = 0.25;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* =============================== Spotlight Glow Physics ============================ */
  if (!isTouch) {
    document.querySelectorAll('.spotlight').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ================================ 3D Parallax Tilt Cards ============================= */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.project-card.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(1100px) rotateX(' + (-py * 5) + 'deg) rotateY(' + (px * 6) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ======================== Interactive Floating Code Terminal ======================== */
  var termModal = document.getElementById('termModal');
  var floatingTermBtn = document.getElementById('floatingTermBtn');
  var heroOpenTerminalBtn = document.getElementById('heroOpenTerminalBtn');
  var termCloseDot = document.getElementById('termCloseDot');
  var terminalTabs = document.querySelectorAll('.terminal-tab');
  var terminalBodies = document.querySelectorAll('.terminal-body');
  var copyCodeBtn = document.getElementById('copyCodeBtn');

  function openTermModal() {
    if (!termModal) return;
    termModal.classList.add('open');
    termModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeTermModal() {
    if (!termModal || !termModal.classList.contains('open')) return;
    termModal.classList.remove('open');
    termModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (floatingTermBtn) floatingTermBtn.addEventListener('click', openTermModal);
  if (heroOpenTerminalBtn) heroOpenTerminalBtn.addEventListener('click', openTermModal);
  if (termCloseDot) termCloseDot.addEventListener('click', closeTermModal);

  if (termModal) {
    termModal.addEventListener('click', function (e) {
      if (e.target === termModal) closeTermModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && termModal && termModal.classList.contains('open')) {
      closeTermModal();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 't') {
      e.preventDefault();
      if (termModal && termModal.classList.contains('open')) {
        closeTermModal();
      } else {
        openTermModal();
      }
    }
  });

  terminalTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = tab.getAttribute('data-tab');
      terminalTabs.forEach(function (t) {
        var isTarget = t === tab;
        t.classList.toggle('active', isTarget);
        t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });
      terminalBodies.forEach(function (body) {
        body.classList.toggle('active', body.id === targetId);
      });
    });
  });

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', function () {
      var activeBody = document.querySelector('.terminal-body.active');
      if (!activeBody) return;
      var codeText = activeBody.textContent;

      var onCopied = function () {
        copyCodeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ee3c0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(function () {
          copyCodeBtn.innerHTML = '<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeText).then(onCopied).catch(onCopied);
      } else {
        var ta = document.createElement('textarea');
        ta.value = codeText;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
        onCopied();
      }
    });
  }

  /* ============================ Skills Filter Bar ============================ */
  var filterButtons = document.querySelectorAll('.filter-pill');
  var skillTiles = document.querySelectorAll('.skill-tile');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });

      skillTiles.forEach(function (tile) {
        var category = tile.getAttribute('data-category');
        var match = filter === 'all' || category === filter;
        tile.classList.toggle('dimmed', !match);
      });
    });
  });

  /* ============================ Skills Ecosystem Highlight ==================== */
  var chips = document.querySelectorAll('.chip[data-tags]');
  function linkChips(activeChip) {
    var tags = (activeChip.dataset.tags || '').split(' ');
    chips.forEach(function (chip) {
      var chipTags = (chip.dataset.tags || '').split(' ');
      var shares = chipTags.some(function (t) { return tags.indexOf(t) !== -1; });
      chip.classList.toggle('is-linked', shares);
      chip.classList.toggle('is-dimmed', !shares);
    });
  }
  function unlinkChips() {
    chips.forEach(function (chip) { chip.classList.remove('is-linked', 'is-dimmed'); });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('mouseenter', function () { linkChips(chip); });
    chip.addEventListener('focus', function () { linkChips(chip); });
    chip.addEventListener('mouseleave', unlinkChips);
    chip.addEventListener('blur', unlinkChips);
    chip.setAttribute('tabindex', '0');
  });

  /* ======================== Interactive REST API Playground ======================== */
  var apiTabs = document.querySelectorAll('.api-tab');
  var apiResponseBody = document.getElementById('apiResponseBody');
  var apiLatencyVal = document.getElementById('apiLatencyVal');
  var copyApiJsonBtn = document.getElementById('copyApiJsonBtn');

  var apiData = {
    'faircart-checkout': {
      latency: '18ms Latency',
      json: '{\n  "status": "SUCCESS",\n  "httpCode": 200,\n  "transactionId": "tx_kafka_fc8912e7",\n  "order": {\n    "orderId": 1042,\n    "userId": 8419,\n    "status": "DISPATCHED_TO_KAFKA",\n    "topic": "order-dispatch-events",\n    "partition": 2,\n    "offset": 48102,\n    "cachedInRedis": true,\n    "totalAmount": 2499.00,\n    "currency": "INR",\n    "pessimisticLockAcquired": true,\n    "lockHoldDurationMs": 4.2\n  },\n  "timestamp": "2026-09-02T16:45:12.802Z"\n}'
    },
    'fixora-nearby': {
      latency: '14ms Latency',
      json: '{\n  "status": "SUCCESS",\n  "httpCode": 200,\n  "queryCoordinates": {\n    "latitude": 23.1793,\n    "longitude": 75.7849,\n    "searchRadiusKm": 15.0,\n    "cityCluster": "Ujjain"\n  },\n  "totalProvidersFound": 2,\n  "providers": [\n    {\n      "providerId": "PRO_772",\n      "name": "Mahakal Electricals & AC Solutions",\n      "distanceKm": 1.42,\n      "rating": 4.9,\n      "slotAvailability": "AVAILABLE_IMMEDIATE"\n    },\n    {\n      "providerId": "PRO_804",\n      "name": "Indore Plumbing Express Hub",\n      "distanceKm": 4.85,\n      "rating": 4.8,\n      "slotAvailability": "SLOT_RESERVED"\n    }\n  ]\n}'
    },
    'auth-jwt': {
      latency: '22ms Latency',
      json: '{\n  "status": "AUTHENTICATED",\n  "httpCode": 200,\n  "tokenType": "Bearer",\n  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eWEiLCJyb2xlcyI6WyJST0xFX0JBQ0tFTkQiXX0...",\n  "expiresInSeconds": 86400,\n  "principal": {\n    "username": "aditya.dev",\n    "roles": ["ROLE_BACKEND_ENGINEER"],\n    "permissions": ["READ_CATALOG", "PROCESS_ORDER", "EXECUTE_TRANSACTIONS"]\n  },\n  "securityEngine": "Spring Security 6.3 + JJWT"\n}'
    }
  };

  function renderApiResponse(endpointKey) {
    if (!apiResponseBody) return;
    var data = apiData[endpointKey] || apiData['faircart-checkout'];
    if (apiLatencyVal) apiLatencyVal.textContent = data.latency;
    
    var formatted = data.json
      .replace(/"(.*?)":/g, '<span class="c-type">"$1"</span>:')
      .replace(/: ("[^"]*")/g, ': <span class="c-str">$1</span>')
      .replace(/: (true|false)/g, ': <span class="c-kw">$1</span>')
      .replace(/: (\d+(\.\d+)?)/g, ': <span class="c-mint">$1</span>');
    apiResponseBody.innerHTML = '<code>' + formatted + '</code>';
  }

  if (apiTabs.length > 0) {
    renderApiResponse('faircart-checkout');
    apiTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-endpoint');
        apiTabs.forEach(function (t) {
          var isTarget = t === tab;
          t.classList.toggle('active', isTarget);
          t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });
        renderApiResponse(key);
      });
    });
  }

  if (copyApiJsonBtn) {
    copyApiJsonBtn.addEventListener('click', function () {
      var activeTab = document.querySelector('.api-tab.active');
      var key = activeTab ? activeTab.getAttribute('data-endpoint') : 'faircart-checkout';
      var text = (apiData[key] || {}).json || '';
      
      var onCopied = function () {
        copyApiJsonBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ee3c0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(function () {
          copyApiJsonBtn.innerHTML = '<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onCopied).catch(onCopied);
      }
    });
  }

  /* ================================ Copy Email to Clipboard ================================ */
  var copyEmailBtn = document.getElementById('copyEmailBtn');
  var liveRegion = document.getElementById('liveRegion');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      var emailEl = document.getElementById('emailText');
      var email = emailEl ? emailEl.textContent.trim() : 'adityachouhan2446@gmail.com';
      var announce = function (msg) { if (liveRegion) liveRegion.textContent = msg; };

      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
      }

      var showCopied = function () {
        copyEmailBtn.classList.add('copied');
        announce('Email address copied to clipboard');
        setTimeout(function () { copyEmailBtn.classList.remove('copied'); }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(function () {
          fallbackCopy();
          showCopied();
        });
      } else {
        fallbackCopy();
        showCopied();
      }
    });
  }

  /* ================================ Live Station Clock (IST) ================================ */
  var timeEl = document.getElementById('localTime');
  function tickClock() {
    if (!timeEl) return;
    var now = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    timeEl.textContent = now;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ============================ Resume Download Confetti Trigger ====================== */
  var resumeButtons = [
    document.getElementById('resumeBtnNav'),
    document.getElementById('resumeBtnHero'),
    document.getElementById('resumeBtnDrawer'),
  ].filter(Boolean);

  resumeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.confetti && !prefersReducedMotion) {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#8b7cf6', '#5b8cff', '#7ee3c0', '#e7e9ee'],
          disableForReducedMotion: true,
        });
      }
    });
  });

  /* ============================ Scroll Progress Bar ============================ */
  var scrollProgressEl = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgressEl) return;
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    scrollProgressEl.style.width = scrolled + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ============================ Command Palette (⌘K) ============================ */
  var cmdModal = document.getElementById('cmdModal');
  var cmdBtn = document.getElementById('cmdPaletteBtn');
  var cmdInput = document.getElementById('cmdInput');
  var cmdList = document.getElementById('cmdList');
  var cmdCopyEmail = document.getElementById('cmdCopyEmail');

  function openCmdPalette() {
    if (!cmdModal) return;
    cmdModal.classList.add('open');
    cmdModal.setAttribute('aria-hidden', 'false');
    if (cmdInput) {
      cmdInput.value = '';
      filterCmdItems('');
      setTimeout(function () { cmdInput.focus(); }, 50);
    }
    document.body.style.overflow = 'hidden';
  }

  function closeCmdPalette() {
    if (!cmdModal || !cmdModal.classList.contains('open')) return;
    cmdModal.classList.remove('open');
    cmdModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function filterCmdItems(query) {
    if (!cmdList) return;
    var q = (query || '').toLowerCase().trim();
    var items = cmdList.querySelectorAll('.cmd-item');
    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var match = !q || text.indexOf(q) !== -1;
      item.style.display = match ? 'flex' : 'none';
    });
  }

  if (cmdBtn) cmdBtn.addEventListener('click', openCmdPalette);
  if (cmdInput) {
    cmdInput.addEventListener('input', function (e) {
      filterCmdItems(e.target.value);
    });
  }

  if (cmdModal) {
    cmdModal.addEventListener('click', function (e) {
      if (e.target === cmdModal) closeCmdPalette();
    });
  }

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal && cmdModal.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      closeCmdPalette();
    }
  });

  if (cmdList) {
    cmdList.addEventListener('click', function (e) {
      var link = e.target.closest('.cmd-item');
      if (!link) return;
      if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
        closeCmdPalette();
      }
    });
  }

  var cmdLaunchTerminal = document.getElementById('cmdLaunchTerminal');
  if (cmdLaunchTerminal) {
    cmdLaunchTerminal.addEventListener('click', function () {
      closeCmdPalette();
      setTimeout(openTermModal, 150);
    });
  }

  if (cmdCopyEmail) {
    cmdCopyEmail.addEventListener('click', function () {
      var email = 'adityachouhan2446@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email);
      }
      if (liveRegion) liveRegion.textContent = 'Email address copied to clipboard';
      closeCmdPalette();
    });
  }

  /* ============================ Dynamic Tab Title on Blur ============================== */
  var originalTitle = document.title;
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? 'Come back? 👋 — Aditya Chouhan' : originalTitle;
  });

  /* ============================ Live Background Particle Canvas ============================ */
  var bgCanvas = document.getElementById('bgCanvas');
  if (bgCanvas && !prefersReducedMotion) {
    var ctx = bgCanvas.getContext('2d');
    var particles = [];
    var particleCount = window.innerWidth < 768 ? 38 : 72;
    var mouse = { x: -9999, y: -9999, radius: 160 };
    var animationFrameId = null;
    var time = 0;

    function resizeCanvas() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });

    var colors = [
      'rgba(56, 189, 248, ',   // sky cyan
      'rgba(168, 85, 247, ',  // neon violet
      'rgba(52, 211, 153, ',  // mint emerald
      'rgba(251, 191, 36, ',  // radiant amber
      'rgba(244, 114, 182, '  // neon rose
    ];

    function createParticle() {
      return {
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2.2 + 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.4 + 0.35,
        pulse: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.025 + 0.015,
        driftPhase: Math.random() * Math.PI * 2
      };
    }

    for (var p = 0; p < particleCount; p++) {
      particles.push(createParticle());
    }

    function renderParticles() {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      var w = bgCanvas.width;
      var h = bgCanvas.height;
      time += 0.015;

      // Update and draw particles
      for (var i = 0; i < particles.length; i++) {
        var pt = particles[i];

        // Fluid organic floating motion
        pt.x += pt.vx + Math.sin(time + pt.driftPhase) * 0.25;
        pt.y += pt.vy + Math.cos(time + pt.driftPhase) * 0.25;
        pt.pulse += pt.pulseSpeed;

        if (pt.x < -20) pt.x = w + 20;
        if (pt.x > w + 20) pt.x = -20;
        if (pt.y < -20) pt.y = h + 20;
        if (pt.y > h + 20) pt.y = -20;

        // Interactive mouse physics
        var dx = pt.x - mouse.x;
        var dy = pt.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          var force = (mouse.radius - dist) / mouse.radius;
          pt.x += (dx / dist) * force * 2.2;
          pt.y += (dy / dist) * force * 2.2;
        }

        var currentAlpha = pt.baseAlpha + Math.sin(pt.pulse) * 0.2;
        var alphaSafe = Math.max(0.15, Math.min(0.9, currentAlpha));

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color + alphaSafe + ')';
        ctx.shadowColor = pt.color + '0.8)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw constellation connections
      var maxConnectDist = w < 768 ? 95 : 130;
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var p1 = particles[i];
          var p2 = particles[j];
          var cdx = p1.x - p2.x;
          var cdy = p1.y - p2.y;
          var cDist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cDist < maxConnectDist) {
            var lineAlpha = (1 - cDist / maxConnectDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(147, 197, 253, ' + lineAlpha + ')';
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderParticles);
    }

    renderParticles();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(renderParticles);
      }
    });
  }

  /* ================================ Back to Top Trigger ================================ */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  }

})();

