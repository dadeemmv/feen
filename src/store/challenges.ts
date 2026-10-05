/**
 * Streak challenges ("Sfide Maratona"): reach n consecutive days → kiwi coins.
 * Content lives in `@/content/challenges` (MARATHON_CHALLENGES); this module derives state.
 * A challenge is reached when the LONGEST streak ever reached its length, so breaking the streak
 * after reaching it never takes a reward away; progress shows the current streak until then.
 */
import { MARATHON_CHALLENGES } from '@/content/challenges';
import type { MarathonChallenge } from '@/content/extra-types';

export type ResolvedChallenge = MarathonChallenge & {
  unlocked: boolean;
  /** Days counted towards the challenge (0…days). */
  current: number;
  /** 0…1. */
  progress: number;
  reached: boolean;
  claimed: boolean;
};

export function findChallenge(challengeId: string): MarathonChallenge | undefined {
  return MARATHON_CHALLENGES.find((c) => c.id === challengeId);
}

export function resolveChallenge(
  challenge: MarathonChallenge,
  streak: { current: number; longest: number },
  claimedIds: readonly string[],
): ResolvedChallenge {
  const days = Math.max(1, challenge.days);
  const unlocked = streak.longest >= challenge.unlockAtStreak;
  const reached = unlocked && streak.longest >= days;
  const current = reached ? days : unlocked ? Math.min(streak.current, days) : 0;
  return { ...challenge, unlocked, current, progress: current / days, reached, claimed: claimedIds.includes(challenge.id) };
}

export function resolveChallenges(streak: { current: number; longest: number }, claimedIds: readonly string[]): ResolvedChallenge[] {
  return MARATHON_CHALLENGES.map((c) => resolveChallenge(c, streak, claimedIds));
}
