/**
 * Route screen of `/lesson/[id]` (full-screen modal, gestures off): resolves the chapter and its
 * lesson content, guards the states that are not a playable lesson (unknown id / missing content
 * → error; there are no locks in the village), then mounts the player keyed by chapter so a new id
 * always starts a fresh machine.
 */
import { useLocalSearchParams } from 'expo-router';

import { getChapter } from '@/content/courses';
import { findLesson } from '@/content/lessons';

import { LessonStateScreen } from './components/lesson-state-screen';
import { LessonPlayer } from './lesson-player';
import { goBackToPath } from './use-lesson-overlays';

export function LessonScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? (params.id[0] ?? '') : (params.id ?? '');
  const chapter = getChapter(id);
  const lesson = chapter ? findLesson(chapter.id) : undefined;

  if (!chapter || !lesson || lesson.steps.length === 0) {
    return <LessonStateScreen kind="error" onBack={goBackToPath} />;
  }
  return <LessonPlayer key={chapter.id} chapter={chapter} lesson={lesson} />;
}
