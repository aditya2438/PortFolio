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
  var heroCopyItems = document.querySelectorAll(
    '.hero-copy .badge, .hero-title, .hero-role, .hero-lede, .hero-ctas, .hero-links'
  );
  var heroVisual = document.querySelector('[data-reveal="hero-visual"]');

  if (window.gsap && !prefersReducedMotion) {
    gsap.set(heroCopyItems, { opacity: 0, y: 28 });
    if (heroVisual) gsap.set(heroVisual, { opacity: 0, y: 36, scale: 0.98 });

    var heroTl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });
    heroTl.to(heroCopyItems, { opacity: 1, y: 0, duration: 0.85, stagger: 0.09 });
    if (heroVisual) heroTl.to(heroVisual, { opacity: 1, y: 0, scale: 1, duration: 0.95 }, '-=0.55');

    /* Subtle ambient scroll-linked parallax on the gradient background orbs */
    if (window.ScrollTrigger) {
      gsap.to('.orb-violet', { y: 160, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
      gsap.to('.orb-blue', { y: -190, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
      gsap.to('.orb-mint', { y: 120, x: 50, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
      gsap.to('.orb-silver', { y: 80, x: -70, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
    }
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
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

  /* ======================== Interactive Code Terminal Studio ======================== */
  var terminalTabs = document.querySelectorAll('.terminal-tab');
  var terminalBodies = document.querySelectorAll('.terminal-body');
  var copyCodeBtn = document.getElementById('copyCodeBtn');

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

