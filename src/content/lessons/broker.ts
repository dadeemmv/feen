import type { Lesson } from '../types';

/** Livello 4 · Capitolo 11. */
export const brokerLesson: Lesson = {
  id: 'broker',
  steps: [
    {
      id: 'broker-intermediario',
      type: 'choice',
      tag: 'indovina',
      illustration: 'broker-phone',
      emoji: '🏦',
      prompt: 'Vuoi comprare un ETF quotato in Borsa. Attraverso chi devi passare?',
      options: [
        { id: 'broker', label: 'Un intermediario (broker)' },
        { id: 'exchange', label: 'Direttamente dalla Borsa' },
        { id: 'issuer', label: 'L’azienda che lo emette' },
      ],
      correctOptionId: 'broker',
      explanation:
        'I privati non possono operare direttamente in Borsa: serve un intermediario autorizzato, come un broker online o una banca. Il broker riceve il tuo ordine e lo esegue sul mercato per conto tuo.',
    },
    {
      id: 'broker-definizione',
      type: 'definition',
      emoji: '🏦',
      title: 'L’intermediario',
      lead: 'Tra te e il mercato c’è sempre qualcuno.',
      term: 'Broker',
      definition:
        'Un intermediario autorizzato che esegue i tuoi ordini di acquisto e vendita sui mercati e custodisce i tuoi titoli. In cambio può chiederti delle commissioni.',
      tone: 'sky',
      explanation:
        'Il broker è il ponte tra te e la Borsa. Oggi la maggior parte dei broker funziona tramite app o sito, ma anche la tua banca può svolgere questo ruolo.',
    },
    {
      id: 'broker-sicurezza',
      type: 'info',
      emoji: '🔐',
      title: 'I tuoi titoli sono al sicuro?',
      lead: 'Cosa succede se il broker fallisce?',
      rows: [
        {
          emoji: '🗂️',
          text: 'I titoli che compri sono tuoi e restano separati dal patrimonio del broker.',
          tone: 'mint',
        },
        {
          emoji: '🛡️',
          text: 'Se un intermediario italiano fallisce e non ti restituisce titoli o soldi, il Fondo Nazionale di Garanzia ti rimborsa fino a 20.000€.',
          tone: 'sky',
        },
        {
          emoji: '🏦',
          text: 'La liquidità in banca è protetta fino a 100.000€ per depositante, in ogni banca, dai fondi di garanzia dei depositi.',
          tone: 'butter',
        },
      ],
      explanation:
        'La separazione patrimoniale fa sì che i creditori del broker non possano prendere i tuoi titoli. I fondi di garanzia intervengono nei casi, rari, in cui qualcosa va storto. Nessun fondo, però, ti rimborsa le perdite dovute all’andamento dei mercati.',
    },
    {
      id: 'broker-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'broker-phone',
      statement: 'Per offrirti servizi di investimento, un sito o un’app non ha bisogno di alcuna autorizzazione.',
      answer: false,
      explanation:
        'In Italia chi offre servizi di investimento deve essere autorizzato e vigilato: CONSOB e Banca d’Italia pubblicano gli elenchi. La CONSOB, inoltre, fa oscurare regolarmente i siti abusivi: se un intermediario non compare nei registri, stai alla larga.',
    },
    {
      id: 'broker-banca',
      type: 'info',
      emoji: '🧾',
      title: 'Broker o banca?',
      lead: 'Ci sono due strade principali per investire:',
      rows: [
        {
          emoji: '🏛️',
          text: 'Banca tradizionale: comoda se sei già cliente, ma spesso con commissioni più alte.',
          tone: 'sky',
        },
        {
          emoji: '📱',
          text: 'Broker online: di solito più economico, e gestisci tutto da app o sito.',
          tone: 'mint',
        },
        {
          emoji: '⚖️',
          text: 'In entrambi i casi valgono le stesse regole: autorizzazione e vigilanza.',
          tone: 'butter',
        },
      ],
      explanation:
        'Non esiste una strada giusta per tutti. La differenza principale sta nei costi e nel servizio: più consulenza di solito significa commissioni più alte.',
    },
    {
      id: 'broker-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni termine al suo significato',
      pairs: [
        { id: 'broker', left: 'Broker', right: 'Esegue i tuoi ordini' },
        { id: 'consob', left: 'CONSOB', right: 'Vigila sui mercati italiani' },
        { id: 'fee', left: 'Commissione', right: 'Costo di un’operazione' },
      ],
      explanation:
        'Il broker esegue gli ordini, la CONSOB controlla che le regole del mercato siano rispettate e la commissione è il prezzo del servizio. Conoscere i ruoli ti aiuta a riconoscere chi è affidabile.',
    },
    {
      id: 'broker-truffa',
      type: 'choice',
      tag: 'scenario',
      emoji: '🕵️',
      prompt:
        'Su Instagram un “broker” ti promette +20% al mese e ti chiede di pagare in crypto. Cosa fai?',
      options: [
        { id: 'test', label: 'Invio una piccola somma di prova' },
        { id: 'discount', label: 'Chiedo uno sconto' },
        { id: 'check', label: 'Non pago e controllo i registri CONSOB' },
      ],
      correctOptionId: 'check',
      explanation:
        'Guadagni altissimi promessi, contatti sui social e pagamenti in crypto sono segnali tipici di truffa: nessuno può garantirti +20% al mese. Verifica sempre sul sito della CONSOB che l’intermediario sia autorizzato, e occhio ai nomi copiati da società vere. Nel dubbio, non inviare denaro, nemmeno una piccola somma “di prova”.',
    },
    {
      id: 'broker-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'In Italia la vigilanza sulla trasparenza dei mercati finanziari spetta soprattutto alla ___.',
      options: [
        { id: 'consob', label: 'CONSOB' },
        { id: 'tax', label: 'Agenzia delle Entrate' },
        { id: 'chamber', label: 'Camera di commercio' },
      ],
      correctOptionId: 'consob',
      explanation:
        'La CONSOB vigila sui mercati e sugli intermediari per proteggere gli investitori, mentre la Banca d’Italia si occupa soprattutto della stabilità delle banche. L’Agenzia delle Entrate, invece, si occupa di tasse.',
    },
    {
      id: 'broker-sintesi',
      type: 'info',
      emoji: '🧠',
      title: 'In sintesi',
      lead: 'Per investire in Borsa serve sempre un intermediario autorizzato.',
      rows: [
        { emoji: '🗂️', text: 'I titoli che compri restano tuoi, separati dal patrimonio del broker.', tone: 'mint' },
        { emoji: '🔎', text: 'Prima di tutto, verifica che sia autorizzato e vigilato.', tone: 'sky' },
        { emoji: '🔍', text: 'Prossimo capitolo: come scegliere il broker adatto a te.', tone: 'butter' },
      ],
      explanation:
        'Ora sai cos’è un broker e come sono protetti i tuoi soldi. Nel prossimo capitolo vedi i criteri per sceglierne uno.',
    },
  ],
};
