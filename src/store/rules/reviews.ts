/**
 * Review rules (pure). A week after a building is finished, one of its residents comes by with a
 * real problem on its topic (concept board §04, spaced repetition). A right answer makes the
 * building bloom; a wrong one loses nothing: the partner explains and the resident comes back a
 * few days later with another problem. Visits fall on local days: the resident is there from the
 * morning of the day they are due, and waits as long as it takes.
 */
import { getReviewSet, type ReviewProblem } from '@/content/reviews';
import { BUILDING_IDS, BUILDINGS, type BuildingId } from '@/content/village';
import { addDays, daysBetween, startOfDay } from '@/lib/dates';

import type { ProgressData, ReviewRecord } from '../types';

/** Days from the end of a building to the first visit. */
export const REVIEW_AFTER_DAYS = 7;
/** Days before the resident comes back after a wrong answer. */
export const REVIEW_RETRY_DAYS = 3;
/** Bricks the resident leaves as thanks for a right answer. */
export const REVIEW_THANKS_BRICKS = 10;

type ReviewInput = Pick<ProgressData, 'chapterRecords' | 'bloomed' | 'reviews'>;

/** When the building was finished: the first completion of its last lesson; null while it is not. */
export function builtAt(id: BuildingId, records: ProgressData['chapterRecords']): number | null {
  const { chapterIds } = BUILDINGS[id];
  if (chapterIds.length === 0) return null;
  let last = 0;
  for (const chapterId of chapterIds) {
    const record = records[chapterId];
    if (!record) return null;
    last = Math.max(last, record.completedAt);
  }
  return last;
}

/** The persisted record of a building's visits, if it has the expected shape. */
export function reviewRecordOf(s: Pick<ReviewInput, 'reviews'>, id: BuildingId): ReviewRecord | undefined {
  const record = s.reviews[id];
  return record && typeof record.lastAt === 'number' && Array.isArray(record.asked) ? record : undefined;
}

/**
 * The morning the resident comes by (epoch ms, local midnight), or null: the building is not
 * finished, it has no problems yet, or it already bloomed.
 */
export function reviewDueAt(id: BuildingId, s: ReviewInput): number | null {
  if (s.bloomed.includes(id) || !getReviewSet(id)) return null;
  const built = builtAt(id, s.chapterRecords);
  if (built === null) return null;
  const record = reviewRecordOf(s, id);
  const from = record ? record.lastAt : built;
  return startOfDay(addDays(from, record ? REVIEW_RETRY_DAYS : REVIEW_AFTER_DAYS)).getTime();
}

export function isReviewWaiting(id: BuildingId, s: ReviewInput, now: number): boolean {
  const due = reviewDueAt(id, s);
  return due !== null && now >= due;
}

/** Buildings with a resident waiting right now, in the order of the village list. */
export function waitingReviews(s: ReviewInput, now: number): BuildingId[] {
  return BUILDING_IDS.filter((id) => isReviewWaiting(id, s, now));
}

/** Calendar days until the resident comes by (0 = already waiting); null when nobody is coming. */
export function daysToReview(id: BuildingId, s: ReviewInput, now: number): number | null {
  const due = reviewDueAt(id, s);
  return due === null ? null : Math.max(0, daysBetween(now, due));
}

/** The problem the next visit brings: the first not asked yet, then round again from the first. */
export function nextProblem(id: BuildingId, s: Pick<ReviewInput, 'reviews'>): ReviewProblem | undefined {
  const problems = getReviewSet(id)?.problems ?? [];
  if (problems.length === 0) return undefined;
  const asked = reviewRecordOf(s, id)?.asked ?? [];
  return problems.find((problem) => !asked.includes(problem.id)) ?? problems[asked.length % problems.length];
}
