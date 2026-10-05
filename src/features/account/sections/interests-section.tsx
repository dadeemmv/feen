/**
 * I tuoi interessi: multi-select pill grid over the shared interest catalogue (same ids as the
 * onboarding step). Changes stay local until "Salva interessi" (≥ 1 topic) → profile.interests,
 * success toast, back to Account.
 */
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, HStack, Text, VStack } from '@/components/ui';
import { INTERESTS, normalizeInterests, type InterestId } from '@/features/onboarding/data/interests';
import { haptics } from '@/lib/haptics';
import { getStoreState, useStore } from '@/store';
import { showToast } from '@/store/ui';
import { spacing } from '@/theme';

import { InterestToggle } from '../components/interest-toggle';
import { SectionPage } from '../components/section-page';
import { INTERESTS_COPY, MENU_COPY } from '../copy';
import { backToAccount } from '../lib/navigation';

const sameSelection = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

export function InterestsSection() {
  const saved = useStore((s) => s.interests);
  const [selected, setSelected] = useState<InterestId[]>(() => normalizeInterests(saved));
  const copy = INTERESTS_COPY;

  const toggle = (id: InterestId) =>
    setSelected((current) => normalizeInterests(current.includes(id) ? current.filter((i) => i !== id) : [...current, id]));

  const changed = !sameSelection(selected, normalizeInterests(saved));
  const valid = selected.length > 0;

  const save = () => {
    getStoreState().setInterests(selected);
    haptics.success();
    showToast(copy.saved, { tone: 'success' });
    backToAccount();
  };

  return (
    <SectionPage
      title={MENU_COPY.interests.title}
      subtitle={copy.subtitle}
      footer={<Button title={copy.save} fullWidth disabled={!changed || !valid} onPress={save} />}>
      <VStack gap="md">
        <HStack wrap gap="xs" align="flex-start">
          {INTERESTS.map((interest) => (
            <InterestToggle
              key={interest.id}
              interest={interest}
              selected={selected.includes(interest.id)}
              onToggle={() => toggle(interest.id)}
            />
          ))}
        </HStack>
        <Text
          variant="labelMd"
          color={valid ? 'textSecondary' : changed ? 'dangerText' : 'textTertiary'}
          accessibilityLiveRegion="polite"
          style={styles.counter}>
          {valid ? copy.selected(selected.length) : copy.minHint}
        </Text>
      </VStack>
    </SectionPage>
  );
}

const styles = StyleSheet.create({
  counter: { paddingHorizontal: spacing.xxs },
});
