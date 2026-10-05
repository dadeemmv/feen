import type { Lesson } from '../types';

/** Livello 4 · Capitolo 12. Maths: 12 ordini × 5€ = 60€ (5% di 1.200€); × 1€ = 12€ (1%). */
export const scegliBrokerLesson: Lesson = {
  id: 'scegli-broker',
  steps: [
    {
      id: 'scegli-primo-controllo',
      type: 'choice',
      tag: 'indovina',
      illustration: 'broker-phone',
      emoji: '🔍',
      prompt: 'Stai scegliendo un broker. Qual è la prima cosa da controllare?',
      options: [
        { id: 'authorized', label: 'Che sia autorizzato e vigilato' },
        { id: 'colors', label: 'Che l’app abbia bei colori' },
        { id: 'followers', label: 'Quanti follower ha sui social' },
      ],
      correctOptionId: 'authorized',
      explanation:
        'La sicurezza viene prima di tutto: un broker deve essere autorizzato e vigilato da un’autorità come CONSOB, Banca d’Italia o un’altra autorità europea. Design e popolarità non dicono nulla su quanto siano protetti i tuoi soldi.',
    },
    {
      id: 'scegli-checklist',
      type: 'info',
      emoji: '✅',
      title: 'La checklist',
      lead: 'Cinque cose da confrontare prima di aprire un conto:',
      rows: [
        {
          emoji: '🔐',
          text: 'Autorizzazione: deve essere vigilato da CONSOB, Banca d’Italia o un’autorità europea.',
          tone: 'mint',
        },
        { emoji: '💸', text: 'Costi: commissioni per ordine, di custodia e di cambio valuta.', tone: 'sky' },
        { emoji: '🧺', text: 'Prodotti: ha gli ETF che ti interessano? Permette i PAC?', tone: 'butter' },
        { emoji: '🧾', text: 'Regime fiscale: amministrato o dichiarativo, lo vediamo tra poco.', tone: 'lilac' },
        { emoji: '📱', text: 'App e assistenza: facile da usare, con supporto in italiano.', tone: 'blush' },
      ],
      explanation:
        'Questi criteri ti aiutano a confrontare i broker in modo oggettivo. Il peso di ciascuno dipende da come pensi di investire.',
    },
    {
      id: 'scegli-regime',
      type: 'definition',
      emoji: '🧾',
      title: 'Chi pensa alle tasse?',
      lead: 'In Italia esistono due regimi fiscali principali.',
      term: 'Regime amministrato',
      definition:
        'Il broker calcola e versa le tasse al posto tuo su vendite, dividendi e cedole. Con il regime dichiarativo, invece, sei tu a indicare i guadagni nella dichiarazione dei redditi.',
      tone: 'lilac',
      explanation:
        'Nel regime amministrato il broker fa da sostituto d’imposta: trattiene le tasse dai tuoi guadagni e le versa allo Stato, e tu non devi dichiarare nulla. Nel dichiarativo paghi le tasse sui guadagni con la dichiarazione dei redditi, ma hai più adempimenti da seguire, spesso con un commercialista.',
    },
    {
      id: 'scegli-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'broker-phone',
      statement: 'Il broker con le commissioni più basse è sempre la scelta migliore.',
      answer: false,
      explanation:
        'Le commissioni contano, ma non sono tutto: sicurezza, regime fiscale, prodotti disponibili e assistenza pesano altrettanto. Un broker economico ma non autorizzato, o poco adatto a te, può costarti molto di più.',
    },
    {
      id: 'scegli-commissioni',
      type: 'choice',
      tag: 'scenario',
      emoji: '🧮',
      prompt:
        'Ogni mese fai un ordine da 100€. Il broker A chiede 5€ a ordine, il broker B 1€. Quanto spendi di commissioni in un anno con A?',
      options: [
        { id: 'five', label: '5€' },
        { id: 'twelve', label: '12€' },
        { id: 'sixty', label: '60€' },
      ],
      correctOptionId: 'sixty',
      explanation:
        '5€ per 12 ordini fanno 60€, cioè il 5% dei 1.200€ investiti: tantissimo. Con il broker B spenderesti 12€, l’1%. Sui piccoli importi ricorrenti le commissioni fisse pesano molto.',
    },
    {
      id: 'scegli-estero',
      type: 'info',
      emoji: '🌍',
      title: 'Italiano o estero?',
      lead: 'Anche molti broker esteri operano in Italia in modo regolare.',
      rows: [
        {
          emoji: '🇮🇹',
          text: 'Broker italiano: di solito offre il regime amministrato, e le tasse le versa lui per te.',
          tone: 'mint',
        },
        {
          emoji: '🌐',
          text: 'Broker estero: spesso regime dichiarativo, e dichiari tu redditi e investimenti esteri.',
          tone: 'sky',
        },
        {
          emoji: '🤔',
          text: 'Nessuna delle due scelte è sbagliata: dipende da quanto vuoi occupartene tu.',
          tone: 'butter',
        },
      ],
      explanation:
        'Alcuni broker esteri offrono comunque il regime amministrato ai clienti italiani. Controlla sempre questa voce prima di aprire il conto.',
    },
    {
      id: 'scegli-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni voce al suo significato',
      pairs: [
        { id: 'custody', left: 'Custodia', right: 'Costo per tenere i titoli' },
        { id: 'managed', left: 'Regime amministrato', right: 'Il broker versa le tasse per te' },
        { id: 'declared', left: 'Regime dichiarativo', right: 'Dichiari e paghi tu le tasse' },
      ],
      explanation:
        'La commissione di custodia è un costo periodico per tenere i titoli sul conto, e non tutti i broker la applicano. I due regimi fiscali cambiano chi si occupa di calcolare e versare le tasse.',
    },
    {
      id: 'scegli-ordine',
      type: 'order',
      tag: 'ripasso',
      prompt: 'Metti in ordine i passaggi per scegliere un broker, partendo da ciò che ti serve',
      items: [
        { id: 'goal', label: 'Decidi cosa vuoi comprare' },
        { id: 'filter', label: 'Cerca broker autorizzati' },
        { id: 'compare', label: 'Confronta costi e servizi' },
        { id: 'open', label: 'Apri il conto' },
      ],
      explanation:
        'Prima capisci di cosa hai bisogno, poi scarti chi non è autorizzato e solo dopo confronti costi e servizi tra i broker rimasti. Aprire il conto è l’ultimo passo, non il primo.',
    },
    {
      id: 'scegli-sintesi',
      type: 'info',
      emoji: '🧠',
      title: 'In sintesi',
      lead: 'Sicurezza prima di tutto, poi costi e comodità.',
      rows: [
        { emoji: '🧩', text: 'Non esiste il broker migliore per tutti: dipende da come investi.', tone: 'mint' },
        {
          emoji: 'ℹ️',
          text: 'Finanz non consiglia broker specifici: questi sono criteri per scegliere, non raccomandazioni.',
          tone: 'butter',
        },
        { emoji: '📱', text: 'Ultimo capitolo: entriamo dentro l’app di un broker.', tone: 'sky' },
      ],
      explanation:
        'Con questa checklist puoi valutare qualsiasi broker in autonomia. Nell’ultimo capitolo vedi come si usa davvero, dal portafoglio al primo ordine.',
    },
  ],
};
