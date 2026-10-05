/**
 * TypingDots — three staggered dots (FaridSafi/react-native-gifted-chat `TypingIndicator`):
 * withDelay(i × 150, withRepeat(withSequence(up, down))). `bubble` wraps them in an assistant
 * chat bubble. Under reduced motion the dots only pulse opacity.
 */
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { duration, easing, radius, spacing, useTheme, type ColorToken } from '@/theme';

import { controlHeight } from './metrics';
import { useReduceMotion } from './use-reduce-motion';

/** Stagger between dots (ms) and dot motion geometry. */
const STAGGER = 150;
const DOT_SIZE = spacing.xs;
const REST_OPACITY = 0.35;
const LIFT_RATIO = 0.5;

export type TypingDotsProps = {
  /** Dot colour. Default `brandText`. */
  color?: ColorToken;
  /** Dot diameter. Default 8. */
  size?: number;
  /** Render inside a left-aligned chat bubble. */
  bubble?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function TypingDots({
  color = 'brandText',
  size = DOT_SIZE,
  bubble = false,
  accessibilityLabel = 'Sta scrivendo',
  style,
}: TypingDotsProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const dots = (
    <View style={[styles.row, { gap: size / 2 }]}>
      {[0, 1, 2].map((index) => (
        <Dot key={index} index={index} size={size} color={theme.colors[color]} lift={!reduceMotion} />
      ))}
    </View>
  );

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={[bubble && [styles.bubble, { backgroundColor: theme.colors.fill }], style]}>
      {dots}
    </View>
  );
}

type DotProps = { index: number; size: number; color: string; lift: boolean };

function Dot({ index, size, color, lift }: DotProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    startDot(progress, index);
    return () => cancelAnimation(progress);
  }, [progress, index]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: REST_OPACITY + (1 - REST_OPACITY) * p,
      transform: [{ translateY: lift ? -p * size * LIFT_RATIO : 0 }],
    };
  });

  return (
    <Animated.View
      style={[{ width: size, height: size, borderRadius: radius.pill, backgroundColor: color }, animatedStyle]}
    />
  );
}

function startDot(progress: SharedValue<number>, index: number) {
  const step = { duration: duration.typingDot, easing: easing.inOut };
  progress.set(
    withDelay(index * STAGGER, withRepeat(withSequence(withTiming(1, step), withTiming(0, step)), -1, false)),
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  bubble: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: controlHeight.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.xs,
  },
});
