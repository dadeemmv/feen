import type { Lesson } from '../types';

/**
 * Il Mercato · Le spese invisibili. The Otter's first site: her superpower (enjoying money
 * without needless risks) covers her blind spot (small spends and subscriptions she does not
 * see). Draft written for 14–19 year olds: to be reviewed with the same fact-check as the other
 * lessons before release.
 */
export const speseInvisibiliLesson: Lesson = {
  id: 'spese-invisibili',
  steps: [
    {
      id: 'spese-merenda',
      type: 'choice',
      tag: 'indovina',
      emoji: '🥐',
      prompt: 'Una merenda da 1,50€ ogni giorno di scuola. In un anno scolastico (circa 200 giorni) quanto fa?',
      options: [
        { id: 'thirty', label: 'Circa 30€' },
        { id: 'three-hundred', label: 'Circa 300€' },
        { id: 'three-thousand', label: 'Circa 3.000€' },
      ],
      correctOptionId: 'three-hundred',
      explanation:
        '1,50€ × 200 giorni = 300€. Una piccola spesa da sola sembra niente, ripetuta ogni giorno diventa una cifra grande. Si chiamano spese invisibili: non le vedi, ma ci sono.',
    },
    {
      id: 'spese-mercato',
      type: 'definition',
      emoji: '🧾',
      title: 'Il Mercato',
      lead: 'Qui i soldi escono. Il trucco è vederli uscire.',
      term: 'Budget',
      definition:
        'Un piano di quanto entra e quanto esce in un periodo, per esempio in un mese. Non è una gabbia: serve a decidere tu dove vanno i soldi, invece di scoprirlo dopo.',
      explanation:
        'Un budget può stare su un foglio o nelle note del telefono: entrate da una parte, uscite dall’altra, e la differenza in fondo.',
    },
    {
      id: 'spese-bisogni',
      type: 'info',
      emoji: '🧺',
      title: 'Bisogni e desideri',
      lead: 'Due cesti diversi, e vanno bene tutti e due.',
      rows: [
        { text: 'Bisogni: quello che ti serve davvero, come l’abbonamento del bus o i libri di scuola.', tone: 'sky' },
        { text: 'Desideri: quello che ti piace avere, come le cuffie nuove o un’uscita in più.', tone: 'butter' },
        { text: 'Il budget non cancella i desideri: li mette in fila, così ci arrivi senza restare a secco.', tone: 'mint' },
      ],
      explanation:
        'Distinguere i due cesti non vuol dire rinunciare a quello che ti piace. Vuol dire scegliere prima, invece di accorgerti dopo che i soldi sono finiti.',
    },
    {
      id: 'spese-abbonamenti',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      statement: 'Tre abbonamenti da 4,99€ al mese costano meno di 100€ all’anno.',
      answer: false,
      explanation:
        '4,99€ × 3 × 12 mesi = quasi 180€ all’anno. Gli abbonamenti si rinnovano da soli: per questo conviene ricontrollarli ogni tanto e disdire quelli che non usi più.',
    },
    {
      id: 'spese-paghetta',
      type: 'choice',
      tag: 'mettiti-alla-prova',
      emoji: '💶',
      prompt: 'Ricevi 50€ al mese. Quale piano ti fa arrivare a fine mese con qualcosa da parte?',
      options: [
        { id: 'spend', label: 'Spendo finché ci sono, poi mi fermo' },
        { id: 'first', label: 'Appena li ricevo ne metto da parte 10€, poi divido il resto' },
        { id: 'last', label: 'Metto da parte quello che avanza a fine mese' },
      ],
      correctOptionId: 'first',
      explanation:
        'Mettere da parte all’inizio, non alla fine, si chiama «pagare prima se stessi». Quello che avanza a fine mese, di solito, è zero.',
    },
    {
      id: 'spese-tipi',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni spesa alla sua descrizione',
      pairs: [
        { id: 'fixed', left: 'Spesa fissa', right: 'Uguale ogni mese, come un abbonamento' },
        { id: 'variable', left: 'Spesa variabile', right: 'Cambia di mese in mese, come le uscite' },
        { id: 'invisible', left: 'Spesa invisibile', right: 'Piccola e ripetuta: non ti accorgi di quanto fa' },
      ],
      explanation:
        'Le fisse le conosci, le variabili le decidi, le invisibili vanno scovate: sono quelle che svuotano il portafoglio senza farsi notare.',
    },
    {
      id: 'spese-diario',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Annotare per una settimana ogni spesa, anche la più piccola, serve a scoprire ___.',
      options: [
        { id: 'where', label: 'dove vanno davvero i tuoi soldi' },
        { id: 'income', label: 'quanto guadagni' },
        { id: 'prices', label: 'quanto salgono i prezzi' },
      ],
      correctOptionId: 'where',
      explanation:
        'Non puoi decidere dove vanno i soldi se non sai dove vanno adesso. Una settimana di note basta per trovare le spese invisibili.',
    },
    {
      id: 'spese-domenica',
      type: 'info',
      emoji: '📅',
      title: 'Cinque minuti a settimana',
      lead: 'Una volta a settimana guardi dove sono andati i tuoi soldi.',
      rows: [
        { text: 'Apri le note o l’app della carta e scorri le spese.', tone: 'sky' },
        { text: 'Cerca quelle che non ricordi di aver deciso.', tone: 'butter' },
        { text: 'Scegline una da tagliare o da rimandare.', tone: 'mint' },
      ],
      explanation:
        'Bastano cinque minuti fissi, sempre nello stesso momento della settimana. È più facile tenere un’abitudine piccola che un grande proposito.',
    },
  ],
};
