/**
 * Long-form copy of "Supporto" (FAQ) and "Informazioni legali". The answers follow the rules of
 * the village (PRODUCT.md): no lives, no streak to lose, knowledge that cannot be bought.
 */
import { MAX_OPEN_SITES } from '@/content/village';

export type HelpEntry = { id: string; title: string; paragraphs: string[] };

export const FAQ: readonly HelpEntry[] = [
  {
    id: 'mistakes',
    title: 'Cosa succede se sbaglio?',
    paragraphs: [
      'Niente: riprovi. Non ci sono vite da perdere e nessuna lezione si blocca.',
      'Se una risposta non ti torna, chiedi alla tua socia: la trovi in basso, accanto a «Continua».',
    ],
  },
  {
    id: 'pact',
    title: 'Cos’è il patto?',
    paragraphs: [
      'Un impegno con la tua socia: perché impari, quanti minuti al giorno e in che momento della giornata.',
      'Ogni giorno in cui fai almeno una lezione arriva un abitante nel borgo. Se salti un giorno non perdi niente: riparti il giorno dopo.',
    ],
  },
  {
    id: 'village',
    title: 'Come cresce il borgo?',
    paragraphs: [
      'Ogni edificio è un argomento e si costruisce solo con le lezioni del suo argomento: il sapere non si compra.',
      `Puoi tenere aperti fino a ${MAX_OPEN_SITES} cantieri alla volta e scegli tu da dove partire. L’unica regola: la Torre (investire) si apre dopo il Pozzo (fondo emergenze).`,
    ],
  },
  {
    id: 'bricks',
    title: 'A cosa servono i mattoni?',
    paragraphs: [
      'Li guadagni finendo le lezioni. Serviranno per costruire case per gli abitanti, alberi e piazze.',
      'Non si comprano e non valgono soldi veri.',
    ],
  },
  {
    id: 'advice',
    title: 'Finanz mi dà consigli di investimento?',
    paragraphs: [
      'No. Finanz è un’app educativa: spiega concetti e strumenti, ma non offre consulenza finanziaria personalizzata.',
      'Per decisioni importanti parlane con un adulto di fiducia o con un consulente abilitato.',
    ],
  },
];

export const LEGAL_DOCUMENTS: readonly HelpEntry[] = [
  {
    id: 'terms',
    title: 'Termini di servizio',
    paragraphs: [
      'Testo di esempio. Utilizzando Finanz accetti di usare l’app per scopi personali ed educativi. I contenuti hanno finalità informative e non costituiscono consulenza finanziaria.',
      'Testo di esempio. Mattoni, abitanti ed edifici sono elementi di gioco senza valore economico e non possono essere convertiti in denaro.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    paragraphs: [
      'Testo di esempio. In questa versione dimostrativa nome, patto e progressi restano sul tuo dispositivo e non vengono inviati a server esterni.',
      'Testo di esempio. Puoi cancellare tutti i dati in qualsiasi momento con il Logout dalla pagina Profilo.',
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
