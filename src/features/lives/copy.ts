/**
 * Italian copy of the lives sheets (docs/PRODUCT_SPEC.md §3.6 + the out-of-lives state of §5).
 * The full-lives title and the two option cards keep the reference video's wording.
 */
import { formatCoins, formatLives } from '@/lib/format';

export const LIVES_COPY = {
  fullTitle: 'Vite al massimo! Ne perderai una quando sbagli una risposta.',
  partialTitle: (lives: number) => `Ti ${lives === 1 ? 'resta' : 'restano'} ${formatLives(lives)}`,
  unlimitedTitle: 'Vite illimitate attive',
  unlimitedMessage: (time: string) => `Puoi sbagliare senza perdere vite ancora per ${time}.`,
  proMessage: (date: string) => `Con Finanz Pro le vite sono illimitate fino al ${date}.`,

  proCard: { tag: 'Pro', title: 'Vite illimitate', subtitle: 'Con Finanz Pro' },
  statusFull: { title: 'Piena!', subtitle: 'Le tue vite sono al massimo' },
  statusPartial: (lives: number, max: number) => ({ title: `${lives}/${max}`, subtitle: 'Vite disponibili' }),
  statusEmpty: { title: 'Vuota', subtitle: 'Nessuna vita rimasta' },

  nextLife: (time: string) => `Prossima vita tra ${time}`,
  allBack: (time: string) => `Tutte le vite tornano tra ${time}`,
  refillRule: 'Si ricarica 1 vita ogni 2 ore',

  refillTitle: 'Ricarica con i Kiwi',
  balance: (coins: number) => `Hai ${formatCoins(coins)} Kiwi`,
  refillLife: { title: 'Ricarica 1 vita', subtitle: 'Torna subito in gioco' },
  refillUnlimited: { title: 'Vite illimitate per 1 ora', subtitle: 'Sbaglia senza pensieri per 60 minuti' },
  missing: (amount: number) => `Ti mancano ${formatCoins(amount)} Kiwi`,
  insufficientHint: 'Completa lezioni o riscatta la ricompensa giornaliera per guadagnare Kiwi.',
  priceA11y: (title: string, price: number) => `${title}, ${formatCoins(price)} Kiwi`,

  ctaPro: 'Ottieni vite illimitate',
  ctaNoThanks: 'No, grazie',
  ctaContinue: 'Continua a imparare',
  ctaTryPro: 'Prova Finanz Pro',
  ctaWait: 'Aspetto la ricarica',
  ctaLeaveLesson: 'Esci dalla lezione',
  ctaResume: 'Continua la lezione',

  outTitle: 'Hai finito le vite',
  outMessage: 'Aspetta la ricarica automatica, oppure torna subito in gioco con i Kiwi o con Finanz Pro.',
  backTitle: 'Sei di nuovo in gioco!',
  backMessage: (lives: number) => `Ora hai ${formatLives(lives)}. Continua da dove eri rimasto.`,

  lifeAdded: 'Vita ricaricata!',
  unlimitedOn: 'Vite illimitate attive per 1 ora',
} as const;
