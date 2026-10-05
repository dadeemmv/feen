/**
 * Corner radii (Restyle `borderRadii`). Ranges cross-checked with Tamagui radius tokens,
 * Polaris border-radius and Expensify component radii.
 * Usage: badge xs · input sm · option tile md · button lg · card xl · hero/sheet xxl · chip pill.
 */
export const radius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
