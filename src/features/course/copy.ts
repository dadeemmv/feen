/**
 * Italian copy of the course path (docs/PRODUCT_SPEC.md §3.9). Video strings are kept verbatim
 * ("INIZIA DA QUI", "RIPRENDI DA QUI", "TRAGUARDO RAGGIUNTO", "Condividi con gli amici").
 */
import type { CourseTier } from '@/content/types';
import { formatChapters, formatFraction, formatPercent } from '@/lib/format';

export const COURSE_COPY = {
  back: 'Indietro',
  tier: { BASE: 'Base', INTERMEDIO: 'Intermedio', AVANZATO: 'Avanzato' } satisfies Record<CourseTier, string>,
  chaptersDone: (done: number, total: number) => `${done} di ${formatChapters(total)}`,
  chaptersFraction: formatFraction,
  chapters: formatChapters,
  minutes: (minutes: number) => `≈ ${minutes} min`,
  xp: (xp: number) => `${xp} XP`,
  percent: formatPercent,
  progressLabel: 'Avanzamento del percorso',
  coverLabel: (title: string) => `Copertina del percorso ${title}`,

  // Compact sticky strip
  compactHint: 'Torna al capitolo da fare',
  compactLabel: (title: string, done: number, total: number) => `${title}, ${done} di ${formatChapters(total)}`,

  // Overview disclosure
  overviewTitle: 'Cosa imparerai',
  overviewSubtitle: (levels: number, chapters: number) => `${levels} livelli · ${formatChapters(chapters)}`,
  overviewExpand: 'Mostra cosa imparerai',
  overviewCollapse: 'Nascondi cosa imparerai',

  // Path
  pathLabel: 'Percorso a capitoli',
  level: (n: number) => `Livello ${n}`,
  levelProgress: formatFraction,
  levelDone: 'Livello completato',
  levelLocked: 'Livello bloccato',
  levelA11y: (n: number, title: string, done: number, total: number) =>
    `Livello ${n}, ${title}, ${done} di ${formatChapters(total)} completati`,
  startHere: 'Inizia da qui',
  resumeHere: 'Riprendi da qui',
  lockedToast: (title: string) => `Completa prima “${title}”`,
  nodeLabel: (title: string, position: number, total: number, state: string) =>
    `${title}, capitolo ${position} di ${total}, ${state}`,
  nodeState: {
    completed: 'completato',
    current: 'da iniziare',
    resume: 'in corso',
    locked: 'bloccato',
  },
  nodeHint: {
    completed: 'Tocca per ripassare il capitolo',
    current: 'Tocca per iniziare la lezione',
    resume: 'Tocca per riprendere la lezione',
    locked: 'Completa i capitoli precedenti per sbloccarlo',
  },
  nodeMeta: (minutes: number, xp: number) => `${minutes} min · ${xp} XP`,
  accuracy: (ratio: number) => `precisione ${formatPercent(ratio)}`,
  sessionStep: (step: number, total: number) => `Passo ${step} di ${total}`,
  practice: 'Ripassa',

  // Goal card
  goalTitle: 'Traguardo raggiunto',
  goalLockedTag: 'Bloccato',
  goalDoneTag: 'Completato',
  goalDoneMessage: 'Ottimo lavoro! Condividi il tuo successo con gli amici.',
  goalLockedMessage: (total: number) => `Completa tutti i ${formatChapters(total)} per sbloccare il traguardo.`,
  goalProgress: (done: number, total: number) => `${formatFraction(done, total)} capitoli`,
  goalShare: 'Condividi con gli amici',
  goalShareLockedHint: 'Disponibile quando completi il percorso',
  goalShareTitle: 'Traguardo raggiunto su Finanz',
  goalShareMessage: (courseTitle: string) =>
    `Ho completato il percorso “${courseTitle}” su Finanz! 🏆 Impara anche tu a gestire i tuoi soldi, un capitolo alla volta.`,
  goalShared: 'Grazie per aver condiviso il tuo traguardo!',

  // Unavailable states
  notFoundTitle: 'Percorso non trovato',
  notFoundMessage: 'Il link potrebbe essere scaduto oppure questo percorso non esiste più.',
  backToAcademy: 'Vai all’Academy',
  comingSoonTag: 'In arrivo',
  comingSoonTitle: 'Stiamo preparando i capitoli',
  comingSoonMessage: 'Questo percorso sarà disponibile a breve. Attiva l’avviso e ti diremo quando è pronto.',
  notifyOn: 'Avvisami',
  notifyActive: 'Avviso attivo',
  notifyOnToast: 'Ti avviseremo quando sarà disponibile',
  notifyOffToast: 'Avviso disattivato',
} as const;

/** Level banner glyphs by level number (the video uses 🤓 everywhere; we give each level its own). */
export const LEVEL_EMOJI: Record<number, string> = { 1: '🌱', 2: '🏛️', 3: '🧩', 4: '🚀' };
export const DEFAULT_LEVEL_EMOJI = '🤓';

/** "Cosa imparerai" outcomes per course (falls back to the level titles). */
export const COURSE_OUTCOMES: Record<string, readonly string[]> = {
  'first-investment': [
    'Perché i soldi fermi perdono valore e come l’interesse composto lavora per te',
    'Come funzionano azioni, obbligazioni ed ETF, con i loro rischi e rendimenti',
    'Come costruire un portafoglio diversificato e scegliere il broker giusto',
  ],
};
