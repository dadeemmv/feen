/**
 * Economy content: Shop catalogue (spec §3.7), Home unlock milestones (§3.3), Finanz Pro copy and
 * the referral promo (§3.1). Prices are in kiwi coins unless stated otherwise.
 */
import type { Milestone, ProPlan, ReferralPromo } from './extra-types';
import type { ShopItem } from './types';

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'daily-reward',
    kind: 'daily-reward',
    overline: 'BONUS',
    title: 'Ricompensa giornaliera',
    price: 0,
    amount: 100,
    badge: 'FREE',
  },
  {
    id: 'streak-shield-1',
    kind: 'streak-shield',
    overline: 'SALVA STREAK',
    title: '1 Scudo salva streak',
    price: 500,
    amount: 1,
  },
  {
    id: 'extra-life-1',
    kind: 'extra-life',
    overline: 'VITE EXTRA',
    title: '1 Vita extra',
    price: 500,
    amount: 1,
  },
  {
    id: 'unlimited-1h',
    kind: 'unlimited-hour',
    overline: 'VITE EXTRA',
    title: 'Vite illimitate per 1 ora',
    price: 1000,
    /** Minutes of unlimited lives. */
    amount: 60,
  },
];

/** One-line descriptions for the purchase confirmation sheet, keyed by item id. */
export const SHOP_ITEM_DESCRIPTIONS: Record<string, string> = {
  'daily-reward': 'Torna ogni giorno a riscattare 100 Kiwi gratis.',
  'streak-shield-1': 'Protegge la tua serie se salti un giorno di studio.',
  'extra-life-1': 'Una vita in più per continuare a imparare.',
  'unlimited-1h': 'Per 60 minuti puoi sbagliare senza perdere vite.',
};

export function getShopItem(itemId: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === itemId);
}

// ─── Home unlock milestones ──────────────────────────────────────────────────────────────────

/**
 * Rewards unlocked by lesson count. Note: the main course has 13 chapters, so the 15-lesson
 * milestone needs completions counted across replays or future courses.
 */
export const MILESTONES: Milestone[] = [
  {
    id: 'milestone-2-lessons',
    threshold: 2,
    reward: { kind: 'shield', amount: 1 },
    title: 'Scudo salva streak',
    description: 'Hai completato 2 lezioni: ecco uno scudo che protegge la tua serie per un giorno.',
  },
  {
    id: 'milestone-10-lessons',
    threshold: 10,
    reward: { kind: 'coins', amount: 1000 },
    title: '1.000 Kiwi',
    description: 'Hai completato 10 lezioni: 1.000 Kiwi da spendere come vuoi nello Shop.',
  },
  {
    id: 'milestone-15-lessons',
    threshold: 15,
    reward: { kind: 'pro', amount: 7 },
    title: '7 giorni di Finanz Pro',
    description: 'Hai completato 15 lezioni: una settimana di Finanz Pro, con vite illimitate.',
  },
];

/** Locked-card label, e.g. "Sblocca dopo 2 lezioni". */
export function milestoneLockedLabel(threshold: number): string {
  return `Sblocca dopo ${threshold} ${threshold === 1 ? 'lezione' : 'lezioni'}`;
}

// ─── Finanz Pro (demo: no real payments) ─────────────────────────────────────────────────────

export const PRO_PLAN: ProPlan = {
  name: 'Finanz Pro',
  tagline: 'Impara senza limiti, al tuo ritmo.',
  benefits: [
    {
      id: 'unlimited-lives',
      icon: 'lives',
      title: 'Vite illimitate',
      description: 'Sbaglia, riprova e impara: non resterai mai senza vite.',
    },
    {
      id: 'ai-explanations',
      icon: 'assistant',
      title: 'Spiegazioni AI illimitate',
      description: '“Spiegami il perché” su ogni domanda, tutte le volte che vuoi.',
    },
    {
      id: 'no-ads',
      icon: 'no-ads',
      title: 'Nessuna pubblicità',
      description: 'Solo tu e il tuo percorso, senza interruzioni.',
    },
    {
      id: 'early-access',
      icon: 'early-access',
      title: 'Nuovi percorsi in anteprima',
      description: 'Accedi per primo ai prossimi corsi dell’Academy.',
    },
  ],
  prices: [
    {
      id: 'monthly',
      label: 'Mensile',
      amountCents: 699,
      priceLabel: '6,99€',
      period: '/mese',
    },
    {
      id: 'yearly',
      label: 'Annuale',
      amountCents: 4999,
      priceLabel: '49,99€',
      period: '/anno',
      note: 'Solo 4,17€ al mese',
      badge: '-40%',
    },
  ],
  defaultPriceId: 'yearly',
  cta: 'Attiva Finanz Pro',
  demoNotice: 'Versione demo: nessun pagamento reale, l’attivazione è simulata.',
  legal:
    'Questa è una dimostrazione: non viene sottoscritto alcun abbonamento e non è richiesto alcun metodo di pagamento.',
};

export const REFERRAL_PROMO: ReferralPromo = {
  title: '30 giorni di Finanz Pro',
  subtitle: 'Invita 3 amici e riscattalo gratis!',
  cta: 'Condividilo ad un amico',
  friendsRequired: 3,
  rewardProDays: 30,
};
