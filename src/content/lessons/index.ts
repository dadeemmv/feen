/**
 * Lesson registry: one lesson per chapter, same id as the chapter.
 */
import { isGradedStep, type Lesson, type LessonStep } from '../types';
import { azioniLesson } from './azioni';
import { brokerLesson } from './broker';
import { capitalGainLesson } from './capital-gain';
import { cedoleLesson } from './cedole';
import { dentroBrokerLesson } from './dentro-broker';
import { diversificaLesson } from './diversifica';
import { dividendiLesson } from './dividendi';
import { etfLesson } from './etf';
import { inflazioneLesson } from './inflazione';
import { interesseCompostoLesson } from './interesse-composto';
import { obbligazioniLesson } from './obbligazioni';
import { rischiRendimentiLesson } from './rischi-rendimenti';
import { scegliBrokerLesson } from './scegli-broker';

export { getCorrectAnswerLabel } from './answer-label';

const ALL_LESSONS: Lesson[] = [
  inflazioneLesson,
  interesseCompostoLesson,
  rischiRendimentiLesson,
  azioniLesson,
  dividendiLesson,
  capitalGainLesson,
  obbligazioniLesson,
  cedoleLesson,
  etfLesson,
  diversificaLesson,
  brokerLesson,
  scegliBrokerLesson,
  dentroBrokerLesson,
];

/** All lessons keyed by chapter id. */
export const LESSONS: Record<string, Lesson> = Object.fromEntries(
  ALL_LESSONS.map((lesson) => [lesson.id, lesson]),
);

export function hasLesson(chapterId: string): boolean {
  return Object.hasOwn(LESSONS, chapterId);
}

/** Lesson for a chapter, or `undefined` (use in routes that receive an untrusted id). */
export function findLesson(chapterId: string): Lesson | undefined {
  return hasLesson(chapterId) ? LESSONS[chapterId] : undefined;
}

/** Lesson for a chapter. Throws for unknown ids: every published chapter has a lesson. */
export function getLesson(chapterId: string): Lesson {
  const lesson = findLesson(chapterId);
  if (!lesson) throw new Error(`[content] No lesson for chapter "${chapterId}"`);
  return lesson;
}

export function getStep(chapterId: string, stepId: string): LessonStep | undefined {
  return findLesson(chapterId)?.steps.find((step) => step.id === stepId);
}

/** Graded steps in a lesson (denominator for accuracy). */
export function gradedStepCount(chapterId: string): number {
  return findLesson(chapterId)?.steps.filter(isGradedStep).length ?? 0;
}
