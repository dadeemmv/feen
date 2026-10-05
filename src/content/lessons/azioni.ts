import type { Lesson } from '../types';

/** Livello 2 · Capitolo 4. */
export const azioniLesson: Lesson = {
  id: 'azioni',
  steps: [
    {
      id: 'azioni-cosa-possiedi',
      type: 'choice',
      tag: 'indovina',
      illustration: 'stock-chart',
      emoji: '🏢',
      prompt: 'Compri 1 azione di un’azienda. Cosa possiedi davvero?',
      options: [
        { id: 'share', label: 'Una piccola parte dell’azienda' },
        { id: 'loan', label: 'Un prestito all’azienda' },
        { id: 'voucher', label: 'Un buono sconto sui prodotti' },
      ],
      correctOptionId: 'share',
      explanation:
        'Un’azione è una quota di proprietà: diventi socio dell’azienda, anche se piccolissimo. Il prestito invece è un’obbligazione, che vedrai più avanti. Da socio partecipi sia ai successi sia alle difficoltà dell’azienda.',
    },
    {
      id: 'azioni-definizione',
      type: 'definition',
      emoji: '🧩',
      title: 'Un pezzo di azienda',
      lead: 'Il capitale di una società è diviso in tante piccole parti uguali.',
      term: 'Azione',
      definition:
        'Una quota del capitale di una società. Chi la possiede è un azionista: un piccolo proprietario dell’azienda.',
      tone: 'lilac',
      explanation:
        'Con un’azione hai diritto a una parte degli utili che la società decide di distribuire e, di solito, a votare in assemblea. Più azioni hai, più grande è la tua quota.',
    },
    {
      id: 'azioni-borsa',
      type: 'info',
      emoji: '🏛️',
      title: 'Dove si comprano',
      lead: 'Le azioni delle società quotate si scambiano in Borsa.',
      rows: [
        {
          emoji: '🇮🇹',
          text: 'In Italia il mercato principale è Borsa Italiana, a Milano, oggi parte del gruppo Euronext.',
          tone: 'sky',
        },
        {
          emoji: '📊',
          text: 'Il prezzo cambia di continuo in base a domanda e offerta: se in tanti vogliono comprare e pochi vendere, sale.',
          tone: 'mint',
        },
        {
          emoji: '📱',
          text: 'Per comprarle ti serve un intermediario, come un broker online o la tua banca.',
          tone: 'butter',
        },
      ],
      explanation:
        'La Borsa è il mercato dove chi vuole comprare incontra chi vuole vendere. Il prezzo di un’azione è semplicemente l’ultimo prezzo a cui qualcuno l’ha scambiata.',
    },
    {
      id: 'azioni-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'stock-chart',
      statement:
        'Se compri azioni di un’azienda con i tuoi soldi, puoi perdere più di quanto hai investito.',
      answer: false,
      explanation:
        'Se compri azioni con i tuoi soldi, senza prestiti né leva, al massimo perdi quanto hai investito: succede se l’azienda fallisce e il prezzo va a zero. Con strumenti a leva o vendite allo scoperto, invece, le perdite possono essere più grandi.',
    },
    {
      id: 'azioni-guadagni',
      type: 'info',
      emoji: '📈',
      title: 'Come si guadagna',
      lead: 'Con le azioni puoi guadagnare in due modi:',
      rows: [
        {
          emoji: '💶',
          text: 'Dividendi: una parte degli utili che l’azienda può decidere di distribuire ai soci.',
          tone: 'mint',
        },
        {
          emoji: '🚀',
          text: 'Capital gain: vendi l’azione a un prezzo più alto di quello a cui l’hai comprata.',
          tone: 'sky',
        },
        { emoji: '⚠️', text: 'Nessuno dei due è garantito: il prezzo può anche scendere.', tone: 'blush' },
      ],
      explanation:
        'Dividendi e capital gain sono le due fonti di guadagno di un azionista. Nei prossimi due capitoli li vedrai uno per uno.',
    },
    {
      id: 'azioni-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni parola al suo significato',
      pairs: [
        { id: 'share', left: 'Azione', right: 'Quota di un’azienda' },
        { id: 'holder', left: 'Azionista', right: 'Chi possiede azioni' },
        { id: 'exchange', left: 'Borsa', right: 'Dove si scambiano le azioni' },
      ],
      explanation:
        'L’azione è la quota, l’azionista è chi la possiede e la Borsa è il mercato dove si compra e si vende. Sono le tre parole base per capire i mercati.',
    },
    {
      id: 'azioni-quota',
      type: 'choice',
      tag: 'scenario',
      emoji: '🧮',
      prompt: 'Un’azienda è divisa in 1.000.000 di azioni e tu ne hai 1.000. Che quota possiedi?',
      options: [
        { id: 'one', label: '1%' },
        { id: 'tenth', label: '0,1%' },
        { id: 'ten', label: '10%' },
      ],
      correctOptionId: 'tenth',
      explanation:
        '1.000 diviso 1.000.000 fa 0,001, cioè lo 0,1%. Ogni azione vale la stessa frazione della società, quindi la tua quota è semplicemente le tue azioni diviso il totale.',
    },
    {
      id: 'azioni-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Il prezzo di un’azione si forma in base a domanda e ___.',
      options: [
        { id: 'luck', label: 'fortuna' },
        { id: 'ads', label: 'pubblicità' },
        { id: 'supply', label: 'offerta' },
      ],
      correctOptionId: 'supply',
      explanation:
        'Se molti vogliono comprare e pochi vendere, il prezzo sale; se succede il contrario, scende. Domanda e offerta riflettono ciò che gli investitori si aspettano dal futuro dell’azienda.',
    },
    {
      id: 'azioni-sintesi',
      type: 'info',
      emoji: '🔭',
      title: 'In sintesi',
      lead: 'Con un’azione diventi socio di un’azienda.',
      rows: [
        { emoji: '🤝', text: 'Condividi successi e difficoltà dell’azienda, in proporzione alla tua quota.', tone: 'mint' },
        { emoji: '🎢', text: 'Il prezzo oscilla ogni giorno: nel breve periodo può scendere parecchio.', tone: 'blush' },
        { emoji: '💶', text: 'Prossimo capitolo: i dividendi, ovvero come le aziende condividono gli utili.', tone: 'sky' },
      ],
      explanation:
        'Le azioni sono lo strumento con il rendimento potenziale più alto tra quelli tradizionali, ma anche con le oscillazioni più forti.',
    },
  ],
};
