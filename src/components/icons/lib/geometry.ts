/**
 * Tiny geometry helpers used to generate repetitive SVG shapes (sparkles, seeds, seal edges)
 * once at module level instead of hand-writing dozens of coordinates.
 */

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * 4-point "AI sparkle" star centred on (cx, cy) with tip radius `r`. `pinch` (0…0.5) is how
 * close the concave sides get to the centre: lower = slimmer star.
 */
export function sparklePath(cx: number, cy: number, r: number, pinch = 0.2): string {
  const k = r * pinch;
  return [
    `M${round(cx)} ${round(cy - r)}`,
    `Q${round(cx + k)} ${round(cy - k)} ${round(cx + r)} ${round(cy)}`,
    `Q${round(cx + k)} ${round(cy + k)} ${round(cx)} ${round(cy + r)}`,
    `Q${round(cx - k)} ${round(cy + k)} ${round(cx - r)} ${round(cy)}`,
    `Q${round(cx - k)} ${round(cy - k)} ${round(cx)} ${round(cy - r)}Z`,
  ].join('');
}

export type Polar = { x: number; y: number; angle: number };

/** `count` points evenly spread on a circle; `angle` is in degrees (0 = up, clockwise). */
export function ring(cx: number, cy: number, radius: number, count: number, startDeg = 0): Polar[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = startDeg + (360 / count) * i;
    const rad = (angle * Math.PI) / 180;
    return { x: round(cx + radius * Math.sin(rad)), y: round(cy - radius * Math.cos(rad)), angle: round(angle) };
  });
}

/** Scalloped circle (wax seal, badge edge): `lobes` bumps of relative depth `depth`. */
export function scallopPath(cx: number, cy: number, r: number, lobes: number, depth = 0.08): string {
  const outer = ring(cx, cy, r, lobes);
  const inner = ring(cx, cy, r * (1 - depth), lobes, 180 / lobes);
  let d = `M${inner[lobes - 1].x} ${inner[lobes - 1].y}`;
  for (let i = 0; i < lobes; i++) {
    d += `Q${outer[i].x} ${outer[i].y} ${inner[i].x} ${inner[i].y}`;
  }
  return `${d}Z`;
}
