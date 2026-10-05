/**
 * The characters in a grid, each with its title and quadrant: the 2 × 2 compass-shaped teaser on
 * the test intro (risk on top, left on the left), and "Gli altri personaggi" in one row under a
 * result (the user's own character left out with `exclude`).
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
              <MascotArt id={id} height={mascotMetrics.lineupArtHeight} />
              <Text variant="labelMd" align="center" numberOfLines={1}>
                {MASCOTS[id].title}
              </Text>
              <Text variant="bodySm" color="textSecondary" align="center" numberOfLines={1}>
                {MASCOTS[id].quadrant}
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
