/**
 * Frame of a question step: progress header, big question + lead line, the answers, and a sticky
 * "Continua" that stays disabled until the step is answered. Content rises in, staggered.
 * Deep links / web refreshes past an unanswered step are redirected to it (the draft is not
 * persisted).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Redirect } from 'expo-router';

import { Button, Screen, Text } from '@/components/ui';
import { spacing } from '@/theme';

import { ONBOARDING_COPY } from '../copy';
import { useOnboardingDraft } from '../draft-store';
import { useEntering } from '../lib/entering';
import { allowedStep, goToNextStep, STEP_HREF, type QuestionStep } from '../steps';
import { StepHeader } from './step-header';

export type StepScreenProps = {
  step: QuestionStep;
  title: string;
  subtitle: string;
  children: ReactNode;
  /** "Continua" enabled. */
  valid: boolean;
  /** Small line above the CTA (selection counter, hint). */
  footerNote?: ReactNode;
  /** Runs before moving on (e.g. trimming the name). */
  onNext?: () => void;
  keyboard?: boolean;
};

export function StepScreen({ step, title, subtitle, children, valid, footerNote, onNext, keyboard }: StepScreenProps) {
  const draft = useOnboardingDraft();
  const { rise } = useEntering();
  const allowed = allowedStep(step, draft);
  if (allowed !== step) return <Redirect href={STEP_HREF[allowed]} />;

  const next = () => {
    if (!valid) return;
    onNext?.();
    goToNextStep(step);
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      keyboard={keyboard}
      header={<StepHeader step={step} />}
      footer={
        <View style={styles.footer}>
          {footerNote}
          <Button title={ONBOARDING_COPY.next} fullWidth disabled={!valid} onPress={next} />
        </View>
      }>
      <Animated.View entering={rise(0)} style={styles.heading}>
        <Text variant="displaySm" accessibilityRole="header">
          {title}
        </Text>
        <Text variant="bodyLg" color="textSecondary">
          {subtitle}
        </Text>
      </Animated.View>
      <Animated.View entering={rise(2)}>{children}</Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xs, marginTop: spacing.md, marginBottom: spacing.xl },
  footer: { gap: spacing.sm },
});
