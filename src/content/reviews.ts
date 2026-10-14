/**
 * The reviews brought by the residents (concept board §04, "Il ripasso arriva dagli abitanti"):
 * a week after a building is finished, one of its residents comes by with a real money problem on
 * its topic. Answer well and the building blooms; answer wrong and the partner explains, the
 * resident comes back a few days later with another problem, and nothing is lost.
 *
 * Each building has its resident (a role of the village, not a person's name) and three problems,
 * asked one per visit in order. They only ask what the building's lessons teach. Drafts written
 * for 14–19 year olds: to be reviewed with the same fact-check as the lessons before release.
 */
import type { BuildingId } from './village';

export type Resident = {
  /** Who comes by, lower case with the article: "il pescatore". */
  who: string;
  /** "Aiutalo", "Aiutala". */
  pronoun: 'lo' | 'la';
};

export type ReviewProblem = {
  id: string;
  /** The resident's words, in first person. */
  ask: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  /** The partner says why, right or wrong. */
  why: string;
  /** The resident's thanks after a right answer. */
  thanks: string;
};

export type ReviewSet = { resident: Resident; problems: readonly ReviewProblem[] };

export const REVIEWS: Partial<Record<BuildingId, ReviewSet>> = {
  mercato: {
    resident: { who: 'la fruttivendola', pronoun: 'la' },
    problems: [
      {
        id: 'mercato-abbonamenti',
        ask: 'Ho tre abbonamenti da 5,99€ al mese: musica, film e un gioco. Sono pochi spicci, no? Quanto mi costano in un anno?',
        options: [
          { id: 'month', label: 'Circa 18€' },
          { id: 'year', label: 'Circa 216€' },
          { id: 'one', label: 'Circa 72€' },
        ],
        correctOptionId: 'year',
        why: 'Tre abbonamenti da 5,99€ fanno quasi 18€ al mese, cioè circa 216€ in un anno. Le spese piccole e automatiche sono le più invisibili: ogni tanto conviene chiedersi se le usi davvero tutte.',
        thanks: '216€? Stasera ne disdico uno.',
      },
      {
        id: 'mercato-dove-vanno',
        ask: 'A fine mese non mi resta mai niente e non capisco dove finiscono i soldi. Da dove comincio?',
        options: [
          { id: 'track', label: 'Per una settimana segno ogni spesa, anche la più piccola' },
          { id: 'earn', label: 'Cerco di guadagnare di più, così il problema sparisce' },
          { id: 'stop', label: 'Per un mese non compro più niente' },
        ],
        correctOptionId: 'track',
        why: 'Prima di cambiare qualcosa devi vedere dove vanno davvero i soldi. Una settimana di spese segnate fa saltare fuori quelle che non ricordi di aver deciso. Tagliare tutto di colpo dura poco, e guadagnare di più non basta se i soldi continuano a sparire.',
        thanks: 'Una settimana di appunti: comincio da domattina.',
      },
      {
        id: 'mercato-prima-te',
        ask: 'Quando mi arrivano dei soldi li spendo un po’ alla volta, e a fine mese da parte non resta niente. Come faccio?',
        options: [
          { id: 'first', label: 'Appena arrivano ne metto da parte un po’, poi spendo il resto' },
          { id: 'last', label: 'Metto da parte quello che resta a fine mese, se resta qualcosa' },
          { id: 'wait', label: 'Aspetto un mese tranquillo, in cui spendo meno del solito' },
        ],
        correctOptionId: 'first',
        why: 'Si chiama pagare prima se stessi: appena arrivano i soldi metti da parte una quota, anche piccola, e il resto lo dividi tra le spese. Se aspetti la fine del mese, di solito non avanza niente.',
        thanks: 'Prima la mia parte, poi il resto. Facile da ricordare.',
      },
    ],
  },

  granaio: {
    resident: { who: 'il fornaio', pronoun: 'lo' },
    problems: [
      {
        id: 'granaio-cassetto',
        ask: 'Tengo 1.000€ in un cassetto da tre anni. Il numero è sempre quello, quindi valgono come il primo giorno, giusto?',
        options: [
          { id: 'same', label: 'Sì: il numero è lo stesso, quindi valgono uguale' },
          { id: 'more', label: 'Valgono di più, perché sono rimasti al sicuro nel cassetto' },
          { id: 'less', label: 'No: i prezzi sono saliti, con quei soldi compro meno' },
        ],
        correctOptionId: 'less',
        why: 'Il numero non cambia, ma i prezzi salgono: con gli stessi 1.000€ oggi compri meno cose di tre anni fa. È l’inflazione, che rosicchia il potere d’acquisto dei soldi fermi, come i topi nel grano.',
        thanks: 'Ecco chi mi mangiava il grano.',
      },
      {
        id: 'granaio-conto',
        ask: 'Quest’anno i prezzi sono saliti del 3% e il mio conto mi ha dato l’1%. Sono più ricco o più povero di un anno fa?',
        options: [
          { id: 'richer', label: 'Più ricco: sul conto ho l’1% in più di prima' },
          { id: 'poorer', label: 'Più povero: i prezzi sono saliti più dei miei soldi' },
          { id: 'same', label: 'Uguale: l’1% e il 3% sono piccoli, si annullano' },
        ],
        correctOptionId: 'poorer',
        why: 'Conta il confronto con i prezzi. Se i tuoi soldi crescono dell’1% e i prezzi del 3%, con quei soldi compri circa il 2% di cose in meno. Per non perdere potere d’acquisto, i risparmi dovrebbero crescere almeno quanto i prezzi.',
        thanks: 'Allora guardo anche i prezzi, non solo il conto.',
      },
      {
        id: 'granaio-pizza',
        ask: 'La pizza che pagavo 5€ adesso costa più di 7€. Che cosa hanno perso i miei soldi?',
        options: [
          { id: 'nothing', label: 'Niente: i miei 5€ sono sempre 5€' },
          { id: 'power', label: 'Potere d’acquisto: con gli stessi euro compro meno' },
          { id: 'interest', label: 'Gli interessi che il conto mi avrebbe dato' },
        ],
        correctOptionId: 'power',
        why: 'Il potere d’acquisto è la quantità di cose che puoi comprare con i tuoi soldi. Quando i prezzi salgono, come quello della pizza, con gli stessi euro compri meno: il numero resta uguale, il potere d’acquisto scende.',
        thanks: 'Potere d’acquisto. Me lo scrivo sul sacco della farina.',
      },
    ],
  },

  pozzo: {
    resident: { who: 'la contadina', pronoun: 'la' },
    problems: [
      {
        id: 'pozzo-concerto',
        ask: 'Ho messo da parte dei soldi per gli imprevisti. Sabato c’è un concerto e il biglietto costa 60€. Posso usare quelli?',
        options: [
          { id: 'no', label: 'No: quei soldi sono solo per gli imprevisti' },
          { id: 'yes', label: 'Sì: sono soldi miei, li uso come voglio' },
          { id: 'half', label: 'Sì, ne uso metà e il resto lo lascio lì' },
        ],
        correctOptionId: 'no',
        why: 'Il fondo emergenze è come il pozzo: serve quando arriva la siccità. Se lo usi per un desiderio, il giorno dell’imprevisto lo trovi vuoto. Per il concerto conviene un cesto a parte: due cesti, non uno.',
        thanks: 'Il concerto va in un altro cesto. Il pozzo non si tocca.',
      },
      {
        id: 'pozzo-dove',
        ask: 'Voglio tenere da parte un fondo per gli imprevisti. Dove lo metto?',
        options: [
          { id: 'risky', label: 'In qualcosa che può salire molto, così intanto cresce' },
          { id: 'friend', label: 'Lo presto a un amico, così non rischio di spenderlo' },
          { id: 'safe', label: 'Su un conto o in un salvadanaio: sicuro e pronto' },
        ],
        correctOptionId: 'safe',
        why: 'Un imprevisto non aspetta: i soldi del fondo devono esserci tutti e subito, anche nel giorno peggiore. Per questo non vanno in investimenti che possono scendere, né in mani che non controlli.',
        thanks: 'Sicuri e a portata di mano, come l’acqua del pozzo.',
      },
      {
        id: 'pozzo-di-nuovo',
        ask: 'Ho usato il fondo emergenze per riparare la bici. Adesso è vuoto. E ora?',
        options: [
          { id: 'debt', label: 'Il prossimo imprevisto lo pagherò a rate' },
          { id: 'done', label: 'Ormai è finito: il fondo è servito' },
          { id: 'refill', label: 'Ricomincio a riempirlo, un po’ alla volta' },
        ],
        correctOptionId: 'refill',
        why: 'Il pozzo si usa e poi si riempie di nuovo. Dopo un imprevisto riprendi a mettere da parte appena arrivano soldi, anche poco: così il prossimo non ti trova a secco.',
        thanks: 'Da sabato ricomincio a riempirlo.',
      },
    ],
  },

  faro: {
    resident: { who: 'il pescatore', pronoun: 'lo' },
    problems: [
      {
        id: 'faro-codice',
        ask: 'Mi scrive la banca: vogliono il codice che mi è appena arrivato per SMS. Glielo do?',
        options: [
          { id: 'looks', label: 'Sì, se il messaggio sembra proprio della banca' },
          { id: 'never', label: 'No: chi chiede quel codice vuole entrare al posto mio' },
          { id: 'call', label: 'Solo se mi richiamano da un numero che sembra della banca' },
        ],
        correctOptionId: 'never',
        why: 'Il codice che arriva per SMS serve a confermare che sei tu. Chi te lo chiede, anche usando il nome della banca, vuole entrare al posto tuo. Nel dubbio non rispondere e controlla dall’app ufficiale.',
        thanks: 'Il codice me lo tengo, e il messaggio lo cancello.',
      },
      {
        id: 'faro-amico',
        ask: 'Un amico mi scrive su Instagram: «Sono nei guai, mi fai una ricarica da 50€? Te li ridò domani». Che faccio?',
        options: [
          { id: 'check', label: 'Prima lo sento in un altro modo, per esempio lo chiamo' },
          { id: 'pay', label: 'Gliela faccio subito: è un amico, e domani me li ridà' },
          { id: 'half', label: 'Gli mando 25€, così se è una truffa perdo meno' },
        ],
        correctOptionId: 'check',
        why: 'I profili degli amici possono essere rubati. Fretta e soldi chiesti con una ricarica sono due segnali di truffa. Prima di pagare chiamalo, o chiedigli qualcosa che sa solo lui.',
        thanks: 'L’ho chiamato: era al mare, il profilo gliel’avevano rubato.',
      },
      {
        id: 'faro-scarpe',
        ask: 'Su un sito trovo le scarpe che volevo a 25€ invece di 150€, ma l’offerta dura solo un’ora. Le compro?',
        options: [
          { id: 'stop', label: 'Aspetto: fretta e prezzo troppo basso sono segnali di truffa' },
          { id: 'buy', label: 'Le compro subito: un’occasione così non torna più' },
          { id: 'card', label: 'Le compro, ma pago con la carta di un amico per sicurezza' },
        ],
        correctOptionId: 'stop',
        why: 'Un prezzo troppo bello per essere vero e un conto alla rovescia sono i segnali tipici dei negozi falsi. Aiuta la regola delle 24 ore: un’occasione vera c’è anche domani, una truffa ha fretta.',
        thanks: 'Ho aspettato un giorno: il sito era sparito.',
      },
    ],
  },

  mura: {
    resident: { who: 'la guardia', pronoun: 'la' },
    problems: [
      {
        id: 'mura-motorino',
        ask: 'Ho appena preso il motorino. Per andare in strada mi serve per forza un’assicurazione?',
        options: [
          { id: 'rc', label: 'Sì, la RC: è obbligatoria per circolare' },
          { id: 'none', label: 'No: l’assicurazione è facoltativa, la fa chi vuole' },
          { id: 'theft', label: 'Solo quella contro il furto, se lo lascio in strada' },
        ],
        correctOptionId: 'rc',
        why: 'La RC, la responsabilità civile, paga i danni che potresti fare agli altri ed è obbligatoria per circolare. Furto e incendio invece sono facoltative. E il casco protegge te: servono tutti e due.',
        thanks: 'RC fatta e casco in testa. Si parte.',
      },
      {
        id: 'mura-franchigia',
        ask: 'Il mio telefono è assicurato con una franchigia di 50€. Si rompe lo schermo e la riparazione costa 200€. Quanto pago io?',
        options: [
          { id: 'zero', label: 'Niente: paga tutto l’assicurazione' },
          { id: 'fifty', label: '50€: la franchigia resta a carico mio' },
          { id: 'all', label: '200€: l’assicurazione non c’entra' },
        ],
        correctOptionId: 'fifty',
        why: 'La franchigia è la parte del danno che resta comunque a carico tuo. Su una riparazione da 200€ con una franchigia di 50€, tu paghi 50€ e l’assicurazione i restanti 150€, fino al massimale.',
        thanks: 'Ecco cosa voleva dire quella parola nel contratto.',
      },
      {
        id: 'mura-cuffie',
        ask: 'Mi propongono di assicurare le cuffie da 30€ per 4€ al mese. Mi conviene?',
        options: [
          { id: 'always', label: 'Sì: assicurare tutto quello che ho è sempre meglio' },
          { id: 'no', label: 'No: in un anno pagherei 48€, più delle cuffie' },
          { id: 'first', label: 'Sì, ma solo per il primo anno, poi la disdico' },
        ],
        correctOptionId: 'no',
        why: 'Prima di assicurare qualcosa chiediti: se si rompe, riesco a ripagarlo da solo? Per le cose che costano poco i premi superano presto il loro valore. L’assicurazione serve per i danni che da solo non potresti pagare.',
        thanks: 'Le cuffie le tratto bene, e i 4€ al mese me li tengo.',
      },
    ],
  },

  frutteto: {
    resident: { who: 'il giardiniere', pronoun: 'lo' },
    problems: [
      {
        id: 'frutteto-due-anni',
        ask: 'Metto 2.000€ al 5% all’anno e lascio lì gli interessi. Dopo due anni quanto ho?',
        options: [
          { id: 'simple', label: '2.200€' },
          { id: 'one', label: '2.100€' },
          { id: 'compound', label: '2.205€' },
        ],
        correctOptionId: 'compound',
        why: 'Il primo anno guadagni 100€. Il secondo il 5% si calcola su 2.100€, quindi guadagni 105€: gli interessi producono altri interessi. È l’interesse composto, la palla di neve che rotola.',
        thanks: 'Quei 5€ in più sono il primo frutto. Il resto arriva col tempo.',
      },
      {
        id: 'frutteto-presto',
        ask: 'Voglio far crescere i miei risparmi con l’interesse composto. Cosa conta di più?',
        options: [
          { id: 'big', label: 'Aspettare di avere una cifra grande' },
          { id: 'withdraw', label: 'Ritirare gli interessi ogni anno' },
          { id: 'early', label: 'Cominciare presto, anche con poco' },
        ],
        correctOptionId: 'early',
        why: 'Con l’interesse composto il tempo fa gran parte del lavoro: più anni lasci crescere i soldi, più a lungo gli interessi producono altri interessi. Se li ritiri ogni anno, la palla di neve si ferma.',
        thanks: 'Allora pianto adesso, anche un albero piccolo.',
      },
      {
        id: 'frutteto-72',
        ask: 'Con la regola del 72: se i miei risparmi rendono il 3% all’anno, in quanti anni circa raddoppiano?',
        options: [
          { id: 'twenty-four', label: 'Circa 24 anni' },
          { id: 'three', label: 'Circa 3 anni' },
          { id: 'sixty-nine', label: 'Circa 69 anni' },
        ],
        correctOptionId: 'twenty-four',
        why: 'Dividi 72 per il rendimento annuo: 72 ÷ 3 = 24. È una stima veloce di quanti anni servono perché un capitale raddoppi con l’interesse composto.',
        thanks: 'Ventiquattro anni. Il frutteto vuole pazienza.',
      },
    ],
  },

  torre: {
    resident: { who: 'la vedetta', pronoun: 'la' },
    problems: [
      {
        id: 'torre-sei-mesi',
        ask: 'Tra sei mesi mi servono 1.000€ per la patente. Intanto li investo in azioni, così crescono?',
        options: [
          { id: 'stocks', label: 'Sì: in sei mesi le azioni di solito salgono' },
          { id: 'safe', label: 'No: in sei mesi potrebbero anche valere meno' },
          { id: 'one', label: 'Sì, ma solo in un’azienda famosa e sicura' },
        ],
        correctOptionId: 'safe',
        why: 'In pochi mesi le azioni possono anche scendere parecchio. Se i soldi ti servono a breve, l’orizzonte temporale è corto: meglio un posto con rischio molto basso, come un conto deposito. Le azioni hanno senso per soldi che puoi lasciare fermi per tanti anni.',
        thanks: 'Prima la patente. Le azioni quando avrò tanti anni davanti.',
      },
      {
        id: 'torre-uova',
        ask: 'Ho 1.000€ da investire per tanti anni. Li metto tutti nell’azienda che mi piace di più, o in un ETF su tutto il mondo?',
        options: [
          { id: 'one', label: 'Tutti nell’azienda che mi piace: la conosco bene' },
          { id: 'etf', label: 'In un ETF ampio: tante aziende, se una va male pesa poco' },
          { id: 'split', label: 'Metà nell’azienda e metà in crypto, così diversifico' },
        ],
        correctOptionId: 'etf',
        why: 'Mettere tutte le uova in un paniere è la scelta più rischiosa: se quell’azienda va male, perdi quasi tutto. Un ETF su un indice ampio compra tante aziende di tanti Paesi insieme. Il rischio di mercato resta, ma non dipendi da una sola.',
        thanks: 'Uova in tanti panieri. Lo dice anche mia nonna.',
      },
      {
        id: 'torre-senza-rischio',
        ask: 'Un’amica mi propone un investimento che rende il 15% all’anno «senza nessun rischio». Che ne penso?',
        options: [
          { id: 'great', label: 'Ottimo: rende tanto e non rischio niente' },
          { id: 'many', label: 'Va bene: se lo fanno in tanti, sarà sicuro' },
          { id: 'rule', label: 'Non torna: rendimenti alti vanno con rischi alti' },
        ],
        correctOptionId: 'rule',
        why: 'È la regola d’oro: rendimenti alti vanno sempre insieme a rischi alti. Chi promette tanto e «senza rischio» non ti sta dicendo tutto, oppure è una truffa.',
        thanks: 'Ho chiesto i dettagli: nessuno sapeva rispondere. Meglio così.',
      },
    ],
  },
};

/** The resident and the problems of a building; undefined when it has none (no lessons yet). */
export const getReviewSet = (id: BuildingId): ReviewSet | undefined => REVIEWS[id];

export const hasReviews = (id: BuildingId): boolean => (REVIEWS[id]?.problems.length ?? 0) > 0;
