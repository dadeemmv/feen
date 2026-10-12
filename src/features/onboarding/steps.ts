/**
 * The onboarding step registry: order, routes, completion rules and the final commit.
 *   welcome (/onboarding) → name → level → test (intro) → quiz → mascot (result, the partner)
 *   → pact (sign, countersigned with the wax seal) → stone (first stone laid) → village (its name)
 * The three question steps (name, level, test) show the progress bar; the quiz has its own
 * counter; mascot, pact, stone and village are full-screen moments. Nothing is written to the
 * profile until "Entra nel borgo" (`finishOnboarding`).
 */
import { router, type Href } from 'expo-router';

import { getMascot } from '@/content/personality';
import { isQuizComplete, scorePersonality } from '@/features/mascots/lib/score';
import { slotForWhen } from '@/features/pact/data';
import { haptics } from '@/lib/haptics';
import { getStoreState, type OnboardingAnswers } from '@/store';

import { cleanName, demoEmailFor, validateName } from './data/name';
import { getOnboardingDraft, type OnboardingDraft } from './draft-store';

export const QUESTION_STEPS = ['name', 'level', 'test'] as const;
export type QuestionStep = (typeof QUESTION_STEPS)[number];
export type StepId = QuestionStep | 'quiz' | 'mascot' | 'pact' | 'stone' | 'village';

export const STEP_HREF = {
  name: '/onboarding/name',
  level: '/onboarding/level',
  test: '/onboarding/test',
  quiz: '/onboarding/quiz',
  mascot: '/onboarding/mascot',
  pact: '/onboarding/pact',
  stone: '/onboarding/stone',
  village: '/onboarding/village',
} as const satisfies Record<StepId, Href>;

export const WELCOME_HREF = '/onboarding' as const satisfies Href;

const STEP_DONE: Record<QuestionStep, (draft: OnboardingDraft) => boolean> = {
  name: (draft) => validateName(draft.name) === null,
  level: (draft) => draft.experience !== null,
  test: (draft) => isQuizComplete(draft.quizAnswers),
};

export const isStepDone = (step: QuestionStep, draft: OnboardingDraft) => STEP_DONE[step](draft);

/** 1-based position in the progress bar. */
export const stepNumber = (step: QuestionStep) => QUESTION_STEPS.indexOf(step) + 1;

/** The question steps that must be answered before `step` can be shown. */
function prerequisites(step: StepId): readonly QuestionStep[] {
  switch (step) {
    case 'quiz':
      return QUESTION_STEPS.slice(0, QUESTION_STEPS.indexOf('test'));
    case 'mascot':
    case 'pact':
    case 'stone':
    case 'village':
      return QUESTION_STEPS;
    default:
      return QUESTION_STEPS.slice(0, QUESTION_STEPS.indexOf(step));
  }
}

/**
 * The step a deep link / web refresh may show: the first unanswered step before `step` (the
 * draft is not persisted), or `step` itself when everything before it is answered. The first
 * stone and the village name need the signed pact.
 */
export function allowedStep(step: StepId, draft: OnboardingDraft): StepId {
  const open = prerequisites(step).find((s) => !isStepDone(s, draft));
  if (open) return open;
  if ((step === 'stone' || step === 'village') && draft.signature === null) return 'pact';
  return step;
}

/** Forward from a question step: the test intro opens the quiz, the others the next step. */
export function goToNextStep(step: QuestionStep) {
  if (step === 'test') {
    router.push(STEP_HREF.quiz);
    return;
  }
  const next = QUESTION_STEPS[QUESTION_STEPS.indexOf(step) + 1] ?? 'test';
  router.push(STEP_HREF[next]);
}

/** Back inside the flow; a deep-linked step without history goes to the welcome screen. */
export function goToPreviousStep() {
  if (router.canGoBack()) router.back();
  else router.replace(WELCOME_HREF);
}

/** The draft's test result (the animal is decided by the first test). */
export const draftPersonality = (draft: OnboardingDraft) => scorePersonality(draft.quizAnswers);

/**
 * "Entra nel borgo": writes the profile, the signed pact and the village name, and enters the
 * village. "Ho già un account" keeps the saved profile instead.
 */
export function finishOnboarding() {
  const draft = getOnboardingDraft();
  const store = getStoreState();

  if (draft.returning) {
    store.completeOnboarding();
  } else {
    const name = cleanName(draft.name);
    const personality = isQuizComplete(draft.quizAnswers) ? draftPersonality(draft) : undefined;
    const answers: OnboardingAnswers = { name, goalMinutes: draft.pactMinutes };
    if (draft.experience) answers.experience = draft.experience;
    if (personality) answers.personality = personality;
    if (draft.villageName.trim()) answers.villageName = draft.villageName.trim();
    store.completeOnboarding(answers);
    store.updateProfile({ email: demoEmailFor(name) });
    if (draft.signature && draft.signedAt) {
      store.signPact(
        { why: draft.pactWhy, minutes: draft.pactMinutes, days: draft.pactDays, when: draft.pactWhen, signature: draft.signature },
        draft.signedAt,
      );
    }
    store.setSetting('notifications', true);
    store.setReminderSlot(slotForWhen(draft.pactWhen));
    // The partner opens the first site: the blind spot, covered with the superpower (the first
    // start building that has lessons and can open).
    if (personality) getMascot(personality.mascot).startBuildings.some((id) => store.openSite(id).ok);
  }

  haptics.success();
  // Pops back to the tab stack when it is underneath (logout), else replaces the flow with it.
  router.dismissTo('/');
}
