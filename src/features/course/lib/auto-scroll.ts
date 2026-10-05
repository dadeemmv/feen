/**
 * Where to scroll the learning path so the current chapter is in view. PURE (no React).
 *
 * - Already fully visible (node + tooltip, below the sticky strip) → no scroll.
 * - Node starting inside the first screen (e.g. "Inflazione" on a fresh course) → the smallest
 *   scroll that reveals it, so the cover and the title stay on screen.
 * - Anything further down → anchored at a fixed fraction of the viewport, with the walked path
 *   above it and what comes next below.
 */
export type AutoScrollInput = {
  /** Node top edge in scroll-content coordinates. */
  nodeTop: number;
  /** Bottom of the node including the tooltip that hangs under it. */
  nodeBottom: number;
  /** Height of the scroll viewport. */
  viewport: number;
  /** Current scroll offset. */
  scrollY: number;
  /** Fraction of the viewport where a far node is anchored (0 = top). */
  anchor: number;
  /** Room kept between a revealed node and the viewport bottom. */
  margin: number;
  /** Height covered at the top of the viewport by sticky chrome (compact title strip). */
  topInset: number;
};

export function autoScrollTarget({ nodeTop, nodeBottom, viewport, scrollY, anchor, margin, topInset }: AutoScrollInput): number | null {
  if (viewport <= 0) return null;
  const visibleTop = scrollY + topInset;
  const visibleBottom = scrollY + viewport;
  if (nodeTop >= visibleTop && nodeBottom + margin <= visibleBottom) return null;
  if (nodeTop < viewport) return Math.max(0, Math.round(nodeBottom + margin - viewport));
  return anchoredScroll(nodeTop, viewport, anchor);
}

/** Offset that puts the node top at `anchor` × viewport (used by the compact strip tap too). */
export function anchoredScroll(nodeTop: number, viewport: number, anchor: number): number {
  return Math.max(0, Math.round(nodeTop - viewport * anchor));
}
