/**
 * Store-connected course view model (progress, current chapter, saved session). Subscribes to the
 * two raw fields it needs, derives during render (React Compiler memoises the derivation).
 */
import type { Course } from '@/content/types';
import { useStore } from '@/store';

import { summarizeCourse, type CourseSummary } from '../lib/course-summary';

export function useCourseSummary(course: Course): CourseSummary {
  const chapterRecords = useStore((s) => s.chapterRecords);
  const session = useStore((s) => s.session);
  return summarizeCourse(course, { chapterRecords, session });
}

/** Bell of a coming-soon course ("Avvisami"). */
export function useCourseNotify(courseId: string): { notify: boolean; toggle: () => boolean } {
  const notify = useStore((s) => s.notifyCourseIds.includes(courseId));
  const toggleCourseNotify = useStore((s) => s.toggleCourseNotify);
  return { notify, toggle: () => toggleCourseNotify(courseId) };
}
