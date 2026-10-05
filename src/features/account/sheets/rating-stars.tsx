/**
 * Five tappable stars ("Valuta app"). Tapping star n fills 1…n; every filled star pops with the
 * bouncy spring, staggered left → right, so the rating "lands" with a little ripple.
 * Behaves as a radio group for screen readers.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay } from 'react-native-reanimated';
import { Star } from 'lucide-react-native';

import { bumpAnimation, Icon, iconStroke, PressableScale, useReduceMotion } from '@/components/ui';
import { spacing } from '@/theme';

import { RATE_COPY } from '../copy';
import { accountMetrics } from '../metrics';

export const MAX_RATING = 5;

/** Peak scale of the star pop (a touch stronger than a chip bump: it is the hero of the sheet). */
const STAR_POP = 1.28;
/** Delay between two stars of the ripple. */
const STAR_STAGGER_MS = 45;

type RatingStarProps = {
  index: number;
  filled: boolean;
  /** Changes on every tap; filled stars replay their pop. */
  pulse: number;
  onPress: () => void;
};

function RatingStar({ index, filled, pulse, onPress }: RatingStarProps) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (pulse === 0 || !filled || reduceMotion) return;
    cancelAnimation(scale);
    scale.set(withDelay(index * STAR_STAGGER_MS, bumpAnimation(STAR_POP)));
  }, [pulse, filled, index, reduceMotion, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const value = index + 1;

  return (
    <PressableScale
      onPress={onPress}
      scaleTo="small"
      haptic="selection"
      accessibilityRole="radio"
      accessibilityLabel={RATE_COPY.starLabel(value)}
      accessibilityState={{ checked: filled }}
      style={styles.star}>
      <Animated.View style={style}>
        <Icon
          icon={Star}
          size={accountMetrics.starGlyph}
          color={filled ? 'warningSolid' : 'borderStrong'}
          fill={filled ? 'warningSolid' : 'fill'}
          strokeWidth={iconStroke.bold}
        />
      </Animated.View>
    </PressableScale>
  );
}

export type RatingStarsProps = {
  value: number;
  pulse: number;
  onChange: (value: number) => void;
};

export function RatingStars({ value, pulse, onChange }: RatingStarsProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={RATE_COPY.question}>
      {Array.from({ length: MAX_RATING }, (_, index) => (
        <RatingStar key={index} index={index} filled={index < value} pulse={pulse} onPress={() => onChange(index + 1)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xxs },
  star: {
    width: accountMetrics.starHit,
    height: accountMetrics.starHit,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
