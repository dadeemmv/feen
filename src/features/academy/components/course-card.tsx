/**
 * CourseCard — store-connected course card, reusable anywhere (Academy, Home):
 *
 *   <CourseCard course={getCourse(MAIN_COURSE_ID)!} size="large" />   // "Continua a studiare"
 *   <CourseCard course={course} size="compact" />                      // carousel
 *
 * - large: 168 cover band, tier pill, title, description, progress, chips and the next-chapter row.
 * - compact: 112 cover band ("In arrivo" badge), tier pill, 2-line title and either the progress or
 *   the chapters chip with the notify bell (a sibling of the card, never a nested button).
 * Tapping an available course pushes its path; a coming-soon course turns the bell on + toast.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Bell, BellRing, BookOpen, Clock } from 'lucide-react-native';

import { Card, Chip, Divider, HStack, IconButton, iconButtonSize, ProgressBar, Tag, Text, VStack } from '@/components/ui';
import type { Course } from '@/content/types';
import { TierTag } from '@/features/course/components/tier-tag';
import { spacing, textVariants } from '@/theme';

import { COURSE_CARD } from '../constants';
import { ACADEMY_COPY } from '../copy';
import { useCourseCard } from '../hooks/use-course-card';
import { CoverBand, NextChapterRow } from './course-card-parts';

export type CourseCardSize = 'large' | 'compact';

export type CourseCardProps = {
  course: Course;
  /** Default `large`. */
  size?: CourseCardSize;
  /** Overrides the default tap (open the path / notify me). */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function CourseCard({ size = 'large', ...props }: CourseCardProps) {
  return size === 'large' ? <LargeCourseCard {...props} /> : <CompactCourseCard {...props} />;
}

function LargeCourseCard({ course, onPress, style }: Omit<CourseCardProps, 'size'>) {
  const { summary, open } = useCourseCard(course);
  const { available, completedChapters, totalChapters, ratio, totalMinutes, isDone } = summary;

  return (
    <Card
      padding="none"
      onPress={onPress ?? open}
      accessibilityLabel={
        available ? ACADEMY_COPY.cardLabel(course.title, completedChapters, totalChapters) : ACADEMY_COPY.comingSoonLabel(course.title)
      }
      accessibilityHint={available ? ACADEMY_COPY.cardHint : ACADEMY_COPY.comingSoonHint}
      style={[styles.clip, style]}>
      <CoverBand
        summary={summary}
        height={COURSE_CARD.largeCover}
        trailing={isDone ? <Tag label={ACADEMY_COPY.doneOverline} tone="accent" solid size="sm" /> : undefined}
      />
      <VStack gap="sm" style={styles.body}>
        <VStack gap="xs">
          <TierTag tier={course.tier} size="sm" style={styles.tier} />
          <Text variant="titleLg" numberOfLines={2}>
            {course.title}
          </Text>
        </VStack>
        <Text variant="bodySm" color="textSecondary" numberOfLines={2}>
          {course.description}
        </Text>
        {available ? (
          <HStack gap="sm" style={styles.progress}>
            <ProgressBar value={ratio} size="sm" tone="brand" style={styles.flex} />
            <Text variant="labelSm" color="textSecondary" tabular>
              {ACADEMY_COPY.fraction(completedChapters, totalChapters)}
            </Text>
          </HStack>
        ) : null}
        <HStack gap="xs" wrap>
          <Chip label={ACADEMY_COPY.chapters(totalChapters)} icon={BookOpen} size="sm" />
          {available ? <Chip label={ACADEMY_COPY.minutes(totalMinutes)} icon={Clock} size="sm" /> : null}
        </HStack>
      </VStack>
      {available ? (
        <>
          <Divider />
          <View style={styles.footer}>
            <NextChapterRow summary={summary} />
          </View>
        </>
      ) : null}
    </Card>
  );
}

function CompactCourseCard({ course, onPress, style }: Omit<CourseCardProps, 'size'>) {
  const { summary, notify, toggleNotify, open } = useCourseCard(course);
  const { available, completedChapters, totalChapters, ratio } = summary;

  return (
    <View style={style}>
      <Card
        padding="none"
        onPress={onPress ?? open}
        accessibilityLabel={
          available ? ACADEMY_COPY.cardLabel(course.title, completedChapters, totalChapters) : ACADEMY_COPY.comingSoonLabel(course.title)
        }
        accessibilityHint={available ? ACADEMY_COPY.cardHint : ACADEMY_COPY.comingSoonHint}
        style={[styles.clip, styles.flex]}
        contentStyle={styles.flex}>
        <CoverBand
          summary={summary}
          height={COURSE_CARD.compactCover}
          compact
          trailing={available ? undefined : <Tag label={ACADEMY_COPY.comingSoon} tone="accent" solid size="sm" />}
        />
        <VStack gap="sm" flex style={styles.compactBody}>
          <VStack gap="xs">
            <TierTag tier={course.tier} size="sm" style={styles.tier} />
            <Text variant="titleSm" numberOfLines={2} style={styles.compactTitle}>
              {course.title}
            </Text>
          </VStack>
          {available ? (
            <HStack gap="xs">
              <ProgressBar value={ratio} size="sm" tone="brand" style={styles.flex} />
              <Text variant="labelSm" color="textSecondary" tabular>
                {ACADEMY_COPY.fraction(completedChapters, totalChapters)}
              </Text>
            </HStack>
          ) : (
            <View style={styles.bellRoom}>
              <Chip label={ACADEMY_COPY.chapters(totalChapters)} icon={BookOpen} size="sm" />
            </View>
          )}
        </VStack>
      </Card>
      {available ? null : (
        <IconButton
          icon={notify ? BellRing : Bell}
          variant={notify ? 'accent' : 'surface'}
          size="sm"
          accessibilityLabel={notify ? ACADEMY_COPY.notifyOff : ACADEMY_COPY.notifyOn}
          onPress={toggleNotify}
          style={styles.bell}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  tier: { alignSelf: 'flex-start' },
  flex: { flex: 1 },
  body: { padding: spacing.lg },
  progress: { marginTop: spacing.xxs },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  compactBody: { padding: spacing.md, justifyContent: 'space-between' },
  compactTitle: { minHeight: textVariants.titleSm.lineHeight * 2 },
  bellRoom: { minHeight: iconButtonSize.sm, justifyContent: 'center', alignItems: 'flex-start' },
  bell: { position: 'absolute', right: spacing.md, bottom: spacing.md },
});
