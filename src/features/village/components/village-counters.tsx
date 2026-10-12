/**
 * Residents, bricks and days of the pact as big serif numbers (no bars, no percentages: the
 * progress is in the world). Residents measure constancy, bricks buy houses, not knowledge.
 */
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

import { VILLAGE_COPY } from '../copy';
import type { Village } from '../lib/model';

function Counter({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.counter} accessible accessibilityLabel={`${value} ${label}`}>
      <Text variant="displayXl" style={styles.numeral} tabular>
        {value}
      </Text>
      <Text variant="labelSm" color="textSecondary">
        {label}
      </Text>
    </View>
  );
}

export function VillageCounters({ village }: { village: Village }) {
  return (
    <View style={styles.row}>
      <Counter value={String(village.residents)} label={VILLAGE_COPY.residents(village.residents)} />
      <Counter value={String(village.bricks)} label={VILLAGE_COPY.bricks} />
      {village.day !== null && village.days !== null ? (
        <Counter value={VILLAGE_COPY.pactDaysValue(village.day, village.days)} label={VILLAGE_COPY.pactDays} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  counter: { gap: spacing.xxxs },
  numeral: { fontSize: 40, lineHeight: 42 },
});
