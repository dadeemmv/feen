/**
 * Geometry of the floating tab bar, shared by the bar itself and by tab screens that need to pad
 * their content so nothing hides behind it.
 */
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout, spacing } from '@/theme';

/** Distance from the screen bottom to the bar's bottom edge (safe inset + gap). */
export function getTabBarBottomOffset(safeBottom: number): number {
  return Math.max(safeBottom, spacing.xs) + layout.tabBarBottomGap;
}

/** Bottom padding a tab screen needs so its last item clears the floating bar (+ breathing room). */
export function getTabBarInset(safeBottom: number): number {
  return getTabBarBottomOffset(safeBottom) + layout.tabBarHeight + spacing.lg;
}

/** `paddingBottom` for scroll content on tab screens (Screen `withTabBar` uses it). */
export function useTabBarInset(): number {
  return getTabBarInset(useSafeAreaInsets().bottom);
}
