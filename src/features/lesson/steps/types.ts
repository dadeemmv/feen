/**
 * Contract between the lesson player and the step renderers (registry keyed by `step.type`,
 * ikyawthetpaing/euolingo `exercise-items.tsx` pattern). Steps are presentational: they read the
 * machine state and report user intent; grading and side effects stay in the controller.
 */
import type { LessonStep } from '@/content/types';

import type { LessonPhase, StepAnswer } from '../machine';
import type { OptionStatus } from '../components/option-tile';

export type StepViewProps<S extends LessonStep = LessonStep> = {
  step: S;
  answer: StepAnswer | null;
  phase: LessonPhase;
  /** Options eliminated after a wrong try on this step. */
  disabledOptionIds: readonly string[];
  /** Increments on every wrong CHECK: the chosen option shakes. */
  wrongSignal: number;
  /** Reports a (partial) answer. */
  onSelect: (answer: StepAnswer) => void;
  /**
   * Match steps: a wrong pair was tapped. Returns false when the controller refused it (out of
   * lives), so the step can still shake without counting it.
   */
  onMatchMiss: (leftId: string, rightId: string) => boolean;
  /** Extra bottom padding so the last element clears the AI button. */
  bottomInset: number;
  /** Short window (iPhone SE): smaller art and tighter gaps. */
  compact: boolean;
};

/** Answers can change only while the step is waiting for a CHECK. */
export const isAnswering = (phase: LessonPhase): boolean => phase === 'idle' || phase === 'selected';

/** Status of a single-answer option (choice / fill / true-false). */
export function singleOptionStatus(
  optionId: string,
  selectedId: string | null,
  phase: LessonPhase,
  disabledOptionIds: readonly string[],
): OptionStatus {
  if (disabledOptionIds.includes(optionId)) return 'disabled';
  if (selectedId !== optionId) return 'idle';
  if (phase === 'feedback-correct' || phase === 'completed') return 'correct';
  if (phase === 'feedback-wrong') return 'wrong';
  return 'selected';
}
