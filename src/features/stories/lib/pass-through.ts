/**
 * Touch pass-through for the story viewer. The tap / swipe gesture lives on a layer BEHIND the
 * faces, so every non-interactive view on top must let touches fall through to it.
 *
 * - Plain Views: `boxNone` (the view ignores touches, its children receive them) and `none`.
 * - Animated.Views: Reanimated inlines styles on web, and react-native-web implements
 *   `box-none` only through StyleSheet classes. So on web an animated shell ignores touches
 *   entirely (`none`) and a plain inner `boxNone` View hands them back to its children; on
 *   native the shell is simply `box-none` (a native `none` would disable the whole subtree).
 */
import { StyleSheet } from 'react-native';

import { isWeb } from '@/lib/platform';

export const passThrough = StyleSheet.create({
  boxNone: { pointerEvents: 'box-none' },
  none: { pointerEvents: 'none' },
  animatedShell: { pointerEvents: isWeb ? 'none' : 'box-none' },
});
