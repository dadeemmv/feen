/**
 * Conversation state of the "Spiegami il perché" sheet. One conversation per (step, mode): reopening
 * the sheet on the same step shows the same thread instead of asking again. Replies come from the
 * assistant engine (offline knowledge base today, an LLM provider later) with a minimum "thinking"
 * time so the typing dots read as intentional; a failing provider falls back to the local
 * content templates, so the sheet never ends up empty.
 */
import { useEffect, useRef, useState } from 'react';

import { getAssistantReply } from '@/features/assistant/engine';
import type { LessonStep } from '@/content/types';

import { COPY } from '../copy';
import { THINKING_MS } from '../metrics';
import {
  alternateReply,
  contextFor,
  localReply,
  openingRequest,
  suggestionReply,
  suggestionsFor,
  type ExplainMode,
  type SuggestionKind,
} from './explain-content';

export type ExplainMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Not shown yet: the bubble types itself out. */
  fresh: boolean;
};

type Thread = {
  key: string;
  mode: ExplainMode | null;
  messages: ExplainMessage[];
  thinking: boolean;
  usedSuggestions: SuggestionKind[];
};

const EMPTY: Thread = { key: '', mode: null, messages: [], thinking: false, usedSuggestions: [] };

let messageSeq = 0;
const nextId = () => {
  messageSeq += 1;
  return `m${messageSeq}`;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export type ExplainTopic = { step: LessonStep; mode: ExplainMode; chapterTitle: string };

export function useExplainChat() {
  const [thread, setThread] = useState<Thread>(EMPTY);
  const topicRef = useRef<ExplainTopic | null>(null);
  // Ignore replies that land after the thread changed or the screen unmounted.
  const tokenRef = useRef(0);
  useEffect(
    () => () => {
      tokenRef.current += 1;
    },
    [],
  );

  const reply = async (key: string, produce: () => Promise<string>, fallback: () => string) => {
    const token = tokenRef.current;
    const topic = topicRef.current;
    let text: string;
    try {
      const [answer] = await Promise.all([produce(), sleep(THINKING_MS)]);
      text = answer.trim() || fallback();
    } catch {
      text = fallback();
    }
    if (token !== tokenRef.current) return;
    setThread((current) => {
      if (current.key !== key) return current;
      // Never repeat a reply word for word: offer another angle on the same idea instead.
      const said = new Set(current.messages.filter((m) => m.role === 'assistant').map((m) => m.text));
      const candidates = topic
        ? [
            text,
            alternateReply(topic.step, topic.mode, topic.chapterTitle),
            suggestionReply('simpler', topic.step, topic.mode, topic.chapterTitle),
          ]
        : [text];
      const finalText = candidates.find((candidate) => !said.has(candidate)) ?? text;
      return {
        ...current,
        thinking: false,
        messages: [...current.messages, { id: nextId(), role: 'assistant', text: finalText, fresh: true }],
      };
    });
  };

  /** Opens (or resumes) the conversation about a step. */
  const open = (topic: ExplainTopic) => {
    const key = `${topic.step.id}:${topic.mode}`;
    topicRef.current = topic;
    if (thread.key === key) return;
    tokenRef.current += 1;
    const question = openingRequest(topic.mode);
    setThread({
      key,
      mode: topic.mode,
      thinking: true,
      usedSuggestions: [],
      messages: [{ id: nextId(), role: 'user', text: question, fresh: false }],
    });
    const fallback = () => localReply(topic.mode, topic.step, topic.chapterTitle);
    void reply(
      key,
      () =>
        topic.mode === 'hint'
          ? Promise.resolve(fallback())
          : getAssistantReply({ question, context: contextFor(topic.mode, topic.step) }),
      fallback,
    );
  };

  /** Follow-up question typed in the composer. */
  const ask = (raw: string) => {
    const question = raw.trim();
    const topic = topicRef.current;
    if (!question || !topic || thread.thinking) return;
    const key = thread.key;
    setThread((current) => ({
      ...current,
      thinking: true,
      messages: [...current.messages, { id: nextId(), role: 'user', text: question, fresh: false }],
    }));
    void reply(
      key,
      () => getAssistantReply({ question, context: contextFor(topic.mode, topic.step) }),
      () => localReply(topic.mode, topic.step, topic.chapterTitle),
    );
  };

  /** Quick-reply chip: answered locally from the step content (no engine round-trip needed). */
  const suggest = (kind: SuggestionKind) => {
    const topic = topicRef.current;
    if (!topic || thread.thinking || thread.usedSuggestions.includes(kind)) return;
    const key = thread.key;
    setThread((current) => ({
      ...current,
      thinking: true,
      usedSuggestions: [...current.usedSuggestions, kind],
      messages: [...current.messages, { id: nextId(), role: 'user', text: COPY.explain.suggestions[kind], fresh: false }],
    }));
    const produce = () => suggestionReply(kind, topic.step, topic.mode, topic.chapterTitle);
    void reply(key, () => Promise.resolve(produce()), produce);
  };

  const last = thread.messages[thread.messages.length - 1];
  const suggestions =
    thread.mode && !thread.thinking && last?.role === 'assistant'
      ? suggestionsFor(thread.mode).filter((kind) => !thread.usedSuggestions.includes(kind))
      : [];

  /** Stops the typewriter on closed sheets: reopening shows the replies in full. */
  const settle = () =>
    setThread((current) =>
      current.messages.some((m) => m.fresh)
        ? { ...current, messages: current.messages.map((m) => (m.fresh ? { ...m, fresh: false } : m)) }
        : current,
    );

  return { messages: thread.messages, thinking: thread.thinking, suggestions, open, ask, suggest, settle };
}
