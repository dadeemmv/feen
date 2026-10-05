/**
 * Card — one idea per card. `style` styles the outer box (size, margins, flex); `contentStyle`
 * the inner layout (flexDirection, gap, alignment). The `brand` variant is an inverted evergreen
 * surface: its children render inside `ColorModeProvider mode="brand"`, so Text/Button/Chip pick
 * brand tokens automatically.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { HapticKind } from '@/lib/haptics';
import {
  ColorModeProvider,
  elevation,
  gradients,
  layout,
  radius as radii,
  spacing,
  sv,
  type RadiusToken,
} from '@/theme';

import { createThemedVariants } from './internal/themed-variants';
import { borderWidth, hairline, uiOpacity } from './metrics';
import { PressableScale } from './pressable-scale';
import { Spotlight } from './spotlight';

export type CardVariant = 'surface' | 'elevated' | 'brand' | 'accent' | 'locked' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export type CardProps = {
  children?: ReactNode;
  /** Default `surface`. */
  variant?: CardVariant;
  /** none 0 · sm 12 · md 16 · lg 20. Default `lg`. */
  padding?: CardPadding;
  /** Brand only: radial lime light from the top edge. */
  spotlight?: boolean;
  /** Override the corner radius (default xl, brand xxl). */
  radius?: RadiusToken;
  /** Makes the whole card pressable (PressableScale). */
  onPress?: () => void;
  disabled?: boolean;
  haptic?: Extract<HapticKind, 'selection' | 'light' | 'medium'>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const PADDING: Record<CardPadding, number> = {
  none: 0,
  sm: spacing.sm,
  md: spacing.md,
  lg: layout.cardPadding,
};

const shellBase: ViewStyle = { borderRadius: radii.xl };

const useShell = createThemedVariants((t) =>
  sv({
    base: shellBase,
    variants: {
      variant: {
        surface: {
          backgroundColor: t.colors.surface,
          borderWidth: hairline,
          borderColor: t.colors.borderSubtle,
          boxShadow: elevation.sm,
        },
        elevated: {
          backgroundColor: t.colors.surface,
          borderWidth: hairline,
          borderColor: t.colors.borderSubtle,
          boxShadow: elevation.md,
        },
        brand: { backgroundColor: t.colors.brandSurface, borderRadius: radii.xxl, boxShadow: elevation.md },
        accent: { backgroundColor: t.colors.accentBg, borderWidth: borderWidth.thin, borderColor: t.colors.accentBorder },
        locked: { backgroundColor: t.colors.fill, borderWidth: hairline, borderColor: t.colors.borderSubtle },
        outline: { backgroundColor: 'transparent', borderWidth: borderWidth.thin, borderColor: t.colors.border },
      },
    },
  }),
);

export function Card({
  children,
  variant = 'surface',
  padding = 'lg',
  spotlight = false,
  radius,
  onPress,
  disabled,
  haptic,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  contentStyle,
}: CardProps) {
  const shell = useShell()({ variant });
  const isBrand = variant === 'brand';
  const cornerRadius = radius ? radii[radius] : undefined;
  const shellStyle = [shell, cornerRadius !== undefined && { borderRadius: cornerRadius }, style];

  const content = (
    <View
      style={[
        styles.content,
        { padding: PADDING[padding] },
        variant === 'locked' && styles.dimmed,
        contentStyle,
      ]}>
      {children}
    </View>
  );

  const inner = (
    <>
      {isBrand ? (
        <View style={[styles.background, { borderRadius: cornerRadius ?? radii.xxl }]}>
          <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
          {spotlight ? <Spotlight /> : null}
        </View>
      ) : null}
      {isBrand ? <ColorModeProvider mode="brand">{content}</ColorModeProvider> : content}
    </>
  );

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        haptic={haptic}
        scaleTo="large"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
        style={shellStyle}>
        {inner}
      </PressableScale>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel} testID={testID} style={shellStyle}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
  dimmed: { opacity: uiOpacity.dimmed },
  background: { ...StyleSheet.absoluteFill, overflow: 'hidden', pointerEvents: 'none' },
});
