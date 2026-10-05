/**
 * The ONE persisted app store, assembled from slices (infinitered/ignite-cookbook Zustand recipe,
 * bryanjenningz/react-duolingo `useBoundStore`), persisted to AsyncStorage (versioned).
 *
 *   const coins = useStore((s) => s.coins);
 *   const { lives, maxLives } = useStoreShallow((s) => ({ lives: s.lives, maxLives: s.maxLives }));
 *   getStoreState().earn(100);
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { STORE_NAME, STORE_VERSION } from './constants';
import { createEconomySlice } from './slices/economy';
import { createMetaSlice } from './slices/meta';
import { createProfileSlice } from './slices/profile';
import { createProgressSlice } from './slices/progress';
import { mergePersisted, migrate, partialize, storage } from './storage';
import type { PersistedData, RootState } from './types';

export const useStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createProfileSlice(...a),
      ...createEconomySlice(...a),
      ...createProgressSlice(...a),
      ...createMetaSlice(...a),
    }),
    {
      name: STORE_NAME,
      version: STORE_VERSION,
      storage,
      partialize,
      migrate,
      merge: mergePersisted,
      // `state` is the pre-hydration store; its actions are bound to the live store. The inner
      // callback runs on success AND on error, so the app never stays stuck on the splash.
      onRehydrateStorage: (state) => () => {
        const now = Date.now();
        state.syncLives(now);
        state.syncStreak(now);
        state.setHasHydrated(true);
      },
    },
  ),
);

/** Object/array selectors without re-render loops (shallow-compared result). */
export function useStoreShallow<T>(selector: (state: RootState) => T): T {
  return useStore(useShallow(selector));
}

/** Plain accessors for non-React code (event handlers, effects, tests). */
export const getStoreState = (): RootState => useStore.getState();
export const subscribeStore = useStore.subscribe;

/** Commits time-based changes (lives refilled by the clock, a shield saving yesterday). */
export function syncTimeBasedState(now: number = Date.now()) {
  const state = useStore.getState();
  return { lives: state.syncLives(now), streak: state.syncStreak(now) };
}

/** Wipes the persisted blob and returns to the demo user (Logout). */
export async function resetStore() {
  useStore.getState().resetAll();
  await useStore.persist.clearStorage();
}

export type { PersistedData, RootState };
export type {
  AppLanguage,
  BuyFailureReason,
  BuyResult,
  ChapterRecord,
  ClaimChallengeResult,
  ClaimMilestoneResult,
  CompleteChapterInput,
  CompletionSummary,
  Experience,
  LessonSession,
  OnboardingAnswers,
  Purchase,
  ReminderSlot,
  Settings,
  SyncStreakResult,
} from './types';
export type { ResolvedChallenge } from './challenges';
export type { ResolvedMilestone } from './milestones';
export type { LivesSnapshot } from './rules/lives';
export type { StreakInfo } from './rules/streak';
export type { ChapterReward, UserLevel } from './rules/levels';
export { computeLives, hasUnlimitedLives, isProActive } from './rules/lives';
export { computeLongestStreak, computeStreak } from './rules/streak';
export { countCompletedChapters, countCompletedLessons } from './rules/progress';
export { computeChapterReward, getUserLevel } from './rules/levels';
export { getAvailabilityIssue } from './rules/shop';
export { findShopItem } from './slices/economy';
export * from './constants';
export * from './selectors';
