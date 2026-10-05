/**
 * Geometry of the Coach tab, derived from the measured screen height and the safe areas:
 * hero orb position/size (SCREEN_SPECS: 120 pt at ~22 % of the height, 96 on short phones),
 * docked orb in the top bar (56), where the intro and the thread start, and where the composer
 * rests above the floating tab bar.
 */
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarBottomOffset } from '@/components/navigation';
import { layout, spacing } from '@/theme';

import { COMPACT_WINDOW_HEIGHT, ORB_HERO_CENTER, orbSize } from '../metrics';

export type CoachLayout = {
  insetTop: number;
  heroSize: number;
  heroCenterY: number;
  dockedCenterY: number;
  /** Top padding of the intro (below the hero orb). */
  introTop: number;
  /** Top padding of the thread (below the top bar). */
  threadTop: number;
  /** Composer's resting distance from the screen bottom (above the tab bar). */
  composerBottom: number;
};

export function useCoachLayout(screenHeight: number): CoachLayout {
  const insets = useSafeAreaInsets();
  const barBottom = insets.top + layout.headerHeight;
  const heroSize = screenHeight < COMPACT_WINDOW_HEIGHT ? orbSize.heroCompact : orbSize.hero;
  const heroCenterY = Math.max(screenHeight * ORB_HERO_CENTER, barBottom + heroSize / 2 + spacing.md);

  return {
    insetTop: insets.top,
    heroSize,
    heroCenterY,
    dockedCenterY: insets.top + layout.headerHeight / 2,
    introTop: heroCenterY + heroSize / 2 + spacing.xxl,
    threadTop: barBottom + spacing.md,
    composerBottom: getTabBarBottomOffset(insets.bottom) + layout.tabBarHeight + spacing.sm,
  };
}
