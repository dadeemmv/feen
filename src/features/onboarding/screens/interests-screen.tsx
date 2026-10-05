/**
 * Step 3/5 — "Cosa vuoi imparare?": two-column grid of interest cards (icon tile, topic, one-line
 * hint), multi-select, at least one to continue.
 */
import { StyleSheet, View } from 'react-native';

import { HStack, IconTile, Text, VStack } from '@/components/ui';
import { spacing } from '@/theme';

import { SelectCard } from '../components/select-card';
import { StepScreen } from '../components/step-screen';
import { ONBOARDING_COPY } from '../copy';
import { INTERESTS, type Interest } from '../data/interests';
import { useOnboardingDraft } from '../draft-store';

const COLUMNS = 2;

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function InterestCard({ interest, selected, onPress }: { interest: Interest; selected: boolean; onPress: () => void }) {
  return (
    <SelectCard
      multiple
      selected={selected}
      onPress={onPress}
      accessibilityLabel={`${interest.label}, ${interest.hint}`}
      style={styles.flex}
      contentStyle={styles.card}>
      <IconTile icon={interest.icon} tone={interest.tone} size="md" />
      <VStack gap="xxxs">
        <Text variant="labelLg" numberOfLines={1}>
          {interest.label}
        </Text>
        <Text variant="bodySm" color="textSecondary" numberOfLines={2}>
          {interest.hint}
        </Text>
      </VStack>
    </SelectCard>
  );
}

export function InterestsStepScreen() {
  const interests = useOnboardingDraft((s) => s.interests);
  const toggleInterest = useOnboardingDraft((s) => s.toggleInterest);
  const copy = ONBOARDING_COPY.interests;
  const count = interests.length;

  return (
    <StepScreen
      step="interests"
      title={copy.title}
      subtitle={copy.subtitle}
      valid={count > 0}
      footerNote={
        <Text
          variant="labelMd"
          color={count > 0 ? 'brandText' : 'textTertiary'}
          align="center"
          accessibilityLiveRegion="polite">
          {count > 0 ? copy.selected(count) : copy.minHint}
        </Text>
      }>
      <VStack gap="xs">
        {chunk(INTERESTS, COLUMNS).map((row) => (
          <HStack key={row[0].id} gap="xs" align="stretch">
            {row.map((interest) => (
              <InterestCard
                key={interest.id}
                interest={interest}
                selected={interests.includes(interest.id)}
                onPress={() => toggleInterest(interest.id)}
              />
            ))}
            {row.length < COLUMNS ? <View style={styles.flex} /> : null}
          </HStack>
        ))}
      </VStack>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: spacing.sm },
});
