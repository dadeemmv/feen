/**
 * Residents strip of the completion screen. First lesson of the day: a day of the pact kept, so a
 * resident arrives (the people icon pops in on sprout). Already studied today: a calm line. The
 * count never goes down: a skipped day takes nobody away.
 */
import { StyleSheet, View } from 'react-native';

import { Users } from 'lucide-react-native';

import { Icon, Text } from '@/components/ui';
import { countResidents, useStoreShallow } from '@/store';
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
  const residents = countResidents(useStoreShallow((s) => ({ activeDays: s.activeDays, pact: s.pact })));
  const title = isNewStreakDay ? COPY.completion.streakNewTitle(streak) : COPY.completion.streakKeptTitle(streak);
  const body = isNewStreakDay
    ? streak <= 1
      ? COPY.completion.streakFirst
      : COPY.completion.streakGrow
    : COPY.completion.streakKept;
  const count = COPY.completion.residents(residents);

  const flame = (
    <View style={[styles.halo, { backgroundColor: isNewStreakDay ? theme.colors.reward : theme.colors.fill }]}>
      <Icon icon={Users} size={COMPLETION.flame - spacing.md} color={isNewStreakDay ? 'onReward' : 'textSecondary'} />
    </View>
  );

  return (
    <View
      accessible
      accessibilityLabel={`${title}. ${count}. ${body}`}
      style={[styles.strip, { backgroundColor: theme.colors.surfaceRaised }]}>
      {isNewStreakDay ? <PopIn delay={delay}>{flame}</PopIn> : flame}
      <View style={styles.text}>
        <Text variant="titleMd" color={isNewStreakDay ? 'accentText' : 'text'}>
          {title}
        </Text>
        <Text variant="labelMd">{count}</Text>
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
