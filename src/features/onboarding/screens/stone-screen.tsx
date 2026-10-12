/**
 * "Prima pietra posata." (concept board, screen 4): the sprout becomes a surface, like Bending
 * Spoons' lime section, only in reward moments. The Town Hall stands and keeps the pact; the
 * partner says where the first lesson is waiting. Then the village gets its name.
 */
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Redirect, router } from 'expo-router';

import { Button, Screen, Text, VStack } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { firstSiteOf, getBuilding } from '@/content/village';
import { pactNumber } from '@/features/pact/data';
import { PopIn } from '@/features/rewards';
import { BuildingScene } from '@/features/village/components/building-scene';
import { duration, fonts, spacing } from '@/theme';

import { ONBOARDING_COPY } from '../copy';
import { useOnboardingDraft } from '../draft-store';
import { useEntering } from '../lib/entering';
import { allowedStep, draftPersonality, STEP_HREF } from '../steps';

const SCENE_WIDTH = 220;

export function StoneScreen() {
  const draft = useOnboardingDraft();
  const { rise } = useEntering();

  const allowed = allowedStep('stone', draft);
  if (allowed !== 'stone') return <Redirect href={STEP_HREF[allowed]} />;

  const mascot = getMascot(draftPersonality(draft).mascot);
  const firstSite = getBuilding(firstSiteOf(mascot.startBuildings) ?? 'pozzo').at;
  const copy = ONBOARDING_COPY.stone;

  return (
    <Screen
      background="reward"
      edges={['top', 'bottom']}
      footer={<Button title={copy.cta} fullWidth onPress={() => router.push(STEP_HREF.village)} />}>
      <VStack gap="xl" align="center" style={styles.body}>
        <PopIn delay={duration.fast}>
          <BuildingScene id="municipio" state="costruito" width={SCENE_WIDTH} accessibilityLabel={copy.artLabel} />
        </PopIn>
        <Animated.View entering={rise(1)} style={styles.text}>
          <Text variant="code" color="onReward" align="center">
            {copy.code(pactNumber(1))}
          </Text>
          <Text variant="displayLg" color="onReward" align="center" accessibilityRole="header">
            {copy.titleStart}
            <Text variant="displayLg" color="onReward" style={styles.italic}>
              {copy.titleWord}
            </Text>
          </Text>
          <Text variant="bodyLg" color="onReward" align="center">
            {copy.body(mascot.partner.name, firstSite)}
          </Text>
        </Animated.View>
      </VStack>
      <View />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: spacing.huge },
  text: { gap: spacing.sm, alignItems: 'center' },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
});
