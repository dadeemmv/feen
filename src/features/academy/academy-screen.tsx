/**
 * Academy tab (docs/PRODUCT_SPEC.md §3.11): "Continua a studiare" with the large card of the
 * course in progress, "Potrebbe interessarti" carousel (coming-soon courses with the notify bell)
 * and "I tuoi traguardi" mini stats.
 */
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookOpen, Sparkles, Trophy } from 'lucide-react-native';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { Screen, ScreenTitle, useReduceMotion } from '@/components/ui';
import { COURSES, MAIN_COURSE_ID } from '@/content/courses';
import type { Course } from '@/content/types';
import { useStore } from '@/store';
import { duration, easing } from '@/theme';

import { AcademySection } from './components/academy-section';
import { CourseCard } from './components/course-card';
import { CourseCarousel } from './components/course-carousel';
import { LearningStats } from './components/learning-stats';
import { ACADEMY_MOTION } from './constants';
import { ACADEMY_COPY } from './copy';

/** Course to continue: the one with the saved session, else the first started, else the main one. */
function useContinueCourse(): Course {
  const sessionChapterId = useStore((s) => s.session?.chapterId);
  const records = useStore((s) => s.chapterRecords);
  const available = COURSES.filter((course) => course.status === 'available');
  const has = (course: Course, test: (chapterId: string) => boolean) =>
    course.levels.some((level) => level.chapterIds.some(test));
  return (
    (sessionChapterId ? available.find((course) => has(course, (id) => id === sessionChapterId)) : undefined) ??
    available.find((course) => has(course, (id) => records[id] !== undefined)) ??
    available.find((course) => course.id === MAIN_COURSE_ID) ??
    COURSES[0]
  );
}

export function AcademyScreen() {
  const reduceMotion = useReduceMotion();
  const continueCourse = useContinueCourse();
  const enter = (step: number) =>
    reduceMotion ? undefined : FadeInDown.duration(duration.slow).easing(easing.enter).delay(step * ACADEMY_MOTION.stagger);

  return (
    <Screen withTabBar header={<ConnectedStatusHeader />}>
      <ScreenTitle title={ACADEMY_COPY.title} subtitle={ACADEMY_COPY.subtitle} />

      <Animated.View entering={enter(0)}>
        <AcademySection icon={BookOpen} tone="brand" title={ACADEMY_COPY.continueTitle} first />
        <CourseCard course={continueCourse} size="large" />
      </Animated.View>

      <Animated.View entering={enter(1)}>
        <AcademySection icon={Sparkles} tone="lilac" title={ACADEMY_COPY.suggestedTitle} subtitle={ACADEMY_COPY.suggestedSubtitle} />
        <CourseCarousel courses={COURSES} />
      </Animated.View>

      <Animated.View entering={enter(2)}>
        <AcademySection icon={Trophy} tone="butter" title={ACADEMY_COPY.statsTitle} />
        <LearningStats />
      </Animated.View>
    </Screen>
  );
}
