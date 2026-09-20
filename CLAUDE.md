# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://localhost:4321 (hot reload)
npm run build      # Production build to dist/
npx wrangler dev   # Serve the built dist/ on the real Worker runtime (port 8787)
```

`npm run preview` does **not** work — the Cloudflare adapter rejects it ("does not support the
preview command"). Use `npx wrangler dev` after `npm run build` to check production behaviour.

## Stack

- **Astro 5** (`output: 'server'` + Cloudflare adapter; every page sets `prerender = true` except `api/interest.ts`) + **Tailwind CSS v4**
- Tailwind v4 is configured via `@tailwindcss/vite` in `astro.config.mjs` — there is **no `tailwind.config.js`**. All configuration lives in `src/styles/global.css`.
- **Iconify** loaded via CDN for icons (lucide icon set)
- **Hosted on Cloudflare.** `@astrojs/cloudflare` is a committed dependency; `wrangler.jsonc` points at `dist/_worker.js/index.js`.

## Deploying

**Pushing to `main` is the deploy.** Cloudflare builds from the GitHub repo itself — there is no
CI workflow, `dist/` is gitignored and has never been tracked, and you do not run `wrangler deploy`
locally. Verify with `npm run build` then `npx wrangler dev` before pushing.

Untracked junk lives at the repo root (raw image drops in `blog/`, stray screenshots). `.gitignore`
covers the known ones, but **never `git add -A` blindly** — check `git status --short` first.

## Architecture

```
src/
├── middleware.ts            # Astro middleware — proxies external game routes (e.g. /triangle → triangle-teal.vercel.app)
├── styles/global.css        # Design tokens (@theme), component classes (.reveal, .contour-*, .glow-btn, etc.)
├── scripts/contour-map.ts   # Draws the contour map background on every <canvas data-contour>
├── layouts/Layout.astro     # HTML shell: Google Fonts (Inter, Playfair Display, Allura), Iconify CDN, global.css import
├── pages/index.astro        # Landing page — all sections inline (Nav, Hero, Games, Experiences, About Us, Blog, Footer) + client-side JS
├── pages/library.astro      # Game library page — catalog of all games
├── pages/blog/index.astro   # /blog — every post stacked for continuous scroll + expandable sidebar
├── pages/blog/[slug].astro  # /blog/<slug> — per-post permalink pages
├── pages/api/interest.ts    # POST endpoint for the SUSpects Live interest list (server-rendered)
├── content.config.ts        # Blog collection schema (glob loader over src/content/blog)
└── content/blog/*.md        # One markdown file per post
```

## External Game Routing

Games hosted on Vercel are proxied through `src/middleware.ts` so they appear under `scarletagames.com/<game>`. See **[vercel.md](vercel.md)** for the full setup checklist (covers both this repo and the game's Vercel repo).

## Design System — Dark Cinematic

The visual language uses a **pure black base `#050505`** with a scarlet **contour map** background, scroll-reveal animations, and parallax effects.

**Contour map.** `<canvas data-contour="hero|masthead|page">` elements are drawn by
[src/scripts/contour-map.ts](src/scripts/contour-map.ts), imported from each page's `<script>`. All canvases
sample one noise field in page coordinates, so they line up as one landscape. Full strength only in the
landing hero; everything below it, plus Library and Blog, uses the faint treatment — reading text always
sits on plain black. Page roots are `relative isolate` so the `z-index: -10` layers stay under content.
Masthead canvases take optional clearings: `data-clear-y`/`data-clear-ry` (ellipse behind a title) and
`data-column`/`data-column-top` (a clear column for prose).

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
| `.contour-layer` / `.contour-hero-fade` | Full-strength contour canvas filling the landing hero |
| `.contour-masthead` | Mid-strength contour canvas behind a page title, fading out downward |
| `.contour-fixed` + `--wide` / `--margins` | Faint viewport-fixed contour canvas; `--wide` dims the middle (card pages), `--margins` keeps the text column clear (reading pages, hidden under 1100px) |
| `.footer-horizon` | Scarlet horizon glow and line along the footer's top edge |
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
- **Blog link and article thumbnails**: The `#blog` section — hardcoded cards that must be kept in sync with `src/content/blog/` by hand
- **Footer social links**: The `#contact` footer

## Blog — "Scarlet Strategy" (`/blog`)

Posts are markdown files in `src/content/blog/`, loaded as an Astro content collection
(`src/content.config.ts`). **Adding a post = dropping in one file**; both `/blog` and its
permalink page pick it up automatically.

Frontmatter: `title`, `slug`, `excerpt`, `tag` (`Strategy` | `Game Design`), `date`, `author`.

- **`date` is sort-order metadata only and is never rendered.** Posts must read as evergreen —
  do not surface dates anywhere in the UI. Newest first.
- **Author is always "Devon Sampson."**
- `/blog` renders every post stacked, so scrolling flows from one into the next. Fine to ~20
  posts; past that, add pagination or lazy-loading.
- Content is authored by pasting **WordPress block-editor markup**, converted by hand: strip
  `<!-- wp:* -->` comments, `<em>`/`<strong>` → markdown emphasis, `<h2>` → `##`, lists → `-`.
  Figures and video embeds stay as raw HTML so captions survive (markdown allows inline HTML).
- Post images go in `public/blog/` (compressed). Raw originals dropped in the root `blog/`
  folder are gitignored — compress with `sips` or `cwebp` before copying into `public/blog/`.
  WebP is fine and well supported.
- Blog-specific styles are the `.blog-*` classes in `global.css`: `.blog-prose`, `.blog-figure`,
  `.blog-figure-narrow` (centered, capped at 420px for small source images), `.blog-gallery-grid`,
  `.blog-embed` (16:9 iframes), `.blog-divider`, `.blog-sidebar*`.

**The landing page blog cards are hardcoded**, not generated from the collection — the three
`<article>` blocks in `#blog` of `index.astro` must be updated by hand when posts change.

## Gotchas

- **Never add a `/blog` proxy route to `middleware.ts`.** It would intercept `/blog/*.jpg` and
  break every post image. Same class of bug as the asset-prefix caveat in `vercel.md`.
- **Tailwind v4 preflight sets `list-style: none`.** Any prose block needs an explicit
  `list-style-type` or bullets vanish (see `.blog-prose ul` / `ol`).
- **A stale `.astro/data-store.json` causes spurious `Duplicate id` warnings** on build after
  editing content files while the dev server is running. `rm -rf .astro/data-store.json` clears it.
- **`curl` against `player.vimeo.com` returns 401** even for public videos — Vimeo blocks
  non-browser requests. Check embeds in a real browser, not with curl.

## Interest List (SUSpects Live)

The form in `#experiences` POSTs to `/api/interest`, which appends JSON Lines to
`data/interest-list.jsonl`. That directory is gitignored — it holds real email addresses.

**This only persists locally** (`npm run dev`). Cloudflare Workers has a
read-only filesystem, so in production the write fails, the entry is logged via
`console.warn` (visible in the Workers log tail — observability is on in `wrangler.jsonc`), and
the visitor still gets a success response. For durable production storage, replace the body of
`storeEntry()` in [src/pages/api/interest.ts](src/pages/api/interest.ts) with a Cloudflare KV or
D1 binding, or forward to an email service.
