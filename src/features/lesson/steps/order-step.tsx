/**
 * Order (tap-to-place word bank, mazkev `lesson.tsx` pattern): numbered slots on top, a bank of
 * phrase chips below. Tap a chip → it takes the first free slot; tap a placed phrase → it goes
 * back to the bank. Pieces reflow with a linear layout transition. After a wrong check each slot
 * shows whether that phrase was in the right place (green) or not (red); "Chiudi" keeps the
 * correct leading phrases in place and returns the rest to the bank.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { PressableScale, Text, borderWidth, tileSize, useReduceMotion } from '@/components/ui';
import type { OrderStep as OrderStepData } from '@/content/types';
import { duration, easing, radius, spacing, useTheme, type Theme } from '@/theme';

import { COPY } from '../copy';
import { orderedIds } from '../machine';
import { lessonMetrics } from '../metrics';
import { bankOrder } from '../lib/arrange';
import { OptionTile } from '../components/option-tile';
import { GradedStepCard, StepPrompt } from '../components/step-layout';
import { isAnswering, type StepViewProps } from './types';

type SlotTone = 'placed' | 'correct' | 'wrong';

export function OrderStep({ step, answer, phase, onSelect, bottomInset, compact }: StepViewProps<OrderStepData>) {
  const reduceMotion = useReduceMotion();
  const placed = orderedIds(answer);
  const answering = isAnswering(phase);
  const labelOf = (id: string) => step.items.find((item) => item.id === id)?.label ?? '';
  const bank = bankOrder(step.items, step.id).filter((item) => !placed.includes(item.id));
  const layout = reduceMotion ? undefined : LinearTransition.duration(duration.base).easing(easing.standard);

  const toneOf = (id: string, index: number): SlotTone => {
    if (phase === 'feedback-correct' || phase === 'completed') return 'correct';
    if (phase === 'feedback-wrong') return step.items[index]?.id === id ? 'correct' : 'wrong';
    return 'placed';
  };

  const place = (id: string) => onSelect([...placed, id]);
  const unplace = (id: string) => onSelect(placed.filter((placedId) => placedId !== id));
  const firstEmpty = placed.length;

  return (
    <GradedStepCard
      tag={step.tag}
      prompt={<StepPrompt>{step.prompt}</StepPrompt>}
      bottomInset={bottomInset}
      compact={compact}>
      <View style={styles.slots}>
        {step.items.map((item, index) => {
          const id = placed[index];
          return id ? (
            <Animated.View key={id} layout={layout} entering={reduceMotion ? undefined : FadeIn.duration(duration.fast)}>
              <PlacedSlot
                compact={compact}
                index={index}
                label={labelOf(id)}
                tone={toneOf(id, index)}
                onPress={answering ? () => unplace(id) : undefined}
              />
            </Animated.View>
          ) : (
            <Animated.View key={`empty-${item.id}`} layout={layout}>
              <EmptySlot compact={compact} index={index} hint={index === firstEmpty ? COPY.steps.orderEmpty : undefined} />
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.bank}>
        {bank.length === 0 ? (
          <Text variant="labelSm" color="textTertiary" align="center">
            {answering ? COPY.steps.orderBankDone : ' '}
          </Text>
        ) : (
          bank.map((item) => (
            <Animated.View
              key={item.id}
              layout={layout}
              entering={reduceMotion ? undefined : FadeIn.duration(duration.fast)}
              exiting={reduceMotion ? undefined : FadeOut.duration(duration.press)}>
              <OptionTile
                label={item.label}
                status="idle"
                shape="pill"
                role="button"
                labelVariant="labelMd"
                locked={!answering}
                onPress={() => place(item.id)}
                testID={`order-bank-${item.id}`}
              />
            </Animated.View>
          ))
        )}
      </View>
    </GradedStepCard>
  );
}

function slotColors(theme: Theme, tone: SlotTone) {
  const c = theme.colors;
  switch (tone) {
    case 'correct':
      return { bg: c.successBg, border: c.successSolid, fg: c.successText, disc: c.successSolid };
    case 'wrong':
      return { bg: c.dangerBg, border: c.dangerSolid, fg: c.dangerText, disc: c.dangerSolid };
    case 'placed':
      return { bg: c.brandBg, border: c.brandSolid, fg: c.brandText, disc: c.brandSolid };
  }
}

type PlacedProps = { index: number; label: string; tone: SlotTone; compact: boolean; onPress?: () => void };

const slotHeight = (compact: boolean) => ({
  minHeight: lessonMetrics.slotMinHeight[compact ? 'compact' : 'regular'],
});

function PlacedSlot({ index, label, tone, compact, onPress }: PlacedProps) {
  const theme = useTheme();
  const colors = slotColors(theme, tone);
  return (
    <PressableScale
      onPress={onPress}
      disabled={!onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={`${COPY.steps.orderSlot(index + 1)}: ${label}`}
      accessibilityHint={onPress ? 'Tocca per rimetterla tra le opzioni' : undefined}>
      <View style={[styles.slot, slotHeight(compact), { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <View style={[styles.disc, { backgroundColor: colors.disc }]}>
          <Text variant="labelSm" color="onBrand" tabular>
            {index + 1}
          </Text>
        </View>
        <Text variant="bodyMd" weight="semiBold" style={[styles.slotLabel, { color: colors.fg }]}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

function EmptySlot({ index, hint, compact }: { index: number; hint?: string; compact: boolean }) {
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${COPY.steps.orderSlot(index + 1)}, vuota`}
      style={[styles.slot, slotHeight(compact), styles.slotEmpty, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceRaised }]}>
      <View style={[styles.disc, { backgroundColor: theme.colors.fill }]}>
        <Text variant="labelSm" color="textTertiary" tabular>
          {index + 1}
        </Text>
      </View>
      {hint ? (
        <Text variant="bodySm" color="textTertiary" style={styles.slotLabel}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slots: { gap: spacing.xs },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: borderWidth.regular,
  },
  slotEmpty: { borderStyle: 'dashed' },
  disc: {
    width: tileSize.sm - spacing.xxs,
    height: tileSize.sm - spacing.xxs,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: { flex: 1 },
  bank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
