import { defineMiddleware } from 'astro:middleware';

const TRIANGLE_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="16" fill="#050505"/>
  <polygon points="64,18 112,104 16,104" fill="#DC2626" stroke="#DC2626" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname === '/triangle' || url.pathname.startsWith('/triangle/')) {
    // Serve custom red triangle favicon instead of the external app's default
    if (/\/triangle\/favicon\.(svg|ico)/.test(url.pathname)) {
      return new Response(TRIANGLE_FAVICON, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    const targetUrl = `https://triangle-teal.vercel.app${url.pathname}${url.search}`;
    const response = await fetch(targetUrl);

    // Inject favicon link into HTML responses
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      const faviconLink = '<link rel="icon" type="image/svg+xml" href="/triangle/favicon.svg">';
      const modifiedHtml = html.replace('<head>', `<head>\n${faviconLink}`);
      return new Response(modifiedHtml, {
        status: response.status,
        headers: response.headers,
      });
    }

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }

  return next();
});
