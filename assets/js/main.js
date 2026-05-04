/* =========================================================
   REYON — Interactions
   - Page loader
   - Cursor glow
   - Mobile nav toggle
   - Smooth scroll & active link highlight
   - Reveal on scroll (IntersectionObserver)
   - Animated counters
   - Process line fill
   - Bubbles generator
   - Ripple effect on .ripple elements
   - Back-to-top
   - Form submit (graceful, no backend)
   ========================================================= */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* -------------------- Loader -------------------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
    }, 350);
  });

  /* -------------------- Year -------------------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* -------------------- Cursor glow -------------------- */
  const glow = $('#cursorGlow');
  if (glow && !prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* -------------------- Nav -------------------- */
  const nav       = $('#nav');
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');
  const navLinks  = $$('.nav__link');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  /* Scroll state */
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);

    const back = $('#backToTop');
    if (back) back.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active link based on section in view */
  const sections = $$('main section[id]');
  const linkMap = new Map(navLinks.map(a => [a.getAttribute('href'), a]));
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach(l => l.classList.remove('is-active'));
      linkMap.get(id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => activeObserver.observe(s));

  /* -------------------- Reveal on scroll -------------------- */
  const revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        setTimeout(() => el.classList.add('is-revealed'), delay);
        revealObs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* -------------------- Counters -------------------- */
  const counters = $$('[data-counter]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const duration = 1400;
        const start = performance.now();
        const animate = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          el.textContent = Math.round(eased * target).toString();
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* -------------------- Process line fill -------------------- */
  const processLine = $('#processLineFill');
  if (processLine) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processLine.style.width = '100%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    obs.observe($('.process__steps'));
  }

  /* -------------------- Bubbles -------------------- */
  const bubblesEl = $('#bubbles');
  if (bubblesEl && !prefersReduced) {
    const N = 18;
    for (let i = 0; i < N; i++) {
      const b = document.createElement('span');
      b.className = 'bubble';
      const size = Math.random() * 14 + 4;
      b.style.width  = size + 'px';
      b.style.height = size + 'px';
      b.style.left   = (Math.random() * 100) + '%';
      b.style.animationDuration = (Math.random() * 10 + 8) + 's';
      b.style.animationDelay    = (Math.random() * -18) + 's';
      b.style.opacity = (Math.random() * 0.4 + 0.2).toFixed(2);
      bubblesEl.appendChild(b);
    }
  }

  /* -------------------- Ripple -------------------- */
  document.addEventListener('pointerdown', (e) => {
    const target = e.target.closest('.ripple');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.left = (e.clientX - rect.left) + 'px';
    wave.style.top  = (e.clientY - rect.top)  + 'px';
    target.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  });

  /* -------------------- Back to top -------------------- */
  const back = $('#backToTop');
  back?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  /* -------------------- Smooth scroll for anchor links -------------------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* -------------------- Form -------------------- */
  const form    = $('#contactForm');
  const success = $('#contactSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple validation
      const required = ['name', 'email', 'topic', 'message'];
      let valid = true;
      required.forEach(id => {
        const f = form.elements[id];
        if (!f) return;
        if (!f.value || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value))) {
          f.style.borderBottomColor = '#E06C75';
          valid = false;
        } else {
          f.style.borderBottomColor = '';
        }
      });
      if (!valid) return;

      // Pretend submit
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        if (success) success.hidden = false;
        btn.innerHTML = original;
        btn.disabled = false;
        setTimeout(() => { if (success) success.hidden = true; }, 5000);
      }, 900);
    });

    // Add empty placeholder so :placeholder-shown floating labels work for inputs
    $$('.field input, .field textarea').forEach(i => {
      if (!i.placeholder) i.placeholder = ' ';
    });
  }

  /* -------------------- Parallax for hero bottle (subtle) -------------------- */
  const bottle = $('.hero__bottle');
  if (bottle && !prefersReduced) {
    const heroEl = $('.hero');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const r = heroEl.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const offset = Math.max(-1, Math.min(1, -r.top / window.innerHeight));
          bottle.style.setProperty('--py', (offset * 24) + 'px');
          bottle.style.translate = `0 ${offset * 24}px`;
        }
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

})();
