/**
 * Layout helpers for the dev-only UI showcase: a titled section and a labelled wrapping row.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/theme';

import { Divider } from '../divider';
import { Text } from '../text';

export function ShowcaseSection({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Divider spacing="xs" />
      <Text variant="titleLg" accessibilityRole="header">
        {title}
      </Text>
      {note ? (
        <Text variant="bodySm" color="textSecondary">
          {note}
        </Text>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

export function ShowcaseRow({
  label,
  children,
  wrap = true,
  style,
}: {
  label?: string;
  children: ReactNode;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={styles.group}>
      {label ? (
        <Text variant="overline" color="textTertiary">
          {label}
        </Text>
      ) : null}
      <View style={[styles.row, wrap && styles.wrap, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xs, marginBottom: spacing.xl },
  body: { gap: spacing.lg, marginTop: spacing.xs },
  group: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  wrap: { flexWrap: 'wrap' },
});
