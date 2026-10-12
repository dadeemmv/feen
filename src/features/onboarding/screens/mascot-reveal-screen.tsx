/**
 * The test result inside onboarding (concept board, screen 2): black screen, confetti, "Sei una
 * Volpe Esploratrice" and the partner who already got past your blind spot. "Firma il patto con
 * Brace" moves on to the pact; back returns to the last scenario.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { Button, Confetti, Screen, Spotlight } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { MascotReveal } from '@/features/mascots/components/mascot-reveal';
import { duration, spacing } from '@/theme';

import { ONBOARDING_COPY } from '../copy';
import { useOnboardingDraft } from '../draft-store';
import { allowedStep, draftPersonality, STEP_HREF } from '../steps';

export function MascotRevealScreen() {
  const draft = useOnboardingDraft();
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBurst(true), duration.base);
    return () => clearTimeout(timer);
  }, []);

  const allowed = allowedStep('mascot', draft);
  if (allowed !== 'mascot') return <Redirect href={STEP_HREF[allowed]} />;

  const result = draftPersonality(draft);
  const { partner } = getMascot(result.mascot);

  return (
    <View style={styles.flex}>
      <Screen
        background="brand"
        edges={['top', 'bottom']}
        statusBar="light"
        footer={<Button title={ONBOARDING_COPY.reveal.sign(partner.name)} fullWidth onPress={() => router.push(STEP_HREF.pact)} />}>
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
