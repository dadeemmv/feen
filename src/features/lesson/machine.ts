/**
 * Lesson player state machine — PURE (no React, no store, no clock).
 *
 * One primary button drives the whole lesson (sanidhyy/duolingo-clone `quiz.tsx`):
 *   idle ──SELECT──▶ selected ──CHECK──▶ feedback-correct ──NEXT──▶ next step … ▶ completed
 *                                   └──▶ feedback-wrong ──RETRY──▶ idle (wrong option faded)
 * Info / definition steps enter directly in `selected` (Continua enabled) and CHECK ≡ NEXT.
 *
 * `transition()` returns the next state plus the side effects the screen must run (lose a life,
 * haptics, persist "RIPRENDI DA QUI"). `reduceLesson()` is the effect-free variant for
 * `useReducer`. Lives rule: a wrong answer costs at most ONE life per step (`lostLifeStepIds`),
 * and only when the caller says the user can lose lives (not unlimited/Pro, not a replay).
 */
import { isGradedStep, type GradedStep, type LessonStep, type MatchStep, type OrderStep } from '@/content/types';

import type {
  LessonEffect,
  LessonEvent,
  LessonPhase,
  LessonState,
  MatchAnswer,
  OrderAnswer,
  PrimaryAction,
  StepAnswer,
  StepResult,
  Transition,
} from './machine.types';

export * from './machine.types';

/** Option ids used for the Vero / Falso buttons (so they can be disabled like other options). */
export const TRUE_FALSE_OPTION_IDS = { true: 'true', false: 'false' } as const;

export const trueFalseOptionId = (value: boolean): string =>
  value ? TRUE_FALSE_OPTION_IDS.true : TRUE_FALSE_OPTION_IDS.false;

export const isStepGraded = (step: LessonStep): step is GradedStep => isGradedStep(step);

// ── Answer helpers ──

const isMatchAnswer = (answer: unknown): answer is MatchAnswer =>
  typeof answer === 'object' && answer !== null && !Array.isArray(answer);

const isOrderAnswer = (answer: unknown): answer is readonly string[] =>
  Array.isArray(answer) && answer.every((id) => typeof id === 'string');

const hasDuplicates = (ids: readonly string[]) => new Set(ids).size !== ids.length;

/** True when a match pair (left pair id, right pair id) is correct. */
export function checkPair(step: MatchStep, leftId: string, rightId: string): boolean {
  return leftId === rightId && step.pairs.some((pair) => pair.id === leftId);
}

/** Answer shape is valid for the step (ids exist, no duplicates); partial answers allowed. */
function isValidPartialAnswer(step: LessonStep, answer: StepAnswer): boolean {
  switch (step.type) {
    case 'choice':
    case 'fill':
      return typeof answer === 'string' && step.options.some((o) => o.id === answer);
    case 'true-false':
      return typeof answer === 'boolean';
    case 'match': {
      if (!isMatchAnswer(answer)) return false;
      const ids = new Set(step.pairs.map((p) => p.id));
      const rights = Object.values(answer);
      return Object.keys(answer).every((id) => ids.has(id)) && rights.every((id) => ids.has(id)) && !hasDuplicates(rights);
    }
    case 'order': {
      if (!isOrderAnswer(answer)) return false;
      const ids = new Set(step.items.map((i) => i.id));
      return answer.every((id) => ids.has(id)) && !hasDuplicates(answer);
    }
    case 'info':
    case 'definition':
      return false;
  }
}

/**
 * The answer can be checked. Info/definition: always. Match: every pair matched.
 * Order: every item placed.
 */
export function isAnswerComplete(step: LessonStep, answer: StepAnswer | null): boolean {
  if (!isGradedStep(step)) return true;
  if (answer === null || !isValidPartialAnswer(step, answer)) return false;
  switch (step.type) {
    case 'match':
      return Object.keys(answer as MatchAnswer).length === step.pairs.length;
    case 'order':
      return (answer as readonly string[]).length === step.items.length;
    default:
      return true;
  }
}

