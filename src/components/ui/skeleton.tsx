/**
 * Skeleton — loading placeholders that breathe (opacity pulse) with an optional light sweep.
 * Static under reduced motion. Compose them into the shape of the content they stand in for:
 *   <Skeleton circle size={44} />   <SkeletonText lines={2} />   <Skeleton height={150} radius="xl" />
 */
import { useEffect } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { duration, easing, radius as radii, spacing, useTheme, type RadiusToken, type SpacingToken } from '@/theme';

import { skeletonLine, uiOpacity } from './metrics';
import { Shimmer } from './shimmer';
import { useReduceMotion } from './use-reduce-motion';

export type SkeletonProps = {
  /** Default `100%`. */
  width?: DimensionValue;
  /** Default 16. */
  height?: DimensionValue;
  /** Square side / circle diameter (overrides width & height). */
  size?: number;
  circle?: boolean;
  /** Default `sm`. */
  radius?: RadiusToken;
  /** Add a light sweep on top of the pulse (hero placeholders). Default `false`. */
  shimmer?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width = '100%',
  height = spacing.md,
  size,
  circle = false,
  radius = 'sm',
  shimmer = false,
  style,
}: SkeletonProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.set(withRepeat(withTiming(uiOpacity.dimmed, { duration: duration.slower * 2, easing: easing.inOut }), -1, true));
    return () => cancelAnimation(pulse);
  }, [reduceMotion, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.get() }));
  const corner = circle ? radii.pill : radii[radius];

  return (
    <Animated.View
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: size ?? width,
          height: size ?? height,
          borderRadius: corner,
          backgroundColor: theme.colors.fillHover,
          overflow: 'hidden',
        },
        animatedStyle,
        style,
      ]}>
      {shimmer ? <Shimmer borderRadius={corner} duration={duration.shimmer} pause={duration.base} /> : null}
    </Animated.View>
  );
}

export type SkeletonTextProps = {
  /** Default 3. */
  lines?: number;
  /** Line bar height. Default 12. */
  lineHeight?: number;
  /** Default `xs`. */
  gap?: SpacingToken;
  /** Width of the last line as a fraction. Default 0.6. */
  lastLineWidth?: number;
  style?: StyleProp<ViewStyle>;
};

/** Paragraph placeholder: full-width lines with a shorter last line. */
export function SkeletonText({
  lines = 3,
  lineHeight = skeletonLine.height,
  gap = 'xs',
  lastLineWidth = skeletonLine.lastLineRatio,
  style,
}: SkeletonTextProps) {
  return (
    <View style={[{ gap: spacing[gap] }, style]} accessibilityLabel="Caricamento" accessible>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          radius="xs"
          width={index === lines - 1 && lines > 1 ? `${Math.round(lastLineWidth * 100)}%` : '100%'}
        />
      ))}
    </View>
  );
}
