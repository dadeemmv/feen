/**
 * Streak rules — derived from the list of active days, never stored as a counter
 * (bryanjenningz/react-duolingo `createStreakStore.ts`).
 *
 * Definition
 * - The streak is the number of ACTIVE days in the unbroken chain that ends today (if today is
 *   active) or yesterday (today is still "in play" until midnight, so it never breaks a streak).
 * - A day in `shieldedDays` keeps the chain unbroken but does not add to the count
 *   (like a Duolingo streak freeze).
 *
 * Shields (kept deliberately simple)
 * - A shield bridges exactly ONE missed day: the missed day must sit between two days where the
 *   earlier one was ACTIVE. Two consecutive missed days always break the streak.
 * - Only YESTERDAY can be bridged "live": when yesterday was missed, the day before was active
 *   and the user owns a shield, the selector already counts the streak as saved
 *   (`pendingShieldDay`), and `syncStreak(now)` commits it (consumes the shield, stores the day in
 *   `shieldedDays`). Older gaps are never bridged retroactively, so buying a shield today cannot
 *   resurrect a streak lost last week. Call `syncStreak` on launch/foreground, after buying a
 *   shield and before completing a chapter (the store does the last two automatically).
 */
import { addDaysToKey, toDayKey, type DayKey } from '@/lib/dates';

import type { EconomyData, ProgressData } from '../types';

export type StreakInput = Pick<ProgressData, 'activeDays' | 'shieldedDays'> & Pick<EconomyData, 'shields'>;

export type StreakInfo = {
  count: number;
  /** Today already has a completed chapter. */
  activeToday: boolean;
  /** Streak > 0 but today is not active yet: study today or lose it (or spend a shield). */
  atRisk: boolean;
  /** Yesterday, when a owned shield is saving the streak but has not been consumed yet. */
  pendingShieldDay: DayKey | null;
};

/** Yesterday if it can be bridged by an owned (not yet consumed) shield, otherwise null. */
export function findPendingShieldDay(input: StreakInput, now: number): DayKey | null {
  if (input.shields <= 0) return null;
  const today = toDayKey(now);
  const yesterday = addDaysToKey(today, -1);
  const dayBefore = addDaysToKey(today, -2);
  const active = new Set(input.activeDays);
  const coveredYesterday = active.has(yesterday) || input.shieldedDays.includes(yesterday);
  return !coveredYesterday && active.has(dayBefore) ? yesterday : null;
}

export function computeStreak(input: StreakInput, now: number): StreakInfo {
  const active = new Set(input.activeDays);
  const shielded = new Set(input.shieldedDays);
  const pendingShieldDay = findPendingShieldDay(input, now);
  if (pendingShieldDay !== null) shielded.add(pendingShieldDay);

  const today = toDayKey(now);
  const activeToday = active.has(today);
  let cursor = activeToday ? today : addDaysToKey(today, -1);
  let count = 0;
  // Bounded walk: at most one iteration per stored day (+1 for the terminating miss).
  for (let guard = active.size + shielded.size + 1; guard > 0; guard -= 1) {
    if (active.has(cursor)) count += 1;
    else if (!shielded.has(cursor)) break;
    cursor = addDaysToKey(cursor, -1);
  }

  return { count, activeToday, atRisk: count > 0 && !activeToday, pendingShieldDay };
}

/**
 * Longest chain ever (same counting rule: shielded days bridge, only active days count).
 * Used by the marathon challenges, so a challenge reached once stays reached.
 */
export function computeLongestStreak(input: Pick<StreakInput, 'activeDays' | 'shieldedDays'>): number {
  const active = new Set(input.activeDays);
  const days = [...new Set([...input.activeDays, ...input.shieldedDays])].sort();
  let best = 0;
  let run = 0;
  let previous: DayKey | null = null;
  for (const day of days) {
    const continues = previous !== null && addDaysToKey(previous, 1) === day;
    run = (continues ? run : 0) + (active.has(day) ? 1 : 0);
    best = Math.max(best, run);
    previous = day;
  }
  return best;
}

/** Sorted, de-duplicated insert (day keys sort lexicographically = chronologically). */
export function insertDay(days: readonly DayKey[], day: DayKey): DayKey[] {
  if (days.includes(day)) return days.slice();
  return [...days, day].sort();
}
