/**
 * Badge — small count pill or dot (unread, new items). A surface-coloured ring makes it read as
 * "cut out" of whatever it overlaps. Position it yourself (or use IconButton's `badge` prop).
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

import { formatCount } from './internal/format-count';
import { badgeSize, borderWidth } from './metrics';
import { Text } from './text';
import { resolveTone, type Tone } from './tones';

export type BadgeProps = {
  /** Omit for a dot. */
  count?: number;
  /** Above this shows `max+`. Default 99. */
  max?: number;
  /** Default `danger`. */
  tone?: Tone;
  /** sm 16 · md 20. Default `md`. */
  size?: 'sm' | 'md';
  /** Ring colour matches the surface below. Default `true`. */
  ring?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const DOT_RATIO = 0.5;

export function Badge({ count, max = 99, tone = 'danger', size = 'md', ring = true, accessibilityLabel, style }: BadgeProps) {
  const theme = useTheme();
  const colors = resolveTone(theme, tone);
  const dimension = badgeSize[size];
  const isDot = count === undefined;
  const label = isDot ? '' : count > max ? `${max}+` : formatCount(count);
  const dotSize = Math.round(dimension * (isDot ? DOT_RATIO : 1));

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? (isDot ? undefined : `${label}`)}
      style={[
        styles.base,
        {
          minWidth: dotSize,
          height: dotSize,
          backgroundColor: colors.solid,
          paddingHorizontal: isDot ? 0 : spacing.xxs,
        },
        ring && { borderWidth: borderWidth.thick, borderColor: theme.colors.surface },
        style,
      ]}>
      {isDot ? null : (
        <Text variant="labelSm" style={[styles.label, { color: colors.onSolid }]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', boxSizing: 'content-box' },
  label: { includeFontPadding: false, textAlignVertical: 'center' },
});
