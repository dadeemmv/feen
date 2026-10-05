/**
 * Italian copy of the lesson player (docs/PRODUCT_SPEC.md §3.10). Strings from the reference video
 * are kept verbatim except for two typos fixed on purpose: "perché" (not "perchè") and
 * "una lezione" (not "un lezione").
 */
import type { StepTag } from '@/content/types';
import type { Tone } from '@/components/ui';
import { countOf, formatNumber } from '@/lib/format';

export const TAGS: Record<StepTag, { label: string; emoji: string; tone: Tone }> = {
  indovina: { label: 'Indovina', emoji: '🎩', tone: 'butter' },
  'mettiti-alla-prova': { label: 'Mettiti alla prova', emoji: '🎩', tone: 'butter' },
  scenario: { label: 'Scenario', emoji: '🧭', tone: 'sky' },
  ripasso: { label: 'Ripasso', emoji: '🧠', tone: 'lilac' },
};

export const COPY = {
  a11y: {
    close: 'Chiudi lezione',
    report: 'Segnala un problema',
    share: 'Condividi lezione',
    progress: 'Avanzamento lezione',
    fab: 'Chiedi all’assistente di spiegarti questo passaggio',
    fabExpanded: 'Spiegami il perché della risposta',
  },
  cta: {
    continue: 'Continua',
    refill: 'Ricarica le vite',
  },
  practiceTag: 'Ripasso',
  fabPill: 'Spiegami il perché',
  resumed: 'Bentornato! Riprendi da dove eri rimasto',
  practiceStart: 'Ripasso: nessuna vita in gioco, metà XP',

  feedback: {
    correctTitle: 'Risposta corretta',
    /** First entry = the video's line; the others rotate so praise never feels canned. */
    praise: [
      'Complimenti, risposta esatta! Continua così!',
      'Esatto! Stai andando alla grande.',
      'Perfetto, hai centrato il punto!',
      'Ottimo lavoro, proprio così!',
      'Bravo! Un passo in più verso i tuoi obiettivi.',
    ],
    firstTry: 'Al primo colpo',
    combo: (n: number) => `${n} risposte giuste di fila`,
    afterMistake: 'Ce l’hai fatta!',
    wrongTitle: 'Risposta errata',
    wrongMessage: 'Ops, la tua risposta non è quella giusta.',
    close: 'Chiudi',
    lifeLost: (left: number) => (left === 0 ? 'Hai perso l’ultima vita' : `Hai perso una vita · ne restano ${left}`),
    noExtraLife: 'Per questa domanda non perdi altre vite',
    practice: 'Ripasso: nessuna vita in gioco',
    unlimited: 'Vite illimitate: nessuna vita persa',
    pairLifeLost: 'Coppia sbagliata: hai perso una vita',
  },

  exit: {
    title: 'Aspetta, non uscire!',
    message: 'Ti bastano meno di 5 minuti per completare una lezione, non mollare!',
    stay: 'Continua a studiare',
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
    title: 'Finanz',
    message: (chapterTitle: string) =>
      `Sto imparando “${chapterTitle}” su Finanz 🥝 Lezioni da 5 minuti per capire davvero i soldi. Provala anche tu!`,
    copied: 'Messaggio copiato: incollalo dove vuoi',
    failed: 'Condivisione non riuscita. Riprova tra poco.',
  },

  coinsInfo: (coins: number) =>
    `Hai ${formatNumber(coins)} Kiwi. Completa la lezione per guadagnarne altri!`,

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
    assistantName: 'Assistente Finanz',
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
    overline: (level: number | undefined) => (level ? `Livello ${level} · completato` : 'Completato'),
    xp: 'XP',
    kiwi: 'Kiwi',
    accuracy: 'Precisione',
    perfect: 'Perfetto! Nessun errore 🎯',
    replayNote: 'Ripasso: metà XP, nessun Kiwi',
    streakNewTitle: (days: number) => `Giorno ${days} di fila!`,
    streakFirst: 'Hai acceso la tua serie. Torna domani per tenerla viva!',
    streakGrow: 'La tua serie cresce: continua così!',
    streakKeptTitle: (days: number) => `Serie di ${countOf(days, 'day')}`,
    streakKept: 'Oggi hai già studiato: la tua serie è al sicuro.',
    nextOverline: 'Prossimo capitolo sbloccato',
    nextOverlineDone: 'Prossimo capitolo',
    nextMinutes: (minutes: number) => `Circa ${minutes} minuti`,
    courseDoneTitle: 'Percorso completato! 🏆',
    courseDoneMessage: 'Hai finito tutti i capitoli. Condividi il tuo traguardo dal percorso!',
    milestone: (title: string) => `Traguardo sbloccato: ${title}. Riscattalo in Home!`,
    cta: 'Continua',
    review: 'Rivedi le risposte',
    reviewTitle: 'Le tue risposte',
    reviewFirstTry: 'Giusta al primo colpo',
    reviewRetry: 'Giusta dopo un errore',
    reviewAnswer: 'Risposta',
  },

  error: {
    title: 'Lezione non trovata',
    message: 'Questa lezione non esiste o non è più disponibile. Torna al percorso e scegline un’altra.',
    back: 'Torna al percorso',
  },
  locked: {
    title: 'Capitolo bloccato',
    message: 'Completa i capitoli precedenti per sbloccare questa lezione.',
    back: 'Vai al percorso',
    devOpen: 'Apri comunque (dev)',
  },
} as const;
