/**
 * Reusable feedback animations built on the motion tokens (signature moments from the art
 * direction: chip bump, wrong-answer shake, badge pop). Builders are worklets, so they can run
 * from JS (effects, handlers) or from gesture callbacks on the UI thread.
 *
 *   const { style, shake } = useShake();
 *   <Animated.View style={style}>…</Animated.View>   // later: shake()
 */
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { duration, easing, spring } from '@/theme';

import { useReduceMotion } from './use-reduce-motion';

/** Amplitudes for feedback gestures (motion geometry, not layout). */
export const feedbackMotion = {
  /** Peak scale of a value bump (StatChip). */
  bumpScale: 1.18,
  /** Start scale of a pop-in (Dialog badge, reward icons). */
  popFromScale: 0.4,
  /** Horizontal shake distance in pt. */
  shakeDistance: 6,
  /** Duration of one half swing in ms. */
  shakeStep: 50,
  /** Number of full swings. */
  shakeCycles: 4,
} as const;

/** 1 → peak → 1 (timing up, bouncy spring back). */
export function bumpAnimation(peak: number = feedbackMotion.bumpScale) {
  'worklet';
  return withSequence(
    withTiming(peak, { duration: duration.fast, easing: easing.enter }),
    withSpring(1, spring.bouncy),
  );
}

/** 0 → ±distance oscillation → 0. Apply to `translateX`. */
export function shakeAnimation(distance: number = feedbackMotion.shakeDistance) {
  'worklet';
  const step = feedbackMotion.shakeStep;
  return withSequence(
    withTiming(-distance, { duration: step }),
    withRepeat(withTiming(distance, { duration: step * 2 }), feedbackMotion.shakeCycles, true),
    withTiming(0, { duration: step }),
  );
}

/** Scale pop to 1 with overshoot. Set the value to `feedbackMotion.popFromScale` first. */
export function popAnimation() {
  'worklet';
  return withSpring(1, spring.bouncy);
}

/** Horizontal shake for wrong answers / failed actions. No-op under reduced motion. */
export function useShake() {
  const reduceMotion = useReduceMotion();
  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }));
  const shake = () => {
    if (reduceMotion) return;
    cancelAnimation(offset);
    offset.set(shakeAnimation());
  };
  return { style, shake };
}

/** Scale bump for value changes / rewards. No-op under reduced motion. */
export function useBump(peak: number = feedbackMotion.bumpScale) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const bump = () => {
    if (reduceMotion) return;
    cancelAnimation(scale);
    scale.set(bumpAnimation(peak));
  };
  return { style, bump };
}
