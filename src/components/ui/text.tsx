/**
 * Text — the ONLY file allowed to import `Text` from react-native (Ignite preset-typed Text).
 * `variant` picks a semantic role from `textVariants`, `color` a semantic colour token of the
 * nearest colour mode (so text inside a brand surface turns white automatically).
 */
import type { ComponentProps, Ref } from 'react';
import {
  Text as RNText,
  StyleSheet,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { fonts, textVariants, useTheme, type ColorToken, type FontWeight, type TextVariant } from '@/theme';

export type TextAlign = 'auto' | 'left' | 'center' | 'right' | 'justify';

type TextOwnProps = {
  /** Typographic role. Default `bodyMd`. */
  variant?: TextVariant;
  /** Semantic colour token. Default `text`. */
  color?: ColorToken;
  align?: TextAlign;
  /** Override the weight while keeping the variant's family (display or text face). */
  weight?: FontWeight;
  /** Force tabular figures (already on for the `numeric` variant). */
  tabular?: boolean;
};

export type TextProps = Omit<RNTextProps, 'style'> &
  TextOwnProps & {
    style?: StyleProp<TextStyle>;
    ref?: Ref<RNText>;
  };

/** Dynamic Type caps: display faces break layouts earlier than body copy. */
const MAX_FONT_SCALE = { display: 1.2, text: 1.4 } as const;

const variantStyles = StyleSheet.create(textVariants);
const displayFamilies: readonly string[] = Object.values(fonts.display);

const styles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
});

function isDisplayVariant(variant: TextVariant): boolean {
  return displayFamilies.includes(textVariants[variant].fontFamily);
}

function familyForWeight(variant: TextVariant, weight: FontWeight): string {
  if (!isDisplayVariant(variant)) return fonts.text[weight];
  if (weight === 'extraBold') return fonts.display.extraBold;
  if (weight === 'bold') return fonts.display.bold;
  return fonts.display.semiBold;
}

/** Resolved style for a variant/colour pair — reuse it for TextInput or animated text. */
export function useTextStyle({
  variant = 'bodyMd',
  color = 'text',
  align,
  weight,
  tabular,
}: TextOwnProps = {}): StyleProp<TextStyle> {
  const theme = useTheme();
  return [
    variantStyles[variant],
    { color: theme.colors[color] },
    align ? { textAlign: align } : undefined,
    weight ? { fontFamily: familyForWeight(variant, weight) } : undefined,
    tabular ? styles.tabular : undefined,
  ];
}

export function Text({
  variant = 'bodyMd',
  color = 'text',
  align,
  weight,
  tabular,
  style,
  maxFontSizeMultiplier,
  ref,
  ...rest
}: TextProps) {
  const textStyle = useTextStyle({ variant, color, align, weight, tabular });
  return (
    <RNText
      ref={ref}
      maxFontSizeMultiplier={
        maxFontSizeMultiplier ?? (isDisplayVariant(variant) ? MAX_FONT_SCALE.display : MAX_FONT_SCALE.text)
      }
      style={[textStyle, style]}
      {...rest}
    />
  );
}

type AnimatedTextStyle = ComponentProps<typeof Animated.Text>['style'];

export type AnimatedTextProps = Omit<ComponentProps<typeof Animated.Text>, 'style'> &
  TextOwnProps & {
    /** Accepts `useAnimatedStyle` results and Reanimated CSS transition props. */
    style?: AnimatedTextStyle;
  };

/** Reanimated `Animated.Text` with the same variant/colour API. */
export function AnimatedText({
  variant = 'bodyMd',
  color = 'text',
  align,
  weight,
  tabular,
  style,
  maxFontSizeMultiplier,
  ...rest
}: AnimatedTextProps) {
  const textStyle = useTextStyle({ variant, color, align, weight, tabular });
  return (
    <Animated.Text
      maxFontSizeMultiplier={
        maxFontSizeMultiplier ?? (isDisplayVariant(variant) ? MAX_FONT_SCALE.display : MAX_FONT_SCALE.text)
      }
      style={[textStyle, style]}
      {...rest}
    />
  );
}
