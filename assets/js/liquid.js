/* =========================================================
   REYON · LIQUID PREMIUM — Interactions
   - Single delegated ripple listener for all .btn-liquid
   - Soft 12px aqua-glow cursor follower (desktop only)
   - Both honor prefers-reduced-motion
   ========================================================= */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* -------------------- PAGE TRANSITION + PREFETCH — fast water-ripple wipe -------------------- */
  if (!prefersReduced) {
    const SAME_PAGE_RX = /^(#|mailto:|tel:|javascript:|sms:)/i;
    const prefetched = new Set();

    const isInternalNav = (link) => {
      if (!link) return null;
      if (link.target && link.target !== '_self') return null;
      const href = link.getAttribute('href');
      if (!href || SAME_PAGE_RX.test(href)) return null;
      let url;
      try { url = new URL(href, location.href); } catch (_) { return null; }
      if (url.origin !== location.origin) return null;
      if (url.pathname === location.pathname && url.search === location.search) return null;
      return url;
    };

    // Prefetch on hover/touchstart so the next page is already in the cache when clicked
    const prefetch = (url) => {
      const href = url.href;
      if (prefetched.has(href)) return;
      prefetched.add(href);
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      document.head.appendChild(link);
    };
    document.addEventListener('mouseover', (e) => {
      const url = isInternalNav(e.target.closest && e.target.closest('a[href]'));
      if (url) prefetch(url);
    }, { passive: true });
    document.addEventListener('touchstart', (e) => {
      const url = isInternalNav(e.target.closest && e.target.closest('a[href]'));
      if (url) prefetch(url);
    }, { passive: true });

    // Click → wipe + navigate (overlapping for snappier feel)
    document.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const link = e.target.closest('a[href]');
      const url = isInternalNav(link);
      if (!url) return;

      e.preventDefault();

      const overlay = document.createElement('div');
      overlay.className = 'page-transition';
      overlay.style.setProperty('--x', e.clientX + 'px');
      overlay.style.setProperty('--y', e.clientY + 'px');
      document.body.appendChild(overlay);

      // Force reflow → trigger CSS transition
      void overlay.offsetWidth;
      overlay.classList.add('is-active');

      // Fire navigation while the wipe is still expanding (180ms in).
      // The new page begins fetching/painting overlapped with the visual,
      // and prefetch above usually has it cached already.
      setTimeout(() => { window.location.href = url.href; }, 180);
    });
  }

  /* -------------------- WOW MOMENT — choreography -------------------- */
  /* Inline script in <body> decided whether the wow runs (sets `.wow-running`).
     liquid.js orchestrates the remaining timing if it did. */
  const wowOverlay = document.getElementById('wowOverlay');
  if (wowOverlay) {
    if (document.body.classList.contains('wow-running')) {
      const prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';

      // 1000ms: overlay starts fading; content begins revealing
      setTimeout(() => {
        wowOverlay.classList.add('is-fading');
        document.body.classList.remove('wow-running');
        document.body.classList.add('wow-revealed');
      }, 1000);

      // 1500ms: overlay removed from DOM, scroll unlocked
      setTimeout(() => {
        wowOverlay.remove();
        document.documentElement.style.overflow = prevOverflow;
      }, 1500);

      // 2400ms: drop reveal helper class
      setTimeout(() => {
        document.body.classList.remove('wow-revealed');
      }, 2400);
    } else {
      // Inline gate decided to skip — kill the overlay
      wowOverlay.remove();
    }
  }

  /* -------------------- Liquid ripple -------------------- */
  if (!prefersReduced) {
    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('.btn-liquid');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      // Ripple must cover the whole button — diagonal × 2 is a safe overshoot
      const size = Math.hypot(rect.width, rect.height) * 2;

      const wave = document.createElement('span');
      wave.className = 'liquid-ripple';
      wave.style.width  = size + 'px';
      wave.style.height = size + 'px';
      wave.style.left   = (e.clientX - rect.left - size / 2) + 'px';
      wave.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
      btn.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove(), { once: true });
    }, { passive: true });
  }

  /* -------------------- Stat counters + drip on completion -------------------- */
  const statEls = document.querySelectorAll('[data-stat]');
  if (statEls.length) {
    const animate = (el) => {
      const target = parseInt(el.dataset.stat, 10) || 0;
      const duration = 1500;
      const start = performance.now();
      const card = el.closest('.stat-card');

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target).toString();
        if (t < 1) {
          requestAnimationFrame(tick);
        } else if (card) {
          // Pause briefly so the number registers, then drip
          setTimeout(() => {
            card.classList.add('is-dripped');
            // Auto-clear so the animation can re-trigger if the user scrolls back
            setTimeout(() => card.classList.remove('is-dripped'), 1500);
          }, 180);
        }
      };
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    statEls.forEach((el) => obs.observe(el));
  }

  /* -------------------- Nav: aqua-glow pulse on scroll-stop -------------------- */
  const nav = document.getElementById('nav');
  if (nav && !prefersReduced) {
    let scrollTimer = null;
    let lastPulseY = window.scrollY;
    let scrolledDistance = 0;

    window.addEventListener('scroll', () => {
      // Track distance scrolled since last pulse
      scrolledDistance = Math.abs(window.scrollY - lastPulseY);

      // Reset pending pulse
      clearTimeout(scrollTimer);
      nav.classList.remove('is-pulsing');

      // Wait for stop, then pulse if we actually moved
      scrollTimer = setTimeout(() => {
        if (scrolledDistance > 80) {
          // Force reflow before re-adding to restart animation
          void nav.offsetWidth;
          nav.classList.add('is-pulsing');
          lastPulseY = window.scrollY;
          setTimeout(() => nav.classList.remove('is-pulsing'), 1900);
        }
      }, 260);
    }, { passive: true });
  }

  /* -------------------- Cursor follower -------------------- */
  if (isFinePointer && !prefersReduced) {
    const cursor = document.createElement('div');
    cursor.className = 'liquid-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    let mx = window.innerWidth / 2,  my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let active = false;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!active) { active = true; cursor.classList.add('is-active'); }
    });
    document.addEventListener('mouseleave', () => { cursor.classList.remove('is-active'); active = false; });
    document.addEventListener('mouseenter', () => { cursor.classList.add('is-active'); active = true; });

    const hoverSel = 'a, button, [role="button"], input, textarea, select, label, .btn-liquid, .glass';
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest && e.target.closest(hoverSel)) cursor.classList.add('is-hover');
    });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest && e.target.closest(hoverSel)) cursor.classList.remove('is-hover');
    });

    const tick = () => {
      // Lag factor — lower = laggier, smoother
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();
  }
})();
