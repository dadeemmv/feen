/**
 * Shop copy (Italian). Product titles, overlines and descriptions come from `@/content/shop`.
 */
import { formatCoins, formatLives, formatShields } from '@/lib/format';

export const SHOP_COPY = {
  title: 'Shop',
  countdownLabel: (time: string) => `Le offerte si rinnovano tra ${time}`,
  sectionDaily: 'Ogni giorno',
  sectionBoosts: 'Potenziamenti',
  sectionPro: 'Abbonamento',

  free: 'Gratuito',
  claimed: 'Riscattata',
  comeBackIn: (time: string) => `Torna tra ${time}`,
  livesFull: 'Vite al massimo',
  unlimitedActive: 'Vite illimitate attive',
  includedInPro: 'Incluso in Pro',
  owned: (count: number) => `Ne hai ${count}`,
  livesStatus: (lives: number, max: number) => `Hai ${lives}/${max} vite`,
  unlimitedLeft: (time: string) => `Attive · ancora ${time}`,
  missing: (amount: number) => `Ti mancano ${formatCoins(amount)}`,
  kiwi: 'Kiwi',

  // Card accessibility
  a11yPrice: (title: string, price: number) => `${title}, ${formatCoins(price)} Kiwi`,
  a11yFree: (title: string) => `${title}, gratuita`,
  a11yHintBuy: 'Apre la conferma di acquisto',
  a11yHintClaim: 'Riscatta la ricompensa di oggi',

  // Purchase sheet
  priceRow: 'Prezzo',
  balanceRow: 'Il tuo saldo',
  afterRow: 'Dopo l’acquisto',
  buyFor: (price: number) => `Acquista per ${formatCoins(price)}`,
  cancel: 'Annulla',
  done: 'Fatto',
  purchased: 'Acquisto completato!',
  insufficientTitle: 'Kiwi insufficienti',
  insufficientHint: 'Completa lezioni per guadagnare Kiwi, o riscatta la ricompensa giornaliera.',
  goToLessons: 'Vai alle lezioni',

  // Daily reward dialog
  rewardTitle: 'Ricompensa riscattata!',
  rewardMessage: (amount: number) =>
    `Hai ricevuto ${formatCoins(amount)} Kiwi. Torna domani per riscattarne altri.`,
  rewardCta: 'Fantastico!',
  rewardBalance: (coins: number) => `Saldo: ${formatCoins(coins)} Kiwi`,

  // Toasts
  toastShield: (total: number) => `Scudo aggiunto! Ora hai ${formatShields(total)}`,
  toastLife: (lives: number) => `Vita ricaricata! Hai ${formatLives(lives)}`,
  toastUnlimited: 'Vite illimitate attive per 1 ora',
  toastDaily: (amount: number) => `+${formatCoins(amount)} Kiwi riscattati`,
  failure: {
    'insufficient-coins': 'Kiwi insufficienti',
    'already-claimed': 'Ricompensa già riscattata oggi',
    'lives-full': 'Le tue vite sono già al massimo',
  },

  // Pro banner
  proTag: 'Pro',
  proTitle: 'Finanz Pro',
  proBody: 'Vite illimitate, spiegazioni AI e nessuna pubblicità.',
  proCta: 'Prova 7 giorni gratis',
  proActiveTitle: 'Sei un membro Pro',
  proActiveBody: (date: string) => `Vite illimitate attive fino al ${date}.`,
  proActiveCta: 'Dettagli abbonamento',
} as const;
