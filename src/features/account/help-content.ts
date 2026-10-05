/**
 * Long-form copy of "Supporto" (FAQ) and "Informazioni legali". Game rules are read from the
 * store constants so the answers never drift from the real behaviour.
 */
import { REFERRAL_PROMO } from '@/content/shop';
import { HOUR_MS } from '@/lib/dates';
import { LIFE_REFILL_MS, MAX_LIVES } from '@/store';

export type HelpEntry = { id: string; title: string; paragraphs: string[] };

const refillHours = Math.round(LIFE_REFILL_MS / HOUR_MS);

export const FAQ: readonly HelpEntry[] = [
  {
    id: 'lives',
    title: 'Come funzionano le vite?',
    paragraphs: [
      `Hai ${MAX_LIVES} vite. Ne perdi una quando sbagli una risposta, al massimo una per domanda.`,
      `Si ricaricano da sole, una ogni ${refillHours} ore. Con Finanz Pro o con le vite illimitate dello Shop puoi sbagliare senza perderne.`,
    ],
  },
  {
    id: 'streak',
    title: 'Cos’è la serie di giorni?',
    paragraphs: [
      'È il numero di giorni di fila in cui completi almeno una lezione. Se salti un giorno, la serie riparte da zero.',
      'Uno scudo salva-streak protegge la serie per un giorno di pausa: lo trovi nello Shop.',
    ],
  },
  {
    id: 'kiwi',
    title: 'Come guadagno i Kiwi?',
    paragraphs: [
      'Riscatta ogni giorno la ricompensa gratuita nello Shop, completa le lezioni e le Sfide Maratona.',
      'Puoi spenderli per scudi, vite extra e vite illimitate.',
    ],
  },
  {
    id: 'pro',
    title: 'Come ottengo Finanz Pro gratis?',
    paragraphs: [
      `Invita ${REFERRAL_PROMO.friendsRequired} amici con il tuo codice personale: quando si iscrivono ricevi ${REFERRAL_PROMO.rewardProDays} giorni di Finanz Pro.`,
    ],
  },
  {
    id: 'advice',
    title: 'Finanz mi dà consigli di investimento?',
    paragraphs: [
      'No. Finanz è un’app educativa: spiega concetti e strumenti, ma non offre consulenza finanziaria personalizzata.',
      'Per decisioni importanti rivolgiti a un consulente abilitato.',
    ],
  },
];

export const LEGAL_DOCUMENTS: readonly HelpEntry[] = [
  {
    id: 'terms',
    title: 'Termini di servizio',
    paragraphs: [
      'Testo di esempio. Utilizzando Finanz accetti di usare l’app per scopi personali ed educativi. I contenuti hanno finalità informative e non costituiscono consulenza finanziaria.',
      'Testo di esempio. Kiwi, vite e scudi sono elementi di gioco senza valore economico e non possono essere convertiti in denaro.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    paragraphs: [
      'Testo di esempio. In questa versione dimostrativa nome, interessi e progressi restano sul tuo dispositivo e non vengono inviati a server esterni.',
      'Testo di esempio. Puoi cancellare tutti i dati in qualsiasi momento con il Logout dalla pagina Account.',
    ],
  },
  {
    id: 'cookie',
    title: 'Cookie',
    paragraphs: [
      'Testo di esempio. La versione web usa solo l’archiviazione locale del browser per ricordare i tuoi progressi. Nessun cookie di profilazione o pubblicità.',
    ],
  },
];
