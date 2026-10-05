/**
 * AssistantIntro — the fresh-chat moment under the hero orb (video t=73–75 s): typing dots, then
 * the greeting typed out ("Ciao! 🦊" as a headline, the rest as the lead), then suggested
 * questions slide in. Remount it (`key`) to play it again ("Nuova chat").
 *
 * The full greeting is laid out from the first frame with the unrevealed part transparent, so
 * centred lines never shift while typing and the suggestions never push the layout around.
 */
import { useEffect, useEffectEvent, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { PressableScale, Text, TypingDots, readableWidth, useReduceMotion } from '@/components/ui';
import { ASSISTANT_GREETING, SUGGESTED_PROMPTS } from '@/content';
import { isIOS } from '@/lib/platform';
import { duration, easing, elevation, layout, radius, spacing, useTheme } from '@/theme';

import { copy } from '../copy';
import { alpha } from '../lib/alpha';
import { joinGreeting, splitGreeting, splitTyped } from '../lib/greeting';
import { GREETING_THINK_MS } from '../metrics';
import { useTypewriter } from '../use-typewriter';
import { SuggestedPrompts } from './suggested-prompts';

const GREETING = splitGreeting(ASSISTANT_GREETING);
const GREETING_TEXT = joinGreeting(GREETING);

export type AssistantIntroProps = {
  /** Space above the greeting (the hero orb sits there). */
  insetTop: number;
  /** Space below the content (composer + tab bar). */
  insetBottom: number;
  onAsk: (prompt: string) => void;
  /** A question is being sent (pills disabled). */
  busy?: boolean;
  /** Typing dots are showing (the orb "thinks" along). */
  onThinkingChange?: (thinking: boolean) => void;
  keyboardLift?: SharedValue<number>;
};

export function AssistantIntro({ insetTop, insetBottom, onAsk, busy = false, onThinkingChange, keyboardLift }: AssistantIntroProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const [thinking, setThinking] = useState(() => !reduceMotion);
  const { visible, done, skip } = useTypewriter(GREETING_TEXT, { enabled: !thinking });
  const shown = thinking ? '' : visible;
  const typed = splitTyped(shown, GREETING);
  const ready = !thinking && done;

  useEffect(() => {
    if (!thinking) return;
    const timer = setTimeout(() => setThinking(false), GREETING_THINK_MS);
    return () => clearTimeout(timer);
  }, [thinking]);

  const reportThinking = useEffectEvent((value: boolean) => onThinkingChange?.(value));
  useEffect(() => {
    reportThinking(thinking);
    return () => reportThinking(false);
  }, [thinking]);

  const liftStyle = useAnimatedStyle(() => ({ height: keyboardLift ? keyboardLift.get() : 0 }));
  const hidden = alpha(theme.colors.text, 0);
  const hiddenSecondary = alpha(theme.colors.textSecondary, 0);

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, { paddingTop: insetTop, paddingBottom: insetBottom }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}>
      <PressableScale
        scaleTo={false}
        onPress={ready ? undefined : skip}
        accessibilityRole="text"
        accessibilityLabel={ASSISTANT_GREETING}
        accessibilityHint={ready ? undefined : copy.skipTypingHint}
        style={styles.greeting}>
        {GREETING.headline ? (
          <Text variant="displaySm" align="center">
            {typed.headline}
            <Text variant="displaySm" style={{ color: hidden }}>
              {GREETING.headline.slice(typed.headline.length)}
            </Text>
          </Text>
        ) : null}
        <Text variant="bodyLg" color="textSecondary" align="center" style={styles.lead}>
          {typed.body}
          <Text variant="bodyLg" style={{ color: hiddenSecondary }}>
            {GREETING.body.slice(typed.body.length)}
          </Text>
        </Text>
        {thinking ? (
          <Animated.View exiting={FadeOut.duration(duration.fast)} style={styles.dots}>
            <TypingDots
              bubble
              accessibilityLabel={copy.typing}
              style={[styles.dotsPill, { backgroundColor: theme.colors.surface }]}
            />
          </Animated.View>
        ) : null}
      </PressableScale>

      {ready ? (
        <Animated.View entering={FadeIn.duration(duration.base).easing(easing.enter)} style={styles.suggestions}>
          <Text variant="overline" color="textTertiary" align="center">
            {copy.suggestionsTitle}
          </Text>
          <SuggestedPrompts prompts={SUGGESTED_PROMPTS} onSelect={onAsk} disabled={busy} bleed={layout.screenX} />
        </Animated.View>
      ) : null}
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
  greeting: { alignSelf: 'center', maxWidth: readableWidth + spacing.xxl, gap: spacing.xs },
  lead: { alignSelf: 'center' },
  dots: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  /** The kit bubble is a left-aligned chat shape; centred under the orb it reads as a pill. */
  dotsPill: { alignSelf: 'center', borderRadius: radius.pill, borderBottomLeftRadius: radius.pill, boxShadow: elevation.sm },
  suggestions: { marginTop: spacing.xl, gap: spacing.sm },
});
