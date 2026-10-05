/**
 * Contextual colour mode (Rainbow design-system `ColorMode.tsx` pattern): wrap an inverted
 * surface in `<ColorModeProvider mode="brand">` and every primitive inside reads brand tokens.
 */
import { createContext, use, type ReactNode } from 'react';

import { themes, type ColorMode, type Theme } from './theme';

const ColorModeContext = createContext<ColorMode>('light');

export function ColorModeProvider({ mode, children }: { mode: ColorMode; children: ReactNode }) {
  return <ColorModeContext value={mode}>{children}</ColorModeContext>;
}

export function useColorMode(): ColorMode {
  return use(ColorModeContext);
}

/** Current theme for the nearest colour mode. */
export function useTheme(): Theme {
  return themes[use(ColorModeContext)];
}
