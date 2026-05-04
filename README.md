# Reyon Group — Premium Drinking Water

Modern dark-themed multi-page website for Reyon Group, built with vanilla HTML, CSS and JavaScript. No build step, no framework, no dependencies — just a fast, beautiful, mobile-first experience that loads in under a second.

## Highlights

- **Pure static stack** — vanilla HTML/CSS/JS, ships in a single small payload, perfect Lighthouse scores out of the box.
- **Scroll-driven rotating water drop** as the hero centerpiece — full 720° rotation tied to scroll position.
- **Auto-advancing hero slider** with three slides, dot navigation, prev/next, keyboard arrows, touch swipe, pause-on-hover.
- **Custom cursor** with magnetic button effects and 3D product card tilt on desktop.
- **Ripple click effects** on all primary actions.
- **Scroll-reveal animations** powered by `IntersectionObserver`.
- **Animated stats counters**, drawing-in process timeline, page progress bar.
- **Glassmorphism nav** that compacts on scroll + slide-out mobile drawer.
- **Marquee strip** of certifications under the hero.
- **Massive parallax wordmark** at the bottom of the home page.
- **Honors `prefers-reduced-motion`** and falls back gracefully on coarse-pointer devices.

## Pages

```
index.html         — Home with hero slider, video placeholder, products preview, blog teaser, CTA
about.html         — Story, mission/vision/promise, 3-stage process, locations
products.html      — Detailed view of all four products (50CL, 75CL, 1.5L, 19L)
contact.html       — Contact form, info chips, business hours, locations
blog.html          — Blog listing with featured post + grid
blog-*.html        — Three full-length sample blog posts (Wellness, Process, Guide)
```

## Structure

```
.
├── index.html
├── about.html
├── products.html
├── contact.html
├── blog.html
├── blog-the-science-of-hydration.html
├── blog-our-purification-process.html
├── blog-choosing-your-water-format.html
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

# Node
npx serve .
```

Then visit http://localhost:8000.

## Deploy

Works out of the box with:

- **GitHub Pages** — push to `main`, enable Pages from the repo Settings.
- **Netlify / Vercel** — drag-and-drop or connect the repo. No build command required.
- **Cloudflare Pages** — connect repo, leave build command blank, set output dir to `/`.

## Wiring up the contact form

The form validates and shows a success message but doesn't actually send. To go live, swap to one of:

- **[Formspree](https://formspree.io)** — change form action to your Formspree endpoint.
- **[Web3Forms](https://web3forms.com)** — single attribute change, free for up to 250 submissions/month.
- **Netlify Forms** — add `netlify` attribute to the `<form>` tag if hosted on Netlify.

## Embedding a real video

Replace the `.video__player` block in `index.html` with:

```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        frameborder="0" allowfullscreen></iframe>
```

…or a self-hosted `<video>` tag.

## Editing content

- Text content lives in each page's `.html` file (clearly commented).
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
