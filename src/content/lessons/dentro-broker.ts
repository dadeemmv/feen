import type { Lesson } from '../types';

/** Livello 4 · Capitolo 13 (ultimo). Maths: PAC 50€ × 12 mesi = 600€. */
export const dentroBrokerLesson: Lesson = {
  id: 'dentro-broker',
  steps: [
    {
      id: 'dentro-isin',
      type: 'choice',
      tag: 'indovina',
      illustration: 'broker-phone',
      emoji: '🔎',
      prompt: 'Ogni ETF ha un codice unico di 12 caratteri che lo identifica. Come si chiama?',
      options: [
        { id: 'isin', label: 'ISIN' },
        { id: 'iban', label: 'IBAN' },
        { id: 'pin', label: 'PIN' },
      ],
      correctOptionId: 'isin',
      explanation:
        'L’ISIN identifica in modo univoco un titolo in tutto il mondo: due lettere del Paese, nove caratteri e una cifra di controllo. Cercare per ISIN evita di confondere prodotti con nomi simili. L’IBAN, invece, identifica un conto bancario.',
    },
    {
      id: 'dentro-schermate',
      type: 'info',
      emoji: '🗺️',
      title: 'Le schermate principali',
      lead: 'Quasi tutti i broker hanno queste sezioni:',
      rows: [
        { emoji: '💼', text: 'Portafoglio: cosa possiedi e quanto vale oggi.', tone: 'mint' },
        { emoji: '🔍', text: 'Ricerca: trovi titoli ed ETF per nome, ticker o ISIN.', tone: 'sky' },
        { emoji: '🧾', text: 'Ordini: acquisti e vendite, eseguiti o in attesa.', tone: 'butter' },
        { emoji: '💶', text: 'Liquidità: i soldi sul conto, pronti da investire.', tone: 'lilac' },
      ],
      explanation:
        'Il ticker è la sigla breve con cui un titolo è quotato in Borsa, mentre l’ISIN è il suo codice internazionale. Il portafoglio mostra il valore aggiornato di ciò che possiedi.',
    },
    {
      id: 'dentro-ordine-limite',
      type: 'definition',
      emoji: '📝',
      title: 'Il tipo di ordine',
      lead: 'Quando compri, scegli anche come eseguire l’ordine.',
      term: 'Ordine limite',
      definition:
        'Fissi il prezzo massimo a cui vuoi comprare, o il minimo a cui vuoi vendere. Se il mercato non ci arriva, l’ordine non viene eseguito.',
      tone: 'lilac',
      explanation:
        'L’ordine limite ti dà il controllo sul prezzo. In cambio rinunci alla certezza che l’ordine venga eseguito.',
    },
    {
      id: 'dentro-mercato-limite',
      type: 'info',
      emoji: '⚡',
      title: 'Al mercato o con limite?',
      lead: 'I due tipi di ordine più comuni:',
      rows: [
        {
          emoji: '⚡',
          text: 'Al mercato: eseguito subito al miglior prezzo disponibile, che non conosci in anticipo.',
          tone: 'sky',
        },
        {
          emoji: '🎯',
          text: 'Con limite: decidi tu il prezzo, ma l’ordine potrebbe non essere eseguito.',
          tone: 'mint',
        },
        {
          emoji: '💡',
          text: 'Il limite evita sorprese sul prezzo, soprattutto su titoli poco scambiati.',
          tone: 'butter',
        },
      ],
      explanation:
        'L’ordine al mercato privilegia la velocità, quello con limite privilegia il prezzo. Sui titoli con pochi scambi il prezzo di esecuzione al mercato può essere lontano da quello che vedi.',
    },
    {
      id: 'dentro-scenario-limite',
      type: 'choice',
      tag: 'scenario',
      emoji: '📝',
      prompt: 'Un ETF quota 100,50€. Inserisci un ordine limite di acquisto a 100€. Cosa succede?',
      options: [
        { id: 'now', label: 'Compri subito a 100,50€' },
        { id: 'limit', label: 'Compri solo a 100€ o meno' },
        { id: 'cancel', label: 'L’ordine viene annullato' },
      ],
      correctOptionId: 'limit',
      explanation:
        'Con un limite di acquisto a 100€ compri solo a quel prezzo o a uno inferiore. Se il prezzo resta sopra, l’ordine rimane in attesa fino alla scadenza che hai scelto. Controlli il prezzo, ma non hai la certezza di comprare.',
    },
    {
      id: 'dentro-spread',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'broker-phone',
      statement:
        'Lo spread è la differenza tra il prezzo a cui puoi comprare un titolo e quello a cui puoi venderlo.',
      answer: true,
      explanation:
        'È vero: l’ask è il prezzo più basso a cui qualcuno vende, il bid il più alto a cui qualcuno compra. La differenza, lo spread, è un costo nascosto: sui titoli molto scambiati è piccolo, su quelli poco scambiati può essere ampio. Non confonderlo con lo spread BTP-Bund dei telegiornali, che confronta due rendimenti.',
    },
    {
      id: 'dentro-pac',
      type: 'definition',
      emoji: '🔁',
      title: 'Un po’ alla volta',
      lead: 'Non serve avere tanti soldi per iniziare.',
      term: 'PAC',
      definition:
        'Piano di Accumulo del Capitale: investi una cifra fissa a intervalli regolari, per esempio 50€ al mese, spesso in automatico.',
      tone: 'mint',
      explanation:
        'Con un PAC compri a prezzi diversi nel tempo, così non devi indovinare il momento giusto per entrare. Non elimina il rischio, ma rende l’investimento un’abitudine costante.',
    },
    {
      id: 'dentro-pac-fill',
      type: 'fill',
      tag: 'scenario',
      prompt: 'Completa il calcolo',
      sentence: 'Con un PAC da 50€ al mese, in un anno investi in totale ___.',
      options: [
        { id: 'five-hundred', label: '500€' },
        { id: 'six-hundred', label: '600€' },
        { id: 'fifty', label: '50€' },
      ],
      correctOptionId: 'six-hundred',
      explanation:
        '50€ per 12 mesi fanno 600€ versati. Il valore del tuo investimento a fine anno potrà essere più alto o più basso, a seconda dell’andamento del mercato.',
    },
    {
      id: 'dentro-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Ripasso finale: collega ogni termine',
      pairs: [
        { id: 'isin', left: 'ISIN', right: 'Codice unico del titolo' },
        { id: 'limit', left: 'Ordine limite', right: 'Fissi tu il prezzo' },
        { id: 'spread', left: 'Spread', right: 'Differenza tra bid e ask' },
        { id: 'pac', left: 'PAC', right: 'Investire a rate regolari' },
      ],
      explanation:
        'Sono quattro parole che incontrerai spesso dentro un broker. Se le conosci, sai già leggere la maggior parte delle schermate.',
    },
    {
      id: 'dentro-traguardo',
      type: 'info',
      emoji: '🏆',
      title: 'Traguardo raggiunto!',
      lead: 'Hai completato il percorso: ora conosci le basi per il tuo primo investimento.',
      rows: [
        {
          emoji: '🧯',
          text: 'Prima di investire: fondo di emergenza, obiettivi chiari e un orizzonte lungo.',
          tone: 'mint',
        },
        {
          emoji: '🌱',
          text: 'Investi solo soldi che puoi permetterti di lasciare fermi per anni.',
          tone: 'sky',
        },
        {
          emoji: 'ℹ️',
          text: 'Finanz ti aiuta a capire, non ti dice cosa comprare: le scelte finali restano tue.',
          tone: 'butter',
        },
      ],
      explanation:
        'Il percorso ti ha dato gli strumenti per capire come funzionano gli investimenti. Prima di decidere, valuta sempre la tua situazione e, se serve, chiedi a un consulente finanziario iscritto all’albo OCF.',
    },
  ],
};
