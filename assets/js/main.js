/* =========================================================
   REYON v2 — Interactions
   - Loader · custom cursor · magnetic buttons · ripple
   - Scroll-tied drop rotation (home hero)
   - Reveal · counters · process rail fill · particles
   - Progress bar · section indicator · mobile nav · form
   - Product 3D tilt · logotype parallax
   ========================================================= */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* -------------------- Loader -------------------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (!loader) return document.body.classList.add('is-loaded');
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
    }, 480);
  });

  /* -------------------- Year -------------------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* -------------------- Custom cursor -------------------- */
  const cursor = $('#cursor');
  if (cursor && isFinePointer && !prefersReduced) {
    const ring = cursor.querySelector('.cursor__ring');
    const dot  = cursor.querySelector('.cursor__dot');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let dx = mx, dy = my;

    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    document.addEventListener('pointerup',   () => cursor.classList.remove('is-down'));

    const tick = () => {
      // Dot follows fast, ring lags for a smooth feel
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    // Hover targets
    const hoverSel = 'a, button, [data-cursor], input, textarea, select, .product, label';
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.add('is-hover');
    });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.remove('is-hover');
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* -------------------- Mobile nav -------------------- */
  const nav       = $('#nav');
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  $$('.nav__link').forEach(a => a.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  /* -------------------- Scroll state -------------------- */
  const progressBar = $('#progressBar');
  const back        = $('#backToTop');
  const sectionInd  = $('#sectionIndicator');

  const onScroll = () => {
    const sy = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    const p  = dh > 0 ? Math.min(1, sy / dh) : 0;

    nav?.classList.toggle('is-scrolled', sy > 40);
    if (progressBar) progressBar.style.width = (p * 100) + '%';
    back?.classList.toggle('is-visible', sy > 600);
    sectionInd?.classList.toggle('is-visible', sy > 200);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------- Active link & section indicator -------------------- */
  const sections = $$('main section[data-section]');
  const navLinks = $$('.nav__link');
  const linkMap  = new Map(navLinks.map(a => [a.getAttribute('href'), a]));

  if (sections.length) {
    const indNum  = sectionInd?.querySelector('.section-indicator__num');
    const indName = sectionInd?.querySelector('.section-indicator__name');

    const activeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id   = '#' + entry.target.id;
        const num  = entry.target.dataset.section;
        const name = entry.target.dataset.sectionName;

        // Only update active link if it's a same-page anchor
        navLinks.forEach(l => {
          if (l.getAttribute('href') === id) l.classList.add('is-active');
          else if (l.getAttribute('href')?.startsWith('#')) l.classList.remove('is-active');
        });

        if (indNum)  indNum.textContent  = num  || '';
        if (indName) indName.textContent = name || '';
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => activeObs.observe(s));
  }

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
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
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
        const duration = 1500;
        const start = performance.now();
        const animate = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(eased * target).toString();
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* -------------------- Process rail -------------------- */
  const processFill = $('#processRailFill');
  const processTL   = $('#processTimeline');
  if (processFill && processTL) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processFill.style.height = '100%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    obs.observe(processTL);
  }

  /* -------------------- Particles (hero) -------------------- */
  const particlesEl = $('#particles');
  if (particlesEl && !prefersReduced) {
    const N = 28;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.left   = (Math.random() * 100) + '%';
      p.style.animationDuration = (Math.random() * 14 + 12) + 's';
      p.style.animationDelay    = (Math.random() * -22) + 's';
      p.style.opacity = (Math.random() * 0.6 + 0.2).toFixed(2);
      particlesEl.appendChild(p);
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

  /* -------------------- Magnetic buttons -------------------- */
  if (isFinePointer && !prefersReduced) {
    $$('.magnetic').forEach(el => {
      const strength = 18;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top  - r.height / 2;
        el.style.transform = `translate(${x / r.width * strength}px, ${y / r.height * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* -------------------- Product 3D tilt -------------------- */
  if (isFinePointer && !prefersReduced) {
    $$('.tilt').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top)  / r.height;
        const rx = (0.5 - y) * 8;
        const ry = (x - 0.5) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* -------------------- Back to top -------------------- */
  back?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  /* -------------------- Smooth scroll for hash links -------------------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* -------------------- Scroll-driven hero drop -------------------- */
  const drop = $('#heroDrop');
  const dropCore = $('#dropCore');
  if (drop && dropCore && !prefersReduced) {
    const heroEl = drop.closest('.hero');
    let ticking = false;

    const update = () => {
      const r = heroEl.getBoundingClientRect();
      const total = window.innerHeight + r.height;
      const scrolled = window.innerHeight - r.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      // Generous rotation: ~720deg over the scroll
      const rot = progress * 720;
      // Scale ramps up slightly mid-scroll
      const scl = 1 + Math.sin(progress * Math.PI) * 0.06;
      // Subtle vertical drift
      const py  = (progress - 0.5) * 60;

      dropCore.style.setProperty('--rot', rot + 'deg');
      dropCore.style.setProperty('--scl', scl);
      dropCore.style.setProperty('--pyy', py + 'px');
      ticking = false;
    };
    update();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(update);
      ticking = true;
    }, { passive: true });
    window.addEventListener('resize', update);
  }

  /* -------------------- Logotype parallax -------------------- */
  const logoEl = $('.logotype__text');
  if (logoEl && !prefersReduced) {
    let ticking = false;
    const update = () => {
      const r = logoEl.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const offset = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        logoEl.style.transform = `translateX(${(offset - 0.5) * 80}px)`;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(update);
      ticking = true;
    }, { passive: true });
    update();
  }

  /* -------------------- Hero slider -------------------- */
  const slider = $('#heroSlider');
  if (slider) {
    const track   = $('#sliderTrack');
    const slides  = $$('.slide', track);
    const dots    = $$('.slider__dot', slider);
    const prev    = $('#sliderPrev');
    const next    = $('#sliderNext');
    const idxOut  = $('#sliderIndex');
    const totalOut= $('#sliderTotal');
    let active = 0;
    let timer  = null;
    const interval = 7000;

    // Reveal hidden slides — make them all DOM-present, JS controls visibility
    slides.forEach(s => s.removeAttribute('hidden'));
    if (totalOut) totalOut.textContent = String(slides.length).padStart(2, '0');

    const goto = (i, dir = 1) => {
      const old = active;
      active = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === active);
        s.classList.toggle('is-prev', idx === old && active !== old);
        s.style.setProperty('--dir', dir);
      });
      dots.forEach((d, idx) => {
        d.classList.toggle('is-active', idx === active);
        d.setAttribute('aria-selected', idx === active ? 'true' : 'false');
      });
      if (idxOut) idxOut.textContent = String(active + 1).padStart(2, '0');
    };

    const start = () => {
      stop();
      timer = setInterval(() => goto(active + 1, 1), interval);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    prev?.addEventListener('click', () => { goto(active - 1, -1); start(); });
    next?.addEventListener('click', () => { goto(active + 1, 1); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => {
      goto(i, i > active ? 1 : -1);
      start();
    }));

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { goto(active - 1, -1); start(); }
      if (e.key === 'ArrowRight') { goto(active + 1, 1);  start(); }
    });

    // Touch swipe support
    let touchX = 0;
    slider.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) { goto(active + 1, 1); }
        else { goto(active - 1, -1); }
        start();
      }
    });

    start();
  }

  /* -------------------- Video placeholder -------------------- */
  const videoPlayer = $('#videoPlayer');
  if (videoPlayer) {
    videoPlayer.addEventListener('click', (e) => {
      // Brief tap/feedback animation
      videoPlayer.classList.add('is-pressed');
      setTimeout(() => videoPlayer.classList.remove('is-pressed'), 600);
      // Real video: replace this block with embed swap.
    });
  }

  /* -------------------- Form -------------------- */
  const form    = $('#contactForm');
  const success = $('#contactSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = ['name', 'email', 'topic', 'message'];
      let valid = true;
      required.forEach(id => {
        const f = form.elements[id];
        if (!f) return;
        if (!f.value || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value))) {
          f.style.borderBottomColor = '#ff7a7a';
          valid = false;
        } else {
          f.style.borderBottomColor = '';
        }
      });
      if (!valid) return;

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
  }
})();
