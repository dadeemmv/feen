import type { Lesson } from '../types';

/** Livello 3 · Capitolo 9. Maths: TER 0,20% su 10.000€ = 20€/anno. */
export const etfLesson: Lesson = {
  id: 'etf',
  steps: [
    {
      id: 'etf-mille-aziende',
      type: 'choice',
      tag: 'indovina',
      illustration: 'pie-diversify',
      emoji: '🧺',
      prompt: 'Vuoi investire in più di 1.000 aziende di tutto il mondo. Qual è il modo più semplice?',
      options: [
        { id: 'one-by-one', label: 'Comprare le azioni una a una' },
        { id: 'accounts', label: 'Aprire un conto per Paese' },
        { id: 'etf', label: 'Comprare un ETF globale' },
      ],
      correctOptionId: 'etf',
      explanation:
        'Un ETF globale può contenere in un solo prodotto oltre mille titoli. Con un’unica operazione investi in tutto il paniere. Comprare ogni azione separatamente richiederebbe molti più soldi e molte più commissioni.',
    },
    {
      id: 'etf-definizione',
      type: 'definition',
      emoji: '🧺',
      title: 'Un paniere in un clic',
      lead: 'Tanti titoli, un solo prodotto da comprare.',
      term: 'ETF',
      definition:
        'Exchange Traded Fund: un fondo quotato in Borsa che di solito replica un indice, come l’MSCI World o l’S&P 500. Lo compri e lo vendi come un’azione.',
      tone: 'lilac',
      explanation:
        'Un ETF è un fondo d’investimento con una particolarità: si scambia in Borsa durante la giornata, proprio come un’azione. La maggior parte degli ETF copia passivamente un indice.',
    },
    {
      id: 'etf-indici',
      type: 'info',
      emoji: '📊',
      title: 'Cos’è un indice',
      lead: 'Un indice misura l’andamento di un gruppo di titoli.',
      rows: [
        { emoji: '🇺🇸', text: 'S&P 500: circa 500 tra le più grandi aziende statunitensi.', tone: 'sky' },
        { emoji: '🇮🇹', text: 'FTSE MIB: le 40 principali società quotate a Milano.', tone: 'mint' },
        {
          emoji: '🌍',
          text: 'MSCI World: oltre mille grandi e medie aziende di 23 Paesi sviluppati.',
          tone: 'butter',
        },
      ],
      explanation:
        'Un indice è come una fotografia di un pezzo di mercato. Un ETF che lo replica ti fa guadagnare o perdere più o meno quanto l’indice, al netto dei costi.',
    },
    {
      id: 'etf-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'pie-diversify',
      statement:
        'Un ETF che replica un indice cerca di battere il mercato scegliendo solo i titoli migliori.',
      answer: false,
      explanation:
        'Un ETF a replica passiva non sceglie i titoli: copia l’indice così com’è. Non punta a battere il mercato ma a seguirlo il più fedelmente possibile, e per questo ha di solito costi molto bassi.',
    },
    {
      id: 'etf-vantaggi',
      type: 'info',
      emoji: '💚',
      title: 'Perché piacciono',
      lead: 'Tre motivi per cui gli ETF sono così diffusi:',
      rows: [
        { emoji: '🧺', text: 'Diversificazione immediata: un solo acquisto, tanti titoli.', tone: 'mint' },
        {
          emoji: '💸',
          text: 'Costi bassi: molti ETF su indici ampi costano meno dello 0,3% l’anno (il TER).',
          tone: 'sky',
        },
        { emoji: '🔄', text: 'Liquidità: puoi comprarli e venderli ogni giorno in cui la Borsa è aperta.', tone: 'butter' },
      ],
      explanation:
        'Il TER, Total Expense Ratio, è il costo annuo di gestione del fondo. Viene scalato in automatico dal valore dell’ETF, quindi non lo vedi come addebito separato.',
    },
    {
      id: 'etf-ter',
      type: 'choice',
      tag: 'scenario',
      emoji: '🧮',
      prompt: 'Investi 10.000€ in un ETF con TER dello 0,20% annuo. Quanto paghi circa di costi di gestione in un anno?',
      options: [
        { id: 'two', label: '2€' },
        { id: 'twenty', label: '20€' },
        { id: 'two-hundred', label: '200€' },
      ],
      correctOptionId: 'twenty',
      explanation:
        'Lo 0,20% di 10.000€ fa 20€ all’anno, scalati in automatico dal valore del fondo. Un fondo con costi del 2% ti costerebbe 200€ l’anno: dieci volte tanto. Sul lungo periodo, anche piccole differenze di costo pesano molto.',
    },
    {
      id: 'etf-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni termine al suo significato',
      pairs: [
        { id: 'acc', left: 'Ad accumulazione', right: 'Reinveste i dividendi' },
        { id: 'dist', left: 'A distribuzione', right: 'Ti paga i dividendi' },
        { id: 'ter', left: 'TER', right: 'Costo annuo del fondo' },
      ],
      explanation:
        'Un ETF ad accumulazione reinveste automaticamente i dividendi, sfruttando l’interesse composto. Uno a distribuzione te li versa sul conto. Il TER è quanto costa ogni anno, in percentuale.',
    },
    {
      id: 'etf-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Un ETF a replica passiva non cerca di battere l’indice, ma di ___.',
      options: [
        { id: 'avoid', label: 'evitarlo' },
        { id: 'track', label: 'replicarlo' },
        { id: 'sell', label: 'venderlo' },
      ],
      correctOptionId: 'track',
      explanation:
        'Replicare un indice significa riprodurne l’andamento, di solito comprandone gli stessi titoli nelle stesse proporzioni. Così l’ETF segue il mercato, nel bene e nel male.',
    },
    {
      id: 'etf-da-sapere',
      type: 'info',
      emoji: '⚠️',
      title: 'Da sapere',
      lead: 'Un ETF riduce il rischio della singola azienda, non quello di mercato.',
      rows: [
        { emoji: '📉', text: 'Se l’indice scende, scende anche l’ETF che lo replica.', tone: 'blush' },
        {
          emoji: '🧾',
          text: 'In Italia i guadagni da ETF sono redditi di capitale: non si compensano con minusvalenze passate.',
          tone: 'butter',
        },
        {
          emoji: '🥚',
          text: 'Prossimo capitolo: la diversificazione, per non mettere tutte le uova nello stesso paniere.',
          tone: 'mint',
        },
      ],
      explanation:
        'Gli ETF sono uno strumento molto usato per diversificare a basso costo, ma il loro valore segue sempre il mercato. Anche la tassazione ha regole particolari da conoscere.',
    },
  ],
};
