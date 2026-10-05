/**
 * React hooks over the store for derived values. Each hook subscribes to the raw fields it needs
 * (stable references / shallow-compared) and derives during render — React Compiler memoises
 * the derivation, zustand v5 never sees a fresh object from a selector.
 */
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { MINUTE_MS } from '@/lib/dates';

import { syncTimeBasedState, useStore, useStoreShallow } from './index';
import {
  selectChallenges,
  selectChapterStatuses,
  selectCourseProgress,
  selectLives,
  selectMilestones,
  selectResumeInfo,
  selectStreakInfo,
  selectUserLevel,
} from './selectors';

export const useHasHydrated = (): boolean => useStore((s) => s._hasHydrated);

/** Current time, re-rendering every `intervalMs` (1 min by default; pass 1000 for a ticking timer). */
export function useNow(intervalMs: number = MINUTE_MS): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/**
 * Commits lives refills and shield consumption when the app returns to the foreground
 * (hydration already does it once). Mount once, in the root layout.
 */
export function useSyncTimeBasedState(): void {
  const hydrated = useHasHydrated();
  useEffect(() => {
    if (!hydrated) return;
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') syncTimeBasedState();
    });
    return () => subscription.remove();
  }, [hydrated]);
}

/** Lives with refills applied, refill countdown and unlimited flag. */
export function useLives(now: number) {
  const input = useStoreShallow((s) => ({
    lives: s.lives,
    maxLives: s.maxLives,
    lastLifeAt: s.lastLifeAt,
    unlimitedUntil: s.unlimitedUntil,
    proUntil: s.proUntil,
  }));
  return selectLives(input, now);
}

export function useStreakInfo(now: number) {
  const input = useStoreShallow((s) => ({ activeDays: s.activeDays, shieldedDays: s.shieldedDays, shields: s.shields }));
  return selectStreakInfo(input, now);
}

export function useCourseProgress(courseId: string) {
  const chapterRecords = useStore((s) => s.chapterRecords);
  return selectCourseProgress({ chapterRecords }, courseId);
}

/** chapterId → 'completed' | 'current' | 'locked' for a course path. */
export function useChapterStatuses(courseId: string) {
  const chapterRecords = useStore((s) => s.chapterRecords);
  return selectChapterStatuses({ chapterRecords }, courseId);
}

export function useResumeInfo(chapterId: string) {
  return useStoreShallow((s) => selectResumeInfo(s, chapterId));
}

export function useMilestones() {
  const input = useStoreShallow((s) => ({ chapterRecords: s.chapterRecords, claimedMilestones: s.claimedMilestones }));
  return selectMilestones(input);
}

export function useChallenges(now: number) {
  const input = useStoreShallow((s) => ({
    activeDays: s.activeDays,
    shieldedDays: s.shieldedDays,
    shields: s.shields,
    claimedChallenges: s.claimedChallenges,
  }));
  return selectChallenges(input, now);
}

export function useUserLevel() {
  const xp = useStore((s) => s.xp);
  return selectUserLevel(xp);
}
