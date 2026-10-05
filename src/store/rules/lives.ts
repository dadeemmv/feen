/**
 * Lives rules — pure functions of the economy data and a timestamp.
 *
 * Refill model: while lives < max, a clock runs from `lastLifeAt`; every LIFE_REFILL_MS one life
 * comes back. The clock stops (lastLifeAt = null) when lives are full again. Losing a life while
 * already below max does NOT restart the clock (Duolingo behaviour).
 */
import { LIFE_REFILL_MS } from '../constants';
import type { EconomyData } from '../types';

type LivesInput = Pick<EconomyData, 'lives' | 'maxLives' | 'lastLifeAt'>;
type PerksInput = Pick<EconomyData, 'unlimitedUntil' | 'proUntil'>;

export type LivesSnapshot = {
  lives: number;
  /** When the next life comes back (epoch ms); null when full. */
  nextRefillAt: number | null;
  /** When lives will be full again (epoch ms); null when full. */
  fullAt: number | null;
  isFull: boolean;
  /** Lives regained since `lastLifeAt` that are not committed yet. */
  refilled: number;
  /** New refill-clock origin after committing `refilled`. */
  lastLifeAt: number | null;
};

export function isProActive(state: Pick<EconomyData, 'proUntil'>, now: number): boolean {
  return state.proUntil !== null && state.proUntil > now;
}

/** Unlimited lives from the 1-hour shop item OR Finanz Pro. */
export function hasUnlimitedLives(state: PerksInput, now: number): boolean {
  return isProActive(state, now) || (state.unlimitedUntil !== null && state.unlimitedUntil > now);
}

/** Lives including the refills earned by the clock at `now` (nothing is mutated). */
export function computeLives(state: LivesInput, now: number): LivesSnapshot {
  const max = Math.max(0, state.maxLives);
  const current = Math.min(Math.max(0, state.lives), max);

  if (current >= max || state.lastLifeAt === null) {
    return { lives: current, nextRefillAt: null, fullAt: null, isFull: current >= max, refilled: 0, lastLifeAt: current >= max ? null : state.lastLifeAt };
  }

  // A clock moved backwards (lastLifeAt in the future) is clamped to now: no free lives, no lock-out.
  const origin = Math.min(state.lastLifeAt, now);
  const gained = Math.floor((now - origin) / LIFE_REFILL_MS);
  const lives = Math.min(max, current + gained);

  if (lives >= max) {
    return { lives: max, nextRefillAt: null, fullAt: null, isFull: true, refilled: max - current, lastLifeAt: null };
  }

  const clock = origin + gained * LIFE_REFILL_MS;
  return {
    lives,
    nextRefillAt: clock + LIFE_REFILL_MS,
    fullAt: clock + (max - lives) * LIFE_REFILL_MS,
    isFull: false,
    refilled: gained,
    lastLifeAt: clock,
  };
}
