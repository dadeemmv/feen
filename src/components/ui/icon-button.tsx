/**
 * IconButton — circular icon-only control (back, close, share, flag, send, new chat).
 * Always pass an Italian `accessibilityLabel` ("Indietro", "Chiudi", "Condividi"…).
 */
import { StyleSheet, View, type Insets, type StyleProp, type ViewStyle } from 'react-native';

import type { HapticKind } from '@/lib/haptics';
import { elevation, layout, radius, spacing, sv, useTheme, type ColorToken } from '@/theme';

import { Badge } from './badge';
import { renderIcon, type IconSource } from './icon';
import { createThemedVariants } from './internal/themed-variants';
import { hairline, iconButtonSize, iconSize, iconStroke, uiOpacity } from './metrics';
import { PressableScale } from './pressable-scale';

export type IconButtonVariant = 'plain' | 'surface' | 'brand' | 'glass' | 'accent';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export type IconButtonProps = {
  icon: IconSource;
  accessibilityLabel: string;
  onPress?: () => void;
  /** Default `surface`. */
  variant?: IconButtonVariant;
  /** Diameters sm 36 · md 40 · lg 48. Default `md`. */
  size?: IconButtonSize;
  disabled?: boolean;
  /** Override the icon colour token. */
  iconColor?: ColorToken;
  /** Count badge (number) or dot (`true`) at the top-right. */
  badge?: number | boolean;
  /** Default `selection`; `false` disables. */
  haptic?: Extract<HapticKind, 'selection' | 'light' | 'medium'> | false;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE: Record<IconButtonSize, number> = { sm: iconSize.sm, md: iconSize.md, lg: iconSize.lg };

const circleBase: ViewStyle = { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill };

const useCircle = createThemedVariants((t) =>
  sv({
    base: circleBase,
    variants: {
      size: {
        sm: { width: iconButtonSize.sm, height: iconButtonSize.sm },
        md: { width: iconButtonSize.md, height: iconButtonSize.md },
        lg: { width: iconButtonSize.lg, height: iconButtonSize.lg },
      },
      variant: {
        plain: {},
        surface: {
          backgroundColor: t.colors.surface,
          borderWidth: hairline,
          borderColor: t.colors.border,
          boxShadow: elevation.sm,
        },
        brand: { backgroundColor: t.colors.brandSolid, boxShadow: elevation.brandGlow },
        glass: { backgroundColor: t.colors.fill, borderWidth: hairline, borderColor: t.colors.borderSubtle },
        accent: { backgroundColor: t.colors.accentSolid },
      },
      disabled: {
        true: { opacity: uiOpacity.disabled, boxShadow: undefined },
        false: {},
      },
    },
    compoundVariants: [
      { variant: 'accent', disabled: true, style: { backgroundColor: t.colors.fill, opacity: 1 } },
    ],
  }),
);

const ICON_COLOR: Record<IconButtonVariant, ColorToken> = {
  plain: 'text',
  surface: 'text',
  brand: 'onBrand',
  glass: 'text',
  accent: 'onAccent',
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'surface',
  size = 'md',
  disabled = false,
  iconColor,
  badge,
  haptic = 'selection',
  accessibilityHint,
  testID,
  style,
}: IconButtonProps) {
  const theme = useTheme();
  const circle = useCircle();
  const diameter = iconButtonSize[size];
  const slop = Math.max(0, (layout.minTouch - diameter) / 2);
  const hitSlop: Insets = { top: slop, bottom: slop, left: slop, right: slop };
  const colorToken: ColorToken =
    iconColor ?? (variant === 'accent' && disabled ? 'textTertiary' : ICON_COLOR[variant]);

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo="small"
      haptic={haptic === false ? undefined : haptic}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={[circle({ size, variant, disabled }), style]}>
      {renderIcon(icon, { size: ICON_SIZE[size], color: theme.colors[colorToken], strokeWidth: iconStroke.regular })}
      {badge ? (
        <View style={styles.badge}>
          <Badge count={typeof badge === 'number' ? badge : undefined} size="sm" />
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: -spacing.xxxs, right: -spacing.xxxs },
});
