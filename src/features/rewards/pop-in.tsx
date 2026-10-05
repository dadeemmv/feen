/**
 * PopIn — scales its children in with the bouncy spring (visible overshoot) when it mounts.
 * Re-key it to replay the pop (e.g. when a reward flips from "revealed" to "claimed").
 * Springs run in JS on web too, unlike layout-animation springs, so the overshoot survives there.
 */
import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { feedbackMotion, popAnimation, useReduceMotion } from '@/components/ui';
import { duration } from '@/theme';

export type PopInProps = {
  children: ReactNode;
  /** Delay before the pop, ms. Default 0. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function PopIn({ children, delay = 0, style }: PopInProps) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(reduceMotion ? 1 : feedbackMotion.popFromScale);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    scale.set(withDelay(delay, popAnimation()));
    opacity.set(withDelay(delay, withTiming(1, { duration: duration.fast })));
  }, [reduceMotion, delay, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get(), transform: [{ scale: scale.get() }] }));
  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
