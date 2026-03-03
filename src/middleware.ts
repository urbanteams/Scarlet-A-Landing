import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname === '/triangle' || url.pathname.startsWith('/triangle/')) {
    const targetUrl = `https://triangle-teal.vercel.app${url.pathname}${url.search}`;
    const response = await fetch(targetUrl);

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }

  return next();
});
