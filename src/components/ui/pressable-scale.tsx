/**
 * PressableScale — bluesky-social/social-app `PressableScale` pattern on Reanimated 4:
 * press-in shrinks with a short timing, release springs back (spring.snappy). Optional opacity
 * dim and haptic. Honours reduced motion (no scaling, opacity feedback only).
 */
import type { ReactNode, Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { triggerHaptic, type HapticKind } from '@/lib/haptics';
import { isWeb } from '@/lib/platform';
import { duration, pressScale, spring } from '@/theme';

import { uiOpacity } from './metrics';
import { useReduceMotion } from './use-reduce-motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressScale = keyof typeof pressScale | number | false;

export type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** `large` (0.97, CTAs/cards) · `small` (0.93, chips/icons) · a number · `false`. Default `large`. */
  scaleTo?: PressScale;
  /** Also dim to `uiOpacity.pressed` while pressed (rows, links). */
  dimOnPress?: boolean;
  /** Haptic fired on press. Default none. */
  haptic?: Extract<HapticKind, 'selection' | 'light' | 'medium'>;
  ref?: Ref<View>;
};

export function PressableScale({
  children,
  style,
  scaleTo = 'large',
  dimOnPress = false,
  haptic,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityRole = 'button',
  accessibilityState,
  ref,
  ...rest
}: PressableScaleProps) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const target = scaleTo === false ? 1 : typeof scaleTo === 'number' ? scaleTo : pressScale[scaleTo];
  const shouldScale = !reduceMotion && target !== 1;
  const shouldDim = dimOnPress || (reduceMotion && scaleTo !== false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() }],
  }));

  const handlePressIn = (event: GestureResponderEvent) => {
    onPressIn?.(event);
    if (shouldScale) {
      cancelAnimation(scale);
      scale.set(withTiming(target, { duration: duration.press }));
    }
    if (shouldDim) {
      cancelAnimation(opacity);
      opacity.set(withTiming(uiOpacity.pressed, { duration: duration.press }));
    }
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    onPressOut?.(event);
    cancelAnimation(scale);
    scale.set(withSpring(1, spring.snappy));
    cancelAnimation(opacity);
    opacity.set(withTiming(1, { duration: duration.fast }));
  };

  // react-native-web ignores `accessibilityState`; aria-* props work on iOS, Android and web.
  const state = { disabled: !!disabled, ...accessibilityState };

  const handlePress = (event: GestureResponderEvent) => {
    if (haptic) triggerHaptic(haptic);
    onPress?.(event);
  };

  return (
    <AnimatedPressable
      ref={ref}
      accessibilityRole={accessibilityRole}
      aria-disabled={state.disabled}
      aria-selected={state.selected}
      aria-checked={state.checked}
      aria-busy={state.busy}
      aria-expanded={state.expanded}
      disabled={disabled}
      onPress={onPress ? handlePress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[isWeb && !disabled && onPress ? styles.pointer : undefined, style, animatedStyle]}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pointer: { cursor: 'pointer' },
});
