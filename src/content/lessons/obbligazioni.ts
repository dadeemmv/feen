import type { Lesson } from '../types';

/** Livello 2 · Capitolo 7. */
export const obbligazioniLesson: Lesson = {
  id: 'obbligazioni',
  steps: [
    {
      id: 'obbligazioni-prestito',
      type: 'choice',
      tag: 'indovina',
      illustration: 'bond-certificate',
      emoji: '📜',
      prompt:
        'Lo Stato ti chiede un prestito e promette di restituirlo con gli interessi. Cosa stai comprando?',
      options: [
        { id: 'share', label: 'Un’azione dello Stato' },
        { id: 'insurance', label: 'Una polizza assicurativa' },
        { id: 'bond', label: 'Un’obbligazione' },
      ],
      correctOptionId: 'bond',
      explanation:
        'Un’obbligazione è un prestito che fai a uno Stato o a un’azienda. In cambio ricevi interessi e, alla scadenza, la restituzione del capitale. I BTP, per esempio, sono obbligazioni emesse dallo Stato italiano.',
    },
    {
      id: 'obbligazioni-definizione',
      type: 'definition',
      emoji: '🤝',
      title: 'Presti, non possiedi',
      lead: 'Con le azioni diventi socio. Con le obbligazioni diventi creditore.',
      term: 'Obbligazione',
      definition:
        'Un titolo di debito: presti soldi a chi lo emette, Stato o azienda, e ricevi interessi. Alla scadenza ti restituisce il capitale.',
      tone: 'sky',
      explanation:
        'Chi emette un’obbligazione si impegna per contratto a pagarti interessi e rimborso. Non partecipi agli utili: ricevi quanto pattuito, se chi emette resta solvibile.',
    },
    {
      id: 'obbligazioni-parole',
      type: 'info',
      emoji: '🗝️',
      title: 'Le parole chiave',
      lead: 'Quasi ogni obbligazione ha tre elementi base:',
      rows: [
        {
          emoji: '💶',
          text: 'Valore nominale: la cifra che ti viene restituita alla scadenza, per esempio 1.000€.',
          tone: 'sky',
        },
        { emoji: '📅', text: 'Scadenza: la data in cui il prestito finisce e riavrai il capitale.', tone: 'mint' },
        {
          emoji: '🎟️',
          text: 'Cedola: l’interesse periodico che ricevi. La vedrai nel dettaglio nel prossimo livello.',
          tone: 'butter',
        },
      ],
      explanation:
        'Valore nominale, scadenza e cedola sono i dati base di un’obbligazione, anche se alcune non pagano cedole. Il prezzo di mercato, invece, può cambiare ogni giorno fino alla scadenza.',
    },
    {
      id: 'obbligazioni-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'bond-certificate',
      statement: 'Le obbligazioni sono sempre investimenti senza alcun rischio.',
      answer: false,
      explanation:
        'Chi emette può non riuscire a ripagarti: è il rischio di credito, o di default. Inoltre, se i tassi di mercato salgono, il prezzo delle obbligazioni già emesse scende, e se vendi prima della scadenza puoi perdere.',
    },
    {
      id: 'obbligazioni-rating',
      type: 'info',
      emoji: '⚖️',
      title: 'Chi paga di più?',
      lead: 'Più è rischioso chi chiede il prestito, più interessi deve offrire.',
      rows: [
        {
          emoji: '🏛️',
          text: 'Stati e aziende molto solidi di solito pagano tassi più bassi.',
          tone: 'mint',
        },
        {
          emoji: '🌪️',
          text: 'Un’azienda in difficoltà deve offrire tassi più alti per convincerti a prestarle soldi.',
          tone: 'blush',
        },
        {
          emoji: '🏅',
          text: 'Il rating, per esempio AAA o BBB, è un giudizio su quanto è affidabile chi emette.',
          tone: 'sky',
        },
      ],
      explanation:
        'Le agenzie di rating valutano la capacità di chi emette di ripagare il debito. Un rating più basso significa più rischio, e quindi di solito interessi più alti.',
    },
    {
      id: 'obbligazioni-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni termine al suo significato',
      pairs: [
        { id: 'bond', left: 'Obbligazione', right: 'Un prestito a Stato o azienda' },
        { id: 'maturity', left: 'Scadenza', right: 'Quando riavrai il capitale' },
        { id: 'rating', left: 'Rating', right: 'Giudizio di affidabilità' },
      ],
      explanation:
        'L’obbligazione è il prestito, la scadenza è il giorno del rimborso e il rating è un giudizio su quanto è probabile che tu venga ripagato. Insieme ti aiutano a capire rischio e rendimento di un titolo.',
    },
    {
      id: 'obbligazioni-fallimento',
      type: 'choice',
      tag: 'scenario',
      emoji: '🏚️',
      prompt: 'Se un’azienda fallisce, chi viene rimborsato per primo tra azionisti e obbligazionisti?',
      options: [
        { id: 'shareholders', label: 'Gli azionisti' },
        { id: 'bondholders', label: 'Gli obbligazionisti' },
        { id: 'together', label: 'Tutti insieme, alla pari' },
      ],
      correctOptionId: 'bondholders',
      explanation:
        'Gli obbligazionisti sono creditori, quindi vengono prima degli azionisti, che sono proprietari e si dividono solo ciò che resta. Non vuol dire che il rimborso sia garantito: spesso si recupera solo una parte.',
    },
    {
      id: 'obbligazioni-tassi',
      type: 'fill',
      tag: 'mettiti-alla-prova',
      prompt: 'Completa la frase',
      sentence: 'Se i tassi di interesse salgono, il prezzo delle obbligazioni già emesse di solito ___.',
      options: [
        { id: 'up', label: 'sale' },
        { id: 'down', label: 'scende' },
        { id: 'flat', label: 'non cambia' },
      ],
      correctOptionId: 'down',
      explanation:
        'Se escono nuove obbligazioni che pagano di più, quelle vecchie con interessi più bassi diventano meno attraenti. Per venderle bisogna abbassarne il prezzo: per questo tassi e prezzi si muovono in direzioni opposte.',
    },
    {
      id: 'obbligazioni-sintesi',
      type: 'info',
      emoji: '🧠',
      title: 'In sintesi',
      lead: 'Le obbligazioni sono prestiti con regole chiare.',
      rows: [
        { emoji: '🤝', text: 'Con le azioni diventi socio, con le obbligazioni diventi creditore.', tone: 'sky' },
        { emoji: '📉', text: 'Di solito oscillano meno delle azioni, ma il rischio non è mai zero.', tone: 'mint' },
        { emoji: '🎠', text: 'Tassi su, prezzi giù: funzionano come un’altalena.', tone: 'butter' },
      ],
      explanation:
        'Hai completato il Livello 2 sui mercati. Nel Livello 3 inizi a costruire un portafoglio, partendo dalle cedole.',
    },
  ],
};
