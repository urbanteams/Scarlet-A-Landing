import { defineMiddleware } from 'astro:middleware';

const TRIANGLE_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="16" fill="#050505"/>
  <polygon points="64,18 112,104 16,104" fill="#DC2626" stroke="#DC2626" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

const DICE_SIX_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="20" fill="#050505"/>
  <rect x="12" y="12" width="104" height="104" rx="14" fill="#111111" stroke="#DC2626" stroke-width="3"/>
  <circle cx="36" cy="36" r="10" fill="#DC2626"/>
  <circle cx="92" cy="36" r="10" fill="#DC2626"/>
  <circle cx="36" cy="64" r="10" fill="#DC2626"/>
  <circle cx="92" cy="64" r="10" fill="#DC2626"/>
  <circle cx="36" cy="92" r="10" fill="#DC2626"/>
  <circle cx="92" cy="92" r="10" fill="#DC2626"/>
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

  if (url.pathname === '/666' || url.pathname.startsWith('/666/')) {
    // Serve custom dice favicon instead of the external app's default
    if (/\/666\/favicon\.(svg|ico)/.test(url.pathname)) {
      return new Response(DICE_SIX_FAVICON, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    const targetUrl = `https://666-one-theta.vercel.app${url.pathname}${url.search}`;
    const response = await fetch(targetUrl);

    // Inject favicon link into HTML responses
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      const faviconLink = '<link rel="icon" type="image/svg+xml" href="/666/favicon.svg">';
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

  if (url.pathname === '/gazump' || url.pathname.startsWith('/gazump/')) {
    // Serve gazump.png as the favicon directly
    if (url.pathname === '/gazump/favicon.png' || url.pathname === '/gazump/favicon.ico') {
      const faviconResponse = await fetch(new URL('/gazump.png', context.request.url));
      return new Response(faviconResponse.body, {
        status: 200,
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    const targetUrl = `https://gazump.vercel.app${url.pathname}${url.search}`;
    const response = await fetch(targetUrl);

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      let html = await response.text();
      // Inject favicon and override title
      const faviconLink = '<link rel="icon" type="image/png" href="/gazump/favicon.png">';
      html = html.replace('<head>', `<head>\n${faviconLink}`);
      html = html.replace(/<title>[^<]*<\/title>/, '<title>GAZUMP!</title>');
      return new Response(html, {
        status: response.status,
        headers: response.headers,
      });
    }

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }

  if (url.pathname === '/target' || url.pathname.startsWith('/target/')) {
    const targetUrl = `https://target-number.vercel.app${url.pathname}${url.search}`;
    const response = await fetch(targetUrl);

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      return new Response(html, {
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
