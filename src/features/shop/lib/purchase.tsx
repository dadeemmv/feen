/**
 * Buying a Shop item: store action + haptic + the confirmation toast to show once the overlay
 * that started the purchase has closed (on native a toast renders under an open Modal).
 * Shared by the Shop purchase sheet and the lives refill options.
 */
import { iconSize, type ToastOptions } from '@/components/ui';
import type { ShopItem } from '@/content/types';
import { haptics } from '@/lib/haptics';
import { computeLives, getStoreState, type BuyFailureReason } from '@/store';

import { SHOP_COPY } from '../copy';
import { ShopItemIcon } from '../components/shop-item-icon';

export type PurchaseOutcome = { ok: true; toast: ToastOptions } | { ok: false; reason: BuyFailureReason };

export function purchaseItem(item: ShopItem, now: number = Date.now()): PurchaseOutcome {
  const result = getStoreState().buy(item.id, now);
  if (!result.ok) {
    haptics.error();
    return result;
  }
  haptics.success();
  return { ok: true, toast: successToast(item, now) };
}

/** Confirmation toast for a completed purchase (reads the balances after the purchase). */
export function successToast(item: ShopItem, now: number = Date.now()): ToastOptions {
  const state = getStoreState();
  const icon = <ShopItemIcon kind={item.kind} size={iconSize.md} />;
  switch (item.kind) {
    case 'daily-reward':
      return { message: SHOP_COPY.toastDaily(item.amount), tone: 'success', icon };
    case 'streak-shield':
      return { message: SHOP_COPY.toastShield(state.shields), tone: 'success', icon };
    case 'extra-life':
      return { message: SHOP_COPY.toastLife(computeLives(state, now).lives), tone: 'success', icon };
    case 'unlimited-hour':
      return { message: SHOP_COPY.toastUnlimited, tone: 'success', icon };
  }
}
