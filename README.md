# Reyon Group — Premium Drinking Water

Modern, single-page marketing site for Reyon Group, built with vanilla HTML, CSS and JavaScript. No build step, no framework, no dependencies — just a fast, beautiful, mobile-first experience.

## Highlights

- **Performance-first**: pure static HTML/CSS/JS, ships in a single small payload, perfect Lighthouse scores out of the box.
- **Animated hero** with layered SVG waves, floating bubbles, ambient color orbs and a 3D-feeling product bottle.
- **Ripple click effects** on all primary actions.
- **Scroll-reveal animations** powered by `IntersectionObserver`.
- **Animated stats counters** and a connecting process timeline.
- **Glassmorphism nav** that compacts on scroll.
- **Floating cursor glow** on devices with a fine pointer.
- **Fully mobile-responsive** with a slide-out drawer nav.
- **Accessible**: semantic HTML, focus styles, ARIA labels, honors `prefers-reduced-motion`.

## Structure

```
.
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/favicon.svg
└── README.md
```

## Run locally

The site is fully static — open `index.html` in any browser, or serve it with any static server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit http://localhost:8000.

## Deploy

Works out of the box with:

- **GitHub Pages** — push to `main`, enable Pages from the repo Settings.
- **Netlify / Vercel** — drag-and-drop or connect the repo. No build command required.
- **Cloudflare Pages** — connect repo, leave build command blank, set output dir to `/`.

## Editing content

- Text content lives in `index.html` (sections are clearly commented).
- Brand colours are CSS custom properties at the top of `assets/css/style.css`.
- Animations and interactions live in `assets/js/main.js`.

## Brand

- Tagline: **Fuel your lifestyle.**
- Mission: To produce and bring clean, premium healthy drinking water to humanity.
- Products: Reyon 50CL · 75CL · 1.5L · 19L Dispenser

## Contact

- Email: enquiry@reyongroup.com
- Lagos: +234 814 173 8501 · Golf Road, off Lekki-Epe Expressway, Lakowe
- Warri: +234 816 486 9309 · Temile Street, By NPA New Port, Warri

---

© Reyon Group. All rights reserved.
