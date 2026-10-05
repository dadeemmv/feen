/**
 * ChatBubble — one chat message, shared by the Coach tab and the lesson "Spiegami il perché" sheet.
 *
 * - `user`: evergreen bubble on the right, white text (bottom-right corner tucked).
 * - `assistant`: tiny orb avatar on the left + text, either plain on the canvas (`variant="plain"`,
 *   Coach tab) or inside a light bubble (`variant="bubble"`, sheets and cards).
 * - Text supports "- " bullets, "1. " lists and **bold**; `typewriter` types it out (tap to show
 *   everything at once), long-press copies it.
 *
 *   <ChatBubble role="assistant" text={reply} typewriter={isFresh} onTypingDone={markRead} />
 */
import { useEffect, useEffectEvent, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { CircleAlert } from 'lucide-react-native';

import { Icon, PressableScale, useReduceMotion } from '@/components/ui';
import { copy as copyToClipboard } from '@/lib/clipboard';
import { duration, easing, radius, spacing, textVariants, useTheme } from '@/theme';

import { copy } from '../copy';
import { toPlainText } from '../markdown-lite';
import { bubbleMaxWidth, orbSize } from '../metrics';
import type { ChatMessage } from '../types';
import { useTypewriter } from '../use-typewriter';
import { MessageText } from './message-text';
import { OrbAvatar } from './orb-avatar';

export type ChatBubbleVariant = 'plain' | 'bubble';

export type ChatBubbleProps = {
  role: ChatMessage['role'];
  text: string;
  /** Type the text out (fresh assistant replies). Default `false`. */
  typewriter?: boolean;
  /** Called once the typewriter has revealed everything. */
  onTypingDone?: () => void;
  /** Assistant look: plain text on the canvas or a light bubble. Default `plain`. */
  variant?: ChatBubbleVariant;
  /** Orb avatar next to assistant messages. Default `true`. */
  showAvatar?: boolean;
  /** Failed reply: danger-tinted bubble. */
  error?: boolean;
  /** Content under an assistant message (links, chips, retry), shown once the text is complete. */
  footer?: ReactNode;
  /** Fade/slide in on mount. Default `false`. */
  animateEntry?: boolean;
  /** Long-press copies the message. Default `true`. */
  copyable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ChatBubble({
  role,
  text,
  typewriter = false,
  onTypingDone,
  variant = 'plain',
  showAvatar = true,
  error = false,
  footer,
  animateEntry = false,
  copyable = true,
  style,
}: ChatBubbleProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const isUser = role === 'user';
  const { visible, done, skip } = useTypewriter(text, { enabled: typewriter && !isUser });

  const notifyDone = useEffectEvent(() => onTypingDone?.());
  useEffect(() => {
    if (typewriter && done) notifyDone();
  }, [typewriter, done]);

  const typing = !done;
  const speaker = isUser ? 'Tu' : copy.assistantName;
  const handleLongPress = copyable ? () => void copyToClipboard(toPlainText(text), { feedback: copy.copied }) : undefined;

  const entering = animateEntry
    ? reduceMotion
      ? FadeIn.duration(duration.fast)
      : FadeInUp.duration(duration.base).easing(easing.enter)
    : undefined;

  const body = (
    <PressableScale
      scaleTo={false}
      onPress={typing ? skip : undefined}
      onLongPress={handleLongPress}
      delayLongPress={duration.slower}
      accessibilityRole="text"
      accessibilityLabel={`${speaker}: ${toPlainText(text)}`}
      accessibilityHint={typing ? copy.skipTypingHint : copyable ? copy.copyHint : undefined}
      style={[
        isUser && [styles.userBubble, { backgroundColor: theme.colors.brandSolid }],
        !isUser && variant === 'bubble' && [styles.assistantBubble, { backgroundColor: theme.colors.surfaceRaised }],
        !isUser && error && [styles.assistantBubble, styles.errorBubble, { backgroundColor: theme.colors.dangerBg }],
      ]}>
      {error ? (
        <View style={styles.errorRow}>
          <View style={[styles.errorIcon, { height: textVariants.bodyMd.lineHeight }]}>
            <Icon icon={CircleAlert} size="sm" color="dangerText" />
          </View>
          <View style={styles.flex}>
            <MessageText text={visible} variant="bodyMd" color="dangerText" markerColor="dangerText" />
          </View>
        </View>
      ) : (
        <MessageText
          text={visible}
          color={isUser ? 'onBrand' : 'text'}
          markerColor={isUser ? 'onBrand' : 'brandSolid'}
        />
      )}
    </PressableScale>
  );

  if (isUser) {
    return (
      <Animated.View entering={entering} style={[styles.userRow, style]}>
        <View style={styles.userColumn}>{body}</View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={entering} style={[styles.assistantRow, style]}>
      {showAvatar ? (
        <View style={[styles.avatarSlot, { height: textVariants.bodyLg.lineHeight + avatarOffset(variant, error) }]}>
          <OrbAvatar />
        </View>
      ) : null}
      <View style={[styles.assistantColumn, variant === 'bubble' && styles.assistantColumnCapped]}>
        {body}
        {footer && !typing ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </Animated.View>
  );
}

/** Bubbles add their top padding before the first line; the avatar follows it. */
function avatarOffset(variant: ChatBubbleVariant, error: boolean): number {
  return variant === 'bubble' || error ? spacing.sm * 2 : 0;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  userRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  userColumn: { maxWidth: bubbleMaxWidth.user, alignItems: 'flex-end' },
  userBubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.xs,
  },
  assistantRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  avatarSlot: { width: orbSize.avatar, justifyContent: 'center' },
  assistantColumn: { flex: 1, alignItems: 'flex-start' },
  assistantColumnCapped: { flex: 0, flexShrink: 1, maxWidth: bubbleMaxWidth.assistant },
  assistantBubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.xs,
  },
  errorBubble: { alignSelf: 'stretch' },
  errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  errorIcon: { justifyContent: 'center' },
  footer: { marginTop: spacing.sm, alignSelf: 'stretch' },
});
