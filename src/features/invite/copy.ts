/**
 * Italian copy of the referral flow: the promo sheet (spec §3.1) and "Invita un amico" (§3.2).
 */
import { REFERRAL_PROMO } from '@/content/shop';
import { formatFraction, plural } from '@/lib/format';

export const INVITE_COPY = {
  title: 'Invita un amico',
  body: 'Condividi questo codice con gli amici per ricevere la tua ricompensa!',
  codeHeadline: 'IL TUO CODICE',
  copyA11y: (code: string) => `Copia il codice ${code.split('').join(' ')}`,
  copied: 'Codice copiato',
  copiedA11y: 'Codice copiato negli appunti',
  shareCta: 'Condividi codice',
  shareTitle: 'Invita un amico su Finanz',
  shareCopied: 'Messaggio copiato: incollalo dove vuoi',
  shareMessage: (code: string) =>
    `Sto imparando a gestire i miei soldi con Finanz 🥝 Lezioni da 5 minuti su risparmio e investimenti. ` +
    `Scarica l’app e usa il mio codice ${code} per iniziare insieme a me!`,

  howTitle: 'Come funziona',
  stepLabel: (n: number) => `Passo ${n}`,
  stepA11y: (n: number, title: string, body: string) => `Passo ${n}: ${title}. ${body}`,
  steps: [
    {
      key: 'share',
      title: 'Condividi il tuo codice',
      body: 'Invialo a un amico con il tasto qui sopra o copialo dove vuoi.',
    },
    {
      key: 'signup',
      title: 'Il tuo amico si iscrive',
      body: 'Scarica Finanz e inserisce il codice in Account → Utilizza codice.',
    },
    {
      key: 'reward',
      title: 'Imparate insieme',
      body: `Ogni amico conta: al ${REFERRAL_PROMO.friendsRequired}° iscritto sblocchi ${REFERRAL_PROMO.title}.`,
    },
  ],

  progressTitle: 'I tuoi inviti',
  progressLabel: (invited: number, total: number) =>
    `${formatFraction(invited, total)} ${plural(total, 'amico invitato', 'amici invitati')}`,
  progressHint: (remaining: number) =>
    remaining <= 0
      ? 'Obiettivo raggiunto: grazie per aver portato i tuoi amici!'
      : `Ancora ${remaining} ${plural(remaining, 'amico', 'amici')} e il premio è tuo.`,
  slotEmptyA11y: (index: number) => `Posto ${index + 1}: in attesa di un amico`,
  slotFilledA11y: (index: number) => `Posto ${index + 1}: amico iscritto`,
  rewardLabel: REFERRAL_PROMO.title,
  rewardCaption: 'Vite illimitate e spiegazioni AI',

  sheet: {
    later: 'Più tardi',
    a11y: 'Promozione invita amici',
  },
} as const;
