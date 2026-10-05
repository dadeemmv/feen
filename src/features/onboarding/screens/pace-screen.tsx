/**
 * Step 4/4 — "Qual è il tuo ritmo?": daily goal cards (5 / 10 / 15 min, 10 recommended) and the
 * "Attiva promemoria" switch with the preferred time (same options as Account → Impostazioni).
 */
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { BellRing } from 'lucide-react-native';

import { Card, Divider, HStack, IconTile, Switch, Tag, Text, VStack } from '@/components/ui';
import { SegmentedOptions } from '@/features/account/components/segmented-options';
import { REMINDER_SLOTS } from '@/features/account/copy';
import type { ReminderSlot } from '@/store';
import { spacing } from '@/theme';

import { SelectCard } from '../components/select-card';
import { StepScreen } from '../components/step-screen';
import { ONBOARDING_COPY } from '../copy';
import { GOAL_OPTIONS, type GoalOption } from '../data/options';
import { useOnboardingDraft } from '../draft-store';
import { useEntering } from '../lib/entering';

const SLOT_OPTIONS = REMINDER_SLOTS.map((slot) => ({ id: slot.id, label: slot.label, caption: slot.time }));

function GoalCard({ option, selected, onPress }: { option: GoalOption; selected: boolean; onPress: () => void }) {
  const copy = ONBOARDING_COPY.pace;
  return (
    <SelectCard
      selected={selected}
      onPress={onPress}
      indicator={false}
      accessibilityLabel={`${copy.perDay(option.minutes)}, ${option.label}, ${option.description}${
        option.recommended ? `, ${copy.recommended}` : ''
      }`}
      style={styles.flex}
      contentStyle={styles.goal}>
      {option.recommended ? <Tag label={copy.recommended} tone="accent" solid size="sm" style={styles.tag} /> : null}
      <HStack gap="xxs" align="baseline">
        <Text variant="displayMd" tabular>
          {option.minutes}
        </Text>
        <Text variant="labelMd" color="textSecondary">
          {copy.minutes}
        </Text>
      </HStack>
      <Text variant="labelLg" align="center" numberOfLines={1}>
        {option.label}
      </Text>
      <Text variant="bodySm" color="textSecondary" align="center" numberOfLines={2}>
        {option.description}
      </Text>
    </SelectCard>
  );
}

export function PaceStepScreen() {
  const goalMinutes = useOnboardingDraft((s) => s.goalMinutes);
  const reminders = useOnboardingDraft((s) => s.reminders);
  const reminderSlot = useOnboardingDraft((s) => s.reminderSlot);
  const { setGoalMinutes, setReminders, setReminderSlot } = useOnboardingDraft.getState();
  const { fade } = useEntering();
  const copy = ONBOARDING_COPY.pace;

  return (
    <StepScreen step="pace" title={copy.title} subtitle={copy.subtitle} valid={goalMinutes !== null}>
      <VStack gap="xl">
        <HStack gap="xs" align="stretch" style={styles.goals} accessibilityRole="radiogroup">
          {GOAL_OPTIONS.map((option) => (
            <GoalCard
              key={option.minutes}
              option={option}
              selected={goalMinutes === option.minutes}
              onPress={() => setGoalMinutes(option.minutes)}
            />
          ))}
        </HStack>

        <VStack gap="xs">
          <Card padding="md" contentStyle={styles.reminder}>
            <HStack gap="sm">
              <IconTile icon={BellRing} tone="butter" size="md" />
              <VStack flex gap="xxxs">
                <Text variant="titleSm">{copy.reminderTitle}</Text>
                <Text variant="bodySm" color="textSecondary">
                  {copy.reminderSubtitle}
                </Text>
              </VStack>
              <Switch value={reminders} onValueChange={setReminders} accessibilityLabel={copy.reminderTitle} />
            </HStack>
            {reminders ? (
              <Animated.View entering={fade()} style={styles.slots}>
                <Divider />
                <Text variant="labelMd" color="textSecondary">
                  {copy.reminderTime}
                </Text>
                <SegmentedOptions<ReminderSlot>
                  options={SLOT_OPTIONS}
                  value={reminderSlot}
                  onChange={setReminderSlot}
                  accessibilityLabel={copy.reminderTime}
                />
              </Animated.View>
            ) : null}
          </Card>
          <Text variant="bodySm" color="textTertiary" style={styles.note}>
            {copy.demoNote}
          </Text>
        </VStack>
      </VStack>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  goals: { paddingTop: spacing.sm },
  goal: { alignItems: 'center', gap: spacing.xxs, paddingTop: spacing.lg, paddingHorizontal: spacing.xs },
  tag: { position: 'absolute', top: -spacing.sm, alignSelf: 'center' },
  reminder: { gap: spacing.md },
  slots: { gap: spacing.sm },
  note: { paddingHorizontal: spacing.xxs },
});
