/**
 * Chip — compact pill for rewards ("+500 🥝"), progress ("0/7"), filters and meta
 * ("📖 13 capitoli"). `surface` is the white hairline chip used by the status row.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { HapticKind } from '@/lib/haptics';
import { elevation, radius, spacing, useTheme, type TextVariant } from '@/theme';

import { renderIcon, type IconSource } from './icon';
import { borderWidth, chipHeight, hairline, iconSize, iconStroke } from './metrics';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { resolveTone, type Tone } from './tones';

export type ChipVariant = 'soft' | 'outline' | 'solid' | 'surface';
export type ChipSize = 'sm' | 'md';

export type ChipProps = {
  label?: string;
  /** Custom content instead of `label` (e.g. a RollingNumber). */
  children?: ReactNode;
  icon?: IconSource;
  iconRight?: IconSource;
  /** Default `neutral`. */
  tone?: Tone;
  /** Default `soft`. */
  variant?: ChipVariant;
  /** sm 28 · md 34. Default `md`. */
  size?: ChipSize;
  /** Filter chips: selected renders `solid`. */
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  haptic?: Extract<HapticKind, 'selection' | 'light'>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  textVariant?: TextVariant;
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  label,
  children,
  icon,
  iconRight,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  selected,
  onPress,
  disabled,
  haptic = 'selection',
  accessibilityLabel,
  accessibilityHint,
  textVariant,
  style,
}: ChipProps) {
  const theme = useTheme();
  const colors = resolveTone(theme, tone);
  const effective: ChipVariant = selected ? 'solid' : variant;

  const frame: ViewStyle = (() => {
    switch (effective) {
      case 'solid':
        return { backgroundColor: colors.solid, borderColor: colors.solid };
      case 'outline':
        return { backgroundColor: 'transparent', borderColor: colors.border };
      case 'surface':
        return { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, boxShadow: elevation.sm };
      case 'soft':
        return { backgroundColor: colors.bg, borderColor: colors.bg };
    }
  })();
  const fg = effective === 'solid' ? colors.onSolid : effective === 'surface' ? theme.colors.text : colors.fg;
  const iconColor = effective === 'surface' && tone !== 'neutral' ? colors.solid : fg;
  const glyph = { size: size === 'sm' ? iconSize.xs : iconSize.sm, color: iconColor, strokeWidth: iconStroke.bold };

  const body = (
    <>
      {renderIcon(icon, glyph)}
      {children ??
        (label !== undefined ? (
          <Text
            variant={textVariant ?? (size === 'sm' ? 'labelSm' : 'labelMd')}
            style={{ color: fg }}
            numberOfLines={1}>
            {label}
          </Text>
        ) : null)}
      {renderIcon(iconRight, glyph)}
    </>
  );

  const frameStyle = [
    styles.base,
    size === 'sm' ? styles.sm : styles.md,
    { borderWidth: effective === 'surface' ? hairline : borderWidth.thin },
    frame,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        scaleTo="small"
        haptic={haptic}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={selected !== undefined ? { selected } : undefined}
        style={frameStyle}>
        {body}
      </PressableScale>
    );
  }
  return (
    <View accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} style={frameStyle}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    gap: spacing.xxs + spacing.xxxs,
  },
  sm: { height: chipHeight.sm, paddingHorizontal: spacing.xs + spacing.xxxs },
  md: { height: chipHeight.md, paddingHorizontal: spacing.sm },
});
