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
