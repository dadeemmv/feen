/**
 * PlanSelector — the two Finanz Pro plans (`PRO_PLAN.prices`) as a radio group of cards:
 * yearly first with the "Più conveniente · -40%" ribbon and its per-month equivalent, then
 * monthly. The selected card gets a 2 pt lime border, a lifted lime-tinted face and a filled
 * radio. Rendered on evergreen (brand colour mode).
 */
import { StyleSheet, View } from 'react-native';

import { HStack, PressableScale, Radio, Tag, Text, VStack, borderWidth } from '@/components/ui';
import type { ProPrice } from '@/content/extra-types';
import { radius, spacing, useTheme } from '@/theme';

import { PRO_COPY } from '../copy';

export type PlanSelectorProps = {
  prices: readonly ProPrice[];
  selectedId: ProPrice['id'];
  onSelect: (id: ProPrice['id']) => void;
  disabled?: boolean;
};

/** Yearly (best value) on top, whatever the content order. */
const order = (price: ProPrice) => (price.id === 'yearly' ? 0 : 1);

export function PlanSelector({ prices, selectedId, onSelect, disabled = false }: PlanSelectorProps) {
  const sorted = [...prices].sort((a, b) => order(a) - order(b));
  return (
    <View accessibilityRole="radiogroup" style={styles.group}>
      {sorted.map((price) => (
        <PlanOption
          key={price.id}
          price={price}
          selected={price.id === selectedId}
          disabled={disabled}
          onPress={() => onSelect(price.id)}
        />
      ))}
    </View>
  );
}

type PlanOptionProps = { price: ProPrice; selected: boolean; disabled: boolean; onPress: () => void };

function PlanOption({ price, selected, disabled, onPress }: PlanOptionProps) {
  const { colors } = useTheme();
  const ribbon = price.badge ? `${PRO_COPY.bestValue} · ${price.badge}` : null;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic="selection"
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected, disabled }}
      accessibilityLabel={PRO_COPY.planA11y(price.label, price.priceLabel, price.period, price.note)}
      style={[
        styles.card,
        ribbon ? styles.withRibbon : null,
        selected
          ? { borderColor: colors.accentSolid, backgroundColor: colors.fillHover }
          : { borderColor: colors.border, backgroundColor: colors.fill },
      ]}>
      {ribbon ? <Tag label={ribbon} tone="accent" solid size="sm" style={styles.ribbon} /> : null}
      <HStack gap="sm">
        <Radio selected={selected} />
        <VStack flex gap="xxxs">
          <Text variant="titleMd">{price.label}</Text>
          {price.note ? (
            <Text variant="bodySm" color="accentText">
              {price.note}
            </Text>
          ) : null}
        </VStack>
        <VStack align="flex-end">
          <Text variant="titleLg" tabular>
            {price.priceLabel}
          </Text>
          <Text variant="labelSm" color="textSecondary">
            {price.period}
          </Text>
        </VStack>
      </HStack>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.md },
  card: {
    borderRadius: radius.xl,
    // Same width in both states: selecting never shifts the layout.
    borderWidth: borderWidth.thick,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  withRibbon: { marginTop: spacing.xs },
  ribbon: { position: 'absolute', top: -spacing.sm, left: spacing.md },
});
