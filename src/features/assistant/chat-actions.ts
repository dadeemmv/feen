/**
 * Coach conversation flow, outside React so a reply always lands in the conversation that asked
 * for it (even after the user switched chat, tab or closed the sheet):
 *
 *   send → user message stored (a fresh chat becomes a conversation) → `pendingId` (typing dots,
 *   orb "thinking") → engine reply → assistant message stored and marked fresh (typewriter).
 *
 * A provider error stores an error bubble with "Riprova", which re-asks the same question.
 */
import { AccessibilityInfo } from 'react-native';

import { haptics } from '@/lib/haptics';

import { createId, getChatState } from './chat-store';
import { copy } from './copy';
import { getAssistantResponse } from './engine';
import { toPlainText } from './markdown-lite';
import { MAX_QUESTION_LENGTH } from './metrics';
import type { ChatMessage, ThreadMessage } from './types';

/** Messages handed to the provider as conversation history (an LLM backend uses them). */
const HISTORY_WINDOW = 12;

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function historyFor(conversationId: string): ChatMessage[] {
  const conversation = getChatState().conversations.find((c) => c.id === conversationId);
  if (!conversation) return [];
  return conversation.messages
    .filter((m) => !m.meta?.error)
    .slice(-HISTORY_WINDOW - 1, -1)
    .map(({ id, role, text, createdAt }) => ({ id, role, text, createdAt }));
}

async function requestReply(conversationId: string, question: string): Promise<void> {
  const chat = getChatState();
  chat.setPending(conversationId);
  try {
    const response = await getAssistantResponse({ question, history: historyFor(conversationId) });
    const reply: ThreadMessage = {
      id: createId('msg'),
      role: 'assistant',
      text: response.text,
      createdAt: Date.now(),
      meta:
        response.chapterId || response.suggestions?.length
          ? { chapterId: response.chapterId, entryId: response.entryId, suggestions: response.suggestions }
          : undefined,
    };
    getChatState().appendMessage(conversationId, reply);
    if (getChatState().activeId === conversationId) {
      getChatState().setFresh(reply.id);
      haptics.selection();
      AccessibilityInfo.announceForAccessibility(toPlainText(reply.text));
    }
  } catch (error) {
    if (isAbort(error)) return;
    getChatState().appendMessage(conversationId, {
      id: createId('msg'),
      role: 'assistant',
      text: copy.errorReply,
      createdAt: Date.now(),
      meta: { error: true, retryQuestion: question },
    });
  } finally {
    if (getChatState().pendingId === conversationId) getChatState().setPending(null);
  }
}

/**
 * Sends a question from the active chat. Returns false when there is nothing to send or a reply
 * is already being written in this chat.
 */
export function sendQuestion(rawText: string): boolean {
  const text = rawText.trim().slice(0, MAX_QUESTION_LENGTH);
  const chat = getChatState();
  if (text.length === 0) return false;
  if (chat.activeId !== null && chat.pendingId === chat.activeId) return false;

  const message: ThreadMessage = { id: createId('msg'), role: 'user', text, createdAt: Date.now() };
  const existing = chat.activeId !== null && chat.conversations.some((c) => c.id === chat.activeId);
  let conversationId: string;
  if (existing && chat.activeId !== null) {
    conversationId = chat.activeId;
    chat.appendMessage(conversationId, message);
  } else {
    conversationId = chat.startConversation(message);
  }
  // Whatever was still typing out is shown in full: the new exchange takes the stage.
  chat.setFresh(null);
  void requestReply(conversationId, text);
  return true;
}

/** "Riprova" on a failed reply: removes the error bubble and asks again. */
export function retryReply(conversationId: string, errorMessageId: string): void {
  const chat = getChatState();
  if (chat.pendingId === conversationId) return;
  const conversation = chat.conversations.find((c) => c.id === conversationId);
  const failed = conversation?.messages.find((m) => m.id === errorMessageId);
  const question = failed?.meta?.retryQuestion;
  if (!question) return;
  chat.removeMessage(conversationId, errorMessageId);
  void requestReply(conversationId, question);
}

/** "Nuova chat": a blank chat with the greeting typed out again. */
export function startNewChat(): void {
  getChatState().startFresh();
}

export function openConversation(conversationId: string): void {
  getChatState().setActive(conversationId);
}

export function deleteConversation(conversationId: string): void {
  getChatState().deleteConversation(conversationId);
}
