/**
 * The theme object. Keys mirror Shopify Restyle's theme shape (colors, spacing, borderRadii,
 * textVariants …) so a later move to Restyle is cheap; the runtime stays a plain object like
 * Ignite's `theme/theme.ts`.
 */
import { brandColors, gradients, illustration, lightColors } from './tokens/colors';
import { elevation } from './tokens/elevation';
import { layout } from './tokens/layout';
import { motion } from './tokens/motion';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fonts, textVariants } from './tokens/typography';

export type ColorMode = 'light' | 'brand';

const base = {
  spacing,
  radius,
  fonts,
  textVariants,
  elevation,
  motion,
  layout,
  gradients,
  illustration,
} as const;

export const lightTheme = { ...base, mode: 'light' as ColorMode, colors: lightColors };
export const brandTheme = { ...base, mode: 'brand' as ColorMode, colors: brandColors };

export type Theme = {
  [K in keyof typeof lightTheme]: K extends 'colors' ? typeof lightColors | typeof brandColors : (typeof lightTheme)[K];
};

export const themes: Record<ColorMode, Theme> = { light: lightTheme, brand: brandTheme };
