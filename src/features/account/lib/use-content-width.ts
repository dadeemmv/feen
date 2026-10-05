import { useWindowDimensions } from 'react-native';

import { layout } from '@/theme';

/**
 * Width of the padded content column (window, capped at the phone-width column on web/tablet,
 * minus the screen gutters). Pass `inset` to subtract a card's own padding on both sides.
 */
export function useContentWidth(inset = 0): number {
  const { width } = useWindowDimensions();
  return Math.min(width, layout.maxContentWidth) - layout.screenX * 2 - inset * 2;
}
