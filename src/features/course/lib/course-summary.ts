/**
 * Course view model shared by the course path and the Academy cards. PURE (no React): it takes
 * the raw progress fields so it can be unit tested and memoised by the React Compiler.
 */
import { chapterCount, getChapter, orderedChapters } from '@/content/courses';
import { findLesson } from '@/content/lessons';
import type { Chapter, Course } from '@/content/types';
import type { ChapterRecord, LessonSession } from '@/store';

export type ChapterState = 'completed' | 'current' | 'locked';

export type ResumePoint = {
  chapterId: string;
  /** 0-based step the saved session resumes from. */
  stepIndex: number;
  totalSteps: number;
  /** stepIndex / totalSteps. */
  ratio: number;
};

export type CourseSummary = {
  course: Course;
  available: boolean;
  /** Published chapters (planned count for coming-soon courses). */
  totalChapters: number;
  completedChapters: number;
  ratio: number;
  isDone: boolean;
  /** Sum of the chapters' estimated minutes (0 for coming-soon courses). */
  totalMinutes: number;
  totalXp: number;
  /** First chapter not completed yet, in path order. */
  currentChapter?: Chapter;
  /** Saved lesson session on the current chapter (past step 0) — "RIPRENDI DA QUI". */
  resume?: ResumePoint;
};

type ProgressInput = {
  chapterRecords: Record<string, ChapterRecord>;
  session: LessonSession | null;
};

/** Saved session of `chapterId`, when it is past the first step. */
export function getResumePoint(session: LessonSession | null, chapterId: string | undefined): ResumePoint | undefined {
  if (!session || !chapterId || session.chapterId !== chapterId || session.stepIndex <= 0) return undefined;
  const totalSteps = findLesson(chapterId)?.steps.length ?? 0;
  if (totalSteps === 0) return undefined;
  const stepIndex = Math.min(session.stepIndex, totalSteps - 1);
  return { chapterId, stepIndex, totalSteps, ratio: stepIndex / totalSteps };
}

export function summarizeCourse(course: Course, { chapterRecords, session }: ProgressInput): CourseSummary {
  const chapters = orderedChapters(course.id);
  const available = course.status === 'available' && chapters.length > 0;
  const completedChapters = chapters.filter((chapter) => chapterRecords[chapter.id] !== undefined).length;
  const totalChapters = available ? chapters.length : chapterCount(course.id);
  const currentChapter = chapters.find((chapter) => chapterRecords[chapter.id] === undefined);
  return {
    course,
    available,
    totalChapters,
    completedChapters,
    ratio: totalChapters === 0 ? 0 : completedChapters / totalChapters,
    isDone: available && completedChapters === chapters.length,
    totalMinutes: chapters.reduce((sum, chapter) => sum + chapter.estimatedMinutes, 0),
    totalXp: chapters.reduce((sum, chapter) => sum + chapter.xpReward, 0),
    currentChapter,
    resume: getResumePoint(session, currentChapter?.id),
  };
}

/** completed → done · first not completed → current · the rest → locked (path order). */
export function getChapterState(chapterId: string, currentChapterId: string | undefined, records: Record<string, ChapterRecord>): ChapterState {
  if (records[chapterId] !== undefined) return 'completed';
  return chapterId === currentChapterId ? 'current' : 'locked';
}

/** 1–3 stars from the best accuracy of a completed chapter. */
export function accuracyStars(accuracy: number): 1 | 2 | 3 {
  if (accuracy >= 0.95) return 3;
  if (accuracy >= 0.7) return 2;
  return 1;
}

/** Chapter title for copy ("Completa prima “Inflazione”"), tolerant to unknown ids. */
export function chapterTitle(chapterId: string | undefined): string {
  return (chapterId && getChapter(chapterId)?.title) || '';
}
