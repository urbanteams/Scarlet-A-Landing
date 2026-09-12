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

### Apps that serve at root (no base path)

If the external app serves at `/` instead of `/<game>` (i.e. it has no Vite `base` or `vercel.json` rewrites), strip the prefix before forwarding:
```ts
const strippedPath = url.pathname.replace(/^\/newgame\/?/, '/');
const targetUrl = `https://newgame-app.vercel.app${strippedPath}${url.search}`;
```
Skip Step 2 entirely in this case — no `base` or `vercel.json` changes needed in the game repo.

**Two extra requirements for root-based apps:**

1. **Forward the full request** — not just the URL. A plain `fetch(url)` defaults to GET, breaking POST API calls. Pass method, headers, and body:
   ```ts
   const response = await fetch(targetUrl, {
     method: context.request.method,
     headers: context.request.headers,
     body: context.request.method !== 'GET' && context.request.method !== 'HEAD' ? context.request.body : undefined,
   });
   ```
2. **Rewrite absolute API paths in the HTML** — if the app uses `fetch('/api/...')`, those will bypass the proxy. Rewrite them in the HTML response:
   ```ts
   html = html.replaceAll("fetch('/api/", "fetch('/newgame/api/");
   ```

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
| `/gazump` | `gazump.vercel.app` | Gazump bidding game — serves at root, prefix stripped in middleware. Custom favicon (gazump.png) and title ("GAZUMP!") injected via HTML rewriting. |

## Custom favicon and title per game

The middleware can inject a custom favicon and override the tab title for any proxied game by rewriting the HTML response. See `/gazump` and `/triangle` in `middleware.ts` for examples. The pattern:
1. Intercept `/<game>/favicon.(png|svg|ico)` requests and serve the asset directly (from `public/` or inline SVG)
2. In HTML responses, inject a `<link rel="icon">` into `<head>` and optionally replace `<title>` via regex

Place favicon images in `public/` (e.g. `public/gazump.png`). The middleware fetches them via the origin URL so they're served with correct content types.

## Static asset naming caveat

Avoid naming images in `public/` with a prefix that matches a proxy route. The middleware checks `url.pathname.startsWith('/<game>/')` (with trailing slash), so a file like `/targetfinal.jpg` is fine — but a file at `/target/something.jpg` would be intercepted and proxied to Vercel instead of served as a static asset.

## Why not `_redirects`?

Cloudflare Workers doesn't support proxy (200) redirects to external URLs in `_redirects`. Astro middleware running in the Worker handles this instead.
