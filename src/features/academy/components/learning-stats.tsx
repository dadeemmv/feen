/**
 * "I tuoi traguardi" — lessons completed, total XP and level, plus the progress to the next
 * level.
 */
import { StyleSheet } from 'react-native';

import { BoltIcon, CheckBadgeIcon, TrophyIcon } from '@/components/icons';
import { Card, HStack, iconSize, ProgressBar, StatTile, Text, VStack } from '@/components/ui';
import { formatNumber } from '@/lib/format';
import { selectLessonsCompleted, useStore } from '@/store';
import { useUserLevel } from '@/store/hooks';
import { spacing } from '@/theme';

import { ACADEMY_COPY } from '../copy';

export function LearningStats() {
  const lessons = useStore((s) => selectLessonsCompleted(s));
  const xp = useStore((s) => s.xp);
  const level = useUserLevel();

  return (
    <VStack gap="xs">
      <HStack gap="xs" align="stretch">
        <StatTile
          icon={<CheckBadgeIcon size={iconSize.lg} muted={lessons === 0} />}
          value={lessons}
          label={ACADEMY_COPY.lessons}
        />
        <StatTile
          icon={<BoltIcon size={iconSize.lg} muted={xp === 0} />}
          value={formatNumber(xp)}
          label={ACADEMY_COPY.xp}
        />
        <StatTile
          icon={<TrophyIcon size={iconSize.lg} muted={level.level === 1 && xp === 0} />}
          value={level.level}
          label={ACADEMY_COPY.level}
        />
      </HStack>
      <Card padding="md" contentStyle={styles.level}>
        <HStack justify="space-between" gap="sm">
          <Text variant="labelMd" numberOfLines={1} style={styles.flex}>
            {ACADEMY_COPY.levelLine(level.level, level.title)}
          </Text>
          <Text variant="labelSm" color="textSecondary" tabular>
            {level.isMaxLevel ? ACADEMY_COPY.levelMax : ACADEMY_COPY.levelProgress(level.currentXp, level.nextLevelXp)}
          </Text>
        </HStack>
        <ProgressBar value={level.ratio} size="sm" tone="accent" accessibilityLabel={ACADEMY_COPY.levelLine(level.level, level.title)} />
      </Card>
    </VStack>
  );
}

const styles = StyleSheet.create({
  level: { gap: spacing.xs },
  flex: { flex: 1 },
});
