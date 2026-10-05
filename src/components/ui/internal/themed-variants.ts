/**
 * Builds a value (usually `sv()` variant functions) once per colour mode and returns a hook that
 * picks the one for the nearest `ColorModeProvider`. Same caching idea as `createStyles`, but for
 * variant factories that need theme colours.
 */
import { themes, useColorMode, type ColorMode, type Theme } from '@/theme';

export function createThemedVariants<T>(factory: (theme: Theme) => T): () => T {
  const byMode = Object.fromEntries(
    (Object.keys(themes) as ColorMode[]).map((mode) => [mode, factory(themes[mode])]),
  ) as Record<ColorMode, T>;
  return function useThemedVariants() {
    return byMode[useColorMode()];
  };
}
