/**
 * Shared step layouts:
 * - `GradedStepCard`: the white rounded card of graded steps (tag pill centred on top, art,
 *   prompt, answers). It fills the available height and scrolls on short screens; its bottom
 *   padding leaves room for the AI button that floats over the card.
 * - `StepScroll`: full-bleed scroll container for info / definition steps.
 * - `StepTagPill`, `StepArt`, `StepPrompt`: the building blocks.
 */
import { createContext, use, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Illustration, illustrationSize } from '@/components/illustrations';
import { Tag, Text, hairline } from '@/components/ui';
import type { IllustrationKey, StepTag } from '@/content/types';
import { elevation, layout, radius, spacing, useTheme } from '@/theme';

import { TAGS } from '../copy';
import { EMOJI_LINE_HEIGHT, lessonMetrics } from '../metrics';

/** Short windows (iPhone SE): set by the graded card, read by its prompt. */
const CompactContext = createContext(false);

type ScrollProps = { children: ReactNode; bottomInset: number; padded?: boolean };

/** Vertical scroll that never shows its indicator and lets taps through while scrolling. */
export function StepScroll({ children, bottomInset, padded = true }: ScrollProps) {
  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent,
        padded ? styles.scrollPadded : styles.scrollCard,
        { paddingBottom: padded ? bottomInset + spacing.md : spacing.md },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

type CardProps = {
  tag?: StepTag;
  art?: ReactNode;
  prompt?: ReactNode;
  children: ReactNode;
  bottomInset: number;
  compact: boolean;
};

export function GradedStepCard({ tag, art, prompt, children, bottomInset, compact }: CardProps) {
  const theme = useTheme();
  return (
    <StepScroll bottomInset={bottomInset} padded={false}>
      <View
        style={[
          styles.card,
          compact && styles.cardCompact,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderSubtle,
            paddingBottom: bottomInset,
          },
        ]}>
        <CompactContext value={compact}>
          {tag ? <StepTagPill tag={tag} /> : null}
          {art}
          {prompt}
          <View style={[styles.answers, compact && styles.answersCompact]}>{children}</View>
        </CompactContext>
      </View>
    </StepScroll>
  );
}

export function StepTagPill({ tag }: { tag: StepTag }) {
  const config = TAGS[tag];
  return <Tag label={config.label} emoji={config.emoji} tone={config.tone} style={styles.tag} />;
}

export function StepPrompt({ children }: { children: string }) {
  const compact = use(CompactContext);
  return (
    <Text variant={compact ? 'titleSm' : 'titleMd'} align="center" accessibilityRole="header" style={styles.prompt}>
      {children}
    </Text>
  );
}

type ArtProps = {
  illustration?: IllustrationKey;
  emoji?: string;
  compact: boolean;
  /** Rounded tinted frame behind the art (true / false statement image). */
  framed?: boolean;
};

export function StepArt({ illustration, emoji, compact, framed = false }: ArtProps) {
  const theme = useTheme();
  const height = compact ? lessonMetrics.artHeight.compact : lessonMetrics.artHeight.regular;

  if (illustration) {
    const [w, h] = illustrationSize(illustration);
    return (
      <View
        aria-hidden
        style={[styles.art, framed && [styles.frame, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.borderSubtle }]]}>
        <Illustration name={illustration} width={Math.round((height * w) / h)} height={height} />
      </View>
    );
  }
  if (emoji) {
    const size = compact ? lessonMetrics.emojiArt - spacing.md : lessonMetrics.emojiArt;
    return (
      <View aria-hidden style={styles.art}>
        <View style={[styles.emojiHalo, compact && styles.emojiHaloCompact, { backgroundColor: theme.colors.tintButter }]}>
          <Text style={{ fontSize: size, lineHeight: Math.round(size * EMOJI_LINE_HEIGHT) }}>{emoji}</Text>
        </View>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  scrollPadded: { paddingHorizontal: layout.screenX, paddingTop: spacing.lg },
  scrollCard: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  card: {
    flexGrow: 1,
    borderRadius: radius.xxl,
    borderWidth: hairline,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
    boxShadow: elevation.sm,
  },
  cardCompact: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.xs },
  tag: { alignSelf: 'center' },
  prompt: { paddingHorizontal: spacing.xxs },
  answers: { gap: spacing.sm, marginTop: spacing.xxs },
  answersCompact: { gap: spacing.xs },
  art: { alignItems: 'center', justifyContent: 'center' },
  frame: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    borderWidth: hairline,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  emojiHalo: {
    borderRadius: radius.pill,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiHaloCompact: { padding: spacing.sm },
});
