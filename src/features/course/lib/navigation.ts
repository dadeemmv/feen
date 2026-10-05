/**
 * Navigation out of the course path (and into it, from Academy / Home).
 */
import { router } from 'expo-router';

import { getStoreState, selectIsChapterCompleted, selectIsOutOfLives } from '@/store';
import { openSheet } from '@/store/ui';

/** Push the learning path of a course. */
export function openCourse(courseId: string): void {
  router.push({ pathname: '/course/[id]', params: { id: courseId } });
}

/**
 * Open the lesson player. A completed chapter opens in practice mode (the lesson never takes a
 * life there); a new chapter with 0 lives and no perk opens the Out-of-lives sheet instead.
 * Returns false when the lesson was not opened.
 */
export function openChapter(chapterId: string): boolean {
  const state = getStoreState();
  if (!selectIsChapterCompleted(state, chapterId) && selectIsOutOfLives(state, Date.now())) {
    openSheet('out-of-lives');
    return false;
  }
  router.push({ pathname: '/lesson/[id]', params: { id: chapterId } });
  return true;
}

/** Back to wherever the path was opened from; deep links fall back to the Academy tab. */
export function leaveCourse(): void {
  if (router.canGoBack()) router.back();
  else router.replace('/academy');
}
