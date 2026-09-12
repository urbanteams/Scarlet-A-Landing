import type { APIRoute } from 'astro';

// Must run on the server, not be prerendered at build time.
export const prerender = false;

/**
 * Rudimentary interest-list storage.
 *
 * Entries are appended as JSON Lines to `data/interest-list.jsonl` in the
 * project folder. This works when the site is run locally (`npm run dev`,
 * `npm run preview`) because there is a real writable filesystem.
 *
 * NOTE: On Cloudflare Workers (production) the filesystem is read-only, so the
 * write below will throw. We catch it, log the entry so it still shows up in
 * the Workers log tail (observability is enabled in wrangler.jsonc), and return
 * success to the visitor. Swap the `storeEntry` body for KV / D1 / an email
 * service when you want durable production storage.
 */
const STORE_PATH = 'data/interest-list.jsonl';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function storeEntry(line: string): Promise<boolean> {
  try {
    const [{ appendFile, mkdir }, { dirname, resolve }] = await Promise.all([
      import('node:fs/promises'),
      import('node:path'),
    ]);
    const file = resolve(process.cwd(), STORE_PATH);
    await mkdir(dirname(file), { recursive: true });
    await appendFile(file, line + '\n', 'utf8');
    return true;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  let email = '';

  try {
    const body = await request.json();
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const line = JSON.stringify({
    email,
    list: 'suspects-live',
    at: new Date().toISOString(),
  });

  const stored = await storeEntry(line);
  if (!stored) {
    // Read-only filesystem (Cloudflare Workers) — surface it in the logs.
    console.warn(`[interest-list] could not write to ${STORE_PATH}; entry: ${line}`);
  }

  return json({ ok: true, stored });
};
