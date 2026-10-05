/**
 * The personality quiz inside onboarding: answers live in the (non-persisted) draft, so going back
 * to the intro and in again resumes at the same statement. The last answer opens the reveal.
 */
import { Redirect, router } from 'expo-router';

import { PersonalityQuiz } from '@/features/mascots/components/personality-quiz';

import { useOnboardingDraft } from '../draft-store';
import { allowedStep, goToPreviousStep, STEP_HREF } from '../steps';

export function QuizStepScreen() {
  const draft = useOnboardingDraft();
  const allowed = allowedStep('quiz', draft);
  if (allowed !== 'quiz') return <Redirect href={STEP_HREF[allowed]} />;

  return (
    <PersonalityQuiz
      answers={draft.quizAnswers}
      index={draft.quizIndex}
      onAnswer={draft.setQuizAnswer}
      onIndexChange={draft.setQuizIndex}
      onComplete={() => router.push(STEP_HREF.mascot)}
      onExit={goToPreviousStep}
    />
  );
}
