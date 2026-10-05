/** Geometry helpers for chart-like illustrations (computed once at module level). */

export type Pt = readonly [number, number];

/** `[[x, y], …]` → SVG `points` attribute. */
export const toPoints = (pts: readonly Pt[]) => pts.map(([x, y]) => `${x},${y}`).join(' ');

/** Polyline → path `d`, optionally closed down to `baseY` (for area fills). */
export function linePath(pts: readonly Pt[], baseY?: number): string {
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join('');
  if (baseY === undefined) return d;
  const first = pts[0];
  const last = pts[pts.length - 1];
  return `${d}L${last[0]} ${baseY}L${first[0]} ${baseY}Z`;
}

/** Triangle arrow head pointing from `from` to `tip`: returns polygon points. */
export function arrowHead(from: Pt, tip: Pt, length: number, halfWidth: number): string {
  const dx = tip[0] - from[0];
  const dy = tip[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = tip[0] - ux * length;
  const by = tip[1] - uy * length;
  const r = (n: number) => Math.round(n * 10) / 10;
  return toPoints([
    [r(tip[0]), r(tip[1])],
    [r(bx - uy * halfWidth), r(by + ux * halfWidth)],
    [r(bx + uy * halfWidth), r(by - ux * halfWidth)],
  ]);
}

/** Pie/donut slice path around (cx, cy) from `start` to `end` (fractions of a turn, 0 = up). */
export function slicePath(cx: number, cy: number, r: number, start: number, end: number): string {
  const p = (t: number) => {
    const a = t * Math.PI * 2;
    return [Math.round((cx + r * Math.sin(a)) * 100) / 100, Math.round((cy - r * Math.cos(a)) * 100) / 100];
  };
  const [x0, y0] = p(start);
  const [x1, y1] = p(end);
  const large = end - start > 0.5 ? 1 : 0;
  return `M${cx} ${cy}L${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}Z`;
}

/** Regular hexagon (pointy top) points. */
export function hexPoints(cx: number, cy: number, r: number): string {
  return toPoints(
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i;
      return [Math.round((cx + r * Math.sin(a)) * 100) / 100, Math.round((cy - r * Math.cos(a)) * 100) / 100] as const;
    }),
  );
}
