/**
 * Inline notice above the footer when the learner has 0 lives (and no unlimited perk) on a graded
 * step: grey heart, "Hai finito le vite", the countdown to the next life and "Ricarica", which
 * opens the global out-of-lives sheet.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { HeartIcon } from '@/components/icons';
import { Button, Text, hairline, iconSize, tileSize, useReduceMotion } from '@/components/ui';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';

export type OutOfLivesBannerProps = {
  /** "2h 26min" until the next life, or null. */
  countdown: string | null;
  onRefill: () => void;
};

export function OutOfLivesBanner({ countdown, onRefill }: OutOfLivesBannerProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(duration.base).easing(easing.enter)}
      exiting={reduceMotion ? undefined : FadeOutDown.duration(duration.fast).easing(easing.exit)}
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: theme.colors.livesBg, borderColor: theme.colors.dangerBorder }]}>
      <View style={[styles.icon, { backgroundColor: theme.colors.surface }]}>
        <HeartIcon size={iconSize.lg} muted />
      </View>
      <View style={styles.text}>
        <Text variant="labelLg">{COPY.outOfLives.title}</Text>
        <Text variant="bodySm" color="textSecondary" numberOfLines={2}>
          {COPY.outOfLives.message(countdown)}
        </Text>
      </View>
      <Button title={COPY.outOfLives.cta} size="sm" variant="brand" onPress={onRefill} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: hairline,
    marginBottom: spacing.sm,
  },
  icon: {
    width: tileSize.md,
    height: tileSize.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: spacing.xxxs },
});