/** Grades a complete answer. Incomplete answers are wrong; info/definition steps are correct. */
export function gradeStep(step: LessonStep, answer: StepAnswer | null): boolean {
  if (!isGradedStep(step)) return true;
  if (!isAnswerComplete(step, answer)) return false;
  switch (step.type) {
    case 'choice':
    case 'fill':
      return answer === step.correctOptionId;
    case 'true-false':
      return answer === step.answer;
    case 'match':
      return Object.entries(answer as MatchAnswer).every(([left, right]) => checkPair(step, left, right));
    case 'order':
      return (answer as readonly string[]).every((id, i) => step.items[i].id === id);
  }
}

/** Accuracy 0…1 = share of graded steps solved at the first try (1 when nothing was graded). */
export function computeAccuracy(results: readonly StepResult[]): number {
  if (results.length === 0) return 1;
  return results.filter((r) => r.firstTryCorrect).length / results.length;
}

/** A wrong answer on this step would cost a life (ignoring unlimited/Pro, which the caller knows). */
export function shouldLoseLife(state: Pick<LessonState, 'lostLifeStepIds'>, step: LessonStep): boolean {
  return isGradedStep(step) && !state.lostLifeStepIds.includes(step.id);
}

/** Option id to fade out after a wrong answer (choice / fill / true-false only). */
function wrongOptionId(step: LessonStep, answer: StepAnswer | null): string | null {
  if ((step.type === 'choice' || step.type === 'fill') && typeof answer === 'string') return answer;
  if (step.type === 'true-false' && typeof answer === 'boolean') return trueFalseOptionId(answer);
  return null;
}

/** Correct pairs kept after a wrong match check, so the user only redoes the wrong ones. */
function keepCorrectPairs(step: MatchStep, answer: StepAnswer | null): MatchAnswer | null {
  if (!isMatchAnswer(answer)) return null;
  const kept = Object.fromEntries(Object.entries(answer).filter(([l, r]) => checkPair(step, l, r)));
  return Object.keys(kept).length > 0 ? kept : null;
}

/**
 * Correctly placed leading items kept after a wrong order check (the word bank fills slots in
 * sequence, so only an unbroken correct prefix can stay).
 */
function keepCorrectPrefix(step: OrderStep, answer: StepAnswer | null): OrderAnswer | null {
  if (!isOrderAnswer(answer)) return null;
  const firstWrong = answer.findIndex((id, i) => step.items[i]?.id !== id);
  const kept = firstWrong === -1 ? answer.slice() : answer.slice(0, firstWrong);
  return kept.length > 0 ? kept : null;
}

/** The ids the order UI should consider "placed" (typed accessor for the component). */
export const orderedIds = (answer: StepAnswer | null): readonly string[] => (isOrderAnswer(answer) ? answer : []);

/** Current matched pairs (typed accessor for the component). */
export const matchedPairs = (answer: StepAnswer | null): MatchAnswer => (isMatchAnswer(answer) ? answer : {});

/** Items of an order step still in the word bank. */
export const remainingOrderItems = (step: OrderStep, answer: StepAnswer | null) => {
  const placed = new Set(orderedIds(answer));
  return step.items.filter((item) => !placed.has(item.id));
};

// ── State ──

const entryPhase = (step: LessonStep | undefined): LessonPhase =>
  step === undefined ? 'completed' : isGradedStep(step) ? 'idle' : 'selected';

const addUnique = (ids: readonly string[], id: string) => (ids.includes(id) ? ids.slice() : [...ids, id]);

function enterStep(state: LessonState, steps: readonly LessonStep[], index: number): LessonState {
  return { ...state, index, phase: entryPhase(steps[index]), answer: null, disabledOptionIds: [], attempts: 0 };
}

/** State for a fresh lesson (step 0). */
export function createLessonState(steps: readonly LessonStep[]): LessonState {
  const blank: LessonState = {
    index: 0,
    phase: 'idle',
    answer: null,
    disabledOptionIds: [],
    lostLifeStepIds: [],
    mistakeStepIds: [],
    results: [],
    attempts: 0,
  };
  return enterStep(blank, steps, 0);
}

