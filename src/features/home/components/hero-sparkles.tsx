/**
 * Twinkling sparkles laid over the hero artwork (redlines: opacity loop 2.4 s, staggered), so
 * the hero card feels like a lit place rather than a banner. Static under reduced motion.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { SparkleIcon, type SparkleTone } from '@/components/icons';
import { useReduceMotion } from '@/components/ui';
import { easing } from '@/theme';

import { homeMetrics } from '../metrics';

type SparkleSpec = {
  /** Position of the sparkle centre, as fractions of the artwork box. */
  x: number;
  y: number;
  size: number;
  tone: SparkleTone;
  /** Phase offset in the loop, 0…1. */
  phase: number;
};

/** Placed in the dark areas of the beam so they never sit on the book. */
const SPARKLES: SparkleSpec[] = [
  { x: 0.3, y: 0.16, size: homeMetrics.heroSparkle.small, tone: 'white', phase: 0 },
  { x: 0.84, y: 0.6, size: homeMetrics.heroSparkle.large, tone: 'lime', phase: 0.33 },
  { x: 0.12, y: 0.62, size: homeMetrics.heroSparkle.small, tone: 'lime', phase: 0.66 },
];

/** Resting opacity between two twinkles. */
const DIM = 0.15;

export function HeroSparkles() {
  return (
    <View style={styles.layer} aria-hidden>
      {SPARKLES.map((spec) => (
        <Twinkle key={`${spec.x}-${spec.y}`} spec={spec} />
      ))}
    </View>
  );
}

function Twinkle({ spec }: { spec: SparkleSpec }) {
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : DIM);

  useEffect(() => {
    if (reduceMotion) {
      opacity.set(1);
      return;
    }
    const half = homeMetrics.twinklePeriod / 2;
    opacity.set(
      withDelay(
        spec.phase * homeMetrics.twinklePeriod,
        withRepeat(
          withSequence(
            withTiming(1, { duration: half, easing: easing.inOut }),
            withTiming(DIM, { duration: half, easing: easing.inOut }),
          ),
          -1,
        ),
      ),
    );
    return () => cancelAnimation(opacity);
  }, [reduceMotion, opacity, spec.phase]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: 0.7 + opacity.get() * 0.3 }],
  }));

  return (
    <Animated.View
      style={[
        styles.sparkle,
        {
          left: `${spec.x * 100}%`,
          top: `${spec.y * 100}%`,
          width: spec.size,
          height: spec.size,
          marginLeft: -spec.size / 2,
          marginTop: -spec.size / 2,
        },
        animatedStyle,
      ]}>
      <SparkleIcon size={spec.size} tone={spec.tone} twin={false} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
  sparkle: { position: 'absolute' },
});
