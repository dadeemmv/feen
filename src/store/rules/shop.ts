/**
 * Shop availability rules — pure (the price check is separate: see `spend`).
 */
import type { ShopItem } from '@/content/types';
import { toDayKey } from '@/lib/dates';

import type { BuyFailureReason, EconomyData, MetaData } from '../types';
import { computeLives, hasUnlimitedLives, isProActive } from './lives';

type ShopInput = Pick<EconomyData, 'lives' | 'maxLives' | 'lastLifeAt' | 'unlimitedUntil' | 'proUntil'> &
  Pick<MetaData, 'dailyRewardClaimedOn'>;

/** Why an item cannot be bought right now, independent of the price (null = available). */
export function getAvailabilityIssue(item: ShopItem, state: ShopInput, now: number): BuyFailureReason | null {
  switch (item.kind) {
    case 'daily-reward':
      return state.dailyRewardClaimedOn === toDayKey(now) ? 'already-claimed' : null;
    case 'extra-life':
      return hasUnlimitedLives(state, now) || computeLives(state, now).isFull ? 'lives-full' : null;
    case 'unlimited-hour':
      // Stacking hours is allowed; buying them while Pro already gives unlimited lives is not.
      return isProActive(state, now) ? 'lives-full' : null;
    case 'streak-shield':
      return null;
  }
}
