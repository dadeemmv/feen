import type { Lesson } from '../types';

/** Livello 1 · Capitolo 1. Steps 1–5 reproduce the reference video verbatim. */
export const inflazioneLesson: Lesson = {
  id: 'inflazione',
  steps: [
    {
      id: 'inflazione-carrello',
      type: 'choice',
      tag: 'indovina',
      illustration: 'shopping-cart',
      emoji: '📖',
      prompt: 'Nel 2020 con 1.000€ riempivi il carrello per un mese. Oggi con gli stessi soldi…',
      options: [
        { id: 'more', label: 'Compri di più' },
        { id: 'same', label: 'Compri uguale' },
        { id: 'less', label: 'Compri di meno' },
      ],
      correctOptionId: 'less',
      explanation:
        'Dal 2020 i prezzi in Italia sono saliti parecchio, soprattutto tra il 2022 e il 2023. I tuoi 1.000€ sono rimasti 1.000€, ma ogni prodotto costa di più: quindi il carrello si riempie meno. Questo fenomeno si chiama inflazione.',
    },
    {
      id: 'inflazione-rivelazione',
      type: 'info',
      emoji: '✨',
      title: 'La rivelazione',
      lead: 'I tuoi 1.000€ sono sempre lì. Ma valgono di meno.',
      rows: [
        { emoji: '🍕', text: 'Pizza margherita: da 5€ a oltre 7€', tone: 'sky' },
        { emoji: '🚗', text: 'Fiat Panda: da 12.000€ a 15.900€', tone: 'blush' },
        {
          text: 'I prezzi salgono ogni anno. I tuoi soldi fermi no. Con gli stessi soldi, compri sempre meno cose.',
          tone: 'butter',
        },
      ],
      explanation:
        'Gli esempi mostrano come lo stesso prodotto costi di più col passare degli anni. In genere i prezzi salgono quasi ogni anno, con rare eccezioni come il 2020. Se i tuoi soldi restano fermi, con la stessa cifra compri meno cose.',
    },
    {
      id: 'inflazione-colpevole',
      type: 'definition',
      emoji: '😈',
      title: 'Il colpevole',
      lead: 'Questo fenomeno ha un nome: INFLAZIONE.',
      term: 'Inflazione',
      definition:
        'L’aumento generale dei prezzi nel tempo. Leggi sempre 1.000€ sul conto, ma ogni anno comprano un po’ meno.',
      tone: 'lilac',
      explanation:
        'Il tasso d’inflazione indica di quanto salgono in media i prezzi di beni e servizi. In Italia lo calcola l’ISTAT, rilevando ogni mese i prezzi di un ampio paniere di prodotti.',
    },
    {
      id: 'inflazione-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'burning-banknote',
      statement:
        'Hai 1.000€ che potrai spendere solo tra un anno. Con un’inflazione del 3%, tra un anno comprerai esattamente le stesse cose di oggi.',
      answer: false,
      explanation:
        'Con un’inflazione del 3%, ciò che oggi costa 1.000€ tra un anno costerà circa 1.030€. I tuoi soldi però restano 1.000€, quindi potrai comprare un po’ meno cose di oggi. Il numero sul conto non cambia, il suo valore sì.',
    },
    {
      id: 'inflazione-erosione',
      type: 'info',
      emoji: '🌊',
      title: 'Erosione',
      lead: 'Perché l’inflazione ti fa così tanto male?',
      rows: [
        {
          text: 'Perché erode il tuo potere d’acquisto: la quantità di cose reali che i tuoi soldi possono comprare.',
          tone: 'sky',
        },
        {
          text: 'Stessi 1.000€. Ma meno spesa, meno benzina, meno tutto. Il numero non cambia, ciò che compri sì.',
          tone: 'blush',
        },
      ],
      explanation:
        'Il potere d’acquisto è ciò che puoi comprare davvero con i tuoi soldi. L’inflazione lo consuma lentamente, come l’acqua che erode una roccia.',
    },
    {
      id: 'inflazione-potere-acquisto',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'La quantità di cose reali che puoi comprare con i tuoi soldi si chiama ___.',
      options: [
        { id: 'rate', label: 'tasso d’interesse' },
        { id: 'power', label: 'potere d’acquisto' },
        { id: 'balance', label: 'saldo del conto' },
      ],
      correctOptionId: 'power',
      explanation:
        'Il potere d’acquisto misura cosa puoi comprare davvero, non quanti euro hai. Il saldo del conto può restare uguale mentre il potere d’acquisto scende a causa dell’inflazione.',
    },
    {
      id: 'inflazione-valore-reale',
      type: 'choice',
      tag: 'mettiti-alla-prova',
      emoji: '🧮',
      prompt:
        'Hai 1.000€ fermi sul conto e l’inflazione è al 3%. Dopo un anno, quanto valgono in “euro di oggi”?',
      options: [
        { id: 'real', label: 'Circa 971€' },
        { id: 'same', label: '1.000€' },
        { id: 'up', label: '1.030€' },
      ],
      correctOptionId: 'real',
      explanation:
        'Il saldo resta 1.000€, ma i prezzi sono saliti del 3%: ciò che costava 1.000€ ora ne costa 1.030€. Dividendo 1.000 per 1,03 ottieni circa 970,87€: è il potere d’acquisto che ti resta, misurato in euro di oggi. Togliere semplicemente il 3% (970€) è una buona approssimazione.',
    },
    {
      id: 'inflazione-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni termine al suo significato',
      pairs: [
        { id: 'inflation', left: 'Inflazione', right: 'Prezzi che salgono nel tempo' },
        { id: 'power', left: 'Potere d’acquisto', right: 'Ciò che i soldi possono comprare' },
        { id: 'erosion', left: 'Erosione', right: 'Perdita lenta di valore' },
      ],
      explanation:
        'L’inflazione è la causa: i prezzi salgono. L’erosione è l’effetto sui tuoi risparmi, che perdono valore lentamente. Il potere d’acquisto è proprio ciò che viene eroso.',
    },
    {
      id: 'inflazione-difendersi',
      type: 'info',
      emoji: '🛡️',
      title: 'Come difendersi',
      lead: 'Tenere i soldi fermi non li protegge dall’inflazione.',
      rows: [
        {
          emoji: '🎯',
          text: 'La BCE punta a un’inflazione del 2% annuo nel medio periodo: un po’ di inflazione è normale.',
          tone: 'sky',
        },
        {
          emoji: '💡',
          text: 'Per non perdere potere d’acquisto, i tuoi risparmi dovrebbero crescere almeno quanto i prezzi.',
          tone: 'mint',
        },
        {
          emoji: '❄️',
          text: 'Un alleato potente per farli crescere? L’interesse composto. Lo scopri nel prossimo capitolo!',
          tone: 'butter',
        },
      ],
      explanation:
        'La Banca Centrale Europea punta a un’inflazione del 2% nel medio periodo, il livello che ritiene adatto a mantenere i prezzi stabili. Per difendere i risparmi serve un rendimento che, al netto di tasse e costi, sia almeno pari all’inflazione.',
    },
  ],
};
