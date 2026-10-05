import type { Lesson } from '../types';

/** Livello 3 · Capitolo 8. Maths: 4% di 1.000€ = 40€/anno (BTP: 2 × 20€); 3% semestrale = 2 × 15€. */
export const cedoleLesson: Lesson = {
  id: 'cedole',
  steps: [
    {
      id: 'cedole-btp',
      type: 'choice',
      tag: 'indovina',
      illustration: 'bond-certificate',
      emoji: '🎟️',
      prompt: 'Hai un BTP da 1.000€ con cedola del 4% annuo. Quanto ricevi di interessi lordi ogni anno?',
      options: [
        { id: 'four', label: '4€' },
        { id: 'forty', label: '40€' },
        { id: 'four-hundred', label: '400€' },
      ],
      correctOptionId: 'forty',
      explanation:
        'Il 4% di 1.000€ fa 40€ lordi all’anno. I BTP classici però pagano la cedola ogni sei mesi, quindi riceveresti 20€ due volte l’anno. Il nome “cedola” viene dai tagliandi di carta che un tempo si staccavano dal titolo per incassare gli interessi.',
    },
    {
      id: 'cedole-definizione',
      type: 'definition',
      emoji: '🎟️',
      title: 'Il premio per il prestito',
      lead: 'Prestare soldi ha un compenso, pagato a intervalli regolari.',
      term: 'Cedola',
      definition:
        'L’interesse che un’obbligazione paga periodicamente, di solito ogni anno o ogni sei mesi. Si calcola sul valore nominale.',
      tone: 'butter',
      explanation:
        'La cedola è espressa in percentuale del valore nominale, non del prezzo che hai pagato. Per questo, se compri sotto o sopra il nominale, il tuo rendimento effettivo cambia.',
    },
    {
      id: 'cedole-tipi',
      type: 'info',
      emoji: '🧾',
      title: 'Tipi di cedola',
      lead: 'Non tutte le cedole funzionano allo stesso modo:',
      rows: [
        { emoji: '📌', text: 'Fissa: la stessa percentuale fino alla scadenza.', tone: 'sky' },
        {
          emoji: '🔀',
          text: 'Variabile: cambia seguendo un tasso di riferimento, come l’Euribor o l’inflazione.',
          tone: 'mint',
        },
        {
          emoji: '0️⃣',
          text: 'Zero coupon: niente cedole. Compri sotto il valore nominale e a scadenza ricevi il valore pieno.',
          tone: 'butter',
        },
      ],
      explanation:
        'Con la cedola fissa sai già quanto incasserai, con quella variabile no. Nei titoli zero coupon, come i BOT, il guadagno è tutto nella differenza di prezzo.',
    },
    {
      id: 'cedole-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'bond-certificate',
      statement:
        'Sugli interessi dei titoli di Stato italiani si paga un’imposta del 12,5%, non del 26%.',
      answer: true,
      explanation:
        'Esatto: gli interessi dei titoli di Stato italiani, e di quelli dei Paesi della cosiddetta white list, sono tassati al 12,5%. Sulle obbligazioni emesse da aziende, invece, l’aliquota è del 26%.',
    },
    {
      id: 'cedole-rendimento',
      type: 'info',
      emoji: '🔍',
      title: 'Cedola o rendimento?',
      lead: 'La cedola non è l’unico numero che conta.',
      rows: [
        {
          emoji: '🏷️',
          text: 'Se compri sotto il valore nominale, per esempio a 95 invece di 100, a scadenza guadagni anche la differenza.',
          tone: 'sky',
        },
        {
          emoji: '🎯',
          text: 'Il rendimento a scadenza tiene conto di cedole e differenza di prezzo: è il dato più utile per confrontare.',
          tone: 'mint',
        },
        {
          emoji: '⚠️',
          text: 'Vale solo se tieni il titolo fino alla scadenza e chi lo ha emesso ti ripaga.',
          tone: 'blush',
        },
      ],
      explanation:
        'Due obbligazioni con cedole diverse possono avere lo stesso rendimento a scadenza, se hanno prezzi diversi. Per confrontarle guarda il rendimento, non solo la cedola.',
    },
    {
      id: 'cedole-semestrale',
      type: 'choice',
      tag: 'scenario',
      emoji: '🧮',
      prompt:
        'Un’obbligazione da 1.000€ paga una cedola del 3% annuo in due rate semestrali. Quanto ricevi a ogni rata, al lordo?',
      options: [
        { id: 'three', label: '3€' },
        { id: 'fifteen', label: '15€' },
        { id: 'thirty', label: '30€' },
      ],
      correctOptionId: 'fifteen',
      explanation:
        'Il 3% di 1.000€ fa 30€ all’anno. Diviso in due rate semestrali, ricevi 15€ ogni sei mesi. Il totale annuo resta sempre 30€ lordi.',
    },
    {
      id: 'cedole-bot',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'I BOT non pagano cedole: sono titoli ___.',
      options: [
        { id: 'zero', label: 'zero coupon' },
        { id: 'fixed', label: 'a cedola fissa' },
        { id: 'equity', label: 'azionari' },
      ],
      correctOptionId: 'zero',
      explanation:
        'I BOT sono titoli di Stato a breve termine, al massimo un anno, senza cedole. Li compri a un prezzo inferiore al nominale e a scadenza ricevi il valore pieno: la differenza è il tuo interesse.',
    },
    {
      id: 'cedole-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni tipo di cedola alla sua caratteristica',
      pairs: [
        { id: 'fixed', left: 'Cedola fissa', right: 'Stessa percentuale ogni volta' },
        { id: 'floating', left: 'Cedola variabile', right: 'Segue un tasso di riferimento' },
        { id: 'zero', left: 'Zero coupon', right: 'Nessuna cedola periodica' },
      ],
      explanation:
        'La cedola fissa non cambia, la variabile si adegua a un tasso di riferimento e lo zero coupon non paga cedole. Scegliere tra loro significa decidere quanta incertezza accetti sugli interessi.',
    },
    {
      id: 'cedole-sintesi',
      type: 'info',
      emoji: '🧠',
      title: 'In sintesi',
      lead: 'La cedola è il “compenso” per aver prestato i tuoi soldi.',
      rows: [
        {
          emoji: '🧾',
          text: 'Titoli di Stato italiani e white list: 12,5% di tasse. Obbligazioni di aziende: 26%.',
          tone: 'butter',
        },
        { emoji: '🎯', text: 'Per confrontare le obbligazioni guarda il rendimento a scadenza.', tone: 'mint' },
        {
          emoji: '🧺',
          text: 'Prossimo capitolo: gli ETF, per comprare tanti titoli con un solo acquisto.',
          tone: 'sky',
        },
      ],
      explanation:
        'Ora sai come funzionano gli interessi delle obbligazioni. Con un ETF investi in un colpo solo in centinaia di azioni o di obbligazioni.',
    },
  ],
};
