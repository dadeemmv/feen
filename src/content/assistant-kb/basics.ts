import type { AssistantKbEntry } from '../extra-types';

/** Money basics: inflation, compounding, risk, time horizon, saving and safety nets. */
export const BASICS_KB: AssistantKbEntry[] = [
  {
    id: 'inflazione',
    topic: 'Inflazione',
    chapterId: 'inflazione',
    keywords: [
      'inflazion',
      'potere d acquisto',
      'potere di acquisto',
      'aumento dei prezzi',
      'prezzi salgono',
      'prezzi aumentano',
      'carovita',
      'costo della vita',
    ],
    answer:
      'L’inflazione è l’aumento generale dei prezzi nel tempo. 📈 Se i prezzi salgono del 3% in un anno, 1.000€ fermi sul conto comprano quanto circa 971€ di oggi. Il numero sul conto resta uguale, ma il tuo potere d’acquisto scende. La BCE punta a un’inflazione del 2% annuo nel medio periodo. Per non perdere potere d’acquisto, i risparmi dovrebbero crescere almeno quanto i prezzi, al netto di tasse e costi.',
  },
  {
    id: 'interesse-composto',
    topic: 'Interesse composto',
    chapterId: 'interesse-composto',
    keywords: [
      'interesse compost',
      'interessi compost',
      'capitalizzazion',
      'palla di neve',
      'regola del 72',
      'interessi sugli interessi',
      'interesse semplice',
    ],
    answer:
      'Con l’interesse composto guadagni interessi anche sugli interessi già maturati. ❄️ Esempio: 1.000€ al 5% annuo diventano 1.050€ dopo un anno e 1.102,50€ dopo due. Dopo 10 anni sono circa 1.629€, contro i 1.500€ dell’interesse semplice. Il fattore chiave è il tempo: prima inizi, più l’effetto palla di neve lavora per te. Trucco veloce, la regola del 72: dividi 72 per il rendimento annuo in percentuale e stimi in quanti anni raddoppia il capitale, per esempio circa 14 anni al 5%.',
  },
  {
    id: 'rischio-rendimento',
    topic: 'Rischio e rendimento',
    chapterId: 'rischi-rendimenti',
    keywords: [
      'rischio e rendimento',
      'rischi e rendimenti',
      'rischio rendimento',
      'rischios',
      'rischio',
      'rischi ',
      'rendimenti alti',
      'rendimento alto',
      'senza rischi',
      'profilo di rischio',
    ],
    answer:
      'Rischio e rendimento vanno a braccetto: per puntare a guadagni potenziali più alti devi accettare più possibilità di perdere. ⚖️ In generale, dal più tranquillo al più movimentato:\n• Conto deposito\n• Obbligazioni\n• Azioni\n• Crypto\nAttenzione: più rischio non garantisce più rendimento. Nessun investimento offre rendimenti alti senza rischi: se qualcuno te lo promette, diffida.',
  },
  {
    id: 'volatilita',
    topic: 'Volatilità',
    chapterId: 'rischi-rendimenti',
    keywords: ['volatil', 'oscill', 'crollo', 'crolla', 'ribass', 'mercato scende', 'mercati scendono', 'calo '],
    answer:
      'La volatilità misura quanto il prezzo di un investimento sale e scende nel tempo. 🎢 Le azioni possono perdere il 30% o più in un solo anno, come è successo nel 2008. Su orizzonti lunghi i mercati azionari ampi e diversificati hanno storicamente recuperato i cali, a volte dopo molti anni, ma il passato non garantisce il futuro. Per questo in azioni si investono di solito soldi che non servono a breve, ben diversificati.',
  },
  {
    id: 'orizzonte-temporale',
    topic: 'Orizzonte temporale',
    chapterId: 'rischi-rendimenti',
    keywords: [
      'orizzonte',
      'lungo periodo',
      'lungo termine',
      'breve periodo',
      'breve termine',
      'per quanto tempo',
    ],
    answer:
      'L’orizzonte temporale è per quanto tempo puoi lasciare investiti i soldi senza toccarli. ⏳ Più è lungo, più tempo hai per recuperare eventuali cali. Un’indicazione molto diffusa:\n• Pochi anni: strumenti poco volatili, come conti deposito o titoli a breve scadenza\n• Molti anni, per esempio oltre 10: c’è più spazio per le azioni, ben diversificate\nDefinirlo è il primo passo prima di scegliere qualsiasi investimento.',
  },
  {
    id: 'tassi-interesse',
    topic: 'Tassi di interesse',
    keywords: ['tassi', 'tasso di interesse', 'tassi di interesse', 'bce ', 'banca centrale', 'euribor'],
    answer:
      'I tassi di interesse sono il “prezzo” del denaro: quanto costa prenderlo in prestito e quanto rende prestarlo. 🏛️ Nell’area euro la BCE fissa i tassi di riferimento per mantenere l’inflazione vicina al 2%. Quando i tassi salgono, i nuovi prestiti e i mutui a tasso variabile, legati all’Euribor, costano di più, mentre conti deposito e nuove obbligazioni rendono di più. Il prezzo delle obbligazioni a tasso fisso già emesse, invece, scende. Quando i tassi scendono succede il contrario.',
  },
  {
    id: 'risparmio-budget',
    topic: 'Budget e risparmio',
    keywords: [
      'risparmi',
      'budget',
      '50 30 20',
      'quanto dovrei',
      'mettere da parte',
      'metto da parte',
      'spese',
      'stipendio',
      'bilancio familiare',
    ],
    answer:
      'Non esiste una cifra giusta per tutti, ma la regola del 50/30/20 è un buon punto di partenza. 💰\n• 50% delle entrate nette per le necessità: casa, bollette, spesa\n• 30% per i desideri: uscite, viaggi, hobby\n• 20% per risparmio e investimenti\nSe il 20% ti sembra troppo, inizia dal 5% e aumenta poco alla volta. Il trucco: metti da parte i soldi a inizio mese, invece di risparmiare solo ciò che avanza.',
  },
  {
    id: 'fondo-emergenza',
    topic: 'Fondo di emergenza',
    keywords: [
      'emergenz',
      'imprevist',
      'cuscinetto',
      'fondo di sicurezza',
      'fondo di riserva',
      'soldi da parte',
    ],
    answer:
      'Il fondo di emergenza è una riserva di liquidità per gli imprevisti: una spesa medica, un guasto all’auto, un periodo senza lavoro. 🧯 Di solito si suggerisce di accumulare da 3 a 6 mesi di spese essenziali. Va tenuto in un posto sicuro e subito disponibile, come il conto corrente o un conto deposito svincolabile. Averlo prima di investire ti evita di dover vendere nel momento sbagliato.',
  },
  {
    id: 'conto-deposito',
    topic: 'Conto deposito',
    keywords: [
      'conto deposito',
      'conti deposito',
      'vincolat',
      'svincolat',
      'liquidita',
      'conto corrente',
      'fitd',
      'garanzia dei depositi',
      'tutela dei depositi',
      'depositi garantit',
      'soldi in banca',
      'banca fallisce',
    ],
    answer:
      'Il conto deposito remunera i tuoi risparmi con un tasso di interesse. 🏦 Può essere libero, con i soldi sempre disponibili, o vincolato: di solito rende di più, ma prima della scadenza non puoi ritirare i soldi, oppure puoi farlo solo con una penalizzazione. Come il conto corrente, è coperto dai fondi di garanzia dei depositi fino a 100.000€ per depositante, in ogni banca. Sugli interessi si paga il 26% e c’è un’imposta di bollo dello 0,20% annuo. È adatto ai soldi che ti servono a breve e, se è libero, al fondo di emergenza.',
  },
  {
    id: 'debiti',
    topic: 'Debiti e finanziamenti',
    keywords: [
      'debit',
      'prestit',
      'mutuo',
      'revolving',
      'finanziament',
      'taeg',
      'tan ',
      'carta di credito',
      'buy now pay later',
    ],
    answer:
      'Non tutti i debiti sono uguali: conta soprattutto quanto ti costano. 💳 Il TAN è solo il tasso di interesse, mentre il TAEG indica il costo totale annuo, incluse le spese obbligatorie: usa il TAEG per confrontare le offerte. Le carte revolving hanno spesso TAEG intorno o sopra il 15%. In genere estinguere un debito caro rende più di quasi ogni investimento: evitare un interesse del 15% equivale a un guadagno sicuro del 15%.',
  },
  {
    id: 'fondo-pensione',
    topic: 'Fondo pensione',
    keywords: ['pension', 'fondo pensione', 'fondi pensione', 'previdenza', 'tfr '],
    answer:
      'Il fondo pensione è uno strumento di previdenza complementare: investi oggi per integrare la pensione pubblica domani. 👵 In Italia ha vantaggi fiscali: i contributi sono deducibili dal reddito entro un limite annuo e i rendimenti sono tassati in modo agevolato. Se sei un lavoratore dipendente, puoi versarci anche il TFR. In cambio i soldi restano vincolati fino alla pensione, salvo alcuni casi di anticipo previsti dalla legge. Le regole possono cambiare: verifica sempre quelle aggiornate.',
  },
  {
    id: 'come-iniziare',
    topic: 'Come iniziare a investire',
    chapterId: 'inflazione',
    priority: -1,
    keywords: [
      'iniziare a investire',
      'inizio a investire',
      'cominciare a investire',
      'primo investimento',
      'da dove parto',
      'da dove inizio',
      'da dove comincio',
      'principiante',
      'come si investe',
      'come investire',
      'voglio investire',
      'investire',
    ],
    answer:
      'Ottima domanda! 🌱 Un percorso tipico, passo dopo passo:\n• Costruisci un fondo di emergenza\n• Estingui i debiti più costosi\n• Definisci obiettivi e orizzonte temporale\n• Scegli strumenti diversificati e a basso costo\n• Investi con costanza, per esempio con un PAC\nIl percorso “Fai il tuo primo investimento” ti accompagna in ogni passaggio.',
  },
];