const persistEffect = (s: LessonState, stepIndex = s.index): LessonEffect => ({
  type: 'PERSIST_PROGRESS',
  stepIndex,
  lostLifeStepIds: s.lostLifeStepIds,
  mistakeStepIds: s.mistakeStepIds,
});

const unchanged = (state: LessonState): Transition => ({ state, effects: [] });

// ── Transitions ──

function onSelect(state: LessonState, step: LessonStep, answer: StepAnswer): Transition {
  if (state.phase !== 'idle' && state.phase !== 'selected') return unchanged(state);
  if (!isGradedStep(step) || !isValidPartialAnswer(step, answer)) return unchanged(state);
  const optionId = wrongOptionId(step, answer);
  if (optionId !== null && state.disabledOptionIds.includes(optionId)) return unchanged(state);
  return {
    state: { ...state, answer, phase: isAnswerComplete(step, answer) ? 'selected' : 'idle' },
    effects: [],
  };
}

/** Records a mistake and, if allowed, the one life this step may cost. */
function registerMistake(state: LessonState, step: GradedStep, canLoseLife: boolean) {
  const loseLife = canLoseLife && shouldLoseLife(state, step);
  const next: LessonState = {
    ...state,
    attempts: state.attempts + 1,
    mistakeStepIds: addUnique(state.mistakeStepIds, step.id),
    lostLifeStepIds: loseLife ? [...state.lostLifeStepIds, step.id] : state.lostLifeStepIds,
  };
  const effects: LessonEffect[] = loseLife ? [{ type: 'LOSE_LIFE', stepId: step.id }] : [];
  return { next, effects };
}

function onCheck(state: LessonState, steps: readonly LessonStep[], step: LessonStep, canLoseLife: boolean): Transition {
  if (state.phase !== 'selected') return unchanged(state);
  if (!isGradedStep(step)) return onNext(state, steps, step);

  if (gradeStep(step, state.answer)) {
    const clean = state.attempts === 0 && !state.mistakeStepIds.includes(step.id); // mistakes survive a resume
    const result: StepResult = { stepId: step.id, firstTryCorrect: clean, attempts: state.attempts + 1 };
    return {
      state: { ...state, phase: 'feedback-correct', results: [...state.results.filter((r) => r.stepId !== step.id), result] },
      effects: [{ type: 'FEEDBACK', outcome: 'correct' }],
    };
  }

  const { next, effects } = registerMistake(state, step, canLoseLife);
  return {
    state: { ...next, phase: 'feedback-wrong' },
    effects: [{ type: 'FEEDBACK', outcome: 'wrong' }, ...effects, persistEffect(next)],
  };
}

function onMatchMiss(state: LessonState, step: LessonStep, canLoseLife: boolean): Transition {
  if (step.type !== 'match' || (state.phase !== 'idle' && state.phase !== 'selected')) return unchanged(state);
  const { next, effects } = registerMistake(state, step, canLoseLife);
  return { state: next, effects: [{ type: 'FEEDBACK', outcome: 'wrong-pair' }, ...effects, persistEffect(next)] };
}

function onRetry(state: LessonState, step: LessonStep): Transition {
  if (state.phase !== 'feedback-wrong') return unchanged(state);
  const faded = wrongOptionId(step, state.answer);
  const answer =
    step.type === 'match'
      ? keepCorrectPairs(step, state.answer)
      : step.type === 'order'
        ? keepCorrectPrefix(step, state.answer)
        : null;
  return {
    state: {
      ...state,
      answer,
      phase: isAnswerComplete(step, answer) && answer !== null ? 'selected' : 'idle',
      disabledOptionIds: faded === null ? state.disabledOptionIds : addUnique(state.disabledOptionIds, faded),
    },
    effects: [],
  };
}

