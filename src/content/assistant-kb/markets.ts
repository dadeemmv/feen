import type { AssistantKbEntry } from '../extra-types';

/** Instruments and portfolio building: stocks, bonds, ETFs, diversification, PAC, crypto. */
export const MARKETS_KB: AssistantKbEntry[] = [
  {
    id: 'azioni',
    topic: 'Azioni',
    chapterId: 'azioni',
    keywords: ['azion', 'azionist', 'titolo azionario', 'titoli azionari', 'socio', 'soci '],
    answer:
      'Un’azione è una piccola quota di proprietà di un’azienda: comprandola diventi socio. 🏢 Puoi guadagnare in due modi:\n• Dividendi, se l’azienda distribuisce parte degli utili\n• Capital gain, se rivendi a un prezzo più alto\nIl prezzo oscilla ogni giorno in base a domanda e offerta. Se l’azienda va male puoi perdere, fino all’intero importo investito.',
  },
  {
    id: 'borsa-indici',
    topic: 'Borsa e indici',
    chapterId: 'etf',
    keywords: [
      'borsa',
      'indice',
      'indici ',
      's p 500',
      'sp500',
      'sp 500',
      'msci',
      'ftse',
      'nasdaq',
      'dow jones',
      'benchmark',
      'quotat',
    ],
    answer:
      'La Borsa è il mercato dove si comprano e vendono azioni, obbligazioni ed ETF. 🏛️ In Italia il mercato principale è Borsa Italiana, a Milano, parte del gruppo Euronext. Un indice misura l’andamento di un gruppo di titoli, per esempio:\n• FTSE MIB: le 40 principali società quotate a Milano\n• S&P 500: circa 500 grandi aziende statunitensi\n• MSCI World: oltre mille aziende di 23 Paesi sviluppati\nPer operare in Borsa serve sempre un intermediario, come un broker.',
  },
  {
    id: 'dividendi',
    topic: 'Dividendi',
    chapterId: 'dividendi',
    keywords: ['dividend', 'yield', 'utili', 'stacco'],
    answer:
      'Il dividendo è la parte di utili che un’azienda distribuisce ai suoi azionisti. 💶 Non è mai garantito: l’azienda può aumentarlo, ridurlo o sospenderlo. Il dividend yield è il rapporto tra dividendo annuo e prezzo: un’azione da 50€ che paga 2€ l’anno ha un dividend yield del 4%. Il giorno dello stacco il prezzo di solito scende di circa l’importo del dividendo. In Italia sui dividendi si paga di norma il 26%.',
  },
  {
    id: 'capital-gain',
    topic: 'Capital gain',
    chapterId: 'capital-gain',
    keywords: [
      'capital gain',
      'plusvalenz',
      'minusvalenz',
      'guadagno di capitale',
      'rivend',
      'zainetto fiscale',
    ],
    answer:
      'Il capital gain, o plusvalenza, è il guadagno che ottieni vendendo un investimento a un prezzo più alto di quello pagato. 🚀 Esempio: compri a 20€ e vendi a 26€, guadagni 6€, cioè il 30%. Finché non vendi il guadagno è solo potenziale: di norma le tasse si pagano quando lo realizzi. In Italia l’aliquota è di norma del 26%, del 12,5% sui titoli di Stato italiani e di molti Stati esteri. Le minusvalenze realizzate, in alcuni casi, possono compensare le plusvalenze dello stesso anno o dei 4 anni successivi.',
  },
  {
    id: 'obbligazioni',
    topic: 'Obbligazioni',
    chapterId: 'obbligazioni',
    keywords: [
      'obbligazion',
      'bond',
      'btp',
      'bot ',
      'titoli di stato',
      'titolo di stato',
      'debito pubblico',
      'rating',
      'default',
    ],
    answer:
      'Un’obbligazione è un prestito che fai a uno Stato o a un’azienda. 📜 In cambio ricevi interessi, di solito tramite cedole periodiche, e alla scadenza il rimborso del capitale. BTP e BOT sono titoli emessi dallo Stato italiano. I rischi principali:\n• Chi emette potrebbe non ripagarti (rischio di credito)\n• Se i tassi salgono il prezzo scende, e vendendo prima della scadenza puoi perdere\nIl rating ti aiuta a capire quanto è affidabile chi emette.',
  },
  {
    id: 'azioni-vs-obbligazioni',
    topic: 'Azioni o obbligazioni',
    chapterId: 'obbligazioni',
    keywords: [
      'azioni e obbligazioni',
      'obbligazioni e azioni',
      'azioni o obbligazioni',
      'obbligazioni o azioni',
      'azioni vs obbligazioni',
      'socio o creditore',
    ],
    answer:
      'La differenza principale è il tuo ruolo. 🤝\n• Con le azioni diventi socio: partecipi a utili e perdite, con un rendimento potenziale più alto e più oscillazioni\n• Con le obbligazioni diventi creditore: ricevi interessi e il rimborso a scadenza, di solito con meno oscillazioni\nSe un’azienda fallisce, gli obbligazionisti vengono rimborsati prima degli azionisti, anche se spesso solo in parte. Molti portafogli le combinano per bilanciare rischio e rendimento.',
  },
  {
    id: 'cedole',
    topic: 'Cedole',
    chapterId: 'cedole',
    keywords: ['cedol', 'coupon', 'zero coupon', 'rendimento a scadenza', 'valore nominale'],
    answer:
      'La cedola è l’interesse periodico pagato da un’obbligazione, calcolato sul valore nominale. 🎟️ Esempio: un BTP da 1.000€ con cedola del 4% paga 40€ lordi l’anno, in due rate semestrali da 20€. Può essere fissa, variabile o assente, come negli zero coupon, per esempio i BOT. Per confrontare le obbligazioni guarda il rendimento a scadenza, che considera anche il prezzo pagato.',
  },
  {
    id: 'etf',
    topic: 'ETF',
    chapterId: 'etf',
    keywords: [
      'etf',
      'exchange traded',
      'fondo indicizzato',
      'fondi indicizzati',
      'replica',
      'accumulazion',
      'distribuzion',
      'ter ',
      'total expense',
    ],
    answer:
      'Un ETF è un fondo quotato in Borsa che di solito replica un indice, come l’MSCI World o l’S&P 500. 🧺 Con un solo acquisto investi in un paniere che può contenere centinaia o migliaia di titoli. I vantaggi principali:\n• Diversificazione immediata\n• Costi bassi: il TER di molti ETF su indici ampi è sotto lo 0,3% l’anno\n• Si comprano e vendono in Borsa come un’azione\nUn ETF ad accumulazione reinveste i dividendi, uno a distribuzione te li versa sul conto. Attenzione: se l’indice scende, scende anche l’ETF.',
  },
  {
    id: 'fondi-comuni',
    topic: 'Fondi comuni e costi',
    chapterId: 'etf',
    keywords: [
      'fondi comuni',
      'fondo comune',
      'fondi attivi',
      'gestione attiva',
      'costi di gestione',
      'commissioni di gestione',
    ],
    answer:
      'Un fondo comune raccoglie i soldi di tanti risparmiatori e li investe secondo una strategia. 🏦 I fondi a gestione attiva cercano di battere il mercato, ma spesso costano di più, a volte oltre l’1,5% l’anno. Gli ETF passivi replicano un indice con costi di solito molto più bassi. Su molti anni anche una differenza dell’1% l’anno pesa parecchio, per via dell’interesse composto.',
  },
  {
    id: 'diversificazione',
    topic: 'Diversificazione',
    chapterId: 'diversifica',
    keywords: [
      'diversific',
      'uova',
      'paniere',
      'concentra',
      'ribilanc',
      'asset allocation',
      'portafoglio',
    ],
    answer:
      'Diversificare significa distribuire i soldi su tanti investimenti diversi, così che il cattivo andamento di uno pesi meno sul totale. 🥚 Puoi diversificare tra aziende, settori, Paesi e strumenti. Esempio: con 10.000€ divisi in parti uguali su 50 aziende, il fallimento di una ti costa il 2%, non il 100%. Attenzione: riduce il rischio della singola azienda, non quello di mercato. Ribilanciare ogni tanto mantiene le proporzioni che hai scelto.',
  },
  {
    id: 'pac',
    topic: 'PAC',
    chapterId: 'dentro-broker',
    keywords: [
      'pac ',
      'piano di accumulo',
      'piani di accumulo',
      'ogni mese',
      'al mese',
      'mensil',
      'dollar cost',
    ],
    answer:
      'Il PAC, Piano di Accumulo del Capitale, consiste nell’investire una cifra fissa a intervalli regolari, per esempio 50€ al mese. 🔁 Compri a prezzi diversi nel tempo, quindi non devi indovinare il momento giusto per entrare. Trasforma l’investimento in un’abitudine, anche partendo da cifre piccole. Non elimina il rischio: se il mercato scende, scende anche il valore del PAC. Occhio alle commissioni fisse, che sugli importi piccoli pesano molto.',
  },
  {
    id: 'crypto',
    topic: 'Crypto',
    keywords: [
      'crypto',
      'cripto',
      'bitcoin',
      'btc ',
      'ethereum',
      'blockchain',
      'stablecoin',
      'nft',
      'altcoin',
      'wallet',
    ],
    answer:
      'Le crypto sono attività digitali basate su blockchain, come Bitcoin ed Ethereum. 🎢 Sono estremamente volatili: in passato hanno perso anche più del 70% dai loro massimi. La maggior parte non produce utili né cedole, quindi il prezzo dipende soprattutto da quanto altri sono disposti a pagare. Nell’UE il regolamento MiCA richiede alle piattaforme un’autorizzazione: verificala sempre prima di usarne una. In Italia, dal 2026, le plusvalenze sulle crypto sono tassate di norma al 33%. Se valuti di investirci, usa solo soldi che puoi permetterti di perdere del tutto.',
  },
];
