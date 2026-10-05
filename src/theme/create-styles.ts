/**
 * Themed StyleSheet factory (Ignite's `ThemedStyle<T> = (theme) => T`, cached per colour mode so
 * StyleSheet.create runs once per mode instead of on every render).
 *
 *   const useStyles = createStyles((t) => ({ card: { backgroundColor: t.colors.surface } }));
 *   const styles = useStyles();
 */
import { StyleSheet } from 'react-native';

import { useColorMode } from './color-mode';
import { themes, type ColorMode, type Theme } from './theme';

export function createStyles<T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache = new Map<ColorMode, T>();
  return function useStyles(): T {
    const mode = useColorMode();
    let styles = cache.get(mode);
    if (!styles) {
      styles = StyleSheet.create(factory(themes[mode]));
      cache.set(mode, styles);
    }
    return styles;
  };
}
