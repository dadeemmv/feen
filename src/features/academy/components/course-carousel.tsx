/**
 * "Potrebbe interessarti" — edge-to-edge horizontal carousel of compact course cards that snaps
 * card by card. The next card always peeks in so the row reads as scrollable.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import type { Course } from '@/content/types';
import { duration, easing } from '@/theme';

import { ACADEMY_MOTION, CAROUSEL, COURSE_CARD } from '../constants';
import { ACADEMY_COPY } from '../copy';
import { CourseCard } from './course-card';

export function CourseCarousel({ courses }: { courses: readonly Course[] }) {
  const reduceMotion = useReduceMotion();
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => setWidth(Math.round(event.nativeEvent.layout.width));
  const contentWidth = Math.max(0, width - CAROUSEL.bleed * 2);
  const cardWidth = Math.round(
    Math.min(COURSE_CARD.compactMax, Math.max(COURSE_CARD.compactMin, contentWidth * COURSE_CARD.compactRatio)),
  );

  return (
    <View style={styles.bleed} onLayout={handleLayout}>
      {width > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardWidth + CAROUSEL.gap}
          snapToAlignment="start"
          disableIntervalMomentum
          accessibilityLabel={ACADEMY_COPY.suggestedTitle}
          contentContainerStyle={styles.row}>
          {courses.map((course, index) => (
            <Animated.View
              key={course.id}
              entering={
                reduceMotion
                  ? undefined
                  : FadeInRight.duration(duration.slow)
                      .easing(easing.enter)
                      .delay(index * ACADEMY_MOTION.stagger)
              }
              style={[styles.item, { width: cardWidth }]}>
              <CourseCard course={course} size="compact" style={styles.card} />
            </Animated.View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -CAROUSEL.bleed },
  row: { paddingHorizontal: CAROUSEL.bleed, gap: CAROUSEL.gap, paddingVertical: CAROUSEL.gap / 2 },
  item: { alignSelf: 'stretch' },
  card: { flex: 1 },
});
