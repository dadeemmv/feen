/**
 * The companions in a grid, each with its animal and type: the 2 × 2 teaser on the test intro,
 * and "Gli altri compagni" in one row under a result (the user's own mascot left out with
 * `exclude`).
 */
import { StyleSheet, View } from 'react-native';

import { MascotArt } from '@/components/illustrations';
import { Text } from '@/components/ui';
import { MASCOT_IDS, MASCOTS, type MascotId } from '@/content/personality';
import { spacing } from '@/theme';

import { mascotMetrics } from '../metrics';

export type MascotLineupProps = {
  exclude?: MascotId;
  /** Items per row. Default: all in one row. */
  columns?: number;
  accessibilityLabel?: string;
};

export function MascotLineup({ exclude, columns, accessibilityLabel }: MascotLineupProps) {
  const ids = MASCOT_IDS.filter((id) => id !== exclude);
  const perRow = columns ?? ids.length;
  const rows = Array.from({ length: Math.ceil(ids.length / perRow) }, (_, row) =>
    ids.slice(row * perRow, row * perRow + perRow),
  );

  return (
    <View style={styles.grid} accessible={Boolean(accessibilityLabel)} accessibilityLabel={accessibilityLabel}>
      {rows.map((row) => (
        <View key={row.join('-')} style={styles.row}>
          {row.map((id) => (
            <View key={id} style={styles.item}>
              <MascotArt id={id} width={mascotMetrics.lineupArt} />
              <Text variant="labelMd" align="center" numberOfLines={1}>
                {MASCOTS[id].animal}
              </Text>
              <Text variant="bodySm" color="textSecondary" align="center" numberOfLines={1}>
                {MASCOTS[id].type}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.xs },
  item: { flex: 1, alignItems: 'center', gap: spacing.xxxs },
});
