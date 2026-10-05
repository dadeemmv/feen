/**
 * Info card ("✨ La rivelazione", "🌊 Erosione"): full bleed, emoji inline before the displaySm
 * title, a titleSm lead, then tinted rows whose content fades up and whose emoji pops in,
 * staggered. Always answerable: the footer "Continua" goes straight to the next step.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { Text, resolveTone, useReduceMotion } from '@/components/ui';
import type { InfoStep as InfoStepData } from '@/content/types';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { EMOJI_LINE_HEIGHT, lessonMetrics, STAGGER } from '../metrics';
import { StepScroll } from '../components/step-layout';
import { StepTitle } from './step-title';
import type { StepViewProps } from './types';

export function InfoStep({ step, bottomInset }: StepViewProps<InfoStepData>) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <StepScroll bottomInset={bottomInset}>
      <StepTitle emoji={step.emoji} title={step.title} lead={step.lead} />
      <View style={styles.rows}>
        {step.rows.map((row, index) => {
          const tone = resolveTone(theme, row.tone);
          const delay = STAGGER.baseMs + index * STAGGER.stepMs;
          return (
            <Animated.View
              key={`${step.id}-${index}`}
              entering={reduceMotion ? undefined : FadeInDown.delay(delay).duration(duration.slow).easing(easing.enter)}
              style={[styles.row, { backgroundColor: tone.bg }]}>
              {row.emoji ? (
                <Animated.View
                  aria-hidden
                  entering={
                    reduceMotion ? undefined : ZoomIn.delay(delay + STAGGER.popMs).duration(duration.base).easing(easing.enter)
                  }>
                  <Text style={styles.emoji}>{row.emoji}</Text>
                </Animated.View>
              ) : null}
              <Text variant="bodyMd" style={styles.text}>
                {row.text}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    </StepScroll>
  );
}

const styles = StyleSheet.create({
  rows: { gap: spacing.xs, marginTop: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  emoji: { fontSize: lessonMetrics.rowEmoji, lineHeight: Math.round(lessonMetrics.rowEmoji * EMOJI_LINE_HEIGHT) },
  text: { flex: 1 },
});
