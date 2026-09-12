# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server at http://localhost:4321 (hot reload)
npm run build    # Production build to dist/
npm run preview  # Serve the production build locally
```

## Stack

- **Astro 5** (static output, no SSR) + **Tailwind CSS v4**
- Tailwind v4 is configured via `@tailwindcss/vite` in `astro.config.mjs` — there is **no `tailwind.config.js`**. All configuration lives in `src/styles/global.css`.
- **Iconify** loaded via CDN for icons (lucide icon set)
- **Hosted on Cloudflare Pages** (via Wrangler). Wrangler auto-installs `@astrojs/cloudflare` adapter during deploy.

## Architecture

```
src/
├── middleware.ts            # Astro middleware — proxies external game routes (e.g. /triangle → triangle-teal.vercel.app)
├── styles/global.css        # Design tokens (@theme), keyframes, component classes (.reveal, .orb-*, .glow-btn, etc.)
├── layouts/Layout.astro     # HTML shell: Google Fonts (Inter, Playfair Display, Allura), Iconify CDN, global.css import
├── pages/index.astro        # Landing page — all sections inline (Nav, Hero, Games, Experiences, About Us, Blog, Footer) + client-side JS
├── pages/library.astro      # Game library page — catalog of all games
└── pages/api/interest.ts    # POST endpoint for the SUSpects Live interest list (server-rendered)
```

## External Game Routing

Games hosted on Vercel are proxied through `src/middleware.ts` so they appear under `scarletagames.com/<game>`. See **[vercel.md](vercel.md)** for the full setup checklist (covers both this repo and the game's Vercel repo).

## Design System — Dark Cinematic

The visual language uses a **pure black base `#050505`** with atmospheric red gradients, floating orbs, scroll-reveal animations, and parallax effects.

### Color tokens (from `@theme`)
- `--color-bg: #050505` — page background
- `--color-card: #111111` — card surfaces
- `--color-accent: #DC2626` — scarlet red accent
- `--color-accent-glow: rgba(220, 38, 38, 0.35)` — glow effects

### Typography (from `@theme`)
- `--font-sans` — Inter (body text)
- `--font-serif` — Playfair Display (headings)
- `--font-cursive` — Allura (logo, decorative headings)

### Component classes (defined in `global.css` `@layer components`)
| Class | Use |
|---|---|
| `.reveal` / `.reveal.active` | Scroll-triggered fade-up animation |
| `.orb-left` / `.orb-right` | Floating decorative orb animations |
| `.pulse-ring` | Pulsing glow ring on orbs |
| `.noise-overlay` | Fixed film-grain texture overlay |
| `.parallax-card-up` / `.parallax-card-down` | Scroll-driven parallax offset |
| `.glow-btn` | Button with red glow on hover (via `::before`) |

### Key rules
- Background is `#050505` — near-black. Cards use `#111111`.
- Depth from `box-shadow`, gradients, and opacity — not borders (except thin `border-white/10` on dark cards).
- Font classes: `font-serif` for Playfair Display headings, `font-cursive` for Allura logo/accents.
- Focus states: `focus-visible` outline with accent color.
- All custom styles live in `global.css` — no `<style>` blocks in Astro components.

## Editing Content

All content lives directly in [src/pages/index.astro](src/pages/index.astro):
- **Nav links**: Desktop nav `<div class="hidden md:flex">` section
- **Hero**: The `#hero-content-wrapper` div
- **Game cards**: The grid inside `#games` (also mirrored in `library.astro`)
- **SUSpects Live card + interest form**: The `#experiences` section
- **Bio and portrait**: The `#about` section (portrait loads `/about.jpg`; if that file is missing the `onerror` handler drops the `<img>` and an icon placeholder shows through)
- **Blog link and article thumbnails**: The `#blog` section
- **Footer social links**: The `#contact` footer

## Interest List (SUSpects Live)

The form in `#experiences` POSTs to `/api/interest`, which appends JSON Lines to
`data/interest-list.jsonl`. That directory is gitignored — it holds real email addresses.

**This only persists locally** (`npm run dev` / `npm run preview`). Cloudflare Workers has a
read-only filesystem, so in production the write fails, the entry is logged via
`console.warn` (visible in the Workers log tail — observability is on in `wrangler.jsonc`), and
the visitor still gets a success response. For durable production storage, replace the body of
`storeEntry()` in [src/pages/api/interest.ts](src/pages/api/interest.ts) with a Cloudflare KV or
D1 binding, or forward to an email service.
