/**
 * Corner radii (Restyle `borderRadii`). Ranges cross-checked with Tamagui radius tokens,
 * Polaris border-radius and Expensify component radii.
 * Usage: badge xs · input sm · option tile md · button lg · card xl · hero/sheet xxl · chip pill.
 */
export const radius = {
  none: 0,
  xs: 8,
  sm: 12,
  /** Option tiles (18 in the board's answer options). */
  md: 18,
  lg: 20,
  /** Cards. */
  xl: 28,
  /** Hero cards, sheets, character cards. */
  xxl: 36,
  xxxl: 44,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
