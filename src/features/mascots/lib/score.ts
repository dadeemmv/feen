/**
 * Pure scoring of the money compass. Each answer is −3…+3 (disagree → agree); flipped by the
 * statement's direction, summed per axis and mapped to a 0…100 position towards the positive pole
 * (right, risk). The quadrant picks the character; an exact 50 falls to the left and to unrisk
 * (Teo, the calm "home" quadrant of a first-time saver).
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

export function mascotFor(right: number, risk: number): MascotId {
  const goal = right > 50 ? 'right' : 'left';
  const riskPole = risk > 50 ? 'risk' : 'unrisk';
  return MASCOT_IDS.find((id) => MASCOTS[id].goal === goal && MASCOTS[id].risk === riskPole) ?? 'giver';
}

export function scorePersonality(answers: QuizAnswers, now: number = Date.now()): PersonalityResult {
  const right = axisLean(answers, 'goal');
  const risk = axisLean(answers, 'risk');
  return { mascot: mascotFor(right, risk), right, risk, takenAt: now };
}
