// Where the project cards sit. Used when the pages are built and again in the browser,
// so the first paint and the live site always agree.

// Out of focus, in the distance: x/y in % of the screen, scale, rotation, blur (px) and opacity.
// mx/my are the positions on a phone, where the cards keep to the edges so the headline stays clear.
export const SCATTER = [
  { x: 13, y: 31, mx: 6, my: 19, s: 0.56, r: -6, b: 9, o: 0.9 },
  { x: 88, y: 27, mx: 96, my: 15, s: 0.5, r: 5, b: 12, o: 0.8 },
  { x: 80, y: 74, mx: 90, my: 74, s: 0.63, r: -4, b: 8, o: 0.9 },
  { x: 21, y: 77, mx: 9, my: 79, s: 0.59, r: 4, b: 10, o: 0.85 },
  { x: 53, y: 97, mx: 54, my: 100, s: 0.54, r: -2, b: 14, o: 0.7 },
  { x: 46, y: 2, mx: 48, my: -3, s: 0.45, r: 3, b: 16, o: 0.6 },
];

export function scatterStyle(i: number): string {
  const a = SCATTER[i % SCATTER.length];
  const bob = (6 + (i % 3) * 0.9).toFixed(1);
  const delay = (-i * 1.3).toFixed(1);
  return `--sx:${a.x};--sy:${a.y};--mx:${a.mx};--my:${a.my};--ss:${a.s};--sr:${a.r}deg;--sb:${a.b}px;--so:${a.o};--bob:${bob}s;--bobd:${delay}s`;
}

// In focus: the current card in the middle, its neighbours softer at the sides, the rest out of view.
// `cx` counts in "steps" (the distance between two neighbouring cards, set in CSS as --step).
export function carousel(i: number, idx: number, n: number) {
  const half = Math.floor(n / 2);
  const d = ((((i - idx + half) % n) + n) % n) - half;
  const ad = Math.abs(d);
  const side = d < 0 ? -1 : 1;
  return {
    d,
    cx: ad >= 2 ? side * (ad === 2 ? 1.83 : 2.58) : d,
    cs: ad === 0 ? 1 : ad === 1 ? 0.72 : 0.55,
    cb: ad === 0 ? 0 : ad === 1 ? 5 : 12,
    co: ad === 0 ? 1 : ad === 1 ? 0.85 : 0,
    cz: 3 - Math.min(ad, 2),
  };
}

export function carouselStyle(i: number, idx: number, n: number): string {
  const c = carousel(i, idx, n);
  return `--cx:${c.cx};--cs:${c.cs};--cb:${c.cb}px;--co:${c.co};--cz:${c.cz}`;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

// Text still waiting for real content is written [like this].
export const isTodo = (s: string | undefined) => !s || /^\s*\[.*\]\s*$/.test(s);
