/**
 * Economy slice: kiwi coins, lives (+ refill clock), perks (unlimited / Pro), shields, shop.
 * Every time-dependent action takes `now` (epoch ms, defaults to Date.now()) so the rules are
 * deterministic in tests and the UI can pass one clock for a whole interaction.
 */
import { SHOP_ITEMS } from '@/content/shop';
import type { ShopItem } from '@/content/types';
import { DAY_MS, MINUTE_MS, toDayKey } from '@/lib/dates';

import { MAX_PURCHASE_HISTORY } from '../constants';
import { createInitialEconomy } from '../initial-state';
import { computeLives, hasUnlimitedLives } from '../rules/lives';
import { getAvailabilityIssue } from '../rules/shop';
import type { BuyResult, EconomySlice, Purchase, SliceCreator } from '../types';

/** Fallback when the shop content has no daily-reward item. */
const DAILY_REWARD_FALLBACK_COINS = 100;

/** Non-negative integer amount; anything else (NaN, negative, Infinity) becomes 0. */
const toAmount = (value: number) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);

export function findShopItem(itemId: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === itemId);
}

const createPurchase = (item: ShopItem, now: number, index: number): Purchase => ({
  id: `${item.id}-${now.toString(36)}-${index.toString(36)}`,
  itemId: item.id,
  title: item.title,
  price: item.price,
  at: now,
});

export const createEconomySlice: SliceCreator<EconomySlice> = (set, get) => ({
  ...createInitialEconomy(),

  spend: (amount) => {
    const cost = toAmount(amount);
    const { coins } = get();
    if (coins < cost) return false;
    if (cost > 0) set({ coins: coins - cost });
    return true;
  },

  earn: (amount) => {
    const gain = toAmount(amount);
    if (gain > 0) set((s) => ({ coins: s.coins + gain }));
  },

  syncLives: (now = Date.now()) => {
    const s = get();
    const snapshot = computeLives(s, now);
    // Repair a missing clock (below max without lastLifeAt): start it now.
    const lastLifeAt = !snapshot.isFull && snapshot.lastLifeAt === null ? now : snapshot.lastLifeAt;
    if (snapshot.lives !== s.lives || lastLifeAt !== s.lastLifeAt) set({ lives: snapshot.lives, lastLifeAt });
    return snapshot.lives;
  },

  loseLife: (now = Date.now()) => {
    if (hasUnlimitedLives(get(), now)) return false;
    const lives = get().syncLives(now);
    if (lives <= 0) return false;
    const { maxLives, lastLifeAt } = get();
    // The refill clock starts when dropping below max; below max it keeps running.
    set({ lives: lives - 1, lastLifeAt: lives >= maxLives ? now : (lastLifeAt ?? now) });
    return true;
  },

  addLives: (amount, now = Date.now()) => {
    const gain = toAmount(amount);
    if (gain === 0) return;
    const lives = get().syncLives(now);
    const { maxLives, lastLifeAt } = get();
    const next = Math.min(maxLives, lives + gain);
    set({ lives: next, lastLifeAt: next >= maxLives ? null : lastLifeAt });
  },

  activateUnlimited: (minutes, now = Date.now()) => {
    const duration = toAmount(minutes) * MINUTE_MS;
    if (duration === 0) return;
    // Stacks on a running perk; lives are topped up so the perk never ends on an empty tank.
    set((s) => ({
      unlimitedUntil: Math.max(now, s.unlimitedUntil ?? 0) + duration,
      lives: s.maxLives,
      lastLifeAt: null,
    }));
  },

  activatePro: (days, now = Date.now()) => {
    const duration = toAmount(days) * DAY_MS;
    if (duration === 0) return;
    set((s) => ({ proUntil: Math.max(now, s.proUntil ?? 0) + duration, lives: s.maxLives, lastLifeAt: null }));
  },

  addShields: (amount) => {
    const gain = toAmount(amount);
    if (gain > 0) set((s) => ({ shields: s.shields + gain }));
  },

  claimDailyReward: (now = Date.now()) => {
    const today = toDayKey(now);
    if (get().dailyRewardClaimedOn === today) return { ok: false, reason: 'already-claimed' };
    const item = SHOP_ITEMS.find((i) => i.kind === 'daily-reward');
    const coins = item ? toAmount(item.amount) : DAILY_REWARD_FALLBACK_COINS;
    set((s) => ({ coins: s.coins + coins, dailyRewardClaimedOn: today }));
    return { ok: true };
  },

  buy: (itemId, now = Date.now()): BuyResult => {
    const item = findShopItem(itemId);
    if (!item) throw new Error(`[store] Unknown shop item "${itemId}"`);
    if (item.kind === 'daily-reward') return get().claimDailyReward(now);

    const issue = getAvailabilityIssue(item, get(), now);
    if (issue) return { ok: false, reason: issue };
    if (!get().spend(item.price)) return { ok: false, reason: 'insufficient-coins' };

    const s = get();
    switch (item.kind) {
      case 'extra-life':
        s.addLives(item.amount, now);
        break;
      case 'unlimited-hour':
        s.activateUnlimited(item.amount, now);
        break;
      case 'streak-shield':
        s.addShields(item.amount);
        // A shield bought today can still save a streak missed yesterday.
        get().syncStreak(now);
        break;
    }

    set((state) => ({
      purchases: [createPurchase(item, now, state.purchases.length), ...state.purchases].slice(0, MAX_PURCHASE_HISTORY),
    }));
    return { ok: true };
  },
});
