/**
 * User level from total XP, plus the reward rule for a finished chapter.
 */
import type { Chapter } from '@/content/types';

import { PERFECT_LESSON_XP_BONUS, PRACTICE_XP_RATIO, USER_LEVELS, type UserLevelTitle } from '../constants';

export type UserLevel = {
  /** 1-based. */
  level: number;
  title: UserLevelTitle;
  /** XP earned inside the current level. */
  currentXp: number;
  /** XP needed to go from this level to the next (0 at the max level). */
  nextLevelXp: number;
  /** Progress towards the next level, 0…1 (1 at the max level). */
  ratio: number;
  isMaxLevel: boolean;
  totalXp: number;
};

export function getUserLevel(xp: number): UserLevel {
  const totalXp = Math.max(0, Math.floor(xp));
  let index = 0;
  for (let i = 0; i < USER_LEVELS.length; i += 1) {
    if (totalXp >= USER_LEVELS[i].minXp) index = i;
  }
  const current = USER_LEVELS[index];
  const next = USER_LEVELS[index + 1];
  if (next === undefined) {
    return { level: index + 1, title: current.title, currentXp: totalXp - current.minXp, nextLevelXp: 0, ratio: 1, isMaxLevel: true, totalXp };
  }
  const span = next.minXp - current.minXp;
  const currentXp = totalXp - current.minXp;
  return { level: index + 1, title: current.title, currentXp, nextLevelXp: span, ratio: currentXp / span, isMaxLevel: false, totalXp };
}

export type ChapterReward = { xp: number; coins: number };

/**
 * Suggested reward for a finished chapter: full XP + coins the first time (+ a small XP bonus when
 * perfect); a practice replay gives half the XP and no coins, so coins cannot be farmed.
 */
export function computeChapterReward(
  chapter: Pick<Chapter, 'xpReward' | 'coinReward'>,
  accuracy: number,
  isReplay: boolean,
): ChapterReward {
  const perfect = accuracy >= 1;
  if (isReplay) return { xp: Math.round(chapter.xpReward * PRACTICE_XP_RATIO), coins: 0 };
  return { xp: chapter.xpReward + (perfect ? PERFECT_LESSON_XP_BONUS : 0), coins: chapter.coinReward };
}
