/**
 * Route screen of `/lesson/[id]` (full-screen modal, gestures off): resolves the chapter and its
 * lesson content, guards the states that are not a playable lesson (unknown id / missing content
 * → error, chapter still locked → locked), then mounts the player keyed by chapter so a new id
 * always starts a fresh machine.
 */
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { getChapter, getCourseForChapter } from '@/content/courses';
import { findLesson } from '@/content/lessons';
import { selectChapterStatus, useStore } from '@/store';

import { LessonStateScreen } from './components/lesson-state-screen';
import { LessonPlayer } from './lesson-player';
import { goBackToPath } from './use-lesson-overlays';

export function LessonScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? (params.id[0] ?? '') : (params.id ?? '');
  const chapter = getChapter(id);
  const lesson = chapter ? findLesson(chapter.id) : undefined;
  const courseId = chapter ? getCourseForChapter(chapter.id)?.id : undefined;
  const status = useStore((s) => (courseId ? selectChapterStatus(s, courseId, id) : 'current'));
  // The gate is decided at open: finishing the lesson must never flip the screen to "locked".
  const [openedAs] = useState(status);
  const [forced, setForced] = useState(false);

  if (!chapter || !lesson || lesson.steps.length === 0) {
    return <LessonStateScreen kind="error" onBack={goBackToPath} />;
  }
  if (openedAs === 'locked' && !forced) {
    return (
      <LessonStateScreen kind="locked" onBack={goBackToPath} onForceOpen={__DEV__ ? () => setForced(true) : undefined} />
    );
  }
  return <LessonPlayer key={chapter.id} chapter={chapter} lesson={lesson} />;
}
