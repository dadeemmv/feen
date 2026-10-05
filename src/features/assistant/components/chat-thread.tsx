/**
 * ChatThread — the scrolling message list of one conversation (Coach tab). Mount it with
 * `key={conversation.id}`: messages present when it mounts appear at once (scrolled to the
 * bottom), later ones slide in; the fresh assistant reply types out.
 *
 * Follows the bottom while new content arrives (typewriter, typing dots, keyboard), unless the
 * user scrolled up to re-read something; sending a question always jumps back down.
 */
import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import { isIOS } from '@/lib/platform';
import { layout, spacing } from '@/theme';

import { getChatState } from '../chat-store';
import { STICK_TO_BOTTOM_THRESHOLD } from '../metrics';
import type { Conversation } from '../types';
import { ChatBubble } from './chat-bubble';
import { hasMessageExtras, MessageExtras } from './message-extras';
import { TypingBubble } from './typing-bubble';

export type ChatThreadProps = {
  conversation: Conversation;
  /** A reply is being written for this conversation. */
  pending: boolean;
  /** Assistant message that should type out. */
  freshMessageId: string | null;
  /** Space above the first message (top bar). */
  insetTop: number;
  /** Space below the last message (composer + tab bar). */
  insetBottom: number;
  /** Extra bottom space while the keyboard lifts the composer (animated). */
  keyboardLift?: SharedValue<number>;
};

export function ChatThread({ conversation, pending, freshMessageId, insetTop, insetBottom, keyboardLift }: ChatThreadProps) {
  const reduceMotion = useReduceMotion();
  const scrollRef = useRef<ScrollView>(null);
  const stickToBottom = useRef(true);
  const didInitialScroll = useRef(false);
  const [mountedAt] = useState(() => Date.now());

  const messages = conversation.messages;
  const last = messages[messages.length - 1];
  const lastId = last?.id;
  const lastIsUser = last?.role === 'user';

  // Sending a question always brings the thread back to the bottom.
  useEffect(() => {
    if (!lastIsUser) return;
    stickToBottom.current = true;
    scrollRef.current?.scrollToEnd({ animated: !reduceMotion });
  }, [lastId, lastIsUser, reduceMotion]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distance = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    stickToBottom.current = distance < STICK_TO_BOTTOM_THRESHOLD;
  };

  const handleContentSizeChange = () => {
    if (!stickToBottom.current) return;
    const animated = didInitialScroll.current && !reduceMotion;
    didInitialScroll.current = true;
    scrollRef.current?.scrollToEnd({ animated });
  };

  const liftStyle = useAnimatedStyle(() => ({ height: keyboardLift ? keyboardLift.get() : 0 }));

  const markTyped = (messageId: string) => {
    if (getChatState().freshMessageId === messageId) getChatState().setFresh(null);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={[styles.content, { paddingTop: insetTop, paddingBottom: insetBottom }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}
      onScroll={handleScroll}
      scrollEventThrottle={32}
      onContentSizeChange={handleContentSizeChange}
      accessibilityRole="list">
      {messages.map((message, index) => {
        const isLatest = index === messages.length - 1;
        const isUser = message.role === 'user';
        const previous = messages[index - 1];
        const turnStart = previous && previous.role !== message.role;
        return (
          <View key={message.id} style={index === 0 ? undefined : turnStart ? styles.turnGap : styles.sameGap}>
            <ChatBubble
              role={message.role}
              text={message.text}
              error={message.meta?.error}
              typewriter={!isUser && message.id === freshMessageId}
              onTypingDone={() => markTyped(message.id)}
              animateEntry={message.createdAt >= mountedAt}
              footer={
                hasMessageExtras(message, isLatest) ? (
                  <MessageExtras
                    conversationId={conversation.id}
                    message={message}
                    isLatest={isLatest}
                    busy={pending}
                  />
                ) : undefined
              }
            />
          </View>
        );
      })}
      {pending ? <TypingBubble style={styles.turnGap} /> : null}
      <Animated.View style={liftStyle} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenX,
  },
  turnGap: { marginTop: spacing.md },
  sameGap: { marginTop: spacing.xs },
});
