/**
 * StatTile — icon + big value + small label, laid out 2–3 per row (Account stats, lesson
 * completion "XP · Precisione · Kiwi", streak records). On brand surfaces it becomes a raised
 * evergreen tile automatically.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { elevation, radius, spacing, useTheme } from '@/theme';

import { renderIcon, type IconSource } from './icon';
import { hairline, iconSize, iconStroke } from './metrics';
import { Text } from './text';
import { resolveTone, type Tone } from './tones';

export type StatTileProps = {
  /** Economy icon node (`<KiwiCoinIcon size={28} />`) or a Lucide component / emoji. */
  icon?: IconSource;
  /** Formatted value ("120", "92%") or a node (CountUp, RollingNumber). */
  value: ReactNode;
  label: string;
  /** Colours a Lucide/emoji icon. Default `accent`. */
  tone?: Tone;
  /** `md` (titleLg value, Account) or `lg` (displaySm value, completion). Default `md`. */
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

export function StatTile({ icon, value, label, tone = 'accent', size = 'md', style }: StatTileProps) {
  const theme = useTheme();
  const onBrand = theme.mode === 'brand';
  const colors = resolveTone(theme, tone);
  const glyph = size === 'lg' ? iconSize.xl : iconSize.lg;
  const valueNode =
    typeof value === 'string' || typeof value === 'number' ? (
      <Text variant={size === 'lg' ? 'displaySm' : 'titleLg'} tabular numberOfLines={1}>
        {value}
      </Text>
    ) : (
      value
    );

  return (
    <View
      accessible
      accessibilityLabel={typeof value === 'string' || typeof value === 'number' ? `${value} ${label}` : label}
      style={[
        styles.tile,
        onBrand
          ? { backgroundColor: theme.colors.surfaceRaised }
          : { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderSubtle, borderWidth: hairline, boxShadow: elevation.sm },
        style,
      ]}>
      {icon ? (
        // Fixed slot = emoji line box, so SVG, Lucide and emoji icons keep values on one baseline.
        <View style={[styles.iconSlot, { height: Math.round(glyph * ICON_SLOT_RATIO) }]}>
          {renderIcon(icon, {
            size: glyph,
            color: onBrand ? theme.colors.accentText : colors.fg,
            strokeWidth: iconStroke.bold,
          })}
        </View>
      ) : null}
      {valueNode}
      <Text variant="labelSm" color="textSecondary" align="center" numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

/** Icon slot height relative to the glyph (matches the emoji line height used by renderIcon). */
const ICON_SLOT_RATIO = 1.25;

const styles = StyleSheet.create({
  iconSlot: { alignItems: 'center', justifyContent: 'center' },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.xl,
  },
});
