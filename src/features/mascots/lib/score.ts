/**
 * Pure scoring of the test. Each answer is −3…+3 on the scale between the two answers; flipped
 * when the positive answer sits on the left, summed per axis and mapped to a 0…100 lean towards
 * the positive pole (domani, audacia). The quadrant picks the animal.
 *
 * The thresholds are a first guess, to be calibrated on a pilot so that the four animals come out
 * in similar proportions. An exact tie falls to oggi and to prudenza.
 */
import {
  CHOICE_SCALE,
  MASCOT_IDS,
  MASCOTS,
  SCENARIOS,
  type ChoiceValue,
  type MascotId,
  type PersonalityAxis,
} from '@/content/personality';
import type { PersonalityResult } from '@/store';

export type QuizAnswers = Readonly<Record<string, ChoiceValue>>;

const MAX_CHOICE = CHOICE_SCALE[CHOICE_SCALE.length - 1];

/** Lean (0…100) above which a test lands on the positive pole of an axis. */
export const AXIS_THRESHOLD: Record<PersonalityAxis, number> = { horizon: 50, risk: 50 };

export const QUIZ_LENGTH = SCENARIOS.length;

export const countAnswered = (answers: QuizAnswers) =>
  SCENARIOS.filter((scenario) => answers[scenario.id] !== undefined).length;

export const isQuizComplete = (answers: QuizAnswers) => countAnswered(answers) === QUIZ_LENGTH;

/** Index of the first unanswered scenario (QUIZ_LENGTH when complete). */
export const firstUnanswered = (answers: QuizAnswers) => {
  const index = SCENARIOS.findIndex((scenario) => answers[scenario.id] === undefined);
  return index === -1 ? QUIZ_LENGTH : index;
};

/** 0…100 lean towards the positive pole of `axis`; unanswered scenarios count as neutral. */
export function axisLean(answers: QuizAnswers, axis: PersonalityAxis): number {
  const scenarios = SCENARIOS.filter((scenario) => scenario.axis === axis);
  const sum = scenarios.reduce(
    (total, scenario) => total + (answers[scenario.id] ?? 0) * (scenario.positiveFirst ? -1 : 1),
    0,
  );
  return Math.round(50 + (50 * sum) / (MAX_CHOICE * scenarios.length));
}

export function mascotFor(future: number, risk: number): MascotId {
  const horizon = future > AXIS_THRESHOLD.horizon ? 'domani' : 'oggi';
  const riskPole = risk > AXIS_THRESHOLD.risk ? 'audacia' : 'prudenza';
  return MASCOT_IDS.find((id) => MASCOTS[id].horizon === horizon && MASCOTS[id].risk === riskPole) ?? 'lontra';
}

/**
 * The result of a test. On a retake (`keep`) the animal stays the one of the first test — the
 * partner signed with you — while the position on the axes moves.
 */
export function scorePersonality(answers: QuizAnswers, now: number = Date.now(), keep?: MascotId): PersonalityResult {
  const future = axisLean(answers, 'horizon');
  const risk = axisLean(answers, 'risk');
  return { mascot: keep ?? mascotFor(future, risk), future, risk, takenAt: now };
}
