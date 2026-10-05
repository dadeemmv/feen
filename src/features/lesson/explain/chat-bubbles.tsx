/**
 * Chat bubbles of the explain sheet: the learner's request (evergreen, right, tail bottom-right),
 * the assistant's reply (soft fill, left, orb avatar, types itself out; tap to reveal at once)
 * and the typing indicator. Replies render paragraphs, list lines and **bold** spans.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AssistantOrb } from '@/components/illustrations';
import { Text, TypingDots, avatarSize, useReduceMotion } from '@/components/ui';
import { useTypewriter } from '@/features/assistant/engine';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import type { ExplainMessage } from './use-explain-chat';

/** Bubbles never span the whole sheet (redlines: 80 %). */
const BUBBLE_MAX = '84%';

export function UserBubble({ text }: { text: string }) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(duration.base).easing(easing.enter)}
      style={[styles.user, { backgroundColor: theme.colors.brandSolid }]}>
      <Text variant="bodyMd" weight="semiBold" color="onBrand">
        {text}
      </Text>
    </Animated.View>
  );
}

export function AssistantBubble({ message }: { message: ExplainMessage }) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const { visible, done, skip } = useTypewriter(message.text, { enabled: message.fresh });

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(duration.fast)}
      style={styles.assistantRow}>
      <OrbAvatar />
      <Pressable
        onPress={done ? undefined : skip}
        accessibilityRole="text"
        accessibilityLabel={message.text}
        style={[styles.assistant, { backgroundColor: theme.colors.fill }]}>
        <RichText text={visible} />
      </Pressable>
    </Animated.View>
  );
}

export function TypingBubble() {
  return (
    <Animated.View entering={FadeIn.duration(duration.fast)} style={styles.assistantRow}>
      <OrbAvatar />
      <TypingDots bubble />
    </Animated.View>
  );
}

/**
 * The pearl fills ~62 % of the orb artwork: drawn one avatar step larger and centred in an
 * `xs` box, it reads at avatar size. Fixed box: the row never squeezes it.
 */
function OrbAvatar() {
  return (
    <View aria-hidden style={styles.avatar}>
      <AssistantOrb width={avatarSize.sm} height={avatarSize.sm} halo={false} />
    </View>
  );
}

const BOLD = '**';
/** A lone trailing "*" is half of a "**" still being typed (never the end of a closed one). */
const dropTypingStar = (line: string) => (line.endsWith('*') && !line.endsWith(BOLD) ? line.slice(0, -1) : line);

/** Paragraphs (blank line), single line breaks and **bold** spans; unclosed bold while typing. */
function RichText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <View style={styles.paragraphs}>
      {paragraphs.map((paragraph, p) => (
        <Text key={p} variant="bodyMd">
          {paragraph.split('\n').map((line, l) => (
            <Text key={l} variant="bodyMd">
              {l > 0 ? '\n' : ''}
              {dropTypingStar(line)
                .split(BOLD)
                .map((span, s) =>
                  s % 2 === 1 ? (
                    <Text key={s} variant="bodyMd" weight="bold">
                      {span}
                    </Text>
                  ) : (
                    span
                  ),
                )}
            </Text>
          ))}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  user: {
    alignSelf: 'flex-end',
    maxWidth: BUBBLE_MAX,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.xs,
  },
  assistantRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, maxWidth: '92%' },
  assistant: {
    flexShrink: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.xs,
  },
  paragraphs: { gap: spacing.xs },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
