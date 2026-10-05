/**
 * Courses, levels and chapters. The main course mirrors the reference video: 13 chapters in 4
 * levels. Coming-soon courses only feed the Academy carousel (no chapters yet).
 */
import type { Chapter, Course, CourseLevel } from './types';

export const MAIN_COURSE_ID = 'first-investment';

/** Every chapter of every course, keyed by chapter id (= lesson id). */
export const CHAPTERS: Record<string, Chapter> = {
  inflazione: {
    id: 'inflazione',
    title: 'Inflazione',
    emoji: '📈',
    summary: 'Perché i soldi fermi perdono valore nel tempo.',
    estimatedMinutes: 4,
    xpReward: 20,
    coinReward: 20,
  },
  'interesse-composto': {
    id: 'interesse-composto',
    title: 'Interesse composto',
    emoji: '❄️',
    summary: 'Come gli interessi iniziano a produrre altri interessi.',
    estimatedMinutes: 4,
    xpReward: 20,
    coinReward: 25,
  },
  'rischi-rendimenti': {
    id: 'rischi-rendimenti',
    title: 'Rischi e rendimenti',
    emoji: '⚖️',
    summary: 'Perché chi cerca più guadagno deve accettare più rischio.',
    estimatedMinutes: 4,
    xpReward: 25,
    coinReward: 25,
  },
  azioni: {
    id: 'azioni',
    title: 'Le azioni',
    emoji: '🏢',
    summary: 'Cosa vuol dire diventare socio di un’azienda.',
    estimatedMinutes: 4,
    xpReward: 25,
    coinReward: 30,
  },
  dividendi: {
    id: 'dividendi',
    title: 'Dividendi',
    emoji: '💶',
    summary: 'Come le aziende condividono gli utili con i soci.',
    estimatedMinutes: 4,
    xpReward: 25,
    coinReward: 30,
  },
  'capital-gain': {
    id: 'capital-gain',
    title: 'Capital gain',
    emoji: '🚀',
    summary: 'Guadagnare dalla differenza di prezzo, tasse comprese.',
    estimatedMinutes: 4,
    xpReward: 25,
    coinReward: 30,
  },
  obbligazioni: {
    id: 'obbligazioni',
    title: 'Obbligazioni',
    emoji: '📜',
    summary: 'Prestare soldi a Stati e aziende in cambio di interessi.',
    estimatedMinutes: 5,
    xpReward: 25,
    coinReward: 35,
  },
  cedole: {
    id: 'cedole',
    title: 'Cedole',
    emoji: '🎟️',
    summary: 'Gli interessi periodici che ti paga un’obbligazione.',
    estimatedMinutes: 4,
    xpReward: 25,
    coinReward: 35,
  },
  etf: {
    id: 'etf',
    title: 'Gli ETF',
    emoji: '🧺',
    summary: 'Centinaia di titoli in un solo acquisto, a costi bassi.',
    estimatedMinutes: 5,
    xpReward: 30,
    coinReward: 35,
  },
  diversifica: {
    id: 'diversifica',
    title: 'Diversifica',
    emoji: '🥚',
    summary: 'Mai tutte le uova nello stesso paniere.',
    estimatedMinutes: 4,
    xpReward: 30,
    coinReward: 35,
  },
  broker: {
    id: 'broker',
    title: 'Il Broker',
    emoji: '🏦',
    summary: 'Chi esegue i tuoi ordini e come sono protetti i tuoi soldi.',
    estimatedMinutes: 4,
    xpReward: 30,
    coinReward: 40,
  },
  'scegli-broker': {
    id: 'scegli-broker',
    title: 'Scegli il broker',
    emoji: '🔍',
    summary: 'I criteri per scegliere l’intermediario adatto a te.',
    estimatedMinutes: 5,
    xpReward: 30,
    coinReward: 40,
  },
  'dentro-broker': {
    id: 'dentro-broker',
    title: 'Dentro un broker',
    emoji: '📱',
    summary: 'Portafoglio, ordini e PAC: come si usa davvero.',
    estimatedMinutes: 5,
    xpReward: 30,
    coinReward: 40,
  },
};

