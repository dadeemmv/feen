/**
 * Companion mascots feature: the money-personality test ("Che tipo sei con i soldi?"), its four
 * results and the "Il tuo compagno" page (/mascot). Data and copy of the mascots live in
 * `@/content/personality`; the artwork in `@/components/illustrations` (`MascotArt`).
 */
export { MascotScreen } from './screens/mascot-screen';
export { PersonalityQuiz, type PersonalityQuizProps } from './components/personality-quiz';
export { MascotReveal, type MascotRevealProps } from './components/mascot-reveal';
export { MascotLineup, type MascotLineupProps } from './components/mascot-lineup';
export { LikertScale, type LikertScaleProps } from './components/likert-scale';
export { TraitBar, type TraitBarProps } from './components/trait-bar';
export {
  axisLean,
  countAnswered,
  firstUnanswered,
  isQuizComplete,
  mascotFor,
  QUIZ_LENGTH,
  scorePersonality,
  type QuizAnswers,
} from './lib/score';
export { MASCOT_COPY } from './copy';
export { mascotMetrics } from './metrics';
