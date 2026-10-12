/**
 * Shared step layouts:
 * - `GradedStepCard`: the grey rounded card of graded steps (label centred on top, art, prompt,
 *   answers). It fills the available height and scrolls on short screens.
 * - `StepScroll`: full-bleed scroll container for info / definition steps.
 * - `StepTagPill`, `StepArt`, `StepPrompt`: the building blocks.
 * Gallery rule: the lesson is black and white; emoji art is not drawn (colour lives in the
 * village), only the custom SVG illustrations are.
 */
import { createContext, use, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Illustration, illustrationSize } from '@/components/illustrations';
import { Text } from '@/components/ui';
import type { IllustrationKey, StepTag } from '@/content/types';
import { layout, radius, spacing, useTheme } from '@/theme';

import { TAGS } from '../copy';
import { lessonMetrics } from '../metrics';

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
        style={[styles.card, compact && styles.cardCompact, { backgroundColor: theme.colors.surface, paddingBottom: bottomInset }]}>
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
  return (
    <Text variant="overline" color="textSecondary" align="center">
      {TAGS[tag].label}
    </Text>
  );
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
  compact: boolean;
  /** Rounded white frame behind the art (true / false statement image). */
  framed?: boolean;
};

export function StepArt({ illustration, compact, framed = false }: ArtProps) {
  const theme = useTheme();
  const height = compact ? lessonMetrics.artHeight.compact : lessonMetrics.artHeight.regular;
  if (!illustration) return null;

  const [w, h] = illustrationSize(illustration);
  return (
    <View aria-hidden style={[styles.art, framed && [styles.frame, { backgroundColor: theme.colors.surfaceRaised }]]}>
      <Illustration name={illustration} width={Math.round((height * w) / h)} height={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  scrollPadded: { paddingHorizontal: layout.screenX, paddingTop: spacing.lg },
  scrollCard: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  card: {
    flexGrow: 1,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  cardCompact: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.xs },
  prompt: { paddingHorizontal: spacing.xxs },
  answers: { gap: spacing.sm, marginTop: spacing.xxs },
  answersCompact: { gap: spacing.xs },
  art: { alignItems: 'center', justifyContent: 'center' },
  frame: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
});
