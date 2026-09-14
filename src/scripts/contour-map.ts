// Contour Map background — topographic lines in scarlet, drawn on <canvas data-contour>.
//
// Every canvas samples one noise field in page coordinates, so the hero, a page
// masthead, and the fixed page layer all line up as a single landscape.
//
//   data-contour="hero"      full strength, slow drift, cleared behind the hero copy
//   data-contour="masthead"  mid strength, static; optional clearings (below)
//   data-contour="page"      low strength, fixed to the viewport, scrolls with the page
//
// Masthead clearings:
//   data-clear-y / data-clear-ry   soft ellipse centered on the title (px from page top)
//   data-column / data-column-top  soft vertical column kept clear for reading text

type Mode = 'hero' | 'masthead' | 'page';

interface Layer {
  cv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mode: Mode;
  w: number;
  h: number;
  visible: boolean;
}

const STRENGTH: Record<Mode, [major: number, minor: number]> = {
  hero: [0.8, 0.42],
  masthead: [0.55, 0.28],
  page: [0.38, 0.19],
};

// ── Perlin noise ──
const perm = new Uint8Array(512);
{
  let seed = 42;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function grad(h: number, x: number, y: number): number {
  switch (h & 7) {
    case 0: return x + y;
    case 1: return -x + y;
    case 2: return x - y;
    case 3: return -x - y;
    case 4: return x;
    case 5: return -x;
    case 6: return y;
    default: return -y;
  }
}

function noise(x: number, y: number): number {
  const xf = Math.floor(x);
  const yf = Math.floor(y);
  const X = xf & 255;
  const Y = yf & 255;
  x -= xf;
  y -= yf;
  const u = fade(x);
  const v = fade(y);
  const a = perm[X] + Y;
  const b = perm[X + 1] + Y;
  return lerp(
    lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u),
    lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u),
    v,
  );
}

function fbm(x: number, y: number): number {
  return (
    noise(x, y) +
    0.5 * noise(x * 2.03 + 11.3, y * 2.03 + 7.1) +
    0.25 * noise(x * 4.1 + 3.7, y * 4.1 + 17.9)
  ) / 1.4;
}

// ── Marching squares ──
// Edges: 0 top, 1 right, 2 bottom, 3 left. Index bits: top-left 8, top-right 4, bottom-right 2, bottom-left 1.
const SEGMENTS: Record<number, [number, number][]> = {
  1: [[3, 2]], 2: [[2, 1]], 3: [[3, 1]], 4: [[0, 1]], 5: [[3, 0], [2, 1]], 6: [[0, 2]], 7: [[3, 0]],
  8: [[3, 0]], 9: [[0, 2]], 10: [[0, 1], [3, 2]], 11: [[0, 1]], 12: [[3, 1]], 13: [[2, 1]], 14: [[3, 2]],
};

function drawContours(ctx: CanvasRenderingContext2D, w: number, h: number, mode: Mode, yOffset: number, drift: number) {
  ctx.clearRect(0, 0, w, h);
  const step = Math.max(7, w / 150);
  const cols = Math.ceil(w / step) + 1;
  const rows = Math.ceil(h / step) + 1;
  const scale = 3.4 / Math.max(900, window.innerWidth);

  const field = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      field[j * cols + i] = fbm(i * step * scale + drift, (j * step + yOffset) * scale + 4.2 - drift * 0.6);
    }
  }

  const [majorAlpha, minorAlpha] = STRENGTH[mode];
  for (let level = 0; level < 22; level++) {
    const lv = -0.55 + level * 0.05;
    const major = level % 5 === 0;
    ctx.strokeStyle = major ? `rgba(235,60,52,${majorAlpha})` : `rgba(220,38,38,${minorAlpha})`;
    ctx.lineWidth = major ? 1.4 : 0.8;
    ctx.beginPath();
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = field[j * cols + i];
        const b = field[j * cols + i + 1];
        const c = field[(j + 1) * cols + i + 1];
        const d = field[(j + 1) * cols + i];
        const segs = SEGMENTS[(a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0)];
        if (!segs) continue;
        const x = i * step;
        const y = j * step;
        const point = (edge: number): [number, number] => {
          switch (edge) {
            case 0: return [x + (step * (lv - a)) / (b - a), y];
            case 1: return [x + step, y + (step * (lv - b)) / (c - b)];
            case 2: return [x + (step * (lv - d)) / (c - d), y + step];
            default: return [x, y + (step * (lv - a)) / (d - a)];
          }
        };
        for (const [e1, e2] of segs) {
          const [x1, y1] = point(e1);
          const [x2, y2] = point(e2);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }
    }
    ctx.stroke();
  }
}

