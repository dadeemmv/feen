/**
 * Derived state — pure functions of `(state, ...args)`, never stored (docs/ARCHITECTURE.md §4).
 *
 * Usage with React: selectors returning primitives can go straight into `useStore`:
 *   const streak = useStore((s) => selectStreak(s, now));
 * Selectors returning objects/arrays build a new value on every call, which zustand v5 treats as
 * a change (render loop). Use the hooks in `./hooks` or `useStoreShallow` for flat objects, or
 * select the raw inputs and call the selector during render.
 */
import { orderedChapterIds } from '@/content/courses';
import type { ShopItem } from '@/content/types';
import { toDayKey, type DayKey } from '@/lib/dates';

import { resolveChallenges, type ResolvedChallenge } from './challenges';
import { resolveMilestones, type ResolvedMilestone } from './milestones';
import { computeLives, hasUnlimitedLives, isProActive, type LivesSnapshot } from './rules/lives';
import { getUserLevel, type UserLevel } from './rules/levels';
import { countCompletedChapters, countCompletedLessons } from './rules/progress';
import { computeLongestStreak, computeStreak, type StreakInfo } from './rules/streak';
import { getAvailabilityIssue } from './rules/shop';
import type { BuyFailureReason, RootState } from './types';

type S = RootState;

/* ── Streak ───────────────────────────────────────────────────────────────────────────────── */

export const selectStreak = (s: Pick<S, 'activeDays' | 'shieldedDays' | 'shields'>, now: number): number =>
  computeStreak(s, now).count;

export const selectStreakInfo = (s: Pick<S, 'activeDays' | 'shieldedDays' | 'shields'>, now: number): StreakInfo =>
  computeStreak(s, now);

/** Best streak ever (never below the current one). */
export const selectLongestStreak = (s: Pick<S, 'activeDays' | 'shieldedDays' | 'shields'>, now: number): number =>
  Math.max(computeLongestStreak(s), computeStreak(s, now).count);

/** "Sfide Maratona" with progress / reached / claimed (compute during render). */
export function selectChallenges(s: Pick<S, 'activeDays' | 'shieldedDays' | 'shields' | 'claimedChallenges'>, now: number): ResolvedChallenge[] {
  const current = computeStreak(s, now).count;
  return resolveChallenges({ current, longest: Math.max(current, computeLongestStreak(s)) }, s.claimedChallenges);
}

export type CalendarDayStatus = 'active' | 'shielded' | 'none';

/** Status of a streak-calendar cell. */
export function getCalendarDayStatus(s: Pick<S, 'activeDays' | 'shieldedDays'>, day: DayKey): CalendarDayStatus {
  if (s.activeDays.includes(day)) return 'active';
  if (s.shieldedDays.includes(day)) return 'shielded';
  return 'none';
}

/* ── Chapters & courses ───────────────────────────────────────────────────────────────────── */

/** Lessons completed, practice replays included (milestones, stats). */
export const selectLessonsCompleted = (s: Pick<S, 'chapterRecords'>): number => countCompletedLessons(s.chapterRecords);

/** Distinct chapters completed. */
export const selectChaptersCompleted = (s: Pick<S, 'chapterRecords'>): number => countCompletedChapters(s.chapterRecords);

export const selectIsChapterCompleted = (s: Pick<S, 'chapterRecords'>, chapterId: string): boolean =>
  s.chapterRecords[chapterId] !== undefined;

export type ChapterStatus = 'completed' | 'current' | 'locked';

/** First chapter of the course (path order) that is not completed; undefined when all are done. */
export function selectCurrentChapter(s: Pick<S, 'chapterRecords'>, courseId: string): string | undefined {
  return orderedChapterIds(courseId).find((id) => s.chapterRecords[id] === undefined);
}

/** completed → done; current → the first not completed; everything after it → locked. */
export function selectChapterStatus(s: Pick<S, 'chapterRecords'>, courseId: string, chapterId: string): ChapterStatus {
  if (s.chapterRecords[chapterId] !== undefined) return 'completed';
  const ids = orderedChapterIds(courseId);
  if (!ids.includes(chapterId)) return 'locked';
  return selectCurrentChapter(s, courseId) === chapterId ? 'current' : 'locked';
}

/** Status of every chapter of a course, in path order (compute during render). */
export function selectChapterStatuses(s: Pick<S, 'chapterRecords'>, courseId: string): Record<string, ChapterStatus> {
  const current = selectCurrentChapter(s, courseId);
  return Object.fromEntries(
    orderedChapterIds(courseId).map((id) => [
      id,
      s.chapterRecords[id] !== undefined ? 'completed' : id === current ? 'current' : 'locked',
    ]),
  );
}

