/**
 * Affordances under an assistant reply in the Coach tab:
 * - failed reply → "Riprova" (re-asks the same question);
 * - topic covered by the course → "Ripassa: <capitolo>" opens the learning path;
 * - fallback reply → follow-up question pills (latest reply only).
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { BookOpen, RotateCcw } from 'lucide-react-native';

import { Button } from '@/components/ui';
import { getChapter, getCourseForChapter, orderedChapterIds } from '@/content';
import { spacing } from '@/theme';

import { retryReply, sendQuestion } from '../chat-actions';
import { copy } from '../copy';
import type { MessageMeta, ThreadMessage } from '../types';
import { SuggestedPrompts } from './suggested-prompts';

export type MessageExtrasProps = {
  conversationId: string;
  message: ThreadMessage;
  /** Only the latest reply offers follow-ups and retry. */
  isLatest: boolean;
  /** A reply is being written in this conversation. */
  busy: boolean;
};

/**
 * Learning-path link under a reply. A topic answer reviews its chapter ("Ripassa: Inflazione");
 * an answer about the whole journey that points at the course's opening chapter (e.g. "come
 * inizio a investire?") opens the course instead ("Apri il percorso").
 */
function courseLink(meta: MessageMeta): { title: string; courseId: string } | undefined {
  const chapterId = meta.chapterId;
  if (!chapterId) return undefined;
  const chapter = getChapter(chapterId);
  const course = getCourseForChapter(chapterId);
  if (!chapter || !course) return undefined;
  const aboutCourse = !!meta.entryId && meta.entryId !== chapterId && orderedChapterIds(course.id)[0] === chapterId;
  return { title: aboutCourse ? copy.openCourse : copy.reviewChapter(chapter.title), courseId: course.id };
}

/** True when `MessageExtras` would render something for this message. */
export function hasMessageExtras(message: ThreadMessage, isLatest: boolean): boolean {
  const meta = message.meta;
  if (!meta || message.role !== 'assistant') return false;
  if (meta.error) return isLatest;
  return !!(meta.chapterId && getChapter(meta.chapterId)) || (isLatest && !!meta.suggestions?.length);
}

export function MessageExtras({ conversationId, message, isLatest, busy }: MessageExtrasProps) {
  const meta = message.meta;
  if (!meta) return null;

  if (meta.error) {
    if (!isLatest) return null;
    return (
      <Button
        title={copy.retry}
        variant="secondary"
        size="sm"
        iconLeft={RotateCcw}
        disabled={busy}
        onPress={() => retryReply(conversationId, message.id)}
      />
    );
  }

  const link = courseLink(meta);
  const suggestions = isLatest ? (meta.suggestions ?? []) : [];

  return (
    <View style={styles.stack}>
      {link ? (
        <Button
          title={link.title}
          variant="secondary"
          size="sm"
          iconLeft={BookOpen}
          accessibilityHint={copy.reviewChapterHint}
          onPress={() => router.push({ pathname: '/course/[id]', params: { id: link.courseId } })}
        />
      ) : null}
      {suggestions.length > 0 ? (
        <SuggestedPrompts
          layout="wrap"
          prompts={suggestions}
          disabled={busy}
          onSelect={(prompt) => sendQuestion(prompt)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.sm, alignItems: 'flex-start' },
});
