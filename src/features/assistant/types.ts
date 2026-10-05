/**
 * Assistant feature types. `ChatMessage` and the `AssistantProvider` contract are public: the
 * lesson "Spiegami il perché" sheet and any future backend import them through `engine.ts`.
 */

/** One line of a conversation (exact public shape — other features rely on it). */
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
};

/** Lesson context passed by the lesson player so the coach can talk about the current step. */
export type AssistantContext = {
  /** The step's question / statement. */
  stepPrompt?: string;
  /** The step's `explanation` from the content layer. */
  explanation?: string;
  /** The right answer as text (`getCorrectAnswerLabel(step)`); set after a wrong answer. */
  correctLabel?: string;
};

export type AssistantRequest = {
  question: string;
  context?: AssistantContext;
  /** Earlier messages of the same conversation, oldest first (an LLM backend uses them). */
  history?: readonly ChatMessage[];
};

export type AssistantResponseKind = 'answer' | 'explanation' | 'fallback';

export type AssistantResponse = {
  /** Reply body. Supports "- " / "• " bullet lines and **bold** spans. */
  text: string;
  kind: AssistantResponseKind;
  /** Knowledge-base entry that produced the answer (offline provider only). */
  entryId?: string;
  /** Main-course chapter that covers the topic ("Ripassa nel percorso" link). */
  chapterId?: string;
  /** Follow-up questions the UI can offer as chips (fallback replies). */
  suggestions?: string[];
};

export type AssistantReplyOptions = {
  /** Cancels the pending reply (the promise rejects with an `AbortError`). */
  signal?: AbortSignal;
};

/**
 * The seam between the chat UI and whatever produces the answers.
 *
 * Today the app ships `offlineProvider` (keyword-scored knowledge base, simulated latency, works
 * without network). A real LLM backend replaces it without touching any screen:
 *
 *   const llmProvider: AssistantProvider = {
 *     id: 'llm',
 *     async respond({ question, context, history }, { signal } = {}) {
 *       const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ question, context, history }), signal });
 *       const { text, chapterId } = await res.json();
 *       return { kind: 'answer', text, chapterId };
 *     },
 *   };
 *   setAssistantProvider(llmProvider);   // once, at startup
 *
 * Providers must return educational answers only (never personalised financial advice) and may
 * throw: the chat UI shows an inline error with a "Riprova" action.
 */
export interface AssistantProvider {
  readonly id: string;
  respond(request: AssistantRequest, options?: AssistantReplyOptions): Promise<AssistantResponse>;
}

/** Extra data kept next to a stored message (UI affordances under the bubble). */
export type MessageMeta = {
  chapterId?: string;
  /** Knowledge-base entry behind the reply (decides "Ripassa: capitolo" vs "Apri il percorso"). */
  entryId?: string;
  suggestions?: string[];
  /** The reply failed: the bubble shows an error and "Riprova" re-asks `retryQuestion`. */
  error?: boolean;
  retryQuestion?: string;
};

/** A message as persisted in a conversation. */
export type ThreadMessage = ChatMessage & { meta?: MessageMeta };

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ThreadMessage[];
};
