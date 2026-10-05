/**
 * "Spiegami il perché" — the AI tutor sheet of the lesson player (spec §3.10, strips s_14/s_15).
 * Opens with the learner's request bubble ("Spiegami perché ho sbagliato" after a mistake,
 * "Spiegami meglio questo passaggio" otherwise), shows the typing dots for ~1.2 s, then the
 * answer types itself out. The composer asks follow-up questions to the assistant engine.
 * The lesson is paused underneath (nothing advances while the sheet is open).
 */
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';

import { AssistantOrb } from '@/components/illustrations';
import { Chip, IconButton, Sheet, Text, TextField, avatarSize, hairline, useReduceMotion } from '@/components/ui';
import { ASSISTANT_DISCLAIMER, ASSISTANT_INPUT_PLACEHOLDER } from '@/content/assistant';
import { isWeb } from '@/lib/platform';
import { duration, spacing, useTheme } from '@/theme';

import { COPY } from './copy';
import { EXPLAIN_THREAD } from './metrics';
import { AssistantBubble, TypingBubble, UserBubble } from './explain/chat-bubbles';
import { useExplainChat, type ExplainTopic } from './explain/use-explain-chat';

export type ExplainSheetProps = {
  visible: boolean;
  /** What to talk about; read when the sheet opens. */
  topic: ExplainTopic | null;
  onClose: () => void;
};

function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (isWeb) return;
    const show = Keyboard.addListener('keyboardDidShow', (event) => setHeight(event.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return height;
}

export function ExplainSheet({ visible, topic, onClose }: ExplainSheetProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const chat = useExplainChat();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardHeight();

  const onOpen = useEffectEvent(() => {
    if (topic) chat.open(topic);
  });
  useEffect(() => {
    if (visible) onOpen();
  }, [visible]);

  const room = windowHeight - keyboard - insets.top - EXPLAIN_THREAD.chrome;
  const threadHeight = Math.max(EXPLAIN_THREAD.min, Math.min(Math.round(windowHeight * EXPLAIN_THREAD.ratio), room));
  const canSend = draft.trim().length > 0 && !chat.thinking;
  const firstReplyIndex = chat.messages.findIndex((m) => m.role === 'assistant');

  const send = () => {
    if (!canSend) return;
    chat.ask(draft);
    setDraft('');
  };

  const composer = (
    <View style={[styles.composer, { borderTopColor: theme.colors.borderSubtle }]}>
      <TextField
        shape="pill"
        size="md"
        placeholder={ASSISTANT_INPUT_PLACEHOLDER}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={send}
        returnKeyType="send"
        submitBehavior="submit"
        accessibilityLabel={ASSISTANT_INPUT_PLACEHOLDER}
        style={styles.field}
      />
      <IconButton
        icon={Send}
        variant="accent"
        size="lg"
        disabled={!canSend}
        accessibilityLabel={COPY.explain.send}
        onPress={send}
      />
    </View>
  );

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      onClosed={chat.settle}
      dragArea="handle"
      footer={composer}
      accessibilityLabel={COPY.a11y.fabExpanded}>
      <View style={styles.header}>
        <AssistantOrb width={avatarSize.sm} />
        <View style={styles.headerText}>
          <Text variant="titleSm">{COPY.explain.assistantName}</Text>
          <Text variant="labelSm" color="textTertiary">
            {COPY.explain.context}
          </Text>
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        style={{ height: threadHeight }}
        contentContainerStyle={styles.thread}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {chat.messages.map((message, index) => (
          <View key={message.id} style={styles.message}>
            {message.role === 'user' ? <UserBubble text={message.text} /> : <AssistantBubble message={message} />}
            {index === firstReplyIndex ? (
              <Text variant="labelSm" color="textTertiary" style={styles.disclaimer}>
                {ASSISTANT_DISCLAIMER}
              </Text>
            ) : null}
          </View>
        ))}
        {chat.thinking ? <TypingBubble /> : null}
        {chat.suggestions.length > 0 ? (
          <Animated.View
            key={chat.messages.length}
            entering={reduceMotion ? undefined : FadeIn.delay(duration.slow).duration(duration.base)}
            accessibilityLabel={COPY.explain.suggestionsA11y}
            style={styles.suggestions}>
            {chat.suggestions.map((kind) => (
              <Chip
                key={kind}
                label={COPY.explain.suggestions[kind]}
                variant="outline"
                tone="brand"
                onPress={() => chat.suggest(kind)}
              />
            ))}
          </Animated.View>
        ) : null}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingBottom: spacing.sm },
  headerText: { flex: 1, gap: spacing.xxxs },
  thread: { flexGrow: 1, justifyContent: 'flex-end', gap: spacing.md, paddingVertical: spacing.sm },
  message: { gap: spacing.xs },
  disclaimer: { paddingLeft: avatarSize.xs + spacing.xs },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: hairline,
  },
  field: { flex: 1 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: spacing.xs },
});
