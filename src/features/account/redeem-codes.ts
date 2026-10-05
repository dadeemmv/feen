/**
 * "Utilizza codice" — demo promo codes. Each code works once per account (tracked in the
 * store's `meta.redeemedCodes`); rewards go through the store's economy actions.
 */
import { getStoreState } from '@/store';

export type RedeemReward = { kind: 'coins'; amount: number } | { kind: 'shield'; amount: number };

type PromoCode = { reward: RedeemReward; title: string; message: string };

const PROMO_CODES: Record<string, PromoCode> = {
  FINANZ100: {
    reward: { kind: 'coins', amount: 100 },
    title: '+100 Kiwi!',
    message: 'Sono già nel tuo saldo: spendili nello Shop quando vuoi.',
  },
  STREAK: {
    reward: { kind: 'shield', amount: 1 },
    title: '+1 Scudo salva-streak',
    message: 'Se salti un giorno di studio, lo scudo protegge la tua serie.',
  },
};

export const REDEEM_CODE_MAX_LENGTH = 12;

/** Upper-case, no spaces: what the user types is compared in this form. */
export const normalizeCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');

export type RedeemOutcome =
  | { ok: true; code: string; reward: RedeemReward; title: string; message: string }
  | { ok: false; reason: 'invalid' | 'already-used' };

export function redeemCode(input: string): RedeemOutcome {
  const code = normalizeCode(input);
  const promo = PROMO_CODES[code];
  if (!promo) return { ok: false, reason: 'invalid' };

  const store = getStoreState();
  if (store.redeemedCodes.includes(code)) return { ok: false, reason: 'already-used' };

  if (promo.reward.kind === 'coins') store.earn(promo.reward.amount);
  else {
    store.addShields(promo.reward.amount);
    // Same rule as a shop shield: it can still bridge a day missed yesterday.
    store.syncStreak();
  }
  store.markCodeRedeemed(code);

  return { ok: true, code, ...promo };
}
