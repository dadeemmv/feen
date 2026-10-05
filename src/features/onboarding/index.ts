/**
 * Onboarding feature public API (first-run flow). Routes live in `src/app/onboarding/*`.
 *   welcome (/onboarding) → name → interests → level → pace → ready
 */
export { OnboardingLayout } from './onboarding-layout';
export { WelcomeScreen } from './screens/welcome-screen';
export { NameStepScreen } from './screens/name-screen';
export { InterestsStepScreen } from './screens/interests-screen';
export { LevelStepScreen } from './screens/level-screen';
export { PaceStepScreen } from './screens/pace-screen';
export { ReadyScreen } from './screens/ready-screen';
export { useOnboardingDraft, getOnboardingDraft, type OnboardingDraft } from './draft-store';
export { INTERESTS, getInterest, normalizeInterests, type Interest, type InterestId } from './data/interests';
export { finishOnboarding, STEP_HREF, WELCOME_HREF } from './steps';
