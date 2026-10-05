/**
 * Content model. Lesson steps are a discriminated union keyed by `type` and rendered through a
 * step registry (pattern from ikyawthetpaing/euolingo `types/course.d.ts` +
 * `components/exercise/items/exercise-items.tsx`).
 */

/** Keys of custom SVG illustrations available in `@/components/illustrations`. */
export type IllustrationKey =
  | 'course-first-investment'
  | 'course-stocks'
  | 'course-budget'
  | 'course-crypto'
  | 'open-book'
  | 'shopping-cart'
  | 'burning-banknote'
  | 'compound-snowball'
  | 'risk-scale'
  | 'stock-chart'
  | 'piggy-bank'
  | 'coins-stack'
  | 'broker-phone'
  | 'pie-diversify'
  | 'bond-certificate'
  | 'trophy'
  | 'shield'
  | 'envelopes'
  | 'kiwi-pattern';

/** Visual tone for tinted content rows (maps to `tint*` colour tokens). */
export type ContentTone = 'mint' | 'sky' | 'blush' | 'butter' | 'lilac';

/** Pill shown at the top of a graded step, e.g. "🎩 INDOVINA", "🎩 METTITI ALLA PROVA". */
export type StepTag = 'indovina' | 'mettiti-alla-prova' | 'scenario' | 'ripasso';

type StepBase = {
  id: string;
  /** Short explanation shown by "Spiegami il perchè" and used as the AI tutor context. */
  explanation?: string;
};

export type ChoiceStep = StepBase & {
  type: 'choice';
  tag: StepTag;
  illustration?: IllustrationKey;
  emoji?: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
};

export type TrueFalseStep = StepBase & {
  type: 'true-false';
  tag: StepTag;
  illustration?: IllustrationKey;
  statement: string;
  answer: boolean;
};

export type InfoStep = StepBase & {
  type: 'info';
  emoji: string;
  title: string;
  lead: string;
  rows: { emoji?: string; text: string; tone: ContentTone }[];
};

export type DefinitionStep = StepBase & {
  type: 'definition';
  emoji: string;
  title: string;
  lead: string;
  term: string;
  definition: string;
  tone?: ContentTone;
};

/** Tap-to-match pairs (e.g. term ↔ meaning). */
export type MatchStep = StepBase & {
  type: 'match';
  tag: StepTag;
  prompt: string;
  pairs: { id: string; left: string; right: string }[];
};

/** Put items in the right order (tap-to-place word bank). */
export type OrderStep = StepBase & {
  type: 'order';
  tag: StepTag;
  prompt: string;
  /** Items listed in the CORRECT order; the UI shuffles them. */
  items: { id: string; label: string }[];
};

/** Sentence with one blank, choose the word that fits. */
export type FillStep = StepBase & {
  type: 'fill';
  tag: StepTag;
  prompt: string;
  /** Sentence with `___` marking the blank. */
  sentence: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
};

export type LessonStep =
  | ChoiceStep
  | TrueFalseStep
  | InfoStep
  | DefinitionStep
  | MatchStep
  | OrderStep
  | FillStep;

export type GradedStep = ChoiceStep | TrueFalseStep | MatchStep | OrderStep | FillStep;

export const isGradedStep = (step: LessonStep): step is GradedStep =>
  step.type !== 'info' && step.type !== 'definition';

export type Lesson = {
  /** Same id as the chapter it belongs to. */
  id: string;
  steps: LessonStep[];
};

export type Chapter = {
  id: string;
  title: string;
  /** Emoji shown in the path node when unlocked. */
  emoji: string;
  /** One-line teaser shown in previews/completion. */
  summary: string;
  estimatedMinutes: number;
  xpReward: number;
  coinReward: number;
};

export type CourseLevel = {
  id: string;
  /** 1-based level number shown as "LIVELLO n". */
  number: number;
  title: string;
  chapterIds: string[];
};

export type CourseTier = 'BASE' | 'INTERMEDIO' | 'AVANZATO';

export type Course = {
  id: string;
  title: string;
  tier: CourseTier;
  description: string;
  cover: IllustrationKey;
  status: 'available' | 'coming-soon';
  levels: CourseLevel[];
};

export type StoryPage =
  | {
      kind: 'academy-intro';
      title: string;
      subtitle: string;
      body: string;
      posterTitle: string;
      sticker: string;
    }
  | {
      kind: 'poll';
      title: string;
      subtitle: string;
      body: string;
      pollId: string;
      question: string;
      options: { id: string; label: string }[];
      sticker: string;
    }
  | {
      kind: 'timeline';
      title?: string;
      cards: { text: string; emphasis?: string[]; emoji?: string }[];
    };

export type StoryGroup = {
  id: string;
  title: string;
  emoji: string;
  theme: 'mint' | 'brand';
  pages: StoryPage[];
};

export type ShopItemKind = 'daily-reward' | 'streak-shield' | 'extra-life' | 'unlimited-hour';

export type ShopItem = {
  id: string;
  kind: ShopItemKind;
  overline: string;
  title: string;
  /** Price in kiwi coins; 0 = free. */
  price: number;
  /** Amount granted (coins for daily reward, lives, shields, minutes…). */
  amount: number;
  badge?: string;
};
