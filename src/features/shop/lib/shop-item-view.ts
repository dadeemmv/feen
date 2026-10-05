/**
 * Pure view model of a Shop product card: what the card shows (free / claimed / buyable /
 * unavailable) and a short meta line, derived from the store rules at `now`.
 */
import type { ShopItem } from '@/content/types';
import { msUntilMidnight } from '@/lib/dates';
import { formatCountdown } from '@/lib/format';
import { computeLives, getAvailabilityIssue, hasUnlimitedLives, isProActive, type RootState } from '@/store';

import { SHOP_COPY } from '../copy';

export type ShopItemStatus =
  /** Daily reward ready to claim. */
  | { type: 'free' }
  /** Daily reward already claimed today; comes back at midnight. */
  | { type: 'claimed'; resetsIn: string }
  /** Paid item that can be bought (the confirm sheet explains a missing balance). */
  | { type: 'buyable'; affordable: boolean; missing: number }
  /** Cannot be bought right now, whatever the balance. */
  | { type: 'unavailable'; label: string };

export type ShopItemView = {
  item: ShopItem;
  status: ShopItemStatus;
  /** Right-aligned hint in the card body ("Ne hai 2", "Hai 2/3 vite"). */
  meta?: string;
};

export type ShopInput = Pick<
  RootState,
  'coins' | 'lives' | 'maxLives' | 'lastLifeAt' | 'unlimitedUntil' | 'proUntil' | 'dailyRewardClaimedOn' | 'shields'
>;

export function getShopItemView(item: ShopItem, state: ShopInput, now: number): ShopItemView {
  const issue = getAvailabilityIssue(item, state, now);

  if (item.kind === 'daily-reward') {
    return issue
      ? { item, status: { type: 'claimed', resetsIn: formatCountdown(msUntilMidnight(now)) } }
      : { item, status: { type: 'free' } };
  }

  if (issue === 'lives-full') {
    const label =
      item.kind === 'unlimited-hour' || isProActive(state, now)
        ? SHOP_COPY.includedInPro
        : hasUnlimitedLives(state, now)
          ? SHOP_COPY.unlimitedActive
          : SHOP_COPY.livesFull;
    return { item, status: { type: 'unavailable', label } };
  }

  const missing = Math.max(0, item.price - state.coins);
  return {
    item,
    status: { type: 'buyable', affordable: missing === 0, missing },
    meta: getMeta(item, state, now),
  };
}

function getMeta(item: ShopItem, state: ShopInput, now: number): string | undefined {
  switch (item.kind) {
    case 'streak-shield':
      return state.shields > 0 ? SHOP_COPY.owned(state.shields) : undefined;
    case 'extra-life': {
      const { lives } = computeLives(state, now);
      return SHOP_COPY.livesStatus(lives, state.maxLives);
    }
    case 'unlimited-hour':
      return state.unlimitedUntil !== null && state.unlimitedUntil > now
        ? SHOP_COPY.unlimitedLeft(formatCountdown(state.unlimitedUntil - now))
        : undefined;
    default:
      return undefined;
  }
}
