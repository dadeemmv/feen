/**
 * Residents, bricks and days of the pact as big serif numbers (no bars, no percentages: the
 * progress is in the world). Residents measure constancy, bricks buy houses, not knowledge.
 */
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

import { VILLAGE_COPY } from '../copy';
import type { Village } from '../lib/model';

function Counter({ value, label, compact }: { value: string; label: string; compact?: boolean }) {
  return (
    <View style={styles.counter} accessible accessibilityLabel={`${value} ${label}`}>
      <Text variant="displayXl" style={compact ? styles.numeralCompact : styles.numeral} tabular>
        {value}
      </Text>
      <Text variant="labelSm" color="textSecondary">
        {label}
      </Text>
    </View>
  );
}

/** `compact`: smaller numerals, for the header floating over the full-screen village. */
export function VillageCounters({ village, compact }: { village: Village; compact?: boolean }) {
  return (
    <View style={styles.row}>
      <Counter value={String(village.residents)} label={VILLAGE_COPY.residents(village.residents)} compact={compact} />
      <Counter value={String(village.bricks)} label={VILLAGE_COPY.bricks} compact={compact} />
      {village.day !== null && village.days !== null ? (
        <Counter value={VILLAGE_COPY.pactDaysValue(village.day, village.days)} label={VILLAGE_COPY.pactDays} compact={compact} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  counter: { gap: spacing.xxxs },
  numeral: { fontSize: 40, lineHeight: 42 },
  numeralCompact: { fontSize: 30, lineHeight: 32 },
});
