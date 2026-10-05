/**
 * Building blocks of the CourseCard: the cover band (status badge top-right, where no cover art
 * puts a sparkle), the next-chapter row and the round "go" affordance.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';

import { TrophyIcon } from '@/components/icons';
import { CourseCover, isCourseCoverKey } from '@/components/illustrations';
import { EmojiTile, Icon, iconButtonSize, iconStroke, Text, tileSize, uiOpacity, VStack } from '@/components/ui';
import type { CourseSummary } from '@/features/course/lib/course-summary';
import { radius, spacing, useTheme } from '@/theme';

import { ACADEMY_COPY } from '../copy';

export function CoverBand({
  summary,
  height,
  compact = false,
  trailing,
}: {
  summary: CourseSummary;
  height: number;
  compact?: boolean;
  /** Overlay pinned to the top-right corner. */
  trailing?: ReactNode;
}) {
  const theme = useTheme();
  const { course, available } = summary;
  return (
    <View style={[styles.cover, { height, backgroundColor: theme.colors.brandSurface }]} aria-hidden>
      <View style={[StyleSheet.absoluteFill, !available && styles.dimmed]}>
        {isCourseCoverKey(course.cover) ? <CourseCover variant={course.cover} width="100%" height="100%" /> : null}
      </View>
      {trailing ? <View style={[styles.overlay, compact && styles.overlayCompact]}>{trailing}</View> : null}
    </View>
  );
}

/** Lime circle with an arrow: tells the whole card is a door (not a nested button). */
export function GoAffordance() {
  const theme = useTheme();
  return (
    <View style={[styles.go, { backgroundColor: theme.colors.accentSolid }]} aria-hidden>
      <Icon icon={ArrowRight} size="md" color="onAccent" strokeWidth={iconStroke.bold} />
    </View>
  );
}

/** "Prossimo capitolo · Interesse composto" footer of the large card. */
export function NextChapterRow({ summary }: { summary: CourseSummary }) {
  const { currentChapter, resume, completedChapters, isDone } = summary;

  if (isDone || !currentChapter) {
    return (
      <View style={styles.row}>
        <TrophyIcon size={tileSize.md} />
        <VStack flex>
          <Text variant="overline" color="brandText">
            {ACADEMY_COPY.doneOverline}
          </Text>
          <Text variant="titleSm" numberOfLines={1}>
            {ACADEMY_COPY.doneLine}
          </Text>
        </VStack>
        <GoAffordance />
      </View>
    );
  }

  const overline = resume
    ? ACADEMY_COPY.resumeOverline
    : completedChapters > 0
      ? ACADEMY_COPY.nextOverline
      : ACADEMY_COPY.startOverline;

  return (
    <View style={styles.row}>
      <EmojiTile emoji={currentChapter.emoji} tone="accent" size="md" round />
      <VStack flex>
        <Text variant="overline" color="brandText">
          {overline}
        </Text>
        <Text variant="titleSm" numberOfLines={1}>
          {currentChapter.title}
        </Text>
        {resume ? (
          <Text variant="labelSm" color="textSecondary">
            {ACADEMY_COPY.resumeStep(resume.stepIndex + 1, resume.totalSteps)}
          </Text>
        ) : null}
      </VStack>
      <GoAffordance />
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { overflow: 'hidden' },
  dimmed: { opacity: uiOpacity.dimmed },
  overlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlayCompact: { top: spacing.sm, left: spacing.sm, right: spacing.sm },
  go: {
    width: iconButtonSize.md,
    height: iconButtonSize.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