export type CourseProgress = { completed: number; total: number; ratio: number; isDone: boolean };

export function selectCourseProgress(s: Pick<S, 'chapterRecords'>, courseId: string): CourseProgress {
  const ids = orderedChapterIds(courseId);
  const completed = ids.filter((id) => s.chapterRecords[id] !== undefined).length;
  const total = ids.length;
  return { completed, total, ratio: total === 0 ? 0 : completed / total, isDone: total > 0 && completed === total };
}

export type ResumeInfo = { hasSession: boolean; stepIndex: number };

/** "RIPRENDI DA QUI" when a saved session exists past step 0. */
export function selectResumeInfo(s: Pick<S, 'session'>, chapterId: string): ResumeInfo {
  const session = s.session?.chapterId === chapterId ? s.session : null;
  return { hasSession: session !== null && session.stepIndex > 0, stepIndex: session?.stepIndex ?? 0 };
}

/* ── Milestones & levels ──────────────────────────────────────────────────────────────────── */

export const selectMilestones = (s: Pick<S, 'chapterRecords' | 'claimedMilestones'>): ResolvedMilestone[] =>
  resolveMilestones(selectLessonsCompleted(s), s.claimedMilestones);

/** Reached but not yet claimed (badge on Home). */
export const selectClaimableMilestoneCount = (s: Pick<S, 'chapterRecords' | 'claimedMilestones'>): number =>
  selectMilestones(s).filter((m) => m.reached && !m.claimed).length;

/** Accepts the XP number or the state. */
export function selectUserLevel(input: number | Pick<S, 'xp'>): UserLevel {
  return getUserLevel(typeof input === 'number' ? input : input.xp);
}

/* ── Lives & perks ────────────────────────────────────────────────────────────────────────── */

export const selectIsUnlimited = (s: Pick<S, 'unlimitedUntil' | 'proUntil'>, now: number): boolean =>
  hasUnlimitedLives(s, now);

export const selectIsPro = (s: Pick<S, 'proUntil'>, now: number): boolean => isProActive(s, now);

export type LivesView = LivesSnapshot & { unlimited: boolean; max: number };

/** Lives with the refills earned by the clock (read-only; `syncLives` commits them). */
export function selectLives(s: Pick<S, 'lives' | 'maxLives' | 'lastLifeAt' | 'unlimitedUntil' | 'proUntil'>, now: number): LivesView {
  return { ...computeLives(s, now), unlimited: hasUnlimitedLives(s, now), max: s.maxLives };
}

/** Lives shown in chips (refills included). */
export const selectLivesCount = (s: Pick<S, 'lives' | 'maxLives' | 'lastLifeAt'>, now: number): number =>
  computeLives(s, now).lives;

/** A wrong answer costs a life: not unlimited/Pro and not a practice replay of a completed chapter. */
export const selectCanLoseLife = (s: S, chapterId: string, now: number): boolean =>
  !hasUnlimitedLives(s, now) && !selectIsChapterCompleted(s, chapterId);

/** The lesson cannot start / continue: 0 lives and no perk. */
export const selectIsOutOfLives = (s: S, now: number): boolean =>
  !hasUnlimitedLives(s, now) && computeLives(s, now).lives <= 0;

/* ── Shop & daily flags ───────────────────────────────────────────────────────────────────── */

export const selectDailyRewardAvailable = (s: Pick<S, 'dailyRewardClaimedOn'>, now: number): boolean =>
  s.dailyRewardClaimedOn !== toDayKey(now);

export type ShopItemView = {
  /** Can be bought/claimed right now. */
  available: boolean;
  /** Why not (availability first, then price). */
  reason: BuyFailureReason | null;
  affordable: boolean;
};

export function selectShopItemState(s: S, item: ShopItem, now: number): ShopItemView {
  const issue = getAvailabilityIssue(item, s, now);
  const affordable = s.coins >= item.price;
  const reason = issue ?? (affordable ? null : 'insufficient-coins');
  return { available: reason === null, reason, affordable };
}

/** Referral promo sheet at most once per day, after onboarding. */
export const selectReferralPromoDue = (s: Pick<S, 'lastReferralPromoOn' | 'onboardingDone'>, now: number): boolean =>
  s.onboardingDone && s.lastReferralPromoOn !== toDayKey(now);

export const selectHasSeenStory = (s: Pick<S, 'seenStories'>, storyId: string): boolean => s.seenStories.includes(storyId);
