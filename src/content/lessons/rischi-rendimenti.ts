import type { Lesson } from '../types';

/** Livello 1 · Capitolo 3. */
export const rischiRendimentiLesson: Lesson = {
  id: 'rischi-rendimenti',
  steps: [
    {
      id: 'rischi-offerta',
      type: 'choice',
      tag: 'indovina',
      illustration: 'risk-scale',
      emoji: '⚖️',
      prompt:
        'Un amico ti propone un investimento “sicuro al 100%” che rende il 30% al mese. Cosa ne pensi?',
      options: [
        { id: 'deal', label: 'Ottimo affare, entro subito' },
        { id: 'friend', label: 'Dipende da quanto è amico' },
        { id: 'alarm', label: 'È un segnale d’allarme' },
      ],
      correctOptionId: 'alarm',
      explanation:
        'Rendimenti altissimi e per giunta “garantiti” sono il segnale tipico di una truffa, come gli schemi Ponzi. Negli investimenti reali un rendimento più alto comporta sempre un rischio più alto. Se sembra troppo bello per essere vero, probabilmente non lo è.',
    },
    {
      id: 'rischi-scala',
      type: 'info',
      emoji: '📶',
      title: 'La scala del rischio',
      lead: 'Dal più tranquillo al più movimentato, in generale:',
      rows: [
        { emoji: '🏦', text: 'Conto deposito: rendimento basso, rischio molto basso.', tone: 'mint' },
        {
          emoji: '📜',
          text: 'Obbligazioni: rendimento medio-basso, rischio contenuto (dipende da chi le emette e dalla durata).',
          tone: 'sky',
        },
        { emoji: '🏢', text: 'Azioni: rendimento potenziale più alto, ma forti oscillazioni.', tone: 'butter' },
        { emoji: '🎢', text: 'Crypto: possono salire o crollare moltissimo in poco tempo.', tone: 'blush' },
      ],
      explanation:
        'Ogni strumento ha un diverso equilibrio tra rischio e rendimento atteso. È una scala indicativa: all’interno di ogni categoria ci sono prodotti più o meno rischiosi.',
    },
    {
      id: 'rischi-volatilita',
      type: 'definition',
      emoji: '🎢',
      title: 'Un nome da ricordare',
      lead: 'Quanto “balla” il prezzo di un investimento ha un nome.',
      term: 'Volatilità',
      definition:
        'Quanto il prezzo di un investimento oscilla nel tempo. Alta volatilità significa grandi salite, ma anche grandi discese.',
      tone: 'lilac',
      explanation:
        'La volatilità è una delle misure più usate del rischio. Un conto deposito ha volatilità quasi nulla, un’azione singola o una crypto possono averne moltissima.',
    },
    {
      id: 'rischi-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'risk-scale',
      statement: 'Esistono investimenti con rendimenti alti e nessun rischio.',
      answer: false,
      explanation:
        'Nella finanza nessuno regala niente: se un investimento promette di più, è perché chi investe si prende più rischio. Chi promette rendimenti alti senza rischi di solito sta nascondendo qualcosa.',
    },
    {
      id: 'rischi-tempo',
      type: 'info',
      emoji: '⏳',
      title: 'Il ruolo del tempo',
      lead: 'Il rischio dipende anche da quanto a lungo puoi restare investito.',
      rows: [
        {
          emoji: '🧭',
          text: 'Orizzonte temporale: per quanto tempo puoi lasciare investiti i soldi senza toccarli.',
          tone: 'sky',
        },
        {
          emoji: '📉',
          text: 'In un solo anno le azioni possono perdere il 30% o più: è successo, per esempio, nel 2008.',
          tone: 'blush',
        },
        {
          emoji: '📅',
          text: 'Su molti anni le Borse, nel loro insieme, hanno storicamente recuperato i cali. Ma il passato non garantisce il futuro.',
          tone: 'mint',
        },
      ],
      explanation:
        'Con un orizzonte lungo hai più tempo per aspettare che i mercati recuperino dopo un calo. Con un orizzonte breve, invece, potresti dover vendere proprio nel momento peggiore. Attenzione: una singola azione, a differenza del mercato nel suo insieme, può anche non riprendersi mai.',
    },
    {
      id: 'rischi-match',
      type: 'match',
      tag: 'ripasso',
      prompt: 'Collega ogni strumento al suo profilo tipico',
      pairs: [
        { id: 'deposit', left: 'Conto deposito', right: 'Rischio molto basso' },
        { id: 'bonds', left: 'Obbligazioni', right: 'Rischio contenuto' },
        { id: 'stocks', left: 'Azioni', right: 'Rischio più alto' },
      ],
      explanation:
        'In generale il conto deposito è lo strumento più tranquillo, le obbligazioni stanno in mezzo e le azioni sono le più volatili. Più sali nella scala, più aumentano sia il rendimento atteso sia le oscillazioni.',
    },
    {
      id: 'rischi-scenario',
      type: 'choice',
      tag: 'scenario',
      emoji: '🚗',
      prompt: 'Ti servono 5.000€ tra 6 mesi per l’anticipo di un’auto. Dove ha più senso tenerli?',
      options: [
        { id: 'single-stock', label: 'Nelle azioni di un’unica società' },
        { id: 'deposit', label: 'Su un conto deposito' },
        { id: 'crypto', label: 'In crypto' },
      ],
      correctOptionId: 'deposit',
      explanation:
        'Con un orizzonte così breve non avresti il tempo di recuperare un eventuale calo. Per soldi che ti servono a breve contano sicurezza e disponibilità, non il rendimento massimo. Se il conto è vincolato, scegli una scadenza che arrivi prima di quando ti servono.',
    },
    {
      id: 'rischi-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la regola d’oro',
      sentence: 'Più alto è il rendimento atteso, più alto è il ___.',
      options: [
        { id: 'sure', label: 'guadagno sicuro' },
        { id: 'risk', label: 'rischio' },
        { id: 'tax', label: 'numero di tasse' },
      ],
      correctOptionId: 'risk',
      explanation:
        'Rischio e rendimento viaggiano sempre in coppia. Per avere la possibilità di guadagnare di più devi accettare la possibilità di perdere di più, almeno nel breve periodo.',
    },
    {
      id: 'rischi-sintesi',
      type: 'info',
      emoji: '🧭',
      title: 'Prima di investire',
      lead: 'Fatti sempre queste tre domande:',
      rows: [
        { emoji: '😌', text: 'Quanto posso permettermi di perdere senza perdere il sonno?', tone: 'sky' },
        { emoji: '📅', text: 'Per quanto tempo posso lasciare investiti questi soldi?', tone: 'mint' },
        { emoji: '🔎', text: 'Capisco davvero dove sto mettendo i miei soldi?', tone: 'butter' },
      ],
      explanation:
        'Queste domande ti aiutano a capire il tuo profilo di rischio. Con questo capitolo completi il Livello 1: nel prossimo scopri come funzionano i mercati, partendo dalle azioni.',
    },
  ],
};
