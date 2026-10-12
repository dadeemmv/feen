/**
 * Onboarding feature public API (first-run flow). Routes live in `src/app/onboarding/*`.
 *   welcome (/onboarding) → name → level → test → quiz → mascot → pact → stone → village
 */
export { OnboardingLayout } from './onboarding-layout';
export { WelcomeScreen } from './screens/welcome-screen';
export { NameStepScreen } from './screens/name-screen';
export { TestIntroScreen } from './screens/test-intro-screen';
export { QuizStepScreen } from './screens/quiz-screen';
export { MascotRevealScreen } from './screens/mascot-reveal-screen';
export { LevelStepScreen } from './screens/level-screen';
export { PactStepScreen } from './screens/pact-screen';
export { StoneScreen } from './screens/stone-screen';
export { VillageNameScreen } from './screens/village-name-screen';
export { useOnboardingDraft, getOnboardingDraft, type OnboardingDraft } from './draft-store';
export { INTERESTS, getInterest, normalizeInterests, type Interest, type InterestId } from './data/interests';
export { finishOnboarding, STEP_HREF, WELCOME_HREF } from './steps';
