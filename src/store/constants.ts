/**
 * Game-economy constants (single source of truth for rules shown in copy, e.g. "1 vita ogni 2 ore").
 */
import { HOUR_MS } from '@/lib/dates';

export const STORE_NAME = 'finanz-store';
export const STORE_VERSION = 1;

export const MAX_LIVES = 3;
/** One life comes back every 2 hours while below max. */
export const LIFE_REFILL_MS = 2 * HOUR_MS;

/** Purchase history is capped so the persisted blob stays small. */
export const MAX_PURCHASE_HISTORY = 100;

/** Replaying a completed chapter (practice) gives this share of its XP and no coins. */
export const PRACTICE_XP_RATIO = 0.5;
/** Bonus XP for a lesson solved without mistakes. */
export const PERFECT_LESSON_XP_BONUS = 5;

/** XP thresholds of the user levels (index = level − 1). */
export const USER_LEVELS = [
  { minXp: 0, title: 'Principiante' },
  { minXp: 50, title: 'Curioso' },
  { minXp: 150, title: 'Risparmiatore' },
  { minXp: 350, title: 'Investitore' },
  { minXp: 700, title: 'Stratega' },
  { minXp: 1200, title: 'Guru' },
] as const;

export type UserLevelTitle = (typeof USER_LEVELS)[number]['title'];
