/**
 * Button — pill CTA. Variants map to the art direction: primary = lime face + evergreen label
 * (the single action colour), brand = evergreen, secondary/outline/ghost, danger.
 * Colour changes (pressed darken, disabled ⇄ enabled) glide with Reanimated CSS transitions,
 * so the lesson "Continua" warms up smoothly once an answer is selected.
 */
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import type { HapticKind } from '@/lib/haptics';
import { duration, elevation, radius, spacing, sv, type TextVariant } from '@/theme';

import { renderIcon, type IconSource } from './icon';
import { createThemedVariants } from './internal/themed-variants';
import { borderWidth, controlHeight, iconSize, iconStroke } from './metrics';
import { PressableScale } from './pressable-scale';
import { Shimmer } from './shimmer';
import { AnimatedText } from './text';

export type ButtonVariant = 'primary' | 'brand' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  /** Default `primary`. */
  variant?: ButtonVariant;
  /** Heights sm 40 · md 48 · lg 56. Default `lg`. */
  size?: ButtonSize;
  disabled?: boolean;
  /** Shows a spinner, keeps the width, blocks presses. */
  loading?: boolean;
  iconLeft?: IconSource;
  iconRight?: IconSource;
  /** Stretch to the parent's width (`alignSelf: 'stretch'`). In a row use `style={{ flex: 1 }}`. */
  fullWidth?: boolean;
  /** Looping light sweep (hero CTA). Off under reduced motion. */
  shimmer?: boolean;
  /** Lime glow under the face (primary on brand surfaces). */
  glow?: boolean;
  /** Default `light`; `false` disables. */
  haptic?: Extract<HapticKind, 'selection' | 'light' | 'medium'> | false;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

type FaceColors = { bg: string; bgPressed: string; label: string; border: string };

const TRANSPARENT = 'transparent';

const useButtonColors = createThemedVariants((t) => {
  const c = t.colors;
  const onBrandSurface = t.mode === 'brand';
  const enabled: Record<ButtonVariant, FaceColors> = {
    primary: { bg: c.accentSolid, bgPressed: c.accentSolidPressed, label: c.onAccent, border: c.accentSolid },
    brand: { bg: c.brandSolid, bgPressed: c.brandSolidPressed, label: c.onBrand, border: c.brandSolid },
    secondary: { bg: c.surface, bgPressed: c.fill, label: c.text, border: c.border },
    outline: { bg: TRANSPARENT, bgPressed: c.fill, label: c.text, border: c.borderStrong },
    ghost: { bg: TRANSPARENT, bgPressed: c.fill, label: c.text, border: TRANSPARENT },
    danger: { bg: c.dangerSolid, bgPressed: c.dangerSolidPressed, label: c.onBrand, border: c.dangerSolid },
  };
  const paleAccent = onBrandSurface ? c.fill : c.accentBg;
  const paleBrand = onBrandSurface ? c.fill : c.brandBg;
  const disabled: Record<ButtonVariant, FaceColors> = {
    primary: { bg: paleAccent, bgPressed: paleAccent, label: c.textTertiary, border: paleAccent },
    brand: { bg: paleBrand, bgPressed: paleBrand, label: c.textTertiary, border: paleBrand },
    secondary: { bg: c.surface, bgPressed: c.surface, label: c.textDisabled, border: c.borderSubtle },
    outline: { bg: TRANSPARENT, bgPressed: TRANSPARENT, label: c.textDisabled, border: c.border },
    ghost: { bg: TRANSPARENT, bgPressed: TRANSPARENT, label: c.textDisabled, border: TRANSPARENT },
    danger: { bg: c.dangerBg, bgPressed: c.dangerBg, label: c.textTertiary, border: c.dangerBg },
  };
  return { enabled, disabled };
});

const faceBase: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radius.pill,
  borderWidth: borderWidth.thin,
};

const face = sv({
  base: faceBase,
  variants: {
    size: {
      sm: { height: controlHeight.sm, paddingHorizontal: spacing.md },
      md: { height: controlHeight.md, paddingHorizontal: spacing.lg },
      lg: { height: controlHeight.lg, paddingHorizontal: spacing.xl },
    },
    variant: {
      primary: {},
      brand: {},
      secondary: { boxShadow: elevation.sm },
      outline: { borderWidth: borderWidth.regular },
      ghost: {},
      danger: {},
    },
  },
  defaultVariants: { size: 'lg', variant: 'primary' },
});

const LABEL_VARIANT: Record<ButtonSize, TextVariant> = { sm: 'labelMd', md: 'labelLg', lg: 'labelLg' };
const ICON_SIZE: Record<ButtonSize, number> = { sm: iconSize.sm, md: iconSize.md, lg: iconSize.md };

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  shimmer = false,
  glow = false,
  haptic = 'light',
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: ButtonProps) {
  const palette = useButtonColors();
  const [pressed, setPressed] = useState(false);
  const inactive = disabled || loading;
  const colors = disabled ? palette.disabled[variant] : palette.enabled[variant];
  const bg = pressed && !inactive ? colors.bgPressed : colors.bg;
  const icon = { size: ICON_SIZE[size], color: colors.label, strokeWidth: iconStroke.bold };

  return (
    <PressableScale
      onPress={onPress}
      disabled={inactive}
      haptic={haptic === false ? undefined : haptic}
      scaleTo="large"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      testID={testID}
      style={[
        styles.root,
        fullWidth && styles.fullWidth,
        glow && !disabled && styles.glow,
        style,
      ]}>
      <Animated.View
        style={[face({ size, variant }), faceTransition, { backgroundColor: bg, borderColor: colors.border }]}>
        {shimmer && !disabled ? <Shimmer borderRadius={radius.pill} /> : null}
        <View style={[styles.content, loading && styles.hidden]}>
          {renderIcon(iconLeft, icon)}
          <AnimatedText
            variant={LABEL_VARIANT[size]}
            numberOfLines={1}
            style={[styles.label, labelTransition, { color: colors.label }]}>
            {title}
          </AnimatedText>
          {renderIcon(iconRight, icon)}
        </View>
        {loading ? (
          <View style={styles.spinner}>
            <ActivityIndicator size="small" color={colors.label} />
          </View>
        ) : null}
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { borderRadius: radius.pill },
  fullWidth: { alignSelf: 'stretch' },
  glow: { boxShadow: elevation.accentGlow },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  hidden: { opacity: 0 },
  label: { userSelect: 'none' },
  spinner: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});

/** Colour glide for pressed / disabled flips ('ease' = motion.easing.standard). */
const faceTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: ['backgroundColor', 'borderColor'],
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const labelTransition: CSSTransitionProperties<TextStyle> = {
  transitionProperty: 'color',
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};
