/**
 * RollingNumber — a counter whose digits roll when the value changes: the new value slides in
 * from below (increase) or above (decrease) while the old one slides out and fades. Tabular
 * figures keep the width steady. Static under reduced motion.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { duration, easing, textVariants, type ColorToken, type TextVariant } from '@/theme';

import { formatCount } from './internal/format-count';
import { AnimatedText } from './text';
import { useReduceMotion } from './use-reduce-motion';

/** Travel of a rolling digit relative to the line height. */
const ROLL_TRAVEL = 0.7;

export type RollingNumberProps = {
  value: number;
  /** Default: Italian grouping, compact above 100k (`1.500`, `125k`). */
  format?: (value: number) => string;
  /** Default `numeric`. */
  variant?: TextVariant;
  color?: ColorToken;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

type RollState = { current: number; previous: number; direction: 1 | -1; generation: number };

export function RollingNumber({
  value,
  format = formatCount,
  variant = 'numeric',
  color = 'text',
  textStyle,
  style,
}: RollingNumberProps) {
  const reduceMotion = useReduceMotion();
  const [roll, setRoll] = useState<RollState>({ current: value, previous: value, direction: 1, generation: 0 });
  if (roll.current !== value) {
    // Derive the transition during render (React "storing information from previous renders").
    setRoll({
      current: value,
      previous: roll.current,
      direction: value > roll.current ? 1 : -1,
      generation: roll.generation + 1,
    });
  }
  const animate = roll.generation > 0 && !reduceMotion;
  const travel = textVariants[variant].lineHeight * ROLL_TRAVEL;
  const text = { variant, color, style: textStyle } as const;

  return (
    <View style={[styles.clip, style]} accessible accessibilityLabel={format(roll.current)}>
      <RollLayer key={`in-${roll.generation}`} phase="in" animate={animate} travel={travel * roll.direction}>
        <AnimatedText {...text}>{format(roll.current)}</AnimatedText>
      </RollLayer>
      {animate ? (
        <RollLayer key={`out-${roll.generation}`} phase="out" animate travel={travel * roll.direction}>
          <AnimatedText {...text}>{format(roll.previous)}</AnimatedText>
        </RollLayer>
      ) : null}
    </View>
  );
}

type RollLayerProps = { phase: 'in' | 'out'; animate: boolean; travel: number; children: ReactNode };

function RollLayer({ phase, animate, travel, children }: RollLayerProps) {
  const progress = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) return;
    progress.set(withTiming(1, { duration: duration.base, easing: easing.enter }));
  }, [animate, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return phase === 'in'
      ? { opacity: p, transform: [{ translateY: (1 - p) * travel }] }
      : { opacity: 1 - p, transform: [{ translateY: -p * travel }] };
  });

  return (
    <Animated.View
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={[phase === 'out' && styles.overlay, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  overlay: { position: 'absolute', left: 0, top: 0 },
});
