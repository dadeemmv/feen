/**
 * The test result inside onboarding: evergreen screen, confetti, the assigned companion and its
 * profile. "Continua" moves on to the interests; back returns to the last statement.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

import { Button, Confetti, Screen, Spotlight } from '@/components/ui';
import { MascotReveal } from '@/features/mascots/components/mascot-reveal';
import { MASCOT_COPY } from '@/features/mascots/copy';
import { scorePersonality } from '@/features/mascots/lib/score';
import { duration, spacing } from '@/theme';

import { useOnboardingDraft } from '../draft-store';
import { allowedStep, goToStepAfterTest, STEP_HREF } from '../steps';

export function MascotRevealScreen() {
  const draft = useOnboardingDraft();
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBurst(true), duration.base);
    return () => clearTimeout(timer);
  }, []);

  const allowed = allowedStep('mascot', draft);
  if (allowed !== 'mascot') return <Redirect href={STEP_HREF[allowed]} />;

  const result = scorePersonality(draft.quizAnswers);

  return (
    <View style={styles.flex}>
      <Screen
        background="brand"
        edges={['top', 'bottom']}
        statusBar="light"
        footer={<Button title={MASCOT_COPY.reveal.continue} glow fullWidth onPress={goToStepAfterTest} />}>
        <Spotlight reach={{ x: 0.9, y: 0.5 }} />
        <View style={styles.content}>
          <MascotReveal result={result} />
        </View>
      </Screen>
      <Confetti run={burst} origin={{ x: 0.5, y: 0.2 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: spacing.xl },
});
