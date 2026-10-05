/**
 * Types of the lesson player state machine (see `machine.ts` and docs/ARCHITECTURE.md §7).
 */
import type { LessonStep } from '@/content/types';

export type LessonPhase =
  /** Waiting for a (complete) answer — primary button disabled. */
  | 'idle'
  /** Answer complete (or an info/definition step) — primary button enabled. */
  | 'selected'
  /** "Risposta corretta" feedback shown — primary button advances. */
  | 'feedback-correct'
  /** "Risposta errata" feedback shown — primary button ("Chiudi") retries. */
  | 'feedback-wrong'
  /** Past the last step — completion screen. */
  | 'completed';

/** Match answer: left pair id → right pair id (the pair is correct when both ids are equal). */
export type MatchAnswer = Readonly<Record<string, string>>;

/** Order answer: item ids in the order the user placed them. */
export type OrderAnswer = readonly string[];

/** Answer value per step type. Info/definition steps never hold an answer. */
export type AnswerByStepType = {
  choice: string;
  fill: string;
  'true-false': boolean;
  match: MatchAnswer;
  order: OrderAnswer;
  info: never;
  definition: never;
};

export type StepAnswer = AnswerByStepType[LessonStep['type']];

export type AnswerFor<S extends LessonStep> = AnswerByStepType[S['type']];

export type StepResult = {
  stepId: string;
  /** Solved at the first CHECK with no wrong match pair along the way. */
  firstTryCorrect: boolean;
  /** Wrong checks + wrong match pairs + the final correct check. */
  attempts: number;
};

export type LessonState = {
  index: number;
  phase: LessonPhase;
  answer: StepAnswer | null;
  /** Options faded out after a wrong answer on the CURRENT step (choice / fill / true-false). */
  disabledOptionIds: string[];
  /** Steps that already cost a life in this lesson (max one life per step). */
  lostLifeStepIds: string[];
  /** Graded steps that were answered wrong at least once (feeds accuracy after a resume). */
  mistakeStepIds: string[];
  /** One entry per graded step solved so far. */
  results: StepResult[];
  /** Wrong attempts on the current step (drives the "Spiegami il perchè" pill). */
  attempts: number;
};

export type LessonEvent =
  | { type: 'SELECT'; answer: StepAnswer }
  /** `canLoseLife` = not unlimited/Pro and not a practice replay of a completed chapter. */
  | { type: 'CHECK'; canLoseLife: boolean }
  /** Pair-by-pair match UIs report a wrong pair without opening the feedback modal. */
  | { type: 'MATCH_MISS'; leftId: string; rightId: string; canLoseLife: boolean }
  | { type: 'RETRY' }
  | { type: 'NEXT' }
  | {
      type: 'RESTORE';
      index: number;
      lostLifeStepIds: readonly string[];
      mistakeStepIds?: readonly string[];
    };

/** Side effects requested by a transition; the screen runs them (store, haptics, sound). */
export type LessonEffect =
  | { type: 'LOSE_LIFE'; stepId: string }
  | { type: 'FEEDBACK'; outcome: 'correct' | 'wrong' | 'wrong-pair' }
  | {
      type: 'PERSIST_PROGRESS';
      stepIndex: number;
      lostLifeStepIds: string[];
      mistakeStepIds: string[];
    }
  | { type: 'COMPLETED'; accuracy: number; results: StepResult[] };

export type Transition = { state: LessonState; effects: LessonEffect[] };

/** What the single primary footer button does right now. */
export type PrimaryAction = {
  kind: 'check' | 'continue' | 'retry' | 'finish';
  enabled: boolean;
};
