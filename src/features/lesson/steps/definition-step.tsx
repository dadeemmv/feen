/**
 * Definition card ("😈 Il colpevole"): full bleed, emoji + displaySm title, titleSm lead, then a
 * tinted definition box: overline "Definizione", the term in bold, the definition in italic,
 * with an accent bar on the leading edge. Always answerable (Continua → next step).
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text, resolveTone, useReduceMotion } from '@/components/ui';
import type { DefinitionStep as DefinitionStepData } from '@/content/types';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { lessonMetrics, STAGGER } from '../metrics';
import { StepScroll } from '../components/step-layout';
import { StepTitle } from './step-title';
import type { StepViewProps } from './types';

export function DefinitionStep({ step, bottomInset }: StepViewProps<DefinitionStepData>) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const tone = resolveTone(theme, step.tone ?? 'lilac');

  return (
    <StepScroll bottomInset={bottomInset}>
      <StepTitle emoji={step.emoji} title={step.title} lead={step.lead} />
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.delay(STAGGER.baseMs).duration(duration.slow).easing(easing.enter)}
        style={[styles.box, { backgroundColor: tone.bg }]}>
        <View aria-hidden style={[styles.bar, { backgroundColor: tone.fg }]} />
        <View style={styles.body}>
          <Text variant="overline" style={{ color: tone.fg }}>
            {COPY.steps.definitionOverline}
          </Text>
          <Text variant="titleMd">{step.term}</Text>
          <Text variant="bodyLg" color="textSecondary" style={styles.definition}>
            {step.definition}
          </Text>
        </View>
      </Animated.View>
    </StepScroll>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  bar: { width: lessonMetrics.accentBar },
  body: { flex: 1, gap: spacing.xxs, padding: spacing.md },
  definition: { fontStyle: 'italic' },
});
