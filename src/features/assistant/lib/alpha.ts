/**
 * `alpha(token, 0.4)` → the same colour with an opacity, for edge fades over the Coach gradient.
 * A fade to the CSS keyword `transparent` interpolates through transparent black on iOS (a grey
 * band), so fades must end on the *same* colour at 0 alpha. Accepts #rgb / #rrggbb tokens;
 * anything else (already rgba) is returned unchanged.
 */
export function alpha(color: string, opacity: number): string {
  const hex = color.trim().replace('#', '');
  if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex)) return color;
  const full = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;
  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const a = Math.min(1, Math.max(0, opacity));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
