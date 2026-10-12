/**
 * Italian copy of the lesson player. The partner (the student's socia) is the voice: she says
 * whether an answer is right and why, and she is the one you ask. "Ripasso" is reserved for the
 * review a resident brings a week after a building is finished, so in-lesson recall questions are
 * "Ricordi?" and a replayed lesson is done "di nuovo".
 */
import type { StepTag } from '@/content/types';
import { formatNumber } from '@/lib/format';

/** Small grey label on top of a graded step (no emoji: the gallery stays black and white). */
export const TAGS: Record<StepTag, { label: string }> = {
  indovina: { label: 'Indovina' },
  'mettiti-alla-prova': { label: 'Mettiti alla prova' },
  scenario: { label: 'Scenario' },
  ripasso: { label: 'Ricordi?' },
};

export const COPY = {
  a11y: {
    close: 'Chiudi lezione',
    report: 'Segnala un problema',
    share: 'Condividi lezione',
    progress: 'Avanzamento lezione',
    fab: 'Chiedi all’assistente di spiegarti questo passaggio',
    fabExpanded: 'Spiegami il perché della risposta',
    ask: (partner: string) => `Chiedi a ${partner} di spiegarti questo passaggio`,
  },
  cta: {
    continue: 'Continua',
    refill: 'Ricarica le vite',
  },
  practiceTag: 'Di nuovo',
  fabPill: 'Spiegami il perché',
  resumed: 'Si riparte da dove avevi lasciato',
  practiceStart: 'Lezione già fatta: la rifai per allenarti',

  feedback: {
    correctTitle: 'Giusto',
    /** The partner's line when a step has no explanation; they rotate so it never feels canned. */
    praise: ['Proprio così.', 'Esatto, hai centrato il punto.', 'Così si fa.', 'Giusto, e non era scontato.', 'Sì. Te lo ricorderai.'],
    firstTry: 'Al primo colpo',
    combo: (n: number) => `${n} giuste di fila`,
    afterMistake: 'Ce l’hai fatta',
    wrongTitle: 'Non proprio',
    wrongMessage: 'Riprova: sbagliare qui non costa niente.',
    close: 'Riprova',
    lifeLost: (left: number) => (left === 0 ? 'Hai perso l’ultima vita' : `Hai perso una vita · ne restano ${left}`),
    noExtraLife: 'Per questa domanda non perdi altre vite',
    practice: 'Ripasso: sbagliare qui non costa niente',
    unlimited: 'Vite illimitate: nessuna vita persa',
    pairLifeLost: 'Coppia sbagliata: hai perso una vita',
  },

  exit: {
    title: 'Vuoi uscire?',
    message: 'Il cantiere resta com’è: quando torni riprendi da qui.',
    stay: 'Continua',
    leave: 'Esci',
  },

  report: {
    title: 'Segnala un problema',
    subtitle: 'Cosa non ti torna in questo passaggio? Il team lo controllerà al più presto.',
    reasons: [
      { id: 'wrong-answer', label: 'La risposta corretta mi sembra sbagliata', emoji: '🤔' },
      { id: 'typo', label: 'C’è un errore nel testo', emoji: '✏️' },
      { id: 'unclear', label: 'Il contenuto non è chiaro', emoji: '🌫️' },
    ],
    send: 'Invia',
    thanks: 'Grazie per la segnalazione',
  },

  share: {
    title: 'Feen',
    message: (chapterTitle: string) =>
      `Sto imparando “${chapterTitle}”: ogni lezione è un mattone del mio borgo. Provala anche tu!`,
    copied: 'Messaggio copiato: incollalo dove vuoi',
    failed: 'Condivisione non riuscita. Riprova tra poco.',
  },

  coinsInfo: (coins: number) =>
    `Hai ${formatNumber(coins)} mattoni. Ogni lezione finita ne aggiunge qualcuno.`,

  outOfLives: {
    title: 'Hai finito le vite',
    message: (countdown: string | null) =>
      countdown ? `La prossima vita arriva tra ${countdown}.` : 'Ricarica le vite per continuare.',
    cta: 'Ricarica',
  },

  steps: {
    trueLabel: 'Vero',
    falseLabel: 'Falso',
    fillHint: 'Scegli la parola giusta',
    matchHint: 'Tocca un termine, poi il suo significato',
    orderHint: 'Tocca le frasi nell’ordine giusto',
    orderSlot: (n: number) => `Posizione ${n}`,
    orderEmpty: 'Tocca una frase qui sotto',
    orderBankDone: 'Tutto a posto! Tocca una frase per spostarla.',
    definitionOverline: 'Definizione',
    blankA11y: 'Spazio da completare',
  },

  explain: {
    assistantName: 'Assistente Feen',
    context: 'Ti rispondo su questo passaggio',
    hintOpener: 'Ecco un indizio per ragionarci 💡',
    hintClosing: 'Prova a rispondere: dopo ti spiego tutto nel dettaglio.',
    suggestions: {
      simpler: 'Spiegamelo più semplice',
      example: 'Fammi un esempio',
      answer: 'Qual è la risposta giusta?',
    },
    simplerOpener: 'In parole semplici 👇',
    simplerFallback: 'Questo passaggio prepara le prossime domande: rileggilo con calma.',
    answerIs: (label: string) =>
      label.includes('\n') ? `Quindi la risposta giusta è:\n${label}` : `Quindi la risposta giusta è **${label}**.`,
    exampleOpener: 'Proviamo a vederla da un’altra angolazione 👇',
    send: 'Invia',
    suggestionsA11y: 'Domande suggerite',
  },

  completion: {
    titleFirst: 'Capitolo completato!',
    titleReplay: 'Lezione completata!',
    /** "Pozzo costruito." · "Il Granaio cresce." · "Lezione rifatta.": one italic word each. */
    builtWord: 'costruito.',
    growWord: 'cresce.',
    replayStart: 'Lezione ',
    replayWord: 'rifatta.',
    partnerBuilt: 'Un edificio in più nel borgo, e una cosa in più che sai fare.',
    partnerGrow: (left: number) =>
      left === 1 ? 'Ancora una lezione e l’edificio è finito.' : `Ancora ${left} lezioni e l’edificio è finito.`,
    partnerReplay: 'Rifarla serve: è così che le cose restano.',
    overline: (level: number | undefined) => (level ? `Livello ${level} · completato` : 'Completato'),
    xp: 'XP',
    kiwi: 'Mattoni',
    residentsLabel: 'Abitanti',
    firstTryLabel: 'Al primo colpo',
    firstTryValue: (right: number, total: number) => `${right}/${total}`,
    accuracy: 'Precisione',
    perfect: 'Nessun errore',
    replayNote: 'Lezione già fatta: niente mattoni questa volta',
    streakNewTitle: (_days: number) => 'Giorno rispettato: arriva un abitante',
    streakFirst: 'Il primo abitante del borgo. Ne arriva uno per ogni giorno del patto.',
    streakGrow: 'Un abitante in più nel borgo. Un giorno saltato non manda via nessuno.',
    streakKeptTitle: (_days: number) => 'Oggi hai già fatto la tua parte',
    streakKept: 'L’abitante di oggi è già arrivato.',
    residents: (n: number) => (n === 1 ? '1 abitante nel borgo' : `${n} abitanti nel borgo`),
    built: (name: string) => `${name}: costruito!`,
    builtBody: 'Tutte le lezioni di questo edificio sono fatte. Restano qui, puoi rifarle quando vuoi.',
    nextOverline: 'Prossima lezione',
    nextOverlineDone: 'Prossima lezione',
    nextMinutes: (minutes: number) => `Circa ${minutes} minuti`,
    nextIn: (building: string) => `Prossima lezione ${building}`,
    courseDoneTitle: 'Percorso completato! 🏆',
    courseDoneMessage: 'Hai finito tutti i capitoli. Condividi il tuo traguardo dal percorso!',
    milestone: (title: string) => `Traguardo sbloccato: ${title}. Riscattalo in Home!`,
    cta: 'Torna al borgo',
    review: 'Rivedi le risposte',
    reviewTitle: 'Le tue risposte',
    reviewFirstTry: 'Giusta al primo colpo',
    reviewRetry: 'Giusta dopo un errore',
    reviewAnswer: 'Risposta',
  },

  error: {
    title: 'Lezione non trovata',
    message: 'Questa lezione non esiste o non è più disponibile. Torna al borgo e scegline un’altra.',
    back: 'Torna al borgo',
  },
  locked: {
    title: 'Capitolo bloccato',
    message: 'Completa i capitoli precedenti per sbloccare questa lezione.',
    back: 'Vai al borgo',
    devOpen: 'Apri comunque (dev)',
  },
} as const;
