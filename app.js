/* ==========================================================================
   Aditya Chouhan — Luxury Portfolio Interactions & Micro-physics
   Resilient vanilla JavaScript. All enhancements fail soft if CDN libraries
   are blocked or fail to load.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ------------------------------ Startup Scheduler ----------------------------- */
  var deferredStartups = [];
  var deferredStarted = false;
  var preloader = document.getElementById('preloader');
  var preloaderActive = Boolean(preloader);

  function runAfterPreloader(fn) {
    if (typeof fn !== 'function') return;
    if (!preloaderActive || deferredStarted) {
      fn();
    } else {
      deferredStartups.push(fn);
    }
  }

  function flushDeferredStartups() {
    if (deferredStarted) return;
    deferredStarted = true;
    while (deferredStartups.length) {
      var fn = deferredStartups.shift();
      try { fn(); } catch (_) {}
    }
  }

  /* ------------------------------ Lucide Icons ---------------------------------- */
  var iconsInitialized = false;
  function initIcons() {
    if (iconsInitialized) return;
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
      iconsInitialized = true;
    }
  }
  if (!preloaderActive) {
    initIcons();
  }

  /* ==========================================================================
     STARTING AURORA ORBITAL KINETIC WORDMARK & 3D APERTURE PRELOADER
     ========================================================================== */
  var preloaderCurtainLeft = document.getElementById('preloaderCurtainLeft');
  var preloaderCurtainRight = document.getElementById('preloaderCurtainRight');
  var preloaderAurora = document.getElementById('preloaderAurora');
  var preloaderGrid = document.getElementById('preloaderGrid');
  var preloaderSpot = document.getElementById('preloaderSpot');
  var preloaderOrbits = document.getElementById('preloaderOrbits');
  var preloaderLaser = document.getElementById('preloaderLaser');
  var preloaderSeam = document.getElementById('preloaderSeam');
  var preloaderHud = document.getElementById('preloaderHud');
  var preloaderCounter = document.getElementById('preloaderCounter');
  var preloaderStage = document.getElementById('preloaderStage');
  var preloaderKicker = document.getElementById('preloaderKicker');
  var preloaderWordWrap = document.getElementById('preloaderWordWrap');
  var preloaderWordStatic = document.getElementById('preloaderWordStatic');
  var preloaderWordLeft = document.getElementById('preloaderWordLeft');
  var preloaderWordRight = document.getElementById('preloaderWordRight');
  var preloaderWordAnim = document.getElementById('preloaderWordAnim');
  var preloaderViRoot = document.getElementById('preloaderViRoot');
  var preloaderAnimHeading = document.getElementById('preloaderAnimHeading');
  var preloaderCoreOrb = document.getElementById('preloaderCoreOrb');
  var preloaderGlow = document.getElementById('preloaderGlow');
  var preloaderFxLayer = document.getElementById('preloaderFxLayer');
  var preloaderHorizon = document.getElementById('preloaderHorizon');
  var preloaderSubtitle = document.getElementById('preloaderSubtitle');
  var preloaderProgressRail = document.getElementById('preloaderProgressRail');
  var preloaderProgressFill = document.getElementById('preloaderProgressFill');

  if (preloader) {
    var SOURCE_WORD = 'ADITYA';
    var TARGET_WORD = 'PORTFOLIO';
    var CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/%$';
    var SHOCKWAVE_COLORS = [
      'rgba(100, 229, 255, 0.88)',
      'rgba(139, 124, 246, 0.88)',
      'rgba(126, 227, 192, 0.88)',
      'rgba(255, 255, 255, 0.92)'
    ];
    var SPARK_COLORS = ['#ffffff', '#64e5ff', '#8b7cf6', '#7ee3c0', '#5b8cff'];

    var preloaderDone = false;
    var preloaderCancelled = false;
    var morphTween = null;
    var idleOrbTween = null;
    var safetyTimer = null;
    var animCtx = null;
    var exitTl = null;
    var resizeHandler = null;
    var pointerHandler = null;
    var lastPct = -1;
    var fxRingPool = [];
    var fxSparkPool = [];
    var fxRingCursor = 0;
    var fxSparkCursor = 0;

    if (window.gsap) {
      gsap.ticker.lagSmoothing(250, 33);
    }

    function initFxPools() {
      if (!preloaderFxLayer || fxRingPool.length > 0) return;
      preloaderFxLayer.innerHTML = '';

      for (var r = 0; r < 8; r++) {
        var ring = document.createElement('span');
        ring.className = 'preloader-shockwave';
        ring.style.left = '0px';
        ring.style.top = '0px';
        ring.style.width = '100px';
        ring.style.height = '100px';
        preloaderFxLayer.appendChild(ring);
        fxRingPool.push(ring);
      }

      for (var s = 0; s < 18; s++) {
        var spark = document.createElement('span');
        var color = SPARK_COLORS[s % SPARK_COLORS.length];
        spark.className = 'preloader-spark';
        spark.style.left = '0px';
        spark.style.top = '0px';
        spark.style.width = '4px';
        spark.style.height = '4px';
        spark.style.background = color;
        preloaderFxLayer.appendChild(spark);
        fxSparkPool.push(spark);
      }
    }

    function lockPreloaderScroll() {
      window.scrollTo(0, 0);
      document.documentElement.classList.add('preloader-active');
      document.body.classList.add('preloader-active');
    }

    function unlockPreloaderScroll() {
      preloaderActive = false;
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      initIcons();
      if (lenis && !document.documentElement.classList.contains('modal-open')) {
        lenis.start();
      }
    }

    function setBootProgress(pct) {
      var clamped = Math.max(0, Math.min(100, Math.round(pct)));
      if (clamped === lastPct) return;
      lastPct = clamped;
      if (preloaderCounter) {
        preloaderCounter.textContent = (clamped < 10 ? '0' : '') + clamped + '%';
      }
      if (preloaderProgressFill) {
        preloaderProgressFill.style.transform = 'scaleX(' + (clamped / 100) + ')';
      }
    }

    function spawnShockwave(x, y, size, alpha, colorIdx) {
      if (preloaderCancelled || preloaderDone || !fxRingPool.length || !window.gsap) return;
      var ring = fxRingPool[fxRingCursor % fxRingPool.length];
      fxRingCursor += 1;

      var stroke = SHOCKWAVE_COLORS[(colorIdx || 0) % SHOCKWAVE_COLORS.length];
      var baseScale = Math.max(0.28, (size || 80) / 100);
      ring.style.borderColor = stroke;

      gsap.killTweensOf(ring);
      gsap.fromTo(ring, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50,
        scaleX: baseScale * 0.24,
        scaleY: baseScale * 0.09,
        opacity: alpha || 0.85,
        force3D: true
      }, {
        scaleX: baseScale * 2.4,
        scaleY: baseScale * 0.78,
        opacity: 0,
        duration: 0.56,
        ease: 'power3.out',
        force3D: true
      });
    }

    function spawnSparks(x, y, count, maxDist, fullCircle) {
      if (preloaderCancelled || preloaderDone || !fxSparkPool.length || !window.gsap) return;
      var safeCount = Math.min(count, fxSparkPool.length);
      for (var sIdx = 0; sIdx < safeCount; sIdx++) {
        var spark = fxSparkPool[(fxSparkCursor + sIdx) % fxSparkPool.length];
        var angleDeg = fullCircle
          ? ((360 / safeCount) * sIdx + gsap.utils.random(-14, 14))
          : gsap.utils.random(-166, -14);
        var angle = angleDeg * Math.PI / 180;
        var dist = gsap.utils.random(maxDist * 0.45, maxDist);

        gsap.killTweensOf(spark);
        gsap.fromTo(spark, {
          xPercent: -50,
          yPercent: -50,
          x: x,
          y: y,
          opacity: 0.96,
          scale: gsap.utils.random(0.7, 1.1),
          force3D: true
        }, {
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist,
          opacity: 0,
          scale: 0.14,
          duration: gsap.utils.random(0.34, 0.56),
          ease: 'power2.out',
          force3D: true
        });
      }
      fxSparkCursor = (fxSparkCursor + safeCount) % fxSparkPool.length;
    }

    function pulseHorizon(peakOpacity) {
      if (preloaderCancelled || preloaderDone || !preloaderHorizon || !window.gsap) return;
      gsap.killTweensOf(preloaderHorizon, 'opacity');
      gsap.fromTo(preloaderHorizon, { opacity: peakOpacity || 0.95 }, {
        opacity: 0.28,
        duration: 0.44,
        ease: 'power2.out'
      });
    }

    function onPreloaderKeydown(e) {
      if (e.key === 'Escape' && !preloaderDone) {
        finishPreloader(true);
      }
    }

    function detachPointerParallax() {
      if (pointerHandler) {
        preloader.removeEventListener('mousemove', pointerHandler);
        pointerHandler = null;
      }
    }

    function finishPreloader(immediate) {
      if (preloaderDone) return;
      preloaderDone = true;
      preloaderCancelled = true;

      if (morphTween) { morphTween.kill(); morphTween = null; }
      if (idleOrbTween) { idleOrbTween.kill(); idleOrbTween = null; }
      if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
      if (resizeHandler) { window.removeEventListener('resize', resizeHandler); resizeHandler = null; }
      detachPointerParallax();
      window.removeEventListener('keydown', onPreloaderKeydown);

      if (immediate) {
        if (animCtx) { animCtx.revert(); animCtx = null; }
        if (exitTl) { exitTl.kill(); exitTl = null; }
      }
      if (preloaderFxLayer) preloaderFxLayer.innerHTML = '';
      fxRingPool.length = 0;
      fxSparkPool.length = 0;

      unlockPreloaderScroll();
      if (typeof triggerHeroEntrance === 'function') {
        triggerHeroEntrance();
      }
      if (window.gsap) {
        gsap.ticker.lagSmoothing(0);
      }
      requestAnimationFrame(flushDeferredStartups);

      preloader.setAttribute('aria-hidden', 'true');
      if (immediate && window.gsap) {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: function () {
            if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
          }
        });
      } else {
        preloader.classList.add('loaded');
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }
    }

    function startMorphAndSplit() {
      if (preloaderCancelled || preloaderDone) return;

      if (window.gsap) {
        if (preloaderWordStatic) {
          gsap.to(preloaderWordStatic, { opacity: 1, duration: 0.16, ease: 'power2.out' });
        }
        if (preloaderWordAnim) {
          gsap.to(preloaderWordAnim, {
            opacity: 0,
            duration: 0.22,
            ease: 'power2.out',
            onComplete: function () {
              if (preloaderWordAnim) preloaderWordAnim.style.display = 'none';
            }
          });
        }
      } else {
        if (preloaderWordStatic) preloaderWordStatic.style.opacity = '1';
        if (preloaderWordAnim) preloaderWordAnim.style.display = 'none';
      }

      var morphState = { step: 0 };
      var lastRenderedStep = -1;
      var lastMorphText = '';

      morphTween = gsap.to(morphState, {
        step: 24,
        duration: 0.96,
        ease: 'none',
        onUpdate: function () {
          if (preloaderCancelled || preloaderDone) return;
          var curStep = Math.round(morphState.step);
          if (curStep === lastRenderedStep) return;
          lastRenderedStep = curStep;

          var revealedCount = Math.floor((curStep * TARGET_WORD.length) / 24);
          var activeLen = curStep >= 24
            ? TARGET_WORD.length
            : Math.min(TARGET_WORD.length, Math.max(SOURCE_WORD.length, revealedCount + 2));

          var morphed = '';
          for (var cIdx = 0; cIdx < activeLen; cIdx++) {
            if (curStep >= 24 || cIdx < revealedCount) {
              morphed += TARGET_WORD[cIdx];
            } else if (cIdx === revealedCount || cIdx >= SOURCE_WORD.length) {
              morphed += CIPHER_CHARS[(curStep * 7 + cIdx * 3) % CIPHER_CHARS.length];
            } else {
              morphed += SOURCE_WORD[cIdx];
            }
          }

          if (morphed !== lastMorphText) {
            lastMorphText = morphed;
            if (preloaderWordLeft) preloaderWordLeft.textContent = morphed.slice(0, 4);
            if (preloaderWordRight) preloaderWordRight.textContent = morphed.slice(4);
          }
          setBootProgress(66 + (morphState.step / 24) * 34);
        },
        onComplete: function () {
          morphTween = null;
          if (preloaderCancelled || preloaderDone) return;
          if (preloaderWordLeft) preloaderWordLeft.textContent = 'PORT';
          if (preloaderWordRight) preloaderWordRight.textContent = 'FOLIO';
          setBootProgress(100);

          if (!window.gsap || !preloaderWordLeft || !preloaderWordRight) {
            finishPreloader(true);
            return;
          }

          detachPointerParallax();
          if (preloaderStage) {
            gsap.to(preloaderStage, { rotationX: 0, rotationY: 0, duration: 0.35, ease: 'power2.out' });
          }

          var isMobile = window.innerWidth < 768;
          var crackDist = isMobile
            ? Math.max(window.innerWidth * 0.08, 22)
            : Math.min(76, window.innerWidth * 0.055);
          var outerDist = isMobile
            ? Math.max(window.innerWidth * 0.36, 128)
            : Math.min(460, window.innerWidth * 0.34);

          exitTl = gsap.timeline({
            onComplete: function () {
              finishPreloader(false);
            }
          });

          // Act 2 Lock Beat: liquid aurora sheen sweep + orbital overdrive + two-tone subtitle
          exitTl
            .to([preloaderWordLeft, preloaderWordRight], {
              '--sheen-x': '-75%',
              duration: 0.48,
              ease: 'power2.inOut'
            }, 0)
            .fromTo(preloaderSubtitle, {
              y: 12,
              scale: 0.96,
              opacity: 0
            }, {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.44,
              ease: 'power3.out',
              force3D: true
            }, 0.04);

          if (preloaderOrbits) {
            exitTl.to(preloaderOrbits, {
              scale: 1.48,
              opacity: 0,
              duration: 0.54,
              ease: 'power2.in',
              force3D: true
            }, 0.06);
          }

          // Act 3 Fracture: prismatic vertical laser seam + elastic tension skew crack
          if (preloaderSeam) {
            exitTl.to(preloaderSeam, {
              scaleY: 1,
              opacity: 1,
              duration: 0.26,
              ease: 'power3.out',
              force3D: true
            }, 0.38);
          }

          exitTl
            .to(preloaderWordLeft, {
              x: -crackDist,
              skewX: -6,
              duration: 0.24,
              ease: 'power2.out',
              force3D: true
            }, 0.5)
            .to(preloaderWordRight, {
              x: crackDist,
              skewX: 6,
              duration: 0.24,
              ease: 'power2.out',
              force3D: true
            }, 0.5)
            .to([preloaderHud, preloaderProgressRail, preloaderKicker, preloaderSubtitle, preloaderHorizon, preloaderGrid, preloaderSpot, preloaderAurora], {
              opacity: 0,
              duration: 0.26,
              ease: 'power2.out'
            }, 0.52);

          // Act 3 Reveal: 3D outward swing + dual radial aurora curtains sliding open
          exitTl
            .to(preloaderCurtainLeft, {
              xPercent: -104,
              duration: 0.96,
              ease: 'power4.inOut',
              force3D: true,
              onStart: function () {
                unlockPreloaderScroll();
                if (typeof triggerHeroEntrance === 'function') {
                  triggerHeroEntrance();
                }
              }
            }, 0.68)
            .to(preloaderCurtainRight, {
              xPercent: 104,
              duration: 0.96,
              ease: 'power4.inOut',
              force3D: true
            }, 0.68)
            .to(preloaderWordLeft, {
              x: -outerDist,
              skewX: 0,
              rotationY: 16,
              scale: 1.1,
              opacity: 0,
              duration: 0.82,
              ease: 'power3.inOut',
              force3D: true
            }, 0.68)
            .to(preloaderWordRight, {
              x: outerDist,
              skewX: 0,
              rotationY: -16,
              scale: 1.1,
              opacity: 0,
              duration: 0.82,
              ease: 'power3.inOut',
              force3D: true
            }, 0.68)
            .to(preloaderSeam, {
              opacity: 0,
              duration: 0.26,
              ease: 'power2.out'
            }, 0.68);
        }
      });
    }

    function setupPointerParallax() {
      if (isTouch || prefersReducedMotion || !window.gsap) return;
      var stageRotY = preloaderStage ? gsap.quickTo(preloaderStage, 'rotationY', { duration: 0.45, ease: 'power2.out' }) : null;
      var stageRotX = preloaderStage ? gsap.quickTo(preloaderStage, 'rotationX', { duration: 0.45, ease: 'power2.out' }) : null;
      var spotX = preloaderSpot ? gsap.quickTo(preloaderSpot, 'x', { duration: 0.55, ease: 'power2.out' }) : null;
      var spotY = preloaderSpot ? gsap.quickTo(preloaderSpot, 'y', { duration: 0.55, ease: 'power2.out' }) : null;

      pointerHandler = function (e) {
        if (preloaderCancelled || preloaderDone) return;
        var nx = (e.clientX / (window.innerWidth || 1)) * 2 - 1;
        var ny = (e.clientY / (window.innerHeight || 1)) * 2 - 1;
        if (stageRotY) stageRotY(nx * 4.5);
        if (stageRotX) stageRotX(-ny * 3.5);
        if (spotX) spotX(nx * 95);
        if (spotY) spotY(ny * 65);
      };
      preloader.addEventListener('mousemove', pointerHandler, { passive: true });
    }

    function waitForPageSettle() {
      var loadWait = document.readyState === 'complete'
        ? Promise.resolve()
        : Promise.race([
            new Promise(function (resolve) { window.addEventListener('load', resolve, { once: true }); }),
            new Promise(function (resolve) { setTimeout(resolve, 900); })
          ]);

      var fontWait = (document.fonts && document.fonts.ready)
        ? Promise.race([
            document.fonts.ready,
            new Promise(function (resolve) { setTimeout(resolve, 450); })
          ])
        : Promise.resolve();

      return Promise.all([loadWait, fontWait]).then(function () {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(resolve);
          });
        });
      });
    }

    function runKineticIntro() {
      if (!window.gsap || !preloaderViRoot || !preloaderAnimHeading || !preloaderCoreOrb || !preloaderGlow) {
        finishPreloader(true);
        return;
      }

      if (prefersReducedMotion) {
        if (preloaderWordStatic) preloaderWordStatic.style.opacity = '1';
        if (preloaderWordLeft) preloaderWordLeft.textContent = 'PORT';
        if (preloaderWordRight) preloaderWordRight.textContent = 'FOLIO';
        if (preloaderWordAnim) preloaderWordAnim.style.display = 'none';
        setBootProgress(100);
        setTimeout(function () { finishPreloader(true); }, 350);
        return;
      }

      if (preloaderSpot) {
        gsap.set(preloaderSpot, { xPercent: -50, yPercent: -50 });
      }
      if (preloaderCoreOrb) {
        gsap.set(preloaderCoreOrb, { xPercent: -50, yPercent: -50 });
      }
      if (preloaderGlow) {
        gsap.set(preloaderGlow, { xPercent: -50, yPercent: -50 });
      }

      initFxPools();
      setupPointerParallax();

      var chars = SOURCE_WORD.split('');
      preloaderAnimHeading.innerHTML = '';
      var letterEls = chars.map(function (ch, idx) {
        var span = document.createElement('span');
        span.className = 'preloader-letter preloader-word-gradient';
        span.style.setProperty('--char-i', String(idx));
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        preloaderAnimHeading.appendChild(span);
        return span;
      });

      gsap.set(letterEls, { opacity: 0 });
      setBootProgress(4);

      // Gentle ambient singularity pulse while browser network/fonts settle
      gsap.set(preloaderCoreOrb, { width: 16, height: 16, y: 0 });
      idleOrbTween = gsap.fromTo(preloaderCoreOrb, {
        scale: 0.72,
        opacity: 0.45
      }, {
        scale: 1.08,
        opacity: 0.9,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true
      });

      waitForPageSettle().then(function () {
        if (preloaderCancelled || preloaderDone) return;
        if (idleOrbTween) { idleOrbTween.kill(); idleOrbTween = null; }

        animCtx = gsap.context(function () {
          gsap.set(letterEls, { clearProps: 'transform' });

          var rootRect = preloaderViRoot.getBoundingClientRect();
          var fontSize = parseFloat(getComputedStyle(preloaderAnimHeading).fontSize) || 16;
          var centerPt = { x: rootRect.width / 2, y: rootRect.height / 2 };
          var boxes = letterEls.map(function (el) {
            var r = el.getBoundingClientRect();
            return {
              cx: r.left - rootRect.left + r.width / 2,
              cy: r.top - rootRect.top + r.height / 2,
              bottom: r.bottom - rootRect.top
            };
          });

          var orbSize = Math.max(14, Math.min(24, fontSize * 0.16));
          var glowSize = fontSize * 2.8;
          var dropFromY = -(window.innerHeight * 0.48);

          gsap.set(preloaderCoreOrb, { width: orbSize, height: orbSize });
          gsap.set(preloaderGlow, { width: glowSize, height: glowSize });

          var master = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onUpdate: function () {
              setBootProgress(6 + master.progress() * 60);
            },
            onComplete: startMorphAndSplit
          });

          master.set(preloaderViRoot, { opacity: 1 });

          // Act 1A: Vertical laser drop + core orb singularity ignition
          if (preloaderLaser) {
            master
              .fromTo(preloaderLaser, { xPercent: -50, scaleY: 0, opacity: 0.9 }, {
                xPercent: -50,
                scaleY: 1,
                opacity: 1,
                duration: 0.34,
                ease: 'power3.in',
                force3D: true
              }, 0)
              .to(preloaderLaser, { scaleY: 0, opacity: 0, transformOrigin: 'bottom center', duration: 0.24, ease: 'power2.out', force3D: true }, 0.36);
          }

          master
            .fromTo(preloaderCoreOrb, { y: dropFromY, scale: 0.7, opacity: 1 }, {
              y: 0,
              scale: 1.35,
              opacity: 1,
              duration: 0.36,
              ease: 'power3.in',
              force3D: true
            }, 0)
            .to(preloaderCoreOrb, { scale: 2.9, opacity: 0, duration: 0.26, ease: 'power2.out', force3D: true }, 0.36)
            .fromTo(preloaderGlow, { scale: 0.2, opacity: 0 }, { scale: 1.25, opacity: 0.88, duration: 0.14, ease: 'power2.out', force3D: true }, 0.36)
            .to(preloaderGlow, { scale: 1.75, opacity: 0, duration: 0.45, ease: 'power2.out', force3D: true }, 0.5)
            .call(function () {
              spawnShockwave(centerPt.x, centerPt.y, fontSize * 0.95, 0.95, 0);
              spawnShockwave(centerPt.x, centerPt.y, fontSize * 0.55, 0.85, 1);
              spawnSparks(centerPt.x, centerPt.y, 10, fontSize * 0.95, true);
              pulseHorizon(1.0);
            }, null, 0.36);

          if (preloaderHorizon) {
            master.fromTo(preloaderHorizon, {
              xPercent: -50,
              scaleX: 0,
              opacity: 0.2
            }, {
              xPercent: -50,
              scaleX: 1,
              opacity: 0.36,
              duration: 0.52,
              ease: 'power3.out',
              force3D: true
            }, 0.36);
          }

          if (preloaderKicker) {
            master.fromTo(preloaderKicker, {
              y: -10,
              scale: 0.96,
              opacity: 0
            }, {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.48,
              ease: 'power3.out',
              force3D: true
            }, 0.34);
          }

          // Gyroscope orbit rings spin up cleanly on impact
          if (preloaderOrbits) {
            var outerRing = preloaderOrbits.querySelector('.preloader-orbit-outer');
            var innerRing = preloaderOrbits.querySelector('.preloader-orbit-inner');
            master.fromTo(preloaderOrbits, { scale: 0.58, opacity: 0 }, {
              scale: 1,
              opacity: 1,
              duration: 0.62,
              ease: 'back.out(1.4)',
              force3D: true
            }, 0.36);
            if (outerRing) {
              master.to(outerRing, { rotation: 165, duration: 2.0, ease: 'power1.inOut', force3D: true }, 0.36);
            }
            if (innerRing) {
              master.to(innerRing, { rotation: -210, duration: 2.0, ease: 'power1.inOut', force3D: true }, 0.36);
            }
          }

          // Act 1B: 3D Center-Out Vortex Convergence of "ADITYA" (pure GPU transform/opacity)
          var centerOrder = chars.map(function (_, i) { return i; }).sort(function (a, b) {
            return Math.abs(a - (chars.length - 1) / 2) - Math.abs(b - (chars.length - 1) / 2);
          });

          centerOrder.forEach(function (letterIdx, order) {
            var el = letterEls[letterIdx];
            var box = boxes[letterIdx];
            var sign = letterIdx % 2 === 0 ? -1 : 1;
            var offsetFromCenter = letterIdx - (chars.length - 1) / 2;
            var entryAt = 0.44 + order * 0.08;

            master
              .fromTo(el, {
                x: offsetFromCenter * fontSize * 0.45,
                y: sign * fontSize * 0.86,
                z: -220,
                rotationX: sign * 68,
                rotationY: offsetFromCenter * 14,
                rotationZ: sign * -18,
                scale: 0.44,
                opacity: 0
              }, {
                x: 0,
                y: 0,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scale: 1,
                opacity: 1,
                duration: 0.62,
                ease: 'back.out(1.45)',
                force3D: true
              }, entryAt)
              .call(function () {
                spawnShockwave(box.cx, box.bottom, fontSize * 0.54, 0.52, letterIdx);
                spawnSparks(box.cx, box.bottom, 3, fontSize * 0.4, false);
                pulseHorizon(0.68);
              }, null, entryAt + 0.44);
          });

          // Act 1C: Chromatic Wave Ripple sweep left-to-right across locked "ADITYA"
          letterEls.forEach(function (el, idx) {
            var waveAt = 1.4 + idx * 0.052;
            master
              .to(el, {
                y: -fontSize * 0.13,
                scaleY: 1.12,
                scaleX: 0.94,
                duration: 0.16,
                ease: 'power2.out',
                force3D: true
              }, waveAt)
              .to(el, {
                y: 0,
                scaleY: 1,
                scaleX: 1,
                duration: 0.34,
                ease: 'elastic.out(1, 0.45)',
                force3D: true
              }, waveAt + 0.16);
          });

          var initW = window.innerWidth;
          var resizeTimer = null;
          resizeHandler = function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
              if (preloaderCancelled || preloaderDone) return;
              if (Math.abs(window.innerWidth - initW) < 60) return;
              initW = window.innerWidth;
              if (master.progress() < 1) {
                master.progress(1, true);
                startMorphAndSplit();
              }
            }, 180);
          };
          window.addEventListener('resize', resizeHandler);
        }, preloaderViRoot);
      });
    }

    lockPreloaderScroll();
    runKineticIntro();

    // Allow impatient visitors to skip via click or Escape
    preloader.addEventListener('click', function () { finishPreloader(true); });
    window.addEventListener('keydown', onPreloaderKeydown);

    // Safety fallback if fonts, GSAP, or timers stall
    safetyTimer = setTimeout(function () { finishPreloader(true); }, 11000);
  }

  /* ==========================================================================
     SIGNAL FORGE — LIVING BACKEND SYSTEM CONSTELLATION SIMULATION
     ========================================================================== */
  var constellationCanvas = document.getElementById('constellationCanvas');
  var pulseTriggerBtn = document.getElementById('pulseTriggerBtn');
  var nodeInfoBox = document.getElementById('nodeInfoBox');
  var nodeTag = document.getElementById('nodeTag');
  var nodeHealth = document.getElementById('nodeHealth');
  var nodeDesc = document.getElementById('nodeDesc');
  var nodeStat1 = document.getElementById('nodeStat1');
  var nodeStat2 = document.getElementById('nodeStat2');

  if (constellationCanvas) {
    var cCtx = constellationCanvas.getContext('2d');
    var cWidth = 480;
    var cHeight = 260;
    var cDpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeConstellation() {
      var rect = constellationCanvas.getBoundingClientRect();
      cWidth = rect.width || 480;
      cHeight = rect.height || 260;
      constellationCanvas.width = cWidth * cDpr;
      constellationCanvas.height = cHeight * cDpr;
      cCtx.scale(cDpr, cDpr);
    }
    resizeConstellation();
    window.addEventListener('resize', resizeConstellation, { passive: true });

    // Defined System Nodes
    var systemNodes = [
      {
        id: 'gateway',
        label: 'API Gateway',
        sub: 'Rate Limiter · JWT',
        normX: 0.16,
        normY: 0.50,
        color: '#64e5ff',
        health: '100% HEALTHY',
        desc: 'Ingress reverse proxy routing client requests, verifying JWT tokens, and enforcing IP token-bucket rate limits.',
        stat1: 'Latency: 0.8ms',
        stat2: 'Protocol: HTTP/2'
      },
      {
        id: 'core',
        label: 'Spring Boot 3.3',
        sub: 'Java 21 · App Core',
        normX: 0.50,
        normY: 0.30,
        color: '#64e5ff',
        health: '100% HEALTHY',
        desc: 'Core service runtime executing transactional business logic, Spring AI deal analysis, and async Kafka event publishing.',
        stat1: 'Latency: 1.2ms',
        stat2: 'ACID: Enforced'
      },
      {
        id: 'kafka',
        label: 'Apache Kafka',
        sub: 'Event Streams · DLQ',
        normX: 0.84,
        normY: 0.28,
        color: '#c8ff6b',
        health: 'STREAMING',
        desc: 'Distributed event bus decoupling checkout & orders into dedicated partitions with exponential-backoff Dead-Letter Queues (DLQ).',
        stat1: 'Queue: 0 DLQ Faults',
        stat2: 'Partitions: 6 Active'
      },
      {
        id: 'redis',
        label: 'Redis Cache',
        sub: '<25ms Read Store',
        normX: 0.50,
        normY: 0.74,
        color: '#c8ff6b',
        health: 'SUB-25MS WARM',
        desc: 'In-memory distributed key-value cache handling session management, shopping cart state, and high-frequency read optimization.',
        stat1: 'Hit Rate: 94.2%',
        stat2: 'TTL: 300s Sliding'
      },
      {
        id: 'postgres',
        label: 'PostgreSQL / MySQL',
        sub: '3NF · ACID Safe',
        normX: 0.84,
        normY: 0.72,
        color: '#947cff',
        health: 'ACID COMMITTED',
        desc: 'Primary relational storage layer structured in 17 normalized (3NF) tables with composite B-Tree indexing and pessimistic locking.',
        stat1: 'Isolation: READ_COMMITTED',
        stat2: 'Tables: 17 (3NF)'
      }
    ];

    // Conduits connecting nodes
    var conduits = [
      { from: 'gateway', to: 'core', color: 'rgba(100, 229, 255, 0.45)' },
      { from: 'core', to: 'kafka', color: 'rgba(200, 255, 107, 0.45)' },
      { from: 'core', to: 'redis', color: 'rgba(100, 229, 255, 0.45)' },
      { from: 'core', to: 'postgres', color: 'rgba(148, 124, 255, 0.45)' },
      { from: 'kafka', to: 'postgres', color: 'rgba(200, 255, 107, 0.35)' },
      { from: 'redis', to: 'gateway', color: 'rgba(100, 229, 255, 0.35)' }
    ];

    // Packet Pool
    var packets = [];
    function emitPacket(fromId, toId, burst) {
      packets.push({
        fromId: fromId,
        toId: toId,
        progress: 0,
        speed: (burst ? 0.024 : 0.012) + Math.random() * 0.008,
        color: burst ? '#c8ff6b' : '#64e5ff',
        size: burst ? 3.5 : 2.5
      });
    }

    // Seed continuous traffic
    setInterval(function () {
      if (document.hidden) return;
      var randomConduit = conduits[Math.floor(Math.random() * conduits.length)];
      emitPacket(randomConduit.from, randomConduit.to, false);
    }, 450);

    // Burst Button
    if (pulseTriggerBtn) {
      pulseTriggerBtn.addEventListener('click', function () {
        for (var b = 0; b < 12; b++) {
          var c = conduits[b % conduits.length];
          emitPacket(c.from, c.to, true);
        }
        if (nodeInfoBox) {
          nodeInfoBox.style.transform = 'scale(1.02)';
          setTimeout(function () { nodeInfoBox.style.transform = 'none'; }, 200);
        }
      });
    }

    // Active hovered node
    var hoveredNode = null;
    var defaultNode = systemNodes[1]; // Core

    function updateNodeInfo(node) {
      var n = node || defaultNode;
      if (nodeTag) nodeTag.textContent = n.label.toUpperCase();
      if (nodeHealth) {
        nodeHealth.textContent = n.health;
        nodeHealth.style.color = n.color;
        nodeHealth.style.borderColor = n.color;
      }
      if (nodeDesc) nodeDesc.textContent = n.desc;
      if (nodeStat1) nodeStat1.textContent = n.stat1;
      if (nodeStat2) nodeStat2.textContent = n.stat2;
    }
    updateNodeInfo(defaultNode);

    // Mouse / Touch interaction
    function getPointerPos(e) {
      var rect = constellationCanvas.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function checkNodeHit(pos) {
      var hit = null;
      for (var i = 0; i < systemNodes.length; i++) {
        var n = systemNodes[i];
        var nx = n.normX * cWidth;
        var ny = n.normY * cHeight;
        var dx = pos.x - nx;
        var dy = pos.y - ny;
        if (Math.sqrt(dx * dx + dy * dy) < 28) {
          hit = n;
          break;
        }
      }
      return hit;
    }

    constellationCanvas.addEventListener('mousemove', function (e) {
      var pos = getPointerPos(e);
      var hit = checkNodeHit(pos);
      if (hit !== hoveredNode) {
        hoveredNode = hit;
        updateNodeInfo(hoveredNode || defaultNode);
      }
    });

    constellationCanvas.addEventListener('mouseleave', function () {
      hoveredNode = null;
      updateNodeInfo(defaultNode);
    });

    constellationCanvas.addEventListener('click', function (e) {
      var pos = getPointerPos(e);
      var hit = checkNodeHit(pos);
      if (hit) {
        conduits.forEach(function (c) {
          if (c.from === hit.id || c.to === hit.id) {
            emitPacket(c.from, c.to, true);
          }
        });
      }
    });

    constellationCanvas.addEventListener('touchstart', function (e) {
      var pos = getPointerPos(e);
      var hit = checkNodeHit(pos);
      if (hit) {
        hoveredNode = hit;
        updateNodeInfo(hit);
        conduits.forEach(function (c) {
          if (c.from === hit.id) emitPacket(c.from, c.to, true);
        });
      }
    }, { passive: true });

    // Render loop
    var simTime = 0;
    function renderConstellation() {
      cCtx.clearRect(0, 0, cWidth, cHeight);
      simTime += 0.02;

      // Map lookup
      var nodeMap = {};
      for (var i = 0; i < systemNodes.length; i++) {
        var n = systemNodes[i];
        nodeMap[n.id] = {
          x: n.normX * cWidth,
          y: n.normY * cHeight,
          node: n
        };
      }

      // Draw Conduits (lines with dash flow)
      for (var j = 0; j < conduits.length; j++) {
        var cond = conduits[j];
        var p1 = nodeMap[cond.from];
        var p2 = nodeMap[cond.to];
        if (!p1 || !p2) continue;

        cCtx.beginPath();
        cCtx.moveTo(p1.x, p1.y);
        cCtx.lineTo(p2.x, p2.y);
        cCtx.strokeStyle = cond.color;
        cCtx.lineWidth = 1.4;
        cCtx.setLineDash([4, 6]);
        cCtx.lineDashOffset = -simTime * 15;
        cCtx.stroke();
        cCtx.setLineDash([]);
      }

      // Update and draw packets
      for (var k = packets.length - 1; k >= 0; k--) {
        var pkt = packets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        var startNode = nodeMap[pkt.fromId];
        var endNode = nodeMap[pkt.toId];
        if (!startNode || !endNode) {
          packets.splice(k, 1);
          continue;
        }

        var curX = startNode.x + (endNode.x - startNode.x) * pkt.progress;
        var curY = startNode.y + (endNode.y - startNode.y) * pkt.progress;

        cCtx.beginPath();
        cCtx.arc(curX, curY, pkt.size, 0, Math.PI * 2);
        cCtx.fillStyle = pkt.color;
        cCtx.shadowColor = pkt.color;
        cCtx.shadowBlur = 10;
        cCtx.fill();
        cCtx.shadowBlur = 0;
      }

      // Draw Nodes
      for (var m = 0; m < systemNodes.length; m++) {
        var sn = systemNodes[m];
        var nx = sn.normX * cWidth;
        var ny = sn.normY * cHeight;
        var isHovered = hoveredNode && hoveredNode.id === sn.id;

        // Outer Halo / Pulse Ring
        var haloPulse = Math.sin(simTime * 3 + m) * 3;
        cCtx.beginPath();
        cCtx.arc(nx, ny, 16 + (isHovered ? 6 : haloPulse), 0, Math.PI * 2);
        cCtx.strokeStyle = isHovered ? '#64e5ff' : 'rgba(255, 255, 255, 0.12)';
        cCtx.lineWidth = isHovered ? 2 : 1;
        cCtx.stroke();

        // Node Solid Disk
        cCtx.beginPath();
        cCtx.arc(nx, ny, 12, 0, Math.PI * 2);
        cCtx.fillStyle = '#0d131c';
        cCtx.fill();
        cCtx.strokeStyle = sn.color;
        cCtx.lineWidth = isHovered ? 2.5 : 1.5;
        cCtx.shadowColor = sn.color;
        cCtx.shadowBlur = isHovered ? 16 : 8;
        cCtx.stroke();
        cCtx.shadowBlur = 0;

        // Inner core beacon
        cCtx.beginPath();
        cCtx.arc(nx, ny, 4, 0, Math.PI * 2);
        cCtx.fillStyle = sn.color;
        cCtx.fill();

        // Text Labels
        cCtx.font = (isHovered ? 'bold ' : '600 ') + '10px "JetBrains Mono", monospace';
        cCtx.fillStyle = isHovered ? '#ffffff' : '#cbd5e1';
        cCtx.textAlign = 'center';
        cCtx.fillText(sn.label, nx, ny - 20);

        cCtx.font = '9px "JetBrains Mono", monospace';
        cCtx.fillStyle = 'rgba(148, 163, 184, 0.75)';
        cCtx.fillText(sn.sub, nx, ny + 24);
      }

      if (!document.hidden && !prefersReducedMotion && !preloaderActive) {
        requestAnimationFrame(renderConstellation);
      }
    }
    runAfterPreloader(renderConstellation);

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !prefersReducedMotion && !preloaderActive) {
        requestAnimationFrame(renderConstellation);
      }
    });
  }

  /* ============================ Project Architecture Deep-Dive Drawers ============================ */
  function setupArchToggle(btnId, detailsId) {
    var btn = document.getElementById(btnId);
    var details = document.getElementById(detailsId);
    if (!btn || !details) return;

    btn.addEventListener('click', function () {
      var isHidden = details.hasAttribute('hidden');
      if (isHidden) {
        details.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        details.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupArchToggle('toggleFairCartDetails', 'faircartDeepDetails');
  setupArchToggle('toggleFixoraDetails', 'fixoraDeepDetails');

  /* ------------------------------ Footer Year ----------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================ Hero Role Typewriter ============================ */
  var roleRotator = document.getElementById('roleRotator');
  if (roleRotator) {
    var roles = [
      'Software Developer Intern',
      'Java Backend Developer',
      'Spring Boot 3.3 & Spring AI',
      'Microservices & Kafka Streams',
      'PostgreSQL & MySQL (3NF/ACID)',
      'Redis Distributed Caching'
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
      gsap.ticker.add(function (time) {
        if (lenis && !preloaderActive) {
          lenis.raf(time * 1000);
        }
      });
      if (!preloaderActive) {
        gsap.ticker.lagSmoothing(0);
      }
    } else {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      });
    }

    if (preloaderActive) {
      lenis.stop();
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
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    var focusTarget = menuClose || drawer.querySelector('a, button');
    if (focusTarget) focusTarget.focus();
  }

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
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
  /* ===================== Hero Load-in Orchestration ===================== */
  var heroCopy = document.querySelector('.hero-copy');
  var heroVisual = document.querySelector('.hero-visual');
  var heroEntranceTriggered = false;

  function triggerHeroEntrance() {
    if (heroEntranceTriggered) return;
    heroEntranceTriggered = true;

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
          delay: 0.15,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        });
      }
    }
  }

  // Defer hero entrance until kinetic preloader completes (or run immediately if preloader is absent)
  if (!preloaderActive) {
    triggerHeroEntrance();
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
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeTermModal() {
    if (!termModal || !termModal.classList.contains('open')) return;
    termModal.classList.remove('open');
    termModal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
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
  var filterButtons = document.querySelectorAll('.filter-btn, .filter-pill');
  var skillCards = document.querySelectorAll('.skill-card');
  var skillTiles = document.querySelectorAll('.skill-tile');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });

      // Filter modern skill cards with smooth visibility toggle
      skillCards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        var match = filter === 'all' || category === filter;
        card.classList.toggle('is-hidden', !match);
      });

      // Filter legacy tiles if present
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
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeCmdPalette() {
    if (!cmdModal || !cmdModal.classList.contains('open')) return;
    cmdModal.classList.remove('open');
    cmdModal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
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

  /* ============================ In-Page Resume PDF Viewer Modal (PDF.js + High-DPI Canvas + Touch Zoom) ============================ */
  var resumeModal = document.getElementById('resumeModal');
  var heroViewResumeBtn = document.getElementById('heroViewResumeBtn');
  var viewResumeBtnNav = document.getElementById('viewResumeBtnNav');
  var viewResumeBtnDrawer = document.getElementById('viewResumeBtnDrawer');
  var cmdViewResume = document.getElementById('cmdViewResume');
  var closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  var resumeCanvasWrapper = document.getElementById('resumeCanvasWrapper');
  var resumeCanvasContainer = document.getElementById('resumeCanvasContainer');
  var resumeLoadingSpinner = document.getElementById('resumeLoadingSpinner');
  var resumeIframeFallback = document.getElementById('resumeIframeFallback');
  var resumeZoomIn = document.getElementById('resumeZoomIn');
  var resumeZoomOut = document.getElementById('resumeZoomOut');
  var resumeZoomFit = document.getElementById('resumeZoomFit');
  var resumeZoomLevel = document.getElementById('resumeZoomLevel');

  var pdfDoc = null;
  var pdfScale = 1.0;
  var isRendering = false;
  var pendingScale = null;
  var pdfUrl = 'Aditya_Singh_Chouhan_Resume.pdf';

  function calculateFitScale(firstPage) {
    if (!resumeCanvasWrapper || !firstPage) return 1.0;
    var containerWidth = resumeCanvasWrapper.clientWidth - (window.innerWidth < 768 ? 16 : 48);
    var unscaledViewport = firstPage.getViewport({ scale: 1.0 });
    var scale = containerWidth / unscaledViewport.width;
    return Math.max(0.45, Math.min(scale, 1.6));
  }

  function applyZoom(newScale) {
    if (!pdfDoc) return;
    var clamped = Math.min(Math.max(Number(newScale.toFixed(2)), 0.45), 2.75);
    pdfScale = clamped;
    if (isRendering) {
      pendingScale = clamped;
      return;
    }
    renderPdfPages();
  }

  function fitResume() {
    if (!pdfDoc || !resumeCanvasWrapper) return;
    pdfDoc.getPage(1).then(function (page) {
      var fitScale = calculateFitScale(page);
      applyZoom(fitScale);
    });
  }

  function renderPdfPages() {
    if (!pdfDoc || !resumeCanvasContainer) return;
    isRendering = true;

    // Preserve scroll position ratio across zoom renders so user doesn't jump to top
    var prevScrollRatio = 0;
    if (resumeCanvasWrapper && resumeCanvasWrapper.scrollHeight > 0) {
      prevScrollRatio = resumeCanvasWrapper.scrollTop / resumeCanvasWrapper.scrollHeight;
    }

    resumeCanvasContainer.innerHTML = '';

    if (resumeZoomLevel) {
      resumeZoomLevel.textContent = Math.round(pdfScale * 100) + '%';
    }

    var numPages = pdfDoc.numPages;
    var renderPromises = [];

    for (var pageNum = 1; pageNum <= numPages; pageNum++) {
      (function (pNum) {
        var pPromise = pdfDoc.getPage(pNum).then(function (page) {
          var viewport = page.getViewport({ scale: pdfScale });
          var outputScale = Math.min(window.devicePixelRatio || 1, 2);

          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');

          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = Math.floor(viewport.width) + 'px';
          canvas.style.height = Math.floor(viewport.height) + 'px';
          canvas.setAttribute('role', 'img');
          canvas.setAttribute('aria-label', 'Resume Document Page ' + pNum);

          var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

          var renderContext = {
            canvasContext: context,
            transform: transform,
            viewport: viewport
          };

          resumeCanvasContainer.appendChild(canvas);
          return page.render(renderContext).promise;
        });
        renderPromises.push(pPromise);
      })(pageNum);
    }

    Promise.all(renderPromises).then(function () {
      isRendering = false;
      if (resumeLoadingSpinner && resumeLoadingSpinner.parentNode) {
        resumeLoadingSpinner.parentNode.removeChild(resumeLoadingSpinner);
      }
      if (resumeCanvasWrapper && prevScrollRatio > 0) {
        resumeCanvasWrapper.scrollTop = Math.round(prevScrollRatio * resumeCanvasWrapper.scrollHeight);
      }
      if (pendingScale !== null) {
        var nextScale = pendingScale;
        pendingScale = null;
        applyZoom(nextScale);
      }
    }).catch(function (err) {
      console.warn('PDF.js render warning:', err);
      isRendering = false;
      pendingScale = null;
    });
  }

  function loadAndRenderPdf(forceReFit) {
    if (!window.pdfjsLib) {
      if (resumeIframeFallback) resumeIframeFallback.style.display = 'block';
      if (resumeCanvasWrapper) resumeCanvasWrapper.style.display = 'none';
      return;
    }

    if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    if (pdfDoc) {
      if (forceReFit) {
        pdfDoc.getPage(1).then(function (page) {
          pdfScale = calculateFitScale(page);
          renderPdfPages();
        });
      } else {
        renderPdfPages();
      }
      return;
    }

    window.pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
      pdfDoc = pdf;
      return pdf.getPage(1);
    }).then(function (firstPage) {
      pdfScale = calculateFitScale(firstPage);
      renderPdfPages();
    }).catch(function (err) {
      console.error('PDF.js loading failed, using iframe fallback:', err);
      if (resumeIframeFallback) resumeIframeFallback.style.display = 'block';
      if (resumeCanvasWrapper) resumeCanvasWrapper.style.display = 'none';
    });
  }

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Pause Lenis smooth scrolling so mouse wheel does not scroll the background website
    if (lenis) {
      lenis.stop();
    }

    // Reset initial scroll position to the top of the resume
    if (resumeCanvasWrapper) {
      resumeCanvasWrapper.scrollTop = 0;
      resumeCanvasWrapper.scrollLeft = 0;
    }

    setTimeout(function () {
      loadAndRenderPdf(true);
      if (resumeCanvasWrapper) {
        resumeCanvasWrapper.focus();
      }
    }, 60);
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    // Resume Lenis smooth scrolling for page navigation
    if (lenis) {
      lenis.start();
    }
  }

  if (resumeZoomIn) {
    resumeZoomIn.addEventListener('click', function () {
      applyZoom(pdfScale + 0.25);
    });
  }

  if (resumeZoomOut) {
    resumeZoomOut.addEventListener('click', function () {
      applyZoom(pdfScale - 0.25);
    });
  }

  if (resumeZoomFit) {
    resumeZoomFit.addEventListener('click', fitResume);
  }

  window.addEventListener('resize', function () {
    if (resumeModal && resumeModal.classList.contains('open') && pdfDoc && !isRendering) {
      pdfDoc.getPage(1).then(function (page) {
        pdfScale = calculateFitScale(page);
        renderPdfPages();
      });
    }
  }, { passive: true });

  if (heroViewResumeBtn) heroViewResumeBtn.addEventListener('click', openResumeModal);
  if (viewResumeBtnNav) viewResumeBtnNav.addEventListener('click', openResumeModal);
  if (viewResumeBtnDrawer) {
    viewResumeBtnDrawer.addEventListener('click', function () {
      var mobileDrawer = document.getElementById('mobileDrawer');
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      openResumeModal();
    });
  }
  if (cmdViewResume) {
    cmdViewResume.addEventListener('click', function () {
      closeCmdPalette();
      setTimeout(openResumeModal, 120);
    });
  }
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);

  if (resumeModal) {
    resumeModal.addEventListener('click', function (e) {
      if (e.target === resumeModal) closeResumeModal();
    });

    // Isolate wheel scrolling to resume viewer, preventing full website from scrolling
    resumeModal.addEventListener('wheel', function (e) {
      e.stopPropagation();
      if (resumeCanvasWrapper && !resumeCanvasWrapper.contains(e.target)) {
        e.preventDefault();
        resumeCanvasWrapper.scrollTop += e.deltaY;
        resumeCanvasWrapper.scrollLeft += e.deltaX;
      }
    }, { passive: false });
  }

  if (resumeCanvasWrapper) {
    resumeCanvasWrapper.addEventListener('wheel', function (e) {
      // Pinch gesture on trackpad or Ctrl + Mouse Wheel -> Zoom document smoothly
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        var delta = e.deltaY < 0 ? 0.15 : -0.15;
        applyZoom(pdfScale + delta);
        return;
      }

      e.stopPropagation();
      var maxScrollTop = resumeCanvasWrapper.scrollHeight - resumeCanvasWrapper.clientHeight;
      var atTop = resumeCanvasWrapper.scrollTop <= 0 && e.deltaY < 0;
      var atBottom = resumeCanvasWrapper.scrollTop >= maxScrollTop - 1 && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Mouse Drag-to-Pan across zoomed document (grab and pan like Acrobat/Drive)
  var isPanning = false;
  var panStartX = 0;
  var panStartY = 0;
  var panScrollLeft = 0;
  var panScrollTop = 0;

  if (resumeCanvasWrapper) {
    resumeCanvasWrapper.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || e.target.closest('button, a')) return;
      isPanning = true;
      resumeCanvasWrapper.classList.add('is-panning');
      panStartX = e.pageX - resumeCanvasWrapper.offsetLeft;
      panStartY = e.pageY - resumeCanvasWrapper.offsetTop;
      panScrollLeft = resumeCanvasWrapper.scrollLeft;
      panScrollTop = resumeCanvasWrapper.scrollTop;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isPanning || !resumeCanvasWrapper) return;
      e.preventDefault();
      var x = e.pageX - resumeCanvasWrapper.offsetLeft;
      var y = e.pageY - resumeCanvasWrapper.offsetTop;
      resumeCanvasWrapper.scrollLeft = panScrollLeft - (x - panStartX);
      resumeCanvasWrapper.scrollTop = panScrollTop - (y - panStartY);
    });

    window.addEventListener('mouseup', function () {
      if (isPanning && resumeCanvasWrapper) {
        isPanning = false;
        resumeCanvasWrapper.classList.remove('is-panning');
      }
    });
  }

  // Mobile Touch Pinch-to-Zoom
  var touchPinchDist = null;
  var touchPinchStartScale = 1.0;

  function getTouchDistance(touches) {
    if (!touches || touches.length < 2) return 0;
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  if (resumeCanvasWrapper) {
    resumeCanvasWrapper.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        touchPinchDist = getTouchDistance(e.touches);
        touchPinchStartScale = pdfScale;
      }
    }, { passive: true });

    resumeCanvasWrapper.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2 && touchPinchDist) {
        var currentDist = getTouchDistance(e.touches);
        if (currentDist > 0) {
          e.preventDefault();
          var ratio = currentDist / touchPinchDist;
          applyZoom(touchPinchStartScale * ratio);
        }
      }
    }, { passive: false });

    resumeCanvasWrapper.addEventListener('touchend', function (e) {
      if (e.touches.length < 2) {
        touchPinchDist = null;
      }
    }, { passive: true });
  }

  window.addEventListener('keydown', function (e) {
    if (resumeModal && resumeModal.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeResumeModal();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        applyZoom(pdfScale + 0.25);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        applyZoom(pdfScale - 0.25);
      } else if (e.key === '0' || e.key.toLowerCase() === 'f') {
        e.preventDefault();
        fitResume();
      } else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) !== -1) {
        if (resumeCanvasWrapper) {
          var step = (e.key === 'PageDown' || e.key === ' ') ? resumeCanvasWrapper.clientHeight * 0.8 :
                     (e.key === 'PageUp') ? -resumeCanvasWrapper.clientHeight * 0.8 :
                     (e.key === 'ArrowDown') ? 60 :
                     (e.key === 'ArrowUp') ? -60 :
                     (e.key === 'Home') ? -resumeCanvasWrapper.scrollHeight :
                     (e.key === 'End') ? resumeCanvasWrapper.scrollHeight : 0;
          if (step !== 0) {
            e.preventDefault();
            e.stopPropagation();
            resumeCanvasWrapper.scrollTop += step;
          }
        }
      }
    }
  });

  /* ============================ Dynamic Tab Title on Blur ============================== */
  var originalTitle = document.title;
  document.addEventListener('visibilitychange', function () {
    document.title = document.hidden ? 'Come back? 👋 — Aditya Chouhan' : originalTitle;
  });

  /* ============================ 3D Cosmic Starfield Canvas (Aakarsh Reference) ============================ */
  function initThreeBackground() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var starsGeometry = new THREE.BufferGeometry();
    var starsCount = window.innerWidth < 768 ? 1800 : 3200;
    var posArray = new Float32Array(starsCount * 3);

    for (var i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    function createStarTexture() {
      var starCanvas = document.createElement('canvas');
      starCanvas.width = 32;
      starCanvas.height = 32;

      var ctx = starCanvas.getContext('2d');
      var center = 16;
      var radius = 14;

      var gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.35, 'rgba(216, 180, 254, 0.9)');
      gradient.addColorStop(0.7, 'rgba(100, 229, 255, 0.45)');
      gradient.addColorStop(1, 'rgba(100, 229, 255, 0)');

      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      return new THREE.CanvasTexture(starCanvas);
    }

    var starsMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: createStarTexture(),
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false
    });

    var starMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starMesh);

    camera.position.z = 20;

    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    if (!isTouch) {
      window.addEventListener('mousemove', function (event) {
        mouseX = (event.clientX - windowHalfX) * 0.0001;
        mouseY = (event.clientY - windowHalfY) * 0.0001;
      }, { passive: true });
    }

    var animId = null;

    function animate() {
      animId = requestAnimationFrame(animate);

      starMesh.rotation.y += 0.0002;
      starMesh.rotation.x += 0.00008;

      if (!isTouch) {
        starMesh.rotation.y += mouseX * 0.35;
        starMesh.rotation.x += mouseY * 0.35;
      }

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
      } else {
        animate();
      }
    });
  }

  // Initialize Three.js 3D Background after preloader curtains clear
  if (!prefersReducedMotion) {
    runAfterPreloader(function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThreeBackground);
      } else {
        initThreeBackground();
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

