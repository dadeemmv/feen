/**
 * Italian copy of the Academy tab (docs/PRODUCT_SPEC.md §3.11). Section titles from the video:
 * "Continua a studiare", "Potrebbe interessarti".
 */
import { formatChapters, formatFraction, formatLessons, formatPercent } from '@/lib/format';

export const ACADEMY_COPY = {
  title: 'Academy',
  subtitle: 'Impara a gestire i tuoi soldi, un capitolo alla volta.',

  continueTitle: 'Continua a studiare',
  suggestedTitle: 'Potrebbe interessarti',
  suggestedSubtitle: 'Nuovi percorsi in arrivo, scegli i tuoi preferiti',
  statsTitle: 'I tuoi traguardi',

  // Course card
  chapters: formatChapters,
  minutes: (minutes: number) => `≈ ${minutes} min`,
  fraction: formatFraction,
  percent: formatPercent,
  nextOverline: 'Prossimo capitolo',
  resumeOverline: 'Riprendi da qui',
  startOverline: 'Inizia da qui',
  resumeStep: (step: number, total: number) => `Passo ${step} di ${total}`,
  doneOverline: 'Percorso completato',
  doneLine: 'Ripassa quando vuoi',
  comingSoon: 'In arrivo',
  cardHint: 'Apri il percorso',
  comingSoonHint: 'Ricevi un avviso quando sarà disponibile',
  cardLabel: (title: string, done: number, total: number) => `${title}, ${done} di ${formatChapters(total)} completati`,
  comingSoonLabel: (title: string) => `${title}, in arrivo`,

  // Notify bell
  notifyOn: 'Avvisami quando è disponibile',
  notifyOff: 'Disattiva avviso',
  notifyOnToast: 'Ti avviseremo quando sarà disponibile',
  notifyOffToast: 'Avviso disattivato',

  // Stats
  lessons: 'Lezioni',
  xp: 'XP totali',
  level: 'Livello',
  levelLine: (level: number, title: string) => `Livello ${level} · ${title}`,
  levelProgress: (current: number, next: number) => `${current}/${next} XP`,
  levelMax: 'Livello massimo',
  lessonsDone: formatLessons,
} as const;
