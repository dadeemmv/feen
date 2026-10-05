/**
 * HeartsRow — the lives meter: one heart per slot, full hearts in rose, empty slots greyed.
 * A heart that fills (refill, purchase) pops in with the bouncy spring; unlimited lives show a
 * single gold ∞ heart instead.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { HeartIcon, HeartInfinityIcon } from '@/components/icons';
import { PopIn } from './pop-in';
import { duration, spacing } from '@/theme';

/** Delay between hearts popping in, left to right. */
const HEART_STAGGER = duration.fast / 2;
/** The single ∞ heart is drawn a little larger than one slot. */
const UNLIMITED_SCALE = 1.25;

export type HeartsRowProps = {
  lives: number;
  max: number;
  unlimited?: boolean;
  /** Heart size in pt. */
  size: number;
  style?: StyleProp<ViewStyle>;
};

export function HeartsRow({ lives, max, unlimited = false, size, style }: HeartsRowProps) {
  if (unlimited) {
    return (
      <View style={[styles.row, style]} accessibilityLabel="Vite illimitate" accessibilityRole="image">
        <PopIn>
          <HeartInfinityIcon size={Math.round(size * UNLIMITED_SCALE)} />
        </PopIn>
      </View>
    );
  }

  const slots = Array.from({ length: Math.max(0, max) }, (_, index) => index < lives);
  return (
    <View style={[styles.row, style]} accessibilityLabel={`${lives} vite su ${max}`} accessibilityRole="image">
      {slots.map((full, index) => (
        // Re-keyed when the slot fills, so the new heart pops in.
        <PopIn key={`${index}-${full ? 'full' : 'empty'}`} delay={full ? index * HEART_STAGGER : 0}>
          <HeartIcon size={size} muted={!full} />
        </PopIn>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xxs },
});
