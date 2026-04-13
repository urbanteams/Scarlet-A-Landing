# Proxying a Vercel-hosted game through scarletagames.com

Read this if you are adding a new `scarletagames.com/<game>` route that proxies to an external Vercel project. Both the landing site (this repo) and the game's Vercel repo need changes.

## Step 1: Add the proxy route (this repo)

Add a condition in `src/middleware.ts` before `return next()`:
```ts
if (url.pathname === '/newgame' || url.pathname.startsWith('/newgame/')) {
  const targetUrl = `https://newgame-app.vercel.app${url.pathname}${url.search}`;
  const response = await fetch(targetUrl);
  return new Response(response.body, { status: response.status, headers: response.headers });
}
```
Then commit, push, and Cloudflare Pages will auto-deploy.

## Step 2: Configure the Vercel project (the game's repo)

**Both** of these changes are needed in the game's repo:

1. **Set the Vite base path** in `vite.config.ts` (or `.js`):
   ```ts
   export default defineConfig({
     base: '/newgame',
     // ...existing config
   })
   ```
   This makes the built HTML reference assets at `/newgame/assets/...` instead of `/assets/...`. Without this, assets will 404 when accessed through the proxy because the browser will request `scarletagames.com/assets/...` which is not a proxied path.

2. **Add Vercel rewrites** in `vercel.json` at the repo root:
   ```json
   {
     "rewrites": [
       { "source": "/newgame/assets/:path*", "destination": "/assets/:path*" },
       { "source": "/newgame", "destination": "/index.html" },
       { "source": "/newgame/:path*", "destination": "/index.html" }
     ]
   }
   ```
   This is needed because Vite's `base` config only changes asset *references* in the HTML — it does NOT move the actual files. Vercel still serves files from the root, so `/newgame` would 404 without these rewrites. The rewrites map `/newgame` → `index.html` and `/newgame/assets/*` → the actual asset files.

Commit, push, and Vercel will auto-deploy.

## Why both are needed (common pitfall)

- `base` alone → HTML loads but references `/newgame/assets/...` which Vercel can't find → blank page
- `vercel.json` alone → Vercel serves the page at `/newgame` but HTML references `/assets/...` → browser requests `scarletagames.com/assets/...` → not proxied → blank page
- Both together → Vercel serves at `/newgame`, HTML references `/newgame/assets/...`, Vercel rewrites those to actual files → everything works

## How to verify

1. After Vercel deploys: visit `<app>.vercel.app/<game>` directly — it should load
2. After Cloudflare deploys: visit `scarletagames.com/<game>` — it should load with the URL staying in the browser

## Current routes

| Route | Origin | Notes |
|---|---|---|
| `/triangle` | `triangle-teal.vercel.app` | Scarlet Triangle game |
| `/666` | `666-one-theta.vercel.app` | 666 dice game |
| `/target` | `target-number.vercel.app` | Target Number game |
| `/gazump` | `gazump.fly.dev` | Gazump bidding game (Fly.io, Python) |

## Static asset naming caveat

Avoid naming images in `public/` with a prefix that matches a proxy route. The middleware checks `url.pathname.startsWith('/<game>/')` (with trailing slash), so a file like `/targetfinal.jpg` is fine — but a file at `/target/something.jpg` would be intercepted and proxied to Vercel instead of served as a static asset.

## Why not `_redirects`?

Cloudflare Workers doesn't support proxy (200) redirects to external URLs in `_redirects`. Astro middleware running in the Worker handles this instead.
