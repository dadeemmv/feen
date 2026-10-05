/**
 * ScreenTitle — the big title of tab roots and pushed pages ("Academy", "Shop", "Account"):
 * `displayMd`, margin top `xs`, bottom `lg` (screen redlines). `trailing` sits on the title's
 * baseline row (Shop's countdown chip); `subtitle` adds a one-line lead.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/theme';

import { Text } from './text';

export type ScreenTitleProps = {
  title: string;
  subtitle?: string;
  /** Node at the end of the title row (Chip, IconButton). */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenTitle({ title, subtitle, trailing, style }: ScreenTitleProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.row}>
        <Text variant="displayMd" accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {trailing}
      </View>
      {subtitle ? (
        <Text variant="bodyMd" color="textSecondary">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: spacing.xs, marginBottom: spacing.lg, gap: spacing.xxs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1 },
});