const firstInvestmentLevels: CourseLevel[] = [
  {
    id: 'first-investment-l1',
    number: 1,
    title: 'Le basi',
    chapterIds: ['inflazione', 'interesse-composto', 'rischi-rendimenti'],
  },
  {
    id: 'first-investment-l2',
    number: 2,
    title: 'I mercati',
    chapterIds: ['azioni', 'dividendi', 'capital-gain', 'obbligazioni'],
  },
  {
    id: 'first-investment-l3',
    number: 3,
    title: 'Costruire un portafoglio',
    chapterIds: ['cedole', 'etf', 'diversifica'],
  },
  {
    id: 'first-investment-l4',
    number: 4,
    title: 'Passare all’azione',
    chapterIds: ['broker', 'scegli-broker', 'dentro-broker'],
  },
];

const placeholderLevel = (courseId: string): CourseLevel[] => [
  { id: `${courseId}-l1`, number: 1, title: 'In arrivo', chapterIds: [] },
];

export const COURSES: Course[] = [
  {
    id: MAIN_COURSE_ID,
    title: 'Fai il tuo primo investimento',
    tier: 'BASE',
    description:
      'Dall’inflazione al tuo primo ordine: 13 capitoli brevi per iniziare a investire con consapevolezza.',
    cover: 'course-first-investment',
    status: 'available',
    levels: firstInvestmentLevels,
  },
  {
    id: 'invest-stocks',
    title: 'Investi in azioni',
    tier: 'INTERMEDIO',
    description: 'Bilanci, multipli e settori: impara a leggere un’azienda prima di comprarne le azioni.',
    cover: 'course-stocks',
    status: 'coming-soon',
    levels: placeholderLevel('invest-stocks'),
  },
  {
    id: 'budget-savings',
    title: 'Budget e risparmio',
    tier: 'BASE',
    description: 'Regola 50/30/20, fondo di emergenza e piccole abitudini per risparmiare senza rinunce.',
    cover: 'course-budget',
    status: 'coming-soon',
    levels: placeholderLevel('budget-savings'),
  },
  {
    id: 'crypto-no-hype',
    title: 'Crypto senza hype',
    tier: 'AVANZATO',
    description: 'Blockchain, wallet e rischi reali: capire le crypto senza farti trascinare dalla FOMO.',
    cover: 'course-crypto',
    status: 'coming-soon',
    levels: placeholderLevel('crypto-no-hype'),
  },
];

/** Planned size of courses that are not published yet (for "n capitoli" on Academy cards). */
const PLANNED_CHAPTER_COUNT: Record<string, number> = {
  'invest-stocks': 10,
  'budget-savings': 8,
  'crypto-no-hype': 9,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────────────────────

export function getCourse(courseId: string): Course | undefined {
  return COURSES.find((course) => course.id === courseId);
}

export function getChapter(chapterId: string): Chapter | undefined {
  return Object.hasOwn(CHAPTERS, chapterId) ? CHAPTERS[chapterId] : undefined;
}

export function getCourseForChapter(chapterId: string): Course | undefined {
  return COURSES.find((course) =>
    course.levels.some((level) => level.chapterIds.includes(chapterId)),
  );
}

export function getLevelForChapter(chapterId: string): CourseLevel | undefined {
  return getCourseForChapter(chapterId)?.levels.find((level) =>
    level.chapterIds.includes(chapterId),
  );
}

/** Chapter ids of a course in path order (level 1 first). Empty for unknown courses. */
export function orderedChapterIds(courseId: string): string[] {
  return getCourse(courseId)?.levels.flatMap((level) => level.chapterIds) ?? [];
}

/** Chapters of a course in path order. */
export function orderedChapters(courseId: string): Chapter[] {
  return orderedChapterIds(courseId).flatMap((id) => getChapter(id) ?? []);
}

/** Next chapter in the same course, or `undefined` for the last one. */
export function getNextChapterId(chapterId: string): string | undefined {
  const course = getCourseForChapter(chapterId);
  if (!course) return undefined;
  const ids = orderedChapterIds(course.id);
  return ids[ids.indexOf(chapterId) + 1];
}

/** Chapters shown on course cards ("13 capitoli"); planned count for coming-soon courses. */
export function chapterCount(courseId: string): number {
  const published = orderedChapterIds(courseId).length;
  if (published > 0) return published;
  return Object.hasOwn(PLANNED_CHAPTER_COUNT, courseId) ? PLANNED_CHAPTER_COUNT[courseId] : 0;
}

/** Total XP and coins a course can award. */
export function courseRewards(courseId: string): { xp: number; coins: number } {
  return orderedChapters(courseId).reduce(
    (sum, chapter) => ({ xp: sum.xp + chapter.xpReward, coins: sum.coins + chapter.coinReward }),
    { xp: 0, coins: 0 },
  );
}
