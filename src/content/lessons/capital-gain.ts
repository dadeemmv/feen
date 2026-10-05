import type { Lesson } from '../types';

/** Livello 2 · Capitolo 6. Maths: 10 × (26€ − 20€) = 60€ lordi; 26% = 15,60€; netto 44,40€. */
export const capitalGainLesson: Lesson = {
  id: 'capital-gain',
  steps: [
    {
      id: 'gain-percentuale',
      type: 'choice',
      tag: 'indovina',
      illustration: 'stock-chart',
      emoji: '🚀',
      prompt: 'Compri un’azione a 20€ e la rivendi a 26€. Qual è il tuo guadagno in percentuale?',
      options: [
        { id: 'six', label: '6%' },
        { id: 'twenty-six', label: '26%' },
        { id: 'thirty', label: '30%' },
      ],
      correctOptionId: 'thirty',
      explanation:
        'Il guadagno è di 6€ su 20€ investiti. 6 diviso 20 fa 0,30, cioè il 30%. La percentuale si calcola sempre rispetto al prezzo di partenza, non a quello di arrivo.',
    },
    {
      id: 'gain-definizione',
      type: 'definition',
      emoji: '🚀',
      title: 'Guadagnare dalla differenza',
      lead: 'Compri a un prezzo, rivendi a un altro.',
      term: 'Capital gain',
      definition:
        'Il guadagno che ottieni vendendo un investimento a un prezzo più alto di quello pagato. In italiano si chiama plusvalenza; se vendi in perdita, è una minusvalenza.',
      tone: 'lilac',
      explanation:
        'Tutto nasce dalla differenza tra prezzo di vendita e prezzo di acquisto. Se è positiva hai una plusvalenza (capital gain), se è negativa una minusvalenza.',
    },
    {
      id: 'gain-realizzato',
      type: 'info',
      emoji: '🧾',
      title: 'Sulla carta o realizzato?',
      lead: 'Finché non vendi, il guadagno è solo “sulla carta”.',
      rows: [
        {
          emoji: '📄',
          text: 'Se l’azione sale ma non la vendi, il tuo guadagno è potenziale: può ancora cambiare.',
          tone: 'sky',
        },
        {
          emoji: '✅',
          text: 'Diventa realizzato quando vendi: di norma è in quel momento che, in Italia, paghi le tasse.',
          tone: 'mint',
        },
        { emoji: '↩️', text: 'Vale anche per le perdite: diventano definitive solo quando vendi.', tone: 'blush' },
      ],
      explanation:
        'Un guadagno non realizzato può sparire se il prezzo scende di nuovo. Solo vendendo lo trasformi in soldi veri.',
    },
    {
      id: 'gain-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'coins-stack',
      statement: 'In Italia sul capital gain delle azioni si paga di norma un’imposta del 26%.',
      answer: true,
      explanation:
        'Esatto: per le persone fisiche i guadagni su azioni ed ETF sono tassati di norma al 26%. Fanno eccezione i titoli di Stato italiani e di molti Paesi esteri, tassati al 12,5%.',
    },
    {
      id: 'gain-conti',
      type: 'info',
      emoji: '🧮',
      title: 'Facciamo due conti',
      lead: 'Compri 10 azioni a 20€ e le rivendi a 26€.',
      rows: [
        { emoji: '🛒', text: 'Spesa: 10 × 20€ = 200€. Incasso: 10 × 26€ = 260€.', tone: 'sky' },
        { emoji: '📈', text: 'Guadagno lordo: 260€ − 200€ = 60€.', tone: 'butter' },
        { emoji: '🧾', text: 'Tasse al 26%: 15,60€. Guadagno netto: 44,40€, commissioni escluse.', tone: 'mint' },
      ],
      explanation:
        'Le tasse si pagano solo sul guadagno, non su tutto l’incasso. Le commissioni pagate riducono ulteriormente il guadagno effettivo.',
    },
    {
      id: 'gain-scenario',
      type: 'choice',
      tag: 'scenario',
      emoji: '📉',
      prompt: 'Hai comprato un’azione a 40€. Ora vale 30€, ma non l’hai venduta. Cosa è vero?',
      options: [
        { id: 'realized', label: 'Hai già perso 10€ per sempre' },
        { id: 'potential', label: 'La perdita non è ancora realizzata' },
        { id: 'tax', label: 'Paghi tasse sulla perdita' },
      ],
      correctOptionId: 'potential',
      explanation:
        'Finché non vendi, la perdita non è realizzata e il prezzo può ancora salire o scendere. Non vuol dire che non esista: se vendessi oggi incasseresti 30€. Sulle perdite, in ogni caso, non si pagano tasse.',
    },
    {
      id: 'gain-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Se vendi un’azione a meno di quanto l’hai pagata, realizzi una ___.',
      options: [
        { id: 'gain', label: 'plusvalenza' },
        { id: 'coupon', label: 'cedola' },
        { id: 'loss', label: 'minusvalenza' },
      ],
      correctOptionId: 'loss',
      explanation:
        'Vendere sotto il prezzo di acquisto genera una minusvalenza, cioè una perdita realizzata. In Italia puoi usarla per ridurre le tasse su plusvalenze dello stesso anno o dei quattro successivi, ma non sui guadagni da ETF.',
    },
    {
      id: 'gain-ordine',
      type: 'order',
      tag: 'ripasso',
      prompt: 'Metti in ordine le fasi di un capital gain',
      items: [
        { id: 'buy', label: 'Compri l’azione' },
        { id: 'rise', label: 'Il prezzo sale' },
        { id: 'sell', label: 'Vendi l’azione' },
        { id: 'tax', label: 'Paghi le tasse sul guadagno' },
      ],
      explanation:
        'Il guadagno diventa realizzato solo con la vendita, ed è lì che nasce l’imposta. Con il regime amministrato è il broker a trattenere le tasse al momento della vendita.',
    },
    {
      id: 'gain-sintesi',
      type: 'info',
      emoji: '🧠',
      title: 'In sintesi',
      lead: 'Capital gain = prezzo di vendita − prezzo di acquisto.',
      rows: [
        { emoji: '✅', text: 'Si realizza e si tassa quando vendi, non quando il prezzo sale.', tone: 'mint' },
        {
          emoji: '🧾',
          text: 'Aliquota di norma: 26%. Titoli di Stato italiani e di molti altri Paesi: 12,5%.',
          tone: 'butter',
        },
        {
          emoji: '📜',
          text: 'Prossimo capitolo: le obbligazioni, dove presti soldi invece di diventare socio.',
          tone: 'sky',
        },
      ],
      explanation:
        'Ora conosci i due modi di guadagnare con le azioni: dividendi e capital gain. Le obbligazioni funzionano in modo molto diverso.',
    },
  ],
};
