/**
 * Companion characters feature: the money-compass test ("Che tipo sei con i soldi?"), its four
 * quadrants and the "Il tuo personaggio" page (/mascot). Data and copy of the characters live in
 * `@/content/personality`; the artwork in `@/components/illustrations` (`MascotArt`).
 */
export { MascotScreen } from './screens/mascot-screen';
export { PersonalityQuiz, type PersonalityQuizProps } from './components/personality-quiz';
export { MascotReveal, type MascotRevealProps } from './components/mascot-reveal';
export { MascotLineup, type MascotLineupProps } from './components/mascot-lineup';
export { LikertScale, type LikertScaleProps } from './components/likert-scale';
export { MoneyCompass, type MoneyCompassProps } from './components/money-compass';
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
