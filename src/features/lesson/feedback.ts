/**
 * Pure builders for the answer feedback dialog content: the partner's line (the step's own
 * explanation when it has one, so a right answer also says why; a rotating short line
 * otherwise) and the streak-of-answers combo. A mistake costs nothing, so the wrong dialog has no
 * lives line. Kept out of React so the dialog content can be frozen at the moment of grading and
 * stay stable while the dialog animates out.
 */
import type { StepResult } from './machine';
import { COPY } from './copy';

export type FeedbackChipKind = 'first-try' | 'combo' | 'recovered';
export type FeedbackChip = { kind: FeedbackChipKind; label: string };

export type CorrectFeedback = { kind: 'correct'; message: string; chips: FeedbackChip[] };

export type WrongFeedback = { kind: 'wrong' };

export type FeedbackContent = CorrectFeedback | WrongFeedback;

/** Correct answers in a row (first try only), counted from the latest result backwards. */
export function comboCount(results: readonly StepResult[]): number {
  let count = 0;
  for (let i = results.length - 1; i >= 0 && results[i].firstTryCorrect; i -= 1) count += 1;
  return count;
}

/** The first correct answer gets the video's line; later ones rotate through the list. */
export function pickPraise(correctSoFar: number): string {
  const list = COPY.feedback.praise;
  return list[Math.max(0, correctSoFar - 1) % list.length];
}

/** Minimum combo worth celebrating. */
const COMBO_MIN = 2;

export function buildCorrectFeedback(results: readonly StepResult[], explanation?: string): CorrectFeedback {
  const latest = results[results.length - 1];
  const chips: FeedbackChip[] = [];
  if (latest?.firstTryCorrect) {
    const combo = comboCount(results);
    chips.push(
      combo >= COMBO_MIN
        ? { kind: 'combo', label: COPY.feedback.combo(combo) }
        : { kind: 'first-try', label: COPY.feedback.firstTry },
    );
  } else if (latest) {
    chips.push({ kind: 'recovered', label: COPY.feedback.afterMistake });
  }
  return { kind: 'correct', message: explanation ?? pickPraise(results.length), chips };
}

export const buildWrongFeedback = (): WrongFeedback => ({ kind: 'wrong' });