// Soft-erase an ellipse (behind a headline).
function clearEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, 'rgba(0,0,0,1)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.94)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Soft-erase a centered vertical column (behind reading text).
function clearColumn(ctx: CanvasRenderingContext2D, w: number, h: number, width: number, top: number) {
  const feather = 72;
  const x0 = Math.max(0, (w - width) / 2);
  const x1 = Math.min(w, (w + width) / 2);
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';

  const vertical = ctx.createLinearGradient(0, top, 0, top + feather);
  vertical.addColorStop(0, 'rgba(0,0,0,0)');
  vertical.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = vertical;
  ctx.fillRect(x0, top, x1 - x0, h - top);

  const left = ctx.createLinearGradient(x0 - feather, 0, x0, 0);
  left.addColorStop(0, 'rgba(0,0,0,0)');
  left.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = left;
  ctx.fillRect(x0 - feather, top + feather, feather, h - top - feather);

  const right = ctx.createLinearGradient(x1, 0, x1 + feather, 0);
  right.addColorStop(0, 'rgba(0,0,0,1)');
  right.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = right;
  ctx.fillRect(x1, top + feather, feather, h - top - feather);

  ctx.restore();
}

function init() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layers: Layer[] = [];

  document.querySelectorAll<HTMLCanvasElement>('canvas[data-contour]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    layers.push({ cv, ctx, mode: cv.dataset.contour as Mode, w: 0, h: 0, visible: true });
  });
  if (!layers.length) return;

  const draw = (layer: Layer, time: number) => {
    const { cv, ctx, mode, w, h } = layer;
    if (!w || !h) return;

    if (mode === 'page') {
      drawContours(ctx, w, h, mode, window.scrollY, 0);
      return;
    }

    drawContours(ctx, w, h, mode, 0, mode === 'hero' && !reducedMotion ? time * 0.000012 : 0);

    if (mode === 'hero') {
      const rx = w < 768 ? w * 0.6 : Math.min(w * 0.36, 560);
      clearEllipse(ctx, w / 2, h * 0.53, rx, Math.min(h * 0.3, 300));
      return;
    }

    const { clearY, clearRy, column, columnTop } = cv.dataset;
    if (clearY) clearEllipse(ctx, w / 2, Number(clearY), Math.min(w * 0.34, 520), Number(clearRy ?? 170));
    if (column) clearColumn(ctx, w, h, Number(column), Number(columnTop ?? 0));
  };

  const resize = () => {
    const now = performance.now();
    for (const layer of layers) {
      const w = layer.cv.clientWidth;
      const h = layer.cv.clientHeight;
      layer.w = w;
      layer.h = h;
      if (!w || !h) continue; // hidden by a media query
      const dpr = Math.min(window.devicePixelRatio || 1, layer.mode === 'page' ? 1.5 : 2);
      layer.cv.width = Math.round(w * dpr);
      layer.cv.height = Math.round(h * dpr);
      layer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(layer, now);
    }
  };

  // Pause the hero drift while it is offscreen.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const layer = layers.find((l) => l.cv === entry.target);
      if (layer) layer.visible = entry.isIntersecting;
    }
  });
  layers.filter((l) => l.mode === 'hero').forEach((l) => observer.observe(l.cv));

  let scrollPending = false;
  window.addEventListener('scroll', () => { scrollPending = true; }, { passive: true });
  window.addEventListener('resize', resize);

  let lastHeroFrame = 0;
  const loop = (time: number) => {
    if (scrollPending) {
      scrollPending = false;
      layers.filter((l) => l.mode === 'page').forEach((l) => draw(l, time));
    }
    if (!reducedMotion && time - lastHeroFrame > 70) {
      lastHeroFrame = time;
      layers.filter((l) => l.mode === 'hero' && l.visible).forEach((l) => draw(l, time));
    }
    requestAnimationFrame(loop);
  };

  resize();
  requestAnimationFrame(loop);
}

init();
