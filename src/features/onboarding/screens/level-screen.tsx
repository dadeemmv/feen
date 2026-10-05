/**
 * Step 3/4 — "Quanto ne sai di finanza?": single choice (Parto da zero / Conosco le basi /
 * Investo già) with a reassuring note.
 */
import { StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';

import { ChoiceRow, HStack, Icon, iconSize, Text, VStack } from '@/components/ui';
import { spacing } from '@/theme';

import { StepScreen } from '../components/step-screen';
import { ONBOARDING_COPY } from '../copy';
import { EXPERIENCE_OPTIONS } from '../data/options';
import { useOnboardingDraft } from '../draft-store';

export function LevelStepScreen() {
  const experience = useOnboardingDraft((s) => s.experience);
  const setExperience = useOnboardingDraft((s) => s.setExperience);
  const copy = ONBOARDING_COPY.level;

  return (
    <StepScreen step="level" title={copy.title} subtitle={copy.subtitle} valid={experience !== null}>
      <VStack gap="sm">
        {EXPERIENCE_OPTIONS.map((option) => (
          <ChoiceRow
            key={option.id}
            icon={option.icon}
            iconTone={option.tone}
            label={option.label}
            description={option.description}
            labelVariant="titleSm"
            selected={experience === option.id}
            onPress={() => setExperience(option.id)}
          />
        ))}
        <HStack gap="xs" align="flex-start" style={styles.note}>
          <Icon icon={Info} size={iconSize.sm} color="textTertiary" />
          <Text variant="bodySm" color="textTertiary" style={styles.flex}>
            {copy.note}
          </Text>
        </HStack>
      </VStack>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  note: { paddingHorizontal: spacing.xxs, paddingTop: spacing.xs },
  flex: { flex: 1 },
});
