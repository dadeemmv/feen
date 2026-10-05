/**
 * 4-pt spacing scale with t-shirt names (Ignite `theme/spacing.ts`, Restyle spacing docs).
 * Add x's at either end to extend it; never use off-grid values in components.
 */
export const spacing = {
  none: 0,
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export type SpacingToken = keyof typeof spacing;
