/**
 * Responsive geometry of the Home tab. On short phones (iPhone SE, 667 pt) the hero shrinks so
 * its CTA stays above the floating tab bar without scrolling (one primary action per viewport).
 */
import { useWindowDimensions } from 'react-native';

import { layout, spacing } from '@/theme';

import { homeMetrics } from '../metrics';

export type HomeLayout = {
  compact: boolean;
  /** Width of the padded content column. */
  contentWidth: number;
  /** Inner padding of the hero card. */
  heroPadding: number;
  /** Size of the hero illustration box. */
  heroArt: { width: number; height: number };
};

export function useHomeLayout(): HomeLayout {
  const { width, height } = useWindowDimensions();
  const compact = height < homeMetrics.compactHeight;
  const contentWidth = Math.min(width, layout.maxContentWidth) - layout.screenX * 2;
  const heroPadding = compact ? spacing.lg : spacing.xl;
  const artWidth = contentWidth - heroPadding * 2;
  const naturalHeight = Math.round(artWidth * homeMetrics.heroArtRatio);
  const artHeight = compact ? Math.min(naturalHeight, homeMetrics.heroArtCompactHeight) : naturalHeight;
  return { compact, contentWidth, heroPadding, heroArt: { width: artWidth, height: artHeight } };
}
