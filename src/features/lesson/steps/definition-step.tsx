/**
 * Definition card ("Il colpevole"): full bleed, displaySm title, titleSm lead, then a grey
 * definition box: the label "Definizione", the term, the definition. No accent bar and no tint
 * (No-Line Rule, Gallery Rule). Always answerable (Continua → next step).
 */
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text, useReduceMotion } from '@/components/ui';
import type { DefinitionStep as DefinitionStepData } from '@/content/types';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { STAGGER } from '../metrics';
import { StepScroll } from '../components/step-layout';
import { StepTitle } from './step-title';
import type { StepViewProps } from './types';

export function DefinitionStep({ step, bottomInset }: StepViewProps<DefinitionStepData>) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <StepScroll bottomInset={bottomInset}>
      <StepTitle title={step.title} lead={step.lead} />
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.delay(STAGGER.baseMs).duration(duration.slow).easing(easing.enter)}
        style={[styles.box, { backgroundColor: theme.colors.surface }]}>
        <Text variant="overline" color="textSecondary">
          {COPY.steps.definitionOverline}
        </Text>
        <Text variant="titleLg">{step.term}</Text>
        <Text variant="bodyLg" color="textSecondary">
          {step.definition}
        </Text>
      </Animated.View>
    </StepScroll>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: spacing.lg, gap: spacing.xs, padding: spacing.lg, borderRadius: radius.xl },
});