function onNext(state: LessonState, steps: readonly LessonStep[], step: LessonStep): Transition {
  const canAdvance = state.phase === 'feedback-correct' || (!isGradedStep(step) && state.phase === 'selected');
  if (!canAdvance) return unchanged(state);

  const nextIndex = state.index + 1;
  if (nextIndex >= steps.length) {
    const done: LessonState = { ...state, phase: 'completed' };
    return { state: done, effects: [{ type: 'COMPLETED', accuracy: computeAccuracy(done.results), results: done.results }] };
  }
  const next = enterStep(state, steps, nextIndex);
  return { state: next, effects: [persistEffect(next)] };
}

function onRestore(steps: readonly LessonStep[], event: Extract<LessonEvent, { type: 'RESTORE' }>): Transition {
  const lastIndex = Math.max(0, steps.length - 1);
  const index = Math.min(Math.max(0, Math.floor(event.index)), lastIndex);
  const stepIds = new Set(steps.map((s) => s.id));
  const lostLifeStepIds = event.lostLifeStepIds.filter((id) => stepIds.has(id));
  const mistakes = new Set([...(event.mistakeStepIds ?? []), ...lostLifeStepIds]);

  // Steps before the resume point were solved in the previous session.
  const results: StepResult[] = steps
    .slice(0, index)
    .filter(isGradedStep)
    .map((s) => ({ stepId: s.id, firstTryCorrect: !mistakes.has(s.id), attempts: mistakes.has(s.id) ? 2 : 1 }));

  const mistakeStepIds = [...mistakes].filter((id) => stepIds.has(id));
  const restored = { ...createLessonState(steps), lostLifeStepIds, mistakeStepIds, results };
  return { state: enterStep(restored, steps, index), effects: [] };
}

/** Pure transition: next state + side effects for the screen to run. */
export function transition(state: LessonState, event: LessonEvent, steps: readonly LessonStep[]): Transition {
  if (event.type === 'RESTORE') return onRestore(steps, event);
  if (state.phase === 'completed') return unchanged(state);

  const step = steps[state.index];
  if (step === undefined) return unchanged(state);

  switch (event.type) {
    case 'SELECT':
      return onSelect(state, step, event.answer);
    case 'CHECK':
      return onCheck(state, steps, step, event.canLoseLife);
    case 'MATCH_MISS':
      return onMatchMiss(state, step, event.canLoseLife);
    case 'RETRY':
      return onRetry(state, step);
    case 'NEXT':
      return onNext(state, steps, step);
  }
}

/** `useReducer`-friendly variant (effects dropped). Bind the steps: `(s, e) => reduceLesson(s, e, steps)`. */
export function reduceLesson(state: LessonState, event: LessonEvent, steps: readonly LessonStep[]): LessonState {
  return transition(state, event, steps).state;
}

// ── Derived view helpers ──

/** The single footer button: label kind + enabled flag. */
export function getPrimaryAction(state: LessonState, step: LessonStep | undefined): PrimaryAction {
  switch (state.phase) {
    case 'completed':
      return { kind: 'finish', enabled: true };
    case 'feedback-correct':
      return { kind: 'continue', enabled: true };
    case 'feedback-wrong':
      return { kind: 'retry', enabled: true };
    case 'selected':
      return { kind: step !== undefined && isGradedStep(step) ? 'check' : 'continue', enabled: true };
    case 'idle':
      return { kind: 'check', enabled: false };
  }
}

/** Progress bar ratio 0…1: solved steps count, the current one fills on a correct answer. */
export function getLessonProgress(state: LessonState, stepCount: number): number {
  if (stepCount <= 0 || state.phase === 'completed') return 1;
  const done = state.index + (state.phase === 'feedback-correct' ? 1 : 0);
  return Math.min(1, done / stepCount);
}

/** Show the "Spiegami il perchè" pill (after at least one wrong attempt on this step). */
export const hasMistakeOnCurrentStep = (state: LessonState): boolean => state.attempts > 0;

export const isOptionDisabled = (state: LessonState, optionId: string): boolean =>
  state.disabledOptionIds.includes(optionId);
