/**
 * Streak strip of the completion screen. First lesson of the day: the flame pops in large with
 * a warm halo and "Giorno N di fila!". Already studied today: a calm "Serie di N giorni".
 */
import { StyleSheet, View } from 'react-native';

import { FlameIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { PopIn } from '@/features/rewards';
import { radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { COMPLETION } from '../metrics';

export type StreakMomentProps = {
  isNewStreakDay: boolean;
  streak: number;
  delay: number;
};

export function StreakMoment({ isNewStreakDay, streak, delay }: StreakMomentProps) {
  const theme = useTheme();
  const title = isNewStreakDay ? COPY.completion.streakNewTitle(streak) : COPY.completion.streakKeptTitle(streak);
  const body = isNewStreakDay
    ? streak <= 1
      ? COPY.completion.streakFirst
      : COPY.completion.streakGrow
    : COPY.completion.streakKept;

  const flame = (
    <View style={[styles.halo, { backgroundColor: isNewStreakDay ? theme.colors.streakBg : theme.colors.fill }]}>
      <FlameIcon size={isNewStreakDay ? COMPLETION.flame : COMPLETION.flame - spacing.xs} />
    </View>
  );

  return (
    <View
      accessible
      accessibilityLabel={`${title} ${body}`}
      style={[styles.strip, { backgroundColor: theme.colors.surfaceRaised }]}>
      {isNewStreakDay ? <PopIn delay={delay}>{flame}</PopIn> : flame}
      <View style={styles.text}>
        <Text variant="titleMd" color={isNewStreakDay ? 'accentText' : 'text'}>
          {title}
        </Text>
        <Text variant="bodySm" color="textSecondary">
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
  },
  halo: {
    width: COMPLETION.flame + spacing.md,
    height: COMPLETION.flame + spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: spacing.xxxs },
});
