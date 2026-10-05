/**
 * Pure scoring of the money-personality test. Each answer is −3…+3 (disagree → agree); flipped
 * by the statement's direction, summed per axis and mapped to a 0…100 lean towards the positive
 * pole (future, bold). The quadrant picks the mascot; an exact 50 leans to the future and to
 * safety (the Scoiattolo is the "home" quadrant of a first-time saver).
 */
import {
  MASCOT_IDS,
  MASCOTS,
  PERSONALITY_STATEMENTS,
  type AgreementValue,
  type MascotId,
  type PersonalityAxis,
} from '@/content/personality';
import type { PersonalityResult } from '@/store';

export type QuizAnswers = Readonly<Record<string, AgreementValue>>;

const MAX_AGREEMENT = 3;

export const QUIZ_LENGTH = PERSONALITY_STATEMENTS.length;

export const countAnswered = (answers: QuizAnswers) =>
  PERSONALITY_STATEMENTS.filter((statement) => answers[statement.id] !== undefined).length;

export const isQuizComplete = (answers: QuizAnswers) => countAnswered(answers) === QUIZ_LENGTH;

/** Index of the first unanswered statement (QUIZ_LENGTH when complete). */
export const firstUnanswered = (answers: QuizAnswers) => {
  const index = PERSONALITY_STATEMENTS.findIndex((statement) => answers[statement.id] === undefined);
  return index === -1 ? QUIZ_LENGTH : index;
};

/** 0…100 lean towards the positive pole of `axis`; unanswered statements count as neutral. */
export function axisLean(answers: QuizAnswers, axis: PersonalityAxis): number {
  const statements = PERSONALITY_STATEMENTS.filter((statement) => statement.axis === axis);
  const sum = statements.reduce((total, statement) => total + (answers[statement.id] ?? 0) * statement.direction, 0);
  return Math.round(50 + (50 * sum) / (MAX_AGREEMENT * statements.length));
}

export function mascotFor(future: number, bold: number): MascotId {
  const horizon = future >= 50 ? 'future' : 'present';
  const risk = bold > 50 ? 'bold' : 'safe';
  return MASCOT_IDS.find((id) => MASCOTS[id].horizon === horizon && MASCOTS[id].risk === risk) ?? 'squirrel';
}

export function scorePersonality(answers: QuizAnswers, now: number = Date.now()): PersonalityResult {
  const future = axisLean(answers, 'horizon');
  const bold = axisLean(answers, 'risk');
  return { mascot: mascotFor(future, bold), future, bold, takenAt: now };
}
