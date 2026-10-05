/**
 * Course detail / learning path (docs/PRODUCT_SPEC.md §3.9, SCREEN_SPECS "Course path").
 * Sticky status row on top; below it a scroll view with the collapsing cover, the title block,
 * "Cosa imparerai", the zig-zag path and the trophy card. A compact title strip slides in once
 * the title is gone. On mount (and whenever a chapter unlocks) the current node is scrolled into
 * view.
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from 'lucide-react-native';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { Screen, Tag, toast, useReduceMotion } from '@/components/ui';
import type { Course } from '@/content/types';
import { useStore } from '@/store';
import { layout, spacing } from '@/theme';

import { COMPACT_STRIP, PATH_METRICS, PATH_MOTION } from '../constants';
import { COURSE_COPY } from '../copy';
import { useCourseSummary } from '../hooks/use-course-summary';
import { anchoredScroll, autoScrollTarget } from '../lib/auto-scroll';
import { leaveCourse, openChapter } from '../lib/navigation';
import type { PathRect } from '../path-layout';
import { ComingSoonPanel } from './coming-soon-panel';
import { CompactTitleStrip } from './compact-title-strip';
import { CourseCoverHeader } from './course-cover-header';
import { CourseIntro } from './course-intro';
import { CourseOverview } from './course-overview';
import { GoalCard } from './goal-card';
import { LearningPath } from './learning-path';

export function CoursePathView({ course }: { course: Course }) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const summary = useCourseSummary(course);
  const records = useStore((s) => s.chapterRecords);
  const { available, currentChapter, resume, isDone, completedChapters, totalChapters } = summary;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

  const [titleBottom, setTitleBottom] = useState(-1);
  const [pathTop, setPathTop] = useState(-1);
  const [viewport, setViewport] = useState(0);
  const [currentRect, setCurrentRect] = useState<PathRect | null>(null);

  const measured = pathTop >= 0 && currentRect !== null && viewport > 0;
  const nodeTop = measured ? pathTop + currentRect.y : null;
  const nodeBottom = measured ? pathTop + currentRect.y + currentRect.height + PATH_METRICS.tooltipSpace : null;

  const scrollToCurrent = () => {
    if (nodeTop === null) return;
    scrollRef.current?.scrollTo({ y: anchoredScroll(nodeTop, viewport, PATH_MOTION.autoScrollAnchor), animated: !reduceMotion });
  };

  // Auto-scroll once per current chapter: on first layout, then after each unlock. The chapter is
  // marked as handled only when the scroll fires, so a late re-layout (fonts, images) reschedules it.
  const scrolledFor = useRef<string | null>(null);
  const currentId = currentChapter?.id ?? null;
  useEffect(() => {
    if (nodeTop === null || nodeBottom === null || currentId === null || scrolledFor.current === currentId) return;
    const timer = setTimeout(() => {
      scrolledFor.current = currentId;
      const target = autoScrollTarget({
        nodeTop,
        nodeBottom,
        viewport,
        scrollY: scrollY.get(),
        anchor: PATH_MOTION.autoScrollAnchor,
        margin: PATH_MOTION.autoScrollMargin,
        topInset: COMPACT_STRIP.height,
      });
      if (target !== null) scrollRef.current?.scrollTo({ y: target, animated: !reduceMotion });
    }, PATH_MOTION.autoScrollDelay);
    return () => clearTimeout(timer);
  }, [nodeTop, nodeBottom, viewport, currentId, reduceMotion, scrollRef, scrollY]);

  const handleLocked = () => {
    if (!currentChapter) return;
    toast.show({ message: COURSE_COPY.lockedToast(currentChapter.title), icon: Lock });
  };

  const handlePathLayout = (event: LayoutChangeEvent) => setPathTop(event.nativeEvent.layout.y);
  const handleViewport = (event: LayoutChangeEvent) => setViewport(event.nativeEvent.layout.height);

  return (
    <Screen preset="fixed" padded={false} header={<ConnectedStatusHeader onBack={leaveCourse} />}>
      <View style={styles.flex}>
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onLayout={handleViewport}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxxl }]}>
          <CourseCoverHeader
            cover={course.cover}
            scrollY={scrollY}
            dimmed={!available}
            accessibilityLabel={COURSE_COPY.coverLabel(course.title)}
            badge={available ? undefined : <Tag label={COURSE_COPY.comingSoonTag} tone="accent" solid size="sm" />}
          />
          <CourseIntro summary={summary} onTitleLayout={setTitleBottom} />

          {available ? (
            <>
              <View style={styles.overview}>
                <CourseOverview course={course} totalChapters={totalChapters} />
              </View>
              <View style={styles.path} onLayout={handlePathLayout}>
                <LearningPath
                  course={course}
                  records={records}
                  currentChapterId={currentChapter?.id}
                  resume={resume}
                  isDone={isDone}
                  onOpenChapter={openChapter}
                  onLockedChapter={handleLocked}
                  onCurrentNode={setCurrentRect}
                />
              </View>
              <GoalCard courseTitle={course.title} completed={completedChapters} total={totalChapters} isDone={isDone} />
            </>
          ) : (
            <ComingSoonPanel courseId={course.id} />
          )}
        </Animated.ScrollView>

        <CompactTitleStrip
          title={course.title}
          completed={completedChapters}
          total={totalChapters}
          scrollY={scrollY}
          threshold={titleBottom}
          onPress={available && currentChapter ? scrollToCurrent : undefined}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: layout.screenX },
  overview: { marginTop: spacing.xl },
  path: { marginTop: spacing.xl },
});
