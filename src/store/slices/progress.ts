/**
 * Progress slice: chapter records, the in-progress lesson session ("RIPRENDI DA QUI"),
 * active days (streak), XP and milestone claims.
 */
import { toDayKey } from '@/lib/dates';

import { findChallenge, resolveChallenge } from '../challenges';
import { createInitialProgress } from '../initial-state';
import { findCrossedMilestone, findMilestone, resolveMilestone } from '../milestones';
import { countCompletedLessons } from '../rules/progress';
import { computeLongestStreak, computeStreak, findPendingShieldDay, insertDay } from '../rules/streak';
import type { ChapterRecord, CompletionSummary, LessonSession, ProgressSlice, SliceCreator } from '../types';

const toAmount = (value: number) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
const clamp01 = (value: number) => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0);
const unique = (ids: readonly string[]) => [...new Set(ids)];

export const createProgressSlice: SliceCreator<ProgressSlice> = (set, get) => ({
  ...createInitialProgress(),

  startOrResumeSession: (chapterId, now = Date.now()) => {
    const { session } = get();
    if (session && session.chapterId === chapterId) return session;
    const fresh: LessonSession = { chapterId, stepIndex: 0, lostLifeStepIds: [], mistakeStepIds: [], updatedAt: now };
    set({ session: fresh });
    return fresh;
  },

  saveSessionStep: (chapterId, stepIndex, lostLifeStepIds, mistakeStepIds, now = Date.now()) =>
    set((s) => {
      const previous = s.session?.chapterId === chapterId ? s.session : null;
      return {
        session: {
          chapterId,
          stepIndex: Math.max(0, Math.floor(stepIndex)),
          lostLifeStepIds: unique(lostLifeStepIds),
          mistakeStepIds: unique(mistakeStepIds ?? previous?.mistakeStepIds ?? []),
          updatedAt: now,
        },
      };
    }),

  clearSession: () => set({ session: null }),

  syncStreak: (now = Date.now()) => {
    const day = findPendingShieldDay(get(), now);
    if (day === null) return { shieldsConsumed: 0, bridgedDays: [] };
    set((s) => ({ shields: Math.max(0, s.shields - 1), shieldedDays: insertDay(s.shieldedDays, day) }));
    return { shieldsConsumed: 1, bridgedDays: [day] };
  },

  completeChapter: ({ chapterId, accuracy, xp, coins, now = Date.now() }): CompletionSummary => {
    // Commit a shield that saves yesterday BEFORE today becomes active.
    get().syncStreak(now);

    const before = get();
    const today = toDayKey(now);
    const previous = before.chapterRecords[chapterId];
    const lessonsBefore = countCompletedLessons(before.chapterRecords);
    const xpEarned = toAmount(xp);
    const coinsEarned = toAmount(coins);
    const score = clamp01(accuracy);

    const record: ChapterRecord = previous
      ? {
          ...previous,
          lastCompletedAt: now,
          accuracy: Math.max(previous.accuracy, score),
          xp: previous.xp + xpEarned,
          runs: previous.runs + 1,
        }
      : { completedAt: now, lastCompletedAt: now, accuracy: score, xp: xpEarned, runs: 1 };

    set((s) => ({
      chapterRecords: { ...s.chapterRecords, [chapterId]: record },
      xp: s.xp + xpEarned,
      coins: s.coins + coinsEarned,
      activeDays: insertDay(s.activeDays, today),
      session: s.session?.chapterId === chapterId ? null : s.session,
    }));

    const after = get();
    const lessonsAfter = countCompletedLessons(after.chapterRecords);
    const crossed = findCrossedMilestone(lessonsBefore, lessonsAfter);

    return {
      xpEarned,
      coinsEarned,
      accuracy: score,
      isFirstCompletion: previous === undefined,
      streakBefore: computeStreak(before, now).count,
      streakAfter: computeStreak(after, now).count,
      isNewStreakDay: !before.activeDays.includes(today),
      milestoneReached: crossed ? resolveMilestone(crossed, lessonsAfter, after.claimedMilestones) : undefined,
    };
  },

  claimMilestone: (milestoneId, now = Date.now()) => {
    const milestone = findMilestone(milestoneId);
    if (!milestone) return { ok: false, reason: 'not-found' };
    const s = get();
    const resolved = resolveMilestone(milestone, countCompletedLessons(s.chapterRecords), s.claimedMilestones);
    if (resolved.claimed) return { ok: false, reason: 'already-claimed' };
    if (!resolved.reached) return { ok: false, reason: 'locked' };

    switch (milestone.reward.kind) {
      case 'shield':
        s.addShields(milestone.reward.amount);
        get().syncStreak(now);
        break;
      case 'coins':
        s.earn(milestone.reward.amount);
        break;
      case 'pro':
        s.activatePro(milestone.reward.amount, now);
        break;
    }
    set((state) => ({ claimedMilestones: [...state.claimedMilestones, milestone.id] }));
    return { ok: true, milestone: { ...resolved, claimed: true } };
  },

  claimChallenge: (challengeId, now = Date.now()) => {
    const challenge = findChallenge(challengeId);
    if (!challenge) return { ok: false, reason: 'not-found' };
    const s = get();
    const current = computeStreak(s, now).count;
    const longest = Math.max(current, computeLongestStreak(s));
    const resolved = resolveChallenge(challenge, { current, longest }, s.claimedChallenges);
    if (resolved.claimed) return { ok: false, reason: 'already-claimed' };
    if (!resolved.reached) return { ok: false, reason: 'locked' };
    s.earn(challenge.reward);
    set((state) => ({ claimedChallenges: [...state.claimedChallenges, challenge.id] }));
    return { ok: true, challenge: { ...resolved, claimed: true } };
  },
});
