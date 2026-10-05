/**
 * Shimmer — a skewed white sweep that loops across its parent (rainbow-me/rainbow
 * `ShimmerAnimation.tsx` pattern with expo-linear-gradient). Place it as the first child of a
 * container with `overflow: 'hidden'` (or pass `borderRadius`, which clips it itself).
 * Renders nothing under reduced motion.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { duration as durations, easing, gradients } from '@/theme';

import { useReduceMotion } from './use-reduce-motion';

/** Band width relative to the container and skew angle (sweep geometry). */
const BAND_RATIO = 0.45;
const SKEW = '-20deg';

export type ShimmerProps = {
  /** Toggle the loop. Default `true`. */
  active?: boolean;
  /** Sweep time in ms. Default `motion.duration.shimmer`. */
  duration?: number;
  /** Rest between sweeps in ms. Default `motion.duration.shimmerPause`. */
  pause?: number;
  /** Delay before the first sweep in ms. Default 0. */
  delay?: number;
  /** Band width as a fraction of the container width. Default 0.45. */
  bandRatio?: number;
  /** Clip radius when the parent does not clip. */
  borderRadius?: number;
  /** Band opacity (0–1). Default 1. */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
};

export function Shimmer({
  active = true,
  duration = durations.shimmer,
  pause = durations.shimmerPause,
  delay = 0,
  bandRatio = BAND_RATIO,
  borderRadius,
  intensity = 1,
  style,
}: ShimmerProps) {
  const reduceMotion = useReduceMotion();
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(0);
  const running = active && !reduceMotion && width > 0;
  const band = width * bandRatio;

  useEffect(() => {
    if (!running) return;
    progress.set(0);
    progress.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration, easing: easing.inOut }),
            withDelay(pause, withTiming(0, { duration: 0 })),
          ),
          -1,
          false,
        ),
      ),
    );
    return () => cancelAnimation(progress);
  }, [running, duration, pause, delay, progress]);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -band * 1.5 + progress.get() * (width + band * 3) }, { skewX: SKEW }],
  }));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      style={[StyleSheet.absoluteFill, styles.container, borderRadius !== undefined && { borderRadius }, style]}>
      {running ? (
        <Animated.View style={[styles.band, { width: band, opacity: intensity }, bandStyle]}>
          <LinearGradient
            colors={gradients.shimmer}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', pointerEvents: 'none' },
  band: { position: 'absolute', top: 0, bottom: 0, left: 0 },
});
