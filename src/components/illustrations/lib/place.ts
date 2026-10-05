/**
 * Transform that places artwork drawn on the 48-unit icon grid (centre 24, 24) at (cx, cy),
 * scaled by `scale` and rotated by `rotate` degrees around its own centre.
 */
export function placeOnGrid(cx: number, cy: number, scale: number, rotate = 0): string {
  const rotation = rotate ? ` rotate(${rotate})` : '';
  return `translate(${cx} ${cy})${rotation} scale(${scale}) translate(-24 -24)`;
}
