/**
 * Reveal — staggered entrance of a story block (title, body, poster, cards) when its page is
 * shown: fade + short rise, timing-based so it looks the same on web. Plain fade under reduced
 * motion. Static blocks ignore touches so taps reach the viewer's tap zones underneath.
 */
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import { duration, easing } from '@/theme';

import { storyMetrics } from '../metrics';

export type RevealProps = {
  /** Position in the page's entrance sequence (0 = first). */
  order: number;
  children: ReactNode;
  /** Interactive blocks (the poll card) must receive touches. Default `false`. */
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Reveal({ order, children, interactive = false, style }: RevealProps) {
  const reduceMotion = useReduceMotion();
  const delay = order * storyMetrics.revealStagger;
  const entering = reduceMotion
    ? FadeIn.duration(duration.fast)
    : FadeInDown.delay(delay).duration(duration.slow).easing(easing.enter);
  return (
    <Animated.View entering={entering} style={[{ pointerEvents: interactive ? 'box-none' : 'none' }, style]}>
      {children}
    </Animated.View>
  );
}
