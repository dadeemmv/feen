/**
 * What the "Spiegami il perché" assistant says about the current step (pure).
 *
 * Modes, decided when the sheet opens:
 * - `mistake`: the learner got it wrong → "Spiegami perché ho sbagliato", the reply names the
 *   right answer and explains it (content `explainMistake` via the assistant engine).
 * - `solved`: answered correctly → full explanation (`explainStep`).
 * - `hint`: a graded step not answered yet → a nudge that does NOT give the answer away.
 * - `concept`: info / definition step → the key point of the card.
 */
import type { AssistantContext } from '@/features/assistant/engine';
import { EXPLAIN_MISTAKE_REQUEST, EXPLAIN_STEP_REQUEST, explainMistake, explainStep, findKbEntry } from '@/content/assistant';
import { getCorrectAnswerLabel } from '@/content/lessons';
import { isGradedStep, type GradedStep, type LessonStep } from '@/content/types';

import { COPY } from '../copy';
import type { LessonState } from '../machine';

export type ExplainMode = 'mistake' | 'solved' | 'hint' | 'concept';

export function explainModeFor(state: Pick<LessonState, 'phase' | 'attempts' | 'mistakeStepIds'>, step: LessonStep): ExplainMode {
  if (!isGradedStep(step)) return 'concept';
  if (state.attempts > 0 || state.mistakeStepIds.includes(step.id)) return 'mistake';
  if (state.phase === 'feedback-correct' || state.phase === 'completed') return 'solved';
  return 'hint';
}

/** The bubble the learner "sends" when the sheet opens. */
export const openingRequest = (mode: ExplainMode): string =>
  mode === 'mistake' ? EXPLAIN_MISTAKE_REQUEST : EXPLAIN_STEP_REQUEST;

export function stepPromptOf(step: LessonStep): string {
  switch (step.type) {
    case 'choice':
    case 'match':
    case 'order':
      return step.prompt;
    case 'fill':
      return `${step.prompt}: ${step.sentence}`;
    case 'true-false':
      return step.statement;
    case 'info':
    case 'definition':
      return `${step.title}. ${step.lead}`;
  }
}

/** Context handed to the assistant engine. A `hint` never carries the answer. */
export function contextFor(mode: ExplainMode, step: LessonStep): AssistantContext {
  const stepPrompt = stepPromptOf(step);
  if (mode === 'hint') return { stepPrompt };
  if (mode === 'mistake' && isGradedStep(step)) {
    return { stepPrompt, explanation: step.explanation, correctLabel: getCorrectAnswerLabel(step) };
  }
  return { stepPrompt, explanation: step.explanation };
}

const HINTS: Record<GradedStep['type'], string> = {
  choice:
    'Rileggi la domanda con calma: spesso la parola chiave è un dettaglio, come un numero o un “oggi”. Poi scarta le opzioni che ti convincono meno.',
  'true-false':
    'Occhio alle parole assolute come “sempre”, “mai” o “esattamente”: basta un’eccezione per rendere falsa un’affermazione.',
  fill: 'Leggi la frase intera provando ogni opzione al posto dello spazio: quale ha davvero senso?',
  match: 'Parti dal termine che conosci meglio: abbinarlo per primo riduce le possibilità per gli altri.',
  order: 'Chiediti cosa deve succedere per primo: ogni passaggio è la conseguenza di quello prima.',
};

/** Local nudge for an unanswered graded step. */
export function buildHint(step: GradedStep, chapterTitle: string): string {
  return [
    COPY.explain.hintOpener,
    HINTS[step.type],
    `Il tema è **${chapterTitle}**: se qualcosa non ti torna, scrivimelo qui sotto.`,
    COPY.explain.hintClosing,
  ].join('\n\n');
}

/** Offline fallback when the engine fails: same content templates, no network. */
export function localReply(mode: ExplainMode, step: LessonStep, chapterTitle: string): string {
  if (mode === 'hint' && isGradedStep(step)) return buildHint(step, chapterTitle);
  if (mode === 'mistake' && isGradedStep(step)) return explainMistake(step.explanation, getCorrectAnswerLabel(step));
  return explainStep(step.explanation);
}

// ── Quick replies (chips under the latest answer) ──

export type SuggestionKind = keyof typeof COPY.explain.suggestions;

/** Chips offered after a reply. The answer chip only where the answer was not given yet. */
export function suggestionsFor(mode: ExplainMode): SuggestionKind[] {
  return mode === 'hint' ? ['simpler', 'example', 'answer'] : ['simpler', 'example'];
}

/** Up to the first sentence end (". ", "! ", "? ", "… " or the end of the text). */
const firstSentence = (text: string): string => /^[\s\S]*?[.!?…](?=\s|$)/.exec(text.trim())?.[0] ?? text.trim();

/** "Spiegamelo più semplice": the key sentence of the explanation (+ the answer once known). */
function simplerReply(step: LessonStep, mode: ExplainMode): string {
  const core = firstSentence(step.explanation ?? '') || COPY.explain.simplerFallback;
  const lines = [COPY.explain.simplerOpener, `**${core}**`];
  if (isGradedStep(step) && (mode === 'mistake' || mode === 'solved')) {
    lines.push(COPY.explain.answerIs(getCorrectAnswerLabel(step)));
  }
  return lines.join('\n\n');
}

/**
 * Another angle on the same idea: the knowledge-base card of the step topic (matched on the
 * chapter title first, then on the step text), or the simpler version when nothing matches.
 */
export function alternateReply(step: LessonStep, mode: ExplainMode, chapterTitle: string): string {
  const entry = findKbEntry(chapterTitle) ?? findKbEntry(stepPromptOf(step));
  if (!entry) return simplerReply(step, mode);
  return [COPY.explain.exampleOpener, entry.answer].join('\n\n');
}

/** Local reply to a quick-reply chip (deterministic, offline). */
export function suggestionReply(kind: SuggestionKind, step: LessonStep, mode: ExplainMode, chapterTitle: string): string {
  switch (kind) {
    case 'simpler':
      return simplerReply(step, mode);
    case 'example':
      return alternateReply(step, mode, chapterTitle);
    case 'answer':
      return isGradedStep(step) ? explainMistake(step.explanation, getCorrectAnswerLabel(step)) : explainStep(step.explanation);
  }
}
