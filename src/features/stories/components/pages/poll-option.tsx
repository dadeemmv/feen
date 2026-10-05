/**
 * One answer of the story poll. Before voting it is a radio row; once the user has voted every
 * row turns into a result bar that fills to its share (the user's own answer in lime, with the
 * check), and the percentage counts up.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { CountUp, PressableScale, Radio, Text, borderWidth, controlHeight, useReduceMotion } from '@/components/ui';
import { duration, easing, radius, spacing, useTheme, type TextVariant } from '@/theme';

import { STORY_COPY } from '../../copy';

export type PollOptionProps = {
  label: string;
  /** Share of the votes, 0…100 — `null` until the user has voted. */
  percent: number | null;
  mine: boolean;
  labelVariant: TextVariant;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
};

const formatPercent = (n: number) => `${Math.round(n)}%`;

export function PollOption({ label, percent, mine, labelVariant, onPress, onPressIn, onPressOut }: PollOptionProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const revealed = percent !== null;
  const fill = useSharedValue(0);

  useEffect(() => {
    const target = percent === null ? 0 : percent / 100;
    fill.set(
      reduceMotion
        ? target
        : withTiming(target, {
            duration: duration.progress,
            easing: easing.enter,
          }),
    );
  }, [percent, reduceMotion, fill]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }));

  return (
    <PressableScale
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      haptic="selection"
      accessibilityRole="radio"
      accessibilityState={{ checked: mine }}
      accessibilityLabel={STORY_COPY.poll.optionA11y(label, percent, mine)}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: mine ? colors.accentBorder : colors.border,
        },
      ]}>
      <Animated.View
        style={[styles.fill, { backgroundColor: mine ? colors.accentBg : colors.fill }, fillStyle]}
        aria-hidden
      />
      <Text variant={labelVariant} style={styles.label}>
        {label}
      </Text>
      {revealed ? (
        <View style={styles.result}>
          <CountUp
            value={percent}
            duration={duration.progress}
            format={formatPercent}
            variant="labelMd"
            color={mine ? 'text' : 'textSecondary'}
          />
          {mine ? <Radio selected size="sm" /> : null}
        </View>
      ) : (
        <Radio selected={false} size="sm" />
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: controlHeight.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: borderWidth.regular,
    overflow: 'hidden',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  label: { flex: 1 },
  result: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
});
