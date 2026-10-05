/**
 * Onboarding step header: back button, lime progress bar, "2/4" counter. Every step mounts its
 * own header (one route per step), so the bar starts at the previous step's value and fills to
 * the current one — it reads as one continuous bar across the pushes.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { IconButton, ProgressBar, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

import { ONBOARDING_COPY } from '../copy';
import { goToPreviousStep, QUESTION_STEPS, stepNumber, type QuestionStep } from '../steps';

export function StepHeader({ step }: { step: QuestionStep }) {
  const total = QUESTION_STEPS.length;
  const current = stepNumber(step);
  const [value, setValue] = useState((current - 1) / total);

  // Fill to this step's value on the first frame after mount, so the bar visibly advances.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setValue(current / total));
    return () => cancelAnimationFrame(frame);
  }, [current, total]);

  return (
    <View style={styles.row}>
      <IconButton icon={ArrowLeft} accessibilityLabel={ONBOARDING_COPY.back} onPress={goToPreviousStep} />
      <ProgressBar
        value={value}
        tone="accent"
        animateOnMount={false}
        accessibilityLabel={ONBOARDING_COPY.stepLabel(current, total)}
        style={styles.bar}
      />
      <Text variant="labelMd" color="textSecondary" tabular aria-hidden>
        {ONBOARDING_COPY.stepOf(current, total)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.screenX,
  },
  bar: { flex: 1, width: undefined },
});
