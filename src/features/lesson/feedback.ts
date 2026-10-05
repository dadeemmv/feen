/**
 * Pure builders for the answer feedback dialog content (praise rotation, streak-of-answers combo,
 * the "lives" line after a mistake). Kept out of React so the dialog content can be frozen at
 * the moment of grading and stay stable while the dialog animates out.
 */
import type { StepResult } from './machine';
import { COPY } from './copy';

export type FeedbackChipKind = 'first-try' | 'combo' | 'recovered';
export type FeedbackChip = { kind: FeedbackChipKind; label: string };

export type CorrectFeedback = { kind: 'correct'; message: string; chips: FeedbackChip[] };

export type LifeNoteTone = 'danger' | 'neutral';
export type WrongFeedback = { kind: 'wrong'; lifeNote: { text: string; tone: LifeNoteTone } };

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

export function buildCorrectFeedback(results: readonly StepResult[]): CorrectFeedback {
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
  return { kind: 'correct', message: pickPraise(results.length), chips };
}

export type WrongContext = {
  practice: boolean;
  unlimited: boolean;
  /** A life was taken by this mistake. */
  lostLife: boolean;
  livesLeft: number;
};

export function buildWrongFeedback({ practice, unlimited, lostLife, livesLeft }: WrongContext): WrongFeedback {
  if (practice) return { kind: 'wrong', lifeNote: { text: COPY.feedback.practice, tone: 'neutral' } };
  if (unlimited) return { kind: 'wrong', lifeNote: { text: COPY.feedback.unlimited, tone: 'neutral' } };
  if (lostLife) return { kind: 'wrong', lifeNote: { text: COPY.feedback.lifeLost(livesLeft), tone: 'danger' } };
  return { kind: 'wrong', lifeNote: { text: COPY.feedback.noExtraLife, tone: 'neutral' } };
}
