/**
 * The four animals: the test ("Che animale sei con i soldi?"), the result with the partner and
 * the "Il tuo personaggio" page (/mascot). Data and copy of the characters live in
 * `@/content/personality`; the artwork in `@/components/illustrations` (`MascotArt`).
 */
export { MascotScreen } from './screens/mascot-screen';
export { PersonalityQuiz, type PersonalityQuizProps } from './components/personality-quiz';
export { MascotReveal, YouAreTitle, type MascotRevealProps } from './components/mascot-reveal';
export { MascotLineup, type MascotLineupProps } from './components/mascot-lineup';
export { ChoiceScale, type ChoiceScaleProps } from './components/choice-scale';
export { AxesGrid, type AxesGridProps } from './components/axes-grid';
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
