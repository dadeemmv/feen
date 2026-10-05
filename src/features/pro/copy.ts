/**
 * Italian copy of the Finanz Pro paywall. Plan names, prices, benefits, the demo notice and the
 * legal line come from `PRO_PLAN` (`@/content/shop`); this file holds the screen's own strings.
 * There are no real payments in this build: the trial is a demo activation, always labelled so.
 */
import { formatDays } from '@/lib/format';

/** Length of the free trial activated by the CTA (demo: no payment). */
export const PRO_TRIAL_DAYS = 7;

export const PRO_COPY = {
  close: 'Chiudi',
  tag: 'Pro',
  headline: 'Finanz Pro',
  benefitsTitle: 'Cosa ottieni',
  plansTitle: 'Scegli il tuo piano',
  bestValue: 'Più conveniente',
  perMonth: 'al mese',
  planA11y: (label: string, price: string, period: string, note?: string) =>
    `${label}, ${price} ${period}${note ? `, ${note}` : ''}`,

  cta: `Prova ${PRO_TRIAL_DAYS} giorni gratis`,
  ctaProcessing: 'Attivazione in corso',
  trialTerms: (price: string, period: string) =>
    `${formatDays(PRO_TRIAL_DAYS)} gratis, poi ${price}${period}. Disdici quando vuoi.`,
  demoBadge: 'Demo — nessun addebito',

  restore: 'Ripristina acquisti',
  restoreNone: 'Nessun abbonamento da ripristinare su questo account.',
  restoreActive: (date: string) => `Finanz Pro è già attivo fino al ${date}.`,

  // Already a member
  activeTag: 'Membro Pro',
  activeHeadline: 'Sei un membro Pro',
  activeTagline: 'Tutti i vantaggi sono già sbloccati. Buono studio!',
  activeUntil: (date: string) => `Attivo fino al ${date}`,
  activeLeft: (days: number) => (days <= 1 ? 'Scade oggi' : `Ancora ${formatDays(days)}`),
  activeIncluded: 'Incluso nel tuo piano',
  activeCta: 'Continua a imparare',

  // Success moment
  successTag: 'Attivato',
  successTitle: 'Benvenuto in Finanz Pro!',
  successMessage: (date: string) => `Le vite illimitate e tutti i vantaggi sono attivi fino al ${date}.`,
  successUnlocked: 'Ora hai sbloccato',
  successCta: 'Inizia a imparare',
} as const;
