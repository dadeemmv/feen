/**
 * Title block under the cover: tier pill, course title, course progress and meta chips.
 * Reports its bottom edge so the sticky strip knows when the title has scrolled away.
 */
import { useRef } from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import { BookOpen, Clock } from 'lucide-react-native';

import { BoltIcon } from '@/components/icons';
import { Chip, HStack, iconSize, ProgressBar, Text, VStack } from '@/components/ui';
import { spacing } from '@/theme';

import { COURSE_COPY } from '../copy';
import type { CourseSummary } from '../lib/course-summary';
import { TierTag } from './tier-tag';

export type CourseIntroProps = {
  summary: CourseSummary;
  /** y of the title's bottom edge inside the scroll content. */
  onTitleLayout?: (bottom: number) => void;
};

export function CourseIntro({ summary, onTitleLayout }: CourseIntroProps) {
  const { course, available, completedChapters, totalChapters, ratio, totalMinutes, totalXp } = summary;

  // Title bottom = block offset in the scroll content + title bottom inside the block.
  const offsets = useRef({ block: -1, title: -1 });
  const report = () => {
    const { block, title } = offsets.current;
    if (block >= 0 && title >= 0) onTitleLayout?.(block + title);
  };
  const handleBlockLayout = (event: LayoutChangeEvent) => {
    offsets.current.block = event.nativeEvent.layout.y;
    report();
  };
  const handleTitleLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    offsets.current.title = y + height;
    report();
  };

  return (
    <VStack gap="md" style={styles.root} onLayout={handleBlockLayout}>
      <VStack gap="xs" onLayout={handleTitleLayout}>
        <TierTag tier={course.tier} size="sm" />
        <Text variant="displaySm" accessibilityRole="header">
          {course.title}
        </Text>
      </VStack>

      {available ? (
        <VStack gap="xs" accessible accessibilityLabel={`${COURSE_COPY.progressLabel}: ${COURSE_COPY.chaptersDone(completedChapters, totalChapters)}`}>
          <HStack justify="space-between">
            <Text variant="labelSm" color="textSecondary">
              {COURSE_COPY.chaptersDone(completedChapters, totalChapters)}
            </Text>
            <Text variant="labelSm" color={ratio > 0 ? 'brandText' : 'textTertiary'} tabular>
              {COURSE_COPY.percent(ratio)}
            </Text>
          </HStack>
          <ProgressBar value={ratio} size="md" tone="brand" />
        </VStack>
      ) : null}

      <HStack gap="xs" wrap>
        <Chip label={COURSE_COPY.chapters(totalChapters)} icon={BookOpen} size="sm" />
        {available ? <Chip label={COURSE_COPY.minutes(totalMinutes)} icon={Clock} size="sm" /> : null}
        {available ? (
          <Chip label={COURSE_COPY.xp(totalXp)} icon={<BoltIcon size={iconSize.sm} />} size="sm" />
        ) : null}
      </HStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: spacing.lg },
});
