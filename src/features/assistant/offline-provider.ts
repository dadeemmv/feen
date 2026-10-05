/**
 * The offline coach: no network, no model. It answers from the curated knowledge base in
 * `@/content/assistant`, explains the current lesson step when asked about it, and otherwise
 * replies with a friendly fallback plus two suggested topics. A simulated 600–1100 ms "thinking"
 * delay keeps the typing indicator meaningful.
 */
import {
  EXPLAIN_MISTAKE_REQUEST,
  EXPLAIN_STEP_REQUEST,
  SUGGESTED_PROMPTS,
  explainMistake,
  explainStep,
  normalizeQuery,
} from '@/content';
import { shuffle } from '@/lib/random';

import { copy } from './copy';
import { matchKnowledgeBase, NO_ADVICE_ENTRY_ID } from './kb-match';
import type {
  AssistantContext,
  AssistantProvider,
  AssistantReplyOptions,
  AssistantRequest,
  AssistantResponse,
} from './types';

/** Simulated latency window (ms). */
export const OFFLINE_LATENCY = { min: 600, max: 1100 } as const;

const FALLBACK_SUGGESTIONS = 2;

/** Phrases that are unmistakably about the current step: the step explanation always wins. */
const STRONG_STEP_INTENTS = [
  'ho sbagliato',
  'sbagliat',
  'non capisco',
  'non ho capito',
  'non mi e chiaro',
  'non e chiaro',
  'spiegami meglio',
  'spiegamelo',
  'spiegami questo',
  'questa domanda',
  'questo passaggio',
  'questa risposta',
  'risposta giusta',
  'risposta corretta',
  'risposta esatta',
  'soluzione',
  'aiutami',
  'aiuto',
  'indizio',
  'suggerimento',
];

/**
 * "Tell me more / another way" follow-ups inside a lesson: repeating the step explanation would
 * not help, so the coach answers with the knowledge-base card of the step's topic instead.
 */
const ELABORATE_INTENTS = [
  'esempio',
  'esempi',
  'fammi capire',
  'piu semplice',
  'piu semplici',
  'semplificami',
  'parole semplici',
  'altre parole',
  'in breve',
  'riassum',
  'approfond',
  'dimmi di piu',
  'ancora non',
  'ancora capito',
  'ancora chiaro',
  'altro modo',
];

/** Generic "why / explain" words: the step explanation is used only when no topic matches. */
const WEAK_STEP_INTENTS = ['perche', 'come mai', 'spiega', 'cioe', 'in che senso', 'esempio', 'quindi'];

const EXPLICIT_REQUESTS = [EXPLAIN_MISTAKE_REQUEST, EXPLAIN_STEP_REQUEST].map((text) => normalizeQuery(text));

function includesPhrase(haystack: string, phrases: readonly string[]): boolean {
  return phrases.some((phrase) => haystack.includes(` ${phrase}`));
}

function hasContext(context: AssistantContext | undefined): context is AssistantContext {
  return !!context && !!(context.explanation || context.correctLabel || context.stepPrompt);
}

/** "Spiegami il perché" reply built from the lesson step (content templates). */
export function explainFromContext(context: AssistantContext): string {
  const body = context.correctLabel
    ? explainMistake(context.explanation, context.correctLabel)
    : explainStep(context.explanation);
  return body;
}

function pickSuggestions(question: string, context: AssistantContext | undefined): string[] {
  const asked = normalizeQuery(question);
  const pool = SUGGESTED_PROMPTS.filter((prompt) => normalizeQuery(prompt) !== asked);
  const picks = shuffle(pool, asked.trim() || 'finanz').slice(0, FALLBACK_SUGGESTIONS);
  if (!hasContext(context)) return picks;
  // Inside a lesson the most useful follow-up is the step itself.
  const stepRequest = context.correctLabel ? EXPLAIN_MISTAKE_REQUEST : EXPLAIN_STEP_REQUEST;
  return [stepRequest, picks[0]].filter((item): item is string => !!item);
}

/** Another angle on the step: its topic's knowledge-base card (undefined when none matches). */
function elaborateFromContext(context: AssistantContext): AssistantResponse | undefined {
  const topicText = [context.stepPrompt, context.explanation, context.correctLabel].filter(Boolean).join(' ');
  const entry = topicText ? matchKnowledgeBase(topicText) : undefined;
  if (!entry || (entry.priority ?? 0) < 0 || entry.id === NO_ADVICE_ENTRY_ID) return undefined;
  return {
    kind: 'explanation',
    text: `${copy.elaborateLead}\n\n${entry.answer}`,
    entryId: entry.id,
    chapterId: entry.chapterId,
  };
}

/** Pure answer logic (no latency) — exported for tests and for providers that wrap it. */
export function composeOfflineResponse({ question, context }: AssistantRequest): AssistantResponse {
  const haystack = normalizeQuery(question);
  const withContext = hasContext(context);

  if (withContext) {
    if (EXPLICIT_REQUESTS.includes(haystack)) return { kind: 'explanation', text: explainFromContext(context) };
    if (includesPhrase(haystack, ELABORATE_INTENTS)) {
      const elaborated = elaborateFromContext(context);
      if (elaborated) return elaborated;
    }
    if (includesPhrase(haystack, STRONG_STEP_INTENTS)) return { kind: 'explanation', text: explainFromContext(context) };
  }

  const entry = haystack.trim().length > 0 ? matchKnowledgeBase(question) : undefined;
  if (entry) {
    return { kind: 'answer', text: entry.answer, entryId: entry.id, chapterId: entry.chapterId };
  }

  if (withContext && includesPhrase(haystack, WEAK_STEP_INTENTS)) {
    return { kind: 'explanation', text: explainFromContext(context) };
  }

  return { kind: 'fallback', text: copy.fallbackLead, suggestions: pickSuggestions(question, context) };
}

function abortError(): Error {
  const error = new Error('La risposta è stata annullata');
  error.name = 'AbortError';
  return error;
}

/** Resolves after `ms`, or rejects early when the signal aborts. */
export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(abortError());
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function simulatedLatency(): number {
  return Math.round(OFFLINE_LATENCY.min + Math.random() * (OFFLINE_LATENCY.max - OFFLINE_LATENCY.min));
}

export const offlineProvider: AssistantProvider = {
  id: 'offline-kb',
  async respond(request: AssistantRequest, options: AssistantReplyOptions = {}) {
    await wait(simulatedLatency(), options.signal);
    return composeOfflineResponse(request);
  },
};
