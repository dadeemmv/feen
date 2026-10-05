/**
 * "Traguardi": the three unlock milestones (2 / 10 / 15 lessons) side by side, exactly 3 across
 * on every phone width (compact cards, no horizontal overflow at 375 pt).
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import type { ResolvedMilestone } from '@/store';
import { useMilestones } from '@/store/hooks';
import { duration, easing, layout, spacing } from '@/theme';

import { HOME_COPY } from '../copy';
import { MilestoneCard } from './milestone-card';

export type MilestonesSectionProps = {
  onOpenMilestone: (milestone: ResolvedMilestone) => void;
};

export function MilestonesSection({ onOpenMilestone }: MilestonesSectionProps) {
  const milestones = useMilestones();
  return (
    <Animated.View
      entering={FadeInDown.delay(duration.base).duration(duration.slow).easing(easing.enter)}
      style={styles.root}>
      <View style={styles.header}>
        <Text variant="titleLg" accessibilityRole="header">
          {HOME_COPY.milestones.title}
        </Text>
        <Text variant="bodySm" color="textSecondary">
          {HOME_COPY.milestones.subtitle}
        </Text>
      </View>
      <View style={styles.row}>
        {milestones.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} onPress={onOpenMilestone} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: layout.sectionGap },
  header: { gap: spacing.xxxs, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.xs },
});
