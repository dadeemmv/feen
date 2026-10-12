/**
 * Info card ("La rivelazione", "Erosione"): full bleed, the displaySm title, a titleSm lead, then
 * grey rows that fade up one after the other. No emoji and no tints: colour is kept for states
 * and rewards. Always answerable: the footer "Continua" goes straight to the next step.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text, useReduceMotion } from '@/components/ui';
import type { InfoStep as InfoStepData } from '@/content/types';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { STAGGER } from '../metrics';
import { StepScroll } from '../components/step-layout';
import { StepTitle } from './step-title';
import type { StepViewProps } from './types';

export function InfoStep({ step, bottomInset }: StepViewProps<InfoStepData>) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <StepScroll bottomInset={bottomInset}>
      <StepTitle title={step.title} lead={step.lead} />
      <View style={styles.rows}>
        {step.rows.map((row, index) => {
          const delay = STAGGER.baseMs + index * STAGGER.stepMs;
          return (
            <Animated.View
              key={`${step.id}-${index}`}
              entering={reduceMotion ? undefined : FadeInDown.delay(delay).duration(duration.slow).easing(easing.enter)}
              style={[styles.row, { backgroundColor: theme.colors.surface }]}>
              <Text variant="bodyLg">{row.text}</Text>
            </Animated.View>
          );
        })}
      </View>
    </StepScroll>
  );
}

const styles = StyleSheet.create({
  rows: { gap: spacing.xs, marginTop: spacing.lg },
  row: { padding: spacing.lg, borderRadius: radius.xl },
});
