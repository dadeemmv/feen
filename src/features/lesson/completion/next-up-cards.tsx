/**
 * "What's next" cards on the completion screen: the chapter that just unlocked (preview of the
 * next path node), the end-of-course trophy, and a milestone reward crossed by this lesson.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { TrophyIcon } from '@/components/icons';
import { EmojiTile, Text, hairline, iconSize, tileSize } from '@/components/ui';
import type { Chapter } from '@/content/types';
import { RewardIcon } from '@/features/rewards';
import type { ResolvedMilestone } from '@/store';
import { radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';

function InfoCard({ leading, overline, title, subtitle }: { leading: ReactNode; overline?: string; title: string; subtitle?: string }) {
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={[overline, title, subtitle].filter(Boolean).join('. ')}
      style={[styles.card, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.borderSubtle }]}>
      {leading}
      <View style={styles.text}>
        {overline ? (
          <Text variant="overline" color="accentText">
            {overline}
          </Text>
        ) : null}
        <Text variant="titleSm" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" color="textSecondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function NextChapterCard({ chapter, justUnlocked }: { chapter: Chapter; justUnlocked: boolean }) {
  return (
    <InfoCard
      leading={<EmojiTile emoji={chapter.emoji} tone="accent" size="lg" round />}
      overline={justUnlocked ? COPY.completion.nextOverline : COPY.completion.nextOverlineDone}
      title={chapter.title}
      subtitle={COPY.completion.nextMinutes(chapter.estimatedMinutes)}
    />
  );
}

export function CourseDoneCard() {
  return (
    <InfoCard
      leading={
        <View style={styles.iconSlot}>
          <TrophyIcon size={tileSize.lg} />
        </View>
      }
      title={COPY.completion.courseDoneTitle}
      subtitle={COPY.completion.courseDoneMessage}
    />
  );
}

export function MilestoneCard({ milestone }: { milestone: ResolvedMilestone }) {
  return (
    <InfoCard
      leading={
        <View style={styles.iconSlot}>
          <RewardIcon kind={milestone.reward.kind} size={iconSize.xl + spacing.md} />
        </View>
      }
      title={COPY.completion.milestone(milestone.title)}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: hairline,
  },
  iconSlot: { width: tileSize.lg, height: tileSize.lg, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: spacing.xxxs },
});
