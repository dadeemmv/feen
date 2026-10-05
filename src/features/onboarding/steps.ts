/**
 * The onboarding step registry: order, routes, completion rules and the final commit.
 *   welcome (/onboarding) → name → interests → level → pace → ready
 * Only the four question steps show the progress bar.
 */
import { router, type Href } from 'expo-router';

import { haptics } from '@/lib/haptics';
import { getStoreState, type OnboardingAnswers } from '@/store';

import { cleanName, demoEmailFor, validateName } from './data/name';
import { getOnboardingDraft, type OnboardingDraft } from './draft-store';

export const QUESTION_STEPS = ['name', 'interests', 'level', 'pace'] as const;
export type QuestionStep = (typeof QUESTION_STEPS)[number];
export type StepId = QuestionStep | 'ready';

export const STEP_HREF = {
  name: '/onboarding/name',
  interests: '/onboarding/interests',
  level: '/onboarding/level',
  pace: '/onboarding/pace',
  ready: '/onboarding/ready',
} as const satisfies Record<StepId, Href>;

export const WELCOME_HREF = '/onboarding' as const satisfies Href;

const STEP_DONE: Record<QuestionStep, (draft: OnboardingDraft) => boolean> = {
  name: (draft) => validateName(draft.name) === null,
  interests: (draft) => draft.interests.length > 0,
  level: (draft) => draft.experience !== null,
  pace: (draft) => draft.goalMinutes !== null,
};

export const isStepDone = (step: QuestionStep, draft: OnboardingDraft) => STEP_DONE[step](draft);

/** 1-based position in the progress bar. */
export const stepNumber = (step: QuestionStep) => QUESTION_STEPS.indexOf(step) + 1;

/**
 * The step a deep link / web refresh may show: the first unanswered step before `step` (the
 * draft is not persisted), or `step` itself when everything before it is answered.
 */
export function allowedStep(step: StepId, draft: OnboardingDraft): StepId {
  if (step === 'ready' && draft.returning) return 'ready';
  const limit = step === 'ready' ? QUESTION_STEPS.length : QUESTION_STEPS.indexOf(step);
  const open = QUESTION_STEPS.slice(0, limit).find((s) => !isStepDone(s, draft));
  return open ?? step;
}

export function goToNextStep(step: QuestionStep) {
  const next = QUESTION_STEPS[QUESTION_STEPS.indexOf(step) + 1] ?? 'ready';
  router.push(STEP_HREF[next]);
}

/** Back inside the flow; a deep-linked step without history goes to the welcome screen. */
export function goToPreviousStep() {
  if (router.canGoBack()) router.back();
  else router.replace(WELCOME_HREF);
}

/** Writes the answers to the profile (or keeps the saved one for a returning user) and enters the app. */
export function finishOnboarding() {
  const draft = getOnboardingDraft();
  const store = getStoreState();

  if (draft.returning) {
    store.completeOnboarding();
  } else {
    const name = cleanName(draft.name);
    const answers: OnboardingAnswers = { name, interests: draft.interests };
    if (draft.experience) answers.experience = draft.experience;
    if (draft.goalMinutes !== null) answers.goalMinutes = draft.goalMinutes;
    store.completeOnboarding(answers);
    store.updateProfile({ email: demoEmailFor(name) });
    store.setSetting('notifications', draft.reminders);
    store.setReminderSlot(draft.reminderSlot);
  }

  haptics.success();
  // Pops back to the tab stack when it is underneath (logout), else replaces the flow with it.
  router.dismissTo('/');
}
