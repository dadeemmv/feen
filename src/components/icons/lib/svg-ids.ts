import { useId } from 'react';

/**
 * Unique, `url(#…)`-safe ids for SVG `<defs>`.
 *
 * Gradient ids are document-global on web (react-native-web renders real DOM `<svg>`), so two
 * icons rendered side by side must never share an id. `useId()` is stable across renders and
 * SSR; we strip anything that is not a valid CSS identifier character just in case the React
 * id format changes again.
 *
 *   const ids = useSvgIds('body', 'core');
 *   <LinearGradient id={ids.body} … />   <Path fill={paint(ids.body)} />
 */
export function useSvgIds<const K extends string>(...keys: K[]): Record<K, string> {
  const base = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const ids = {} as Record<K, string>;
  for (const key of keys) ids[key] = `fz-${key}-${base}`;
  return ids;
}

/** `fill`/`stroke` value that references a gradient/clip id. */
export const paint = (id: string) => `url(#${id})`;
