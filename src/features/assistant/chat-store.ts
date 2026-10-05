/**
 * Coach conversations — a small persisted zustand store owned by the assistant feature
 * (`name: 'finanz-chat'`, AsyncStorage, versioned), separate from the app store because only
 * this feature reads it.
 *
 * Persisted: `conversations` (newest first). Session-only: `activeId` (`null` = a fresh, unsaved
 * chat — a conversation is created only when the first question is sent, and every cold start
 * opens on the greeting with the history one tap away), `introKey` (bumped by "Nuova chat" so
 * the greeting plays again), the reply in flight (`pendingId`), the message that should type
 * out (`freshMessageId`) and `hasHydrated`.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { Conversation, ThreadMessage } from './types';

export const CHAT_STORE_NAME = 'finanz-chat';
const CHAT_STORE_VERSION = 1;
/** Storage bounds: oldest conversations / messages are dropped beyond these. */
export const MAX_CONVERSATIONS = 30;
export const MAX_MESSAGES = 120;
const TITLE_MAX_LENGTH = 48;

type PersistedChat = { conversations: Conversation[] };

type ChatState = PersistedChat & {
  activeId: string | null;
  /** Remount key of the fresh-chat intro (greeting typed out again on every "Nuova chat"). */
  introKey: number;
  pendingId: string | null;
  freshMessageId: string | null;
  hasHydrated: boolean;
  /** Creates a conversation from its first message, makes it active and returns its id. */
  startConversation: (first: ThreadMessage) => string;
  appendMessage: (conversationId: string, message: ThreadMessage) => void;
  /** Drops one message (a failed reply before "Riprova"). */
  removeMessage: (conversationId: string, messageId: string) => void;
  /** `null` opens a fresh chat. */
  setActive: (conversationId: string | null) => void;
  /** Opens a fresh chat and replays the greeting. */
  startFresh: () => void;
  deleteConversation: (conversationId: string) => void;
  setPending: (conversationId: string | null) => void;
  setFresh: (messageId: string | null) => void;
  clearAll: () => void;
  markHydrated: () => void;
};

/** Static web rendering evaluates modules in Node, where AsyncStorage has no backend. */
const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};
const isServer = Platform.OS === 'web' && typeof window === 'undefined';

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** First question, single-lined and trimmed to a list-friendly length. */
export function titleFromText(text: string): string {
  const line = text.replace(/\s+/g, ' ').trim();
  if (line.length <= TITLE_MAX_LENGTH) return line;
  return `${line.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`;
}

function isMessage(value: unknown): value is ThreadMessage {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.text === 'string' &&
    typeof m.createdAt === 'number'
  );
}

function sanitizeConversation(value: unknown): Conversation | null {
  if (typeof value !== 'object' || value === null) return null;
  const c = value as Record<string, unknown>;
  if (typeof c.id !== 'string' || !Array.isArray(c.messages)) return null;
  const messages = c.messages.filter(isMessage).slice(-MAX_MESSAGES);
  if (messages.length === 0) return null;
  const createdAt = typeof c.createdAt === 'number' ? c.createdAt : messages[0].createdAt;
  return {
    id: c.id,
    title: typeof c.title === 'string' && c.title.length > 0 ? c.title : titleFromText(messages[0].text),
    createdAt,
    updatedAt: typeof c.updatedAt === 'number' ? c.updatedAt : messages[messages.length - 1].createdAt,
    messages,
  };
}

/** Drops malformed blobs instead of crashing the tab on a bad write. */
function mergePersisted(persisted: unknown, current: ChatState): ChatState {
  if (typeof persisted !== 'object' || persisted === null) return current;
  const p = persisted as Record<string, unknown>;
  const conversations = (Array.isArray(p.conversations) ? p.conversations : [])
    .map(sanitizeConversation)
    .filter((c): c is Conversation => c !== null)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_CONVERSATIONS);
  // A conversation opened before the blob arrived (very early tap) stays open if it still exists.
  const activeId = conversations.some((c) => c.id === current.activeId) ? current.activeId : null;
  return { ...current, conversations, activeId };
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      activeId: null,
      introKey: 0,
      pendingId: null,
      freshMessageId: null,
      hasHydrated: false,

      startConversation: (first) => {
        const id = createId('chat');
        const conversation: Conversation = {
          id,
          title: titleFromText(first.text),
          createdAt: first.createdAt,
          updatedAt: first.createdAt,
          messages: [first],
        };
        set((s) => ({
          conversations: [conversation, ...s.conversations].slice(0, MAX_CONVERSATIONS),
          activeId: id,
        }));
        return id;
      },

      appendMessage: (conversationId, message) =>
        set((s) => {
          const target = s.conversations.find((c) => c.id === conversationId);
          if (!target) return s;
          const updated: Conversation = {
            ...target,
            updatedAt: message.createdAt,
            messages: [...target.messages, message].slice(-MAX_MESSAGES),
          };
          return { conversations: [updated, ...s.conversations.filter((c) => c.id !== conversationId)] };
        }),

      removeMessage: (conversationId, messageId) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c,
          ),
        })),

      setActive: (conversationId) => set({ activeId: conversationId, freshMessageId: null }),
      startFresh: () => set((s) => ({ activeId: null, freshMessageId: null, introKey: s.introKey + 1 })),

      deleteConversation: (conversationId) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== conversationId),
          activeId: s.activeId === conversationId ? null : s.activeId,
          pendingId: s.pendingId === conversationId ? null : s.pendingId,
        })),

      setPending: (conversationId) => set({ pendingId: conversationId }),
      setFresh: (messageId) => set({ freshMessageId: messageId }),
      clearAll: () => set({ conversations: [], activeId: null, pendingId: null, freshMessageId: null }),
      markHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: CHAT_STORE_NAME,
      version: CHAT_STORE_VERSION,
      storage: createJSONStorage<PersistedChat>(() => (isServer ? serverStorage : AsyncStorage)),
      partialize: (s): PersistedChat => ({ conversations: s.conversations }),
      merge: mergePersisted,
      // Runs on success and on error, so the tab never waits forever. Uses the passed state (not
      // `useChatStore`): with a synchronous storage this runs before the store is assigned.
      onRehydrateStorage: (state) => () => state.markHydrated(),
    },
  ),
);

/** Imperative access for event handlers and async reply callbacks. */
export const getChatState = () => useChatStore.getState();

/** Logout: forget every conversation and wipe the persisted blob. */
export async function clearChatHistory() {
  useChatStore.getState().clearAll();
  await useChatStore.persist.clearStorage();
}
