/**
 * Italian copy of the story viewer (spec §3.4). Page content lives in `@/content/stories`.
 */
import { formatNumber, plural } from '@/lib/format';

export const STORY_COPY = {
  close: 'Chiudi storia',
  share: 'Condividi storia',
  shareTitle: 'Finanz',
  shareCopied: 'Messaggio copiato: incollalo dove vuoi',
  /** Share text per group id (fallback: `default`). */
  shareMessage: {
    academy:
      'Nell’Academy di Finanz trovi percorsi, quiz e lezioni da 5 minuti per imparare a gestire i tuoi soldi 📚 Provala con me!',
    app: 'Finanz è l’app che ti aiuta a risparmiare, investire e imparare. Perché la finanza non deve essere un privilegio 💖',
    default: 'Scopri Finanz: impara a gestire i tuoi soldi, una lezione da 5 minuti alla volta 🥝',
  } as Record<string, string>,

  pageA11y: (group: string, page: number, total: number) => `Storia ${group}, pagina ${page} di ${total}`,
  pageHint: 'Tocca a destra per andare avanti, a sinistra per tornare indietro. Tieni premuto per mettere in pausa.',
  next: 'Pagina successiva',
  previous: 'Pagina precedente',

  /** Tag on the course poster of the Academy page. */
  posterTag: 'Nuovo percorso',

  poll: {
    votes: (total: number) => `${formatNumber(total)} ${plural(total, 'voto', 'voti')}`,
    thanks: 'Grazie, il tuo voto conta!',
    optionA11y: (label: string, percent: number | null, mine: boolean) =>
      percent === null ? label : `${label}: ${percent}%${mine ? ', il tuo voto' : ''}`,
  },

  notFound: {
    title: 'Storia non trovata',
    message: 'Questa storia non è più disponibile.',
    cta: 'Torna alla Home',
  },
} as const;
