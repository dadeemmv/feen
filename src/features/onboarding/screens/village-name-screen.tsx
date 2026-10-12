/**
 * The village's name (concept board, screen 4): you choose it after the first stone, as in FIFA
 * City; the partner suggests three (her bust beside them, the chips wrapping in their own column).
 * "Entra nel borgo" writes everything and enters the village.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { MascotArt } from '@/components/illustrations';
import { avatarSize, Button, Chip, HStack, IconButton, Screen, Text, TextField, VStack } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { VILLAGE_NAME_IDEAS } from '@/content/village';
import { layout, spacing } from '@/theme';

import { ONBOARDING_COPY } from '../copy';
import { cleanName } from '../data/name';
import { useOnboardingDraft } from '../draft-store';
import { allowedStep, draftPersonality, finishOnboarding, goToPreviousStep, STEP_HREF } from '../steps';

/** Three ideas, stable for a given name (the partner "thinks" of them for you). */
function ideasFor(seed: string) {
  const start = [...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % VILLAGE_NAME_IDEAS.length;
  return [0, 1, 2].map((k) => VILLAGE_NAME_IDEAS[(start + k * 3) % VILLAGE_NAME_IDEAS.length]);
}

export function VillageNameScreen() {
  const draft = useOnboardingDraft();
  const setVillageName = useOnboardingDraft((s) => s.setVillageName);
  const [value, setValue] = useState(draft.villageName);

  const allowed = allowedStep('village', draft);
  if (allowed !== 'village') return <Redirect href={STEP_HREF[allowed]} />;

  const mascot = getMascot(draftPersonality(draft).mascot);
  const copy = ONBOARDING_COPY.village;
  const ideas = ideasFor(cleanName(draft.name) || 'borgo');
  const valid = value.trim().length > 1;

  const enter = () => {
    if (!valid) return;
    setVillageName(value.trim());
    finishOnboarding();
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      keyboard
      header={
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} accessibilityLabel={ONBOARDING_COPY.back} onPress={goToPreviousStep} />
        </View>
      }
      footer={<Button title={copy.cta} fullWidth disabled={!valid} onPress={enter} />}>
      <VStack gap="lg" style={styles.body}>
        <VStack gap="xs">
          <Text variant="displaySm" accessibilityRole="header">
            {copy.title}
          </Text>
          <Text variant="bodyLg" color="textSecondary">
            {copy.subtitle(mascot.partner.name)}
          </Text>
        </VStack>
        <HStack gap="sm" align="center">
          <MascotArt id={mascot.id} framing="bust" width={avatarSize.md} />
          <HStack gap="xs" style={styles.ideas}>
            {ideas.map((idea) => (
              <Chip key={idea} label={idea} selected={value === idea} onPress={() => setValue(idea)} />
            ))}
          </HStack>
        </HStack>
        <TextField
          label={copy.label}
          placeholder={copy.placeholder}
          value={value}
          onChangeText={setValue}
          maxLength={24}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={enter}
          helper={valid ? copy.preview(value.trim()) : undefined}
        />
      </VStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenX },
  body: { paddingTop: spacing.md },
  ideas: { flex: 1, flexWrap: 'wrap' },
});
