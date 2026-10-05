import type { Lesson } from '../types';

/** Livello 2 · Capitolo 5. */
export const dividendiLesson: Lesson = {
  id: 'dividendi',
  steps: [
    {
      id: 'dividendi-utili',
      type: 'choice',
      tag: 'indovina',
      illustration: 'coins-stack',
      emoji: '💶',
      prompt: 'Un’azienda chiude l’anno con un bel profitto. Cosa può fare con una parte di questi utili?',
      options: [
        { id: 'shareholders', label: 'Distribuirli agli azionisti' },
        { id: 'customers', label: 'Rimborsarli ai clienti' },
        { id: 'exchange', label: 'Versarli alla Borsa' },
      ],
      correctOptionId: 'shareholders',
      explanation:
        'Una società può distribuire parte degli utili ai soci: questo pagamento si chiama dividendo. In alternativa può reinvestirli per crescere, per esempio in ricerca o in nuovi impianti. Di norma decide l’assemblea degli azionisti, su proposta degli amministratori.',
    },
    {
      id: 'dividendi-definizione',
      type: 'definition',
      emoji: '🍰',
      title: 'Una fetta degli utili',
      lead: 'Quando l’azienda guadagna, può condividere il risultato con te.',
      term: 'Dividendo',
      definition:
        'La parte di utili che una società distribuisce ai suoi azionisti, di solito in denaro. Non è obbligatoria: può aumentare, diminuire o sparire.',
      tone: 'mint',
      explanation:
        'Il dividendo si paga per ogni azione posseduta: più azioni hai, più ricevi. Molte aziende in crescita preferiscono non distribuirlo e reinvestire tutto.',
    },
    {
      id: 'dividendi-yield',
      type: 'info',
      emoji: '🧮',
      title: 'Il rendimento da dividendo',
      lead: 'Per confrontare i dividendi si usa una percentuale.',
      rows: [
        { emoji: '➗', text: 'Dividend yield = dividendo annuo ÷ prezzo dell’azione.', tone: 'sky' },
        {
          emoji: '💡',
          text: 'Esempio: un’azione da 50€ che paga 2€ l’anno ha un rendimento da dividendo del 4% (2 ÷ 50).',
          tone: 'butter',
        },
        {
          emoji: '⚠️',
          text: 'Un rendimento altissimo può essere un campanello d’allarme: spesso vuol dire che il prezzo è crollato.',
          tone: 'blush',
        },
      ],
      explanation:
        'Il dividend yield ti dice quanto rende il dividendo rispetto al prezzo che paghi. Se il prezzo crolla, il rapporto sale anche se l’azienda è in difficoltà.',
    },
    {
      id: 'dividendi-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'coins-stack',
      statement:
        'Un’azienda che ha sempre pagato dividendi è obbligata a pagarli anche il prossimo anno.',
      answer: false,
      explanation:
        'I dividendi non sono mai garantiti: la società decide ogni anno se e quanto distribuire. In periodi difficili può ridurli o sospenderli, come hanno fatto molte banche europee nel 2020 su raccomandazione della BCE.',
    },
    {
      id: 'dividendi-date',
      type: 'info',
      emoji: '📅',
      title: 'Le date da sapere',
      lead: 'Per ricevere il dividendo conta quando possiedi l’azione.',
      rows: [
        {
          emoji: '✂️',
          text: 'Data di stacco: da questo giorno chi compra l’azione non riceve più quel dividendo.',
          tone: 'sky',
        },
        {
          emoji: '📉',
          text: 'Il giorno dello stacco il prezzo dell’azione di solito scende di circa l’importo del dividendo.',
          tone: 'butter',
        },
        { emoji: '💸', text: 'Data di pagamento: il giorno in cui i soldi arrivano sul tuo conto.', tone: 'mint' },
      ],
      explanation:
        'Il calo di prezzo allo stacco è normale: parte del valore dell’azienda esce sotto forma di dividendo. Per questo il dividendo non è un regalo “gratis”.',
    },
    {
      id: 'dividendi-calcolo',
      type: 'choice',
      tag: 'scenario',
      emoji: '🧮',
      prompt:
        'Hai 200 azioni e la società paga un dividendo di 0,50€ per azione. Quanto ricevi prima delle tasse?',
      options: [
        { id: 'fifty', label: '50€' },
        { id: 'hundred', label: '100€' },
        { id: 'two-hundred', label: '200€' },
      ],
      correctOptionId: 'hundred',
      explanation:
        '200 azioni per 0,50€ fanno 100€ lordi. In Italia sui dividendi si paga di norma un’imposta del 26%, quindi netti ne ricevi 74€. Sui dividendi esteri possono aggiungersi anche ritenute del Paese di origine.',
    },
    {
      id: 'dividendi-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Il rapporto tra dividendo annuo e prezzo dell’azione si chiama ___.',
      options: [
        { id: 'gain', label: 'capital gain' },
        { id: 'yield', label: 'dividend yield' },
        { id: 'coupon', label: 'cedola' },
      ],
      correctOptionId: 'yield',
      explanation:
        'Il dividend yield esprime il dividendo in percentuale sul prezzo. Il capital gain è il guadagno dalla vendita, mentre la cedola è l’interesse di un’obbligazione.',
    },
    {
      id: 'dividendi-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni termine al suo significato',
      pairs: [
        { id: 'dividend', left: 'Dividendo', right: 'Parte degli utili ai soci' },
        { id: 'ex-date', left: 'Data di stacco', right: 'Da qui chi compra non lo riceve' },
        { id: 'yield', left: 'Dividend yield', right: 'Dividendo diviso prezzo' },
      ],
      explanation:
        'Il dividendo è il pagamento e la data di stacco decide chi lo riceve. Il dividend yield, invece, ti permette di confrontare i dividendi di aziende con prezzi diversi.',
    },
    {
      id: 'dividendi-reinvestire',
      type: 'info',
      emoji: '🌱',
      title: 'Reinvestire i dividendi',
      lead: 'Ricordi l’interesse composto?',
      rows: [
        {
          emoji: '🔁',
          text: 'Se reinvesti i dividendi compri nuove azioni, che a loro volta potranno pagare dividendi.',
          tone: 'mint',
        },
        {
          emoji: '🧺',
          text: 'Gli ETF ad accumulazione lo fanno in automatico: li vedrai nel Livello 3.',
          tone: 'sky',
        },
      ],
      explanation:
        'Reinvestire i dividendi applica l’effetto palla di neve alle azioni. Nel prossimo capitolo vedi l’altro modo di guadagnare: il capital gain.',
    },
  ],
};
