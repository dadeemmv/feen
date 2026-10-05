/**
 * "Il tuo primo percorso" preview on the "Tutto pronto" screen: a wide crop of the main course
 * cover above its title and chapter count. Rendered inside the brand screen, so the card picks
 * the evergreen surface tokens.
 */
import { StyleSheet } from 'react-native';

import { Illustration } from '@/components/illustrations';
import { Card, Text, VStack } from '@/components/ui';
import { MAIN_COURSE_ID, getCourse, orderedChapters } from '@/content/courses';
import { useContentWidth } from '@/features/account/lib/use-content-width';
import { useCourseProgress } from '@/store/hooks';

import { ONBOARDING_COPY } from '../copy';

/** Wide crop of the 16:9 course cover (slice), so the recap fits an iPhone SE without scrolling far. */
const COVER_BAND_RATIO = 2.4;

export function FirstPathCard() {
  const progress = useCourseProgress(MAIN_COURSE_ID);
  const coverWidth = useContentWidth();
  const course = getCourse(MAIN_COURSE_ID);
  const firstChapter = orderedChapters(MAIN_COURSE_ID)[0];
  const copy = ONBOARDING_COPY.ready;

  if (!course || !firstChapter) return null;

  return (
    <Card padding="none" style={styles.card}>
      <Illustration name={course.cover} width={coverWidth} height={Math.round(coverWidth / COVER_BAND_RATIO)} />
      <VStack gap="xxs" padding="md">
        <Text variant="overline" color="accentText">
          {copy.pathOverline}
        </Text>
        <Text variant="titleMd">{course.title}</Text>
        <Text variant="bodySm" color="textSecondary">
          {copy.pathMeta(progress.total, firstChapter.title)}
        </Text>
      </VStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
});
