/**
 * Course detail / learning path route screen (`/course/[id]`): resolves the course and renders
 * the path, or a friendly "not found" state for stale links.
 */
import { useLocalSearchParams } from 'expo-router';

import { getCourse } from '@/content/courses';

import { CourseNotFound } from './components/course-not-found';
import { CoursePathView } from './components/course-path-view';

export function CourseScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const course = getCourse(id);
  if (!course) return <CourseNotFound />;
  // Keyed by id so moving between courses resets scroll, measurements and auto-scroll.
  return <CoursePathView key={course.id} course={course} />;
}
