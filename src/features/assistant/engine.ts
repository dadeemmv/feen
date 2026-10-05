/**
 * Assistant engine — the one entry point other features use:
 *
 *   import { getAssistantReply, useTypewriter, type ChatMessage } from '@/features/assistant/engine';
 *   const text = await getAssistantReply({ question: EXPLAIN_MISTAKE_REQUEST, context: { explanation, correctLabel } });
 *
 * Architecture: screens → engine → `AssistantProvider`. The default provider is the offline
 * knowledge base (`offline-provider.ts`). To plug in a real LLM backend, implement
 * `AssistantProvider` (see `types.ts` for a sketch) and call `setAssistantProvider(provider)` once
 * at startup; nothing else changes — the chat UI, the lesson sheet and the typewriter keep working.
 */
import { copy } from './copy';
import { offlineProvider } from './offline-provider';
import type {
  AssistantContext,
  AssistantProvider,
  AssistantReplyOptions,
  AssistantRequest,
  AssistantResponse,
} from './types';

export type {
  AssistantContext,
  AssistantProvider,
  AssistantReplyOptions,
  AssistantRequest,
  AssistantResponse,
  AssistantResponseKind,
  ChatMessage,
} from './types';
export { useTypewriter, type TypewriterOptions, type TypewriterState } from './use-typewriter';

let activeProvider: AssistantProvider = offlineProvider;

/** Swap the answer source (e.g. an LLM backend). Returns the previous provider. */
export function setAssistantProvider(provider: AssistantProvider): AssistantProvider {
  const previous = activeProvider;
  activeProvider = provider;
  return previous;
}

export function getAssistantProvider(): AssistantProvider {
  return activeProvider;
}

/** Structured reply (text + chapter link + suggestion chips) — used by the Coach tab. */
export function getAssistantResponse(
  request: AssistantRequest,
  options?: AssistantReplyOptions,
): Promise<AssistantResponse> {
  return activeProvider.respond(request, options);
}

/** Response → one plain message: fallback suggestions become a bullet list. */
export function formatResponseText(response: AssistantResponse): string {
  if (!response.suggestions?.length) return response.text;
  const bullets = response.suggestions.map((suggestion) => `- ${suggestion}`).join('\n');
  return `${response.text}\n\n${copy.fallbackTryLabel}\n${bullets}`;
}

/**
 * Plain-text reply (lesson "Spiegami il perché" sheet and any other caller). Resolves after the
 * provider's latency; rejects only on abort or a provider error.
 */
export async function getAssistantReply(input: {
  question: string;
  context?: AssistantContext;
}): Promise<string> {
  const response = await getAssistantResponse({ question: input.question, context: input.context });
  return formatResponseText(response);
}
