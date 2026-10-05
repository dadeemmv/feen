/**
 * Lesson counters derived from chapter records.
 */
import type { ProgressData } from '../types';

type Records = ProgressData['chapterRecords'];

/** Distinct chapters completed at least once (course path progress). */
export const countCompletedChapters = (records: Records): number => Object.keys(records).length;

/**
 * Lessons completed, practice replays included (Home milestones "Sblocca dopo n lezioni" and
 * profile stats). Counting runs keeps the 15-lesson milestone reachable on a 13-chapter course.
 */
export const countCompletedLessons = (records: Records): number =>
  Object.values(records).reduce((sum, record) => sum + record.runs, 0);
