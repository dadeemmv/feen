/**
 * TextField — rounded input on a soft `fill` background; focus draws a 2 pt evergreen ring (lime on
 * brand surfaces), errors a danger ring + message. One component for forms (name, email), the
 * redeem-code field (`align="center"`, `autoCapitalize="characters"`) and the chat composer
 * (`shape="pill"` + `trailing` send button, `multiline`).
 */
import { useState, type ReactNode, type Ref } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TargetedEvent,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import { isWeb } from '@/lib/platform';
import { duration, radius, spacing, textVariants, useTheme, type TextVariant } from '@/theme';

import { renderIcon, type IconSource } from './icon';
import { borderWidth, controlHeight, iconSize, iconStroke, inputMaxHeight, uiOpacity } from './metrics';
import { Text } from './text';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'editable'> & {
  /** Label above the field (`labelMd`, textSecondary). */
  label?: string;
  /** Hint below the field. Replaced by `error` when set. */
  helper?: string;
  /** Error message (string) or error state only (`true`). */
  error?: string | boolean;
  /** Icon inside the field, before the text. */
  leading?: IconSource;
  /** Node inside the field, after the text (send IconButton, clear button, suffix). */
  trailing?: ReactNode;
  /** Heights md 48 · lg 56. Default `lg`. */
  size?: 'md' | 'lg';
  /** `rounded` (radius md, forms) or `pill` (chat composer). Default `rounded`. */
  shape?: 'rounded' | 'pill';
  /** `fill` (soft background, default) or `surface` (white + hairline, for tinted backgrounds). */
  variant?: 'fill' | 'surface';
  /** Text alignment inside the input. Default `left`. */
  align?: 'left' | 'center';
  /** Typography of the typed text. Default `bodyLg`. */
  textVariant?: TextVariant;
  /** Shows "12/40" under the field when `maxLength` is set. */
  showCount?: boolean;
  disabled?: boolean;
  ref?: Ref<TextInput>;
  /** Outer container (label + field + helper). */
  style?: StyleProp<ViewStyle>;
  /** The field box itself. */
  fieldStyle?: StyleProp<ViewStyle>;
  /** The TextInput text (e.g. letterSpacing for a code). */
  inputStyle?: StyleProp<TextStyle>;
};

const TRANSPARENT = 'transparent';
/** Browser focus ring off (the field draws its own ring). `none` is valid CSS but not in RN's types. */
const WEB_INPUT_RESET = { outlineStyle: 'none', outlineWidth: 0 } as unknown as TextStyle;
/** react-native-web `rows` (not in RN's TS types). */
const WEB_SINGLE_ROW = { rows: 1 } as object;

export function TextField({
  label,
  helper,
  error,
  leading,
  trailing,
  size = 'lg',
  shape = 'rounded',
  variant = 'fill',
  align = 'left',
  textVariant = 'bodyLg',
  showCount = false,
  disabled = false,
  multiline = false,
  maxLength,
  value,
  onFocus,
  onBlur,
  onContentSizeChange,
  ref,
  style,
  fieldStyle,
  inputStyle,
  accessibilityLabel,
  ...inputProps
}: TextFieldProps) {
  const theme = useTheme();
  const c = theme.colors;
  const [focused, setFocused] = useState(false);
  // Web textareas default to 2 rows and never grow: start at 1 row and grow with the content.
  const webAutoGrow = isWeb && multiline;
  const [webContentHeight, setWebContentHeight] = useState(0);
  const hasError = !!error;
  const errorMessage = typeof error === 'string' ? error : undefined;
  const focusColor = theme.mode === 'brand' ? c.accentSolid : c.brandSolid;
  const restingBorder = variant === 'surface' ? c.border : TRANSPARENT;
  const borderColor = hasError ? c.dangerSolid : focused ? focusColor : restingBorder;
  const backgroundColor = variant === 'surface' || focused ? c.surface : c.fill;
  const height = controlHeight[size];
  const type = textVariants[textVariant];

  const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(true);
    onFocus?.(event);
  };
  const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const restingInputHeight = height - borderWidth.thick * 2;
  const webHeight =
    webAutoGrow && value && webContentHeight > restingInputHeight
      ? Math.min(inputMaxHeight, webContentHeight)
      : undefined;
  const handleContentSizeChange: TextInputProps['onContentSizeChange'] = (event) => {
    if (webAutoGrow) setWebContentHeight(event.nativeEvent.contentSize.height);
    onContentSizeChange?.(event);
  };

  const count = maxLength !== undefined && showCount ? `${value?.length ?? 0}/${maxLength}` : undefined;
  const footnote = errorMessage ?? helper;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text variant="labelMd" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <Animated.View
        style={[
          styles.field,
          fieldTransition,
          {
            minHeight: height,
            // Half the resting height = a pill at one line, a soft rounded box when multiline grows.
            borderRadius: shape === 'pill' ? height / 2 : radius.md,
            paddingLeft: leading ? spacing.sm : shape === 'pill' ? spacing.lg : spacing.md,
            paddingRight: trailing ? spacing.xxs + spacing.xxxs : shape === 'pill' ? spacing.lg : spacing.md,
            backgroundColor,
            borderColor,
          },
          multiline && styles.multilineField,
          disabled && styles.disabled,
          fieldStyle,
        ]}>
        {leading ? (
          <View style={[styles.adornment, multiline && { height: height - borderWidth.thick * 2 }]}>
            {renderIcon(leading, { size: iconSize.md, color: c.textTertiary, strokeWidth: iconStroke.regular })}
          </View>
        ) : null}
        <TextInput
          ref={ref}
          value={value}
          editable={!disabled}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onContentSizeChange={handleContentSizeChange}
          {...(webAutoGrow ? WEB_SINGLE_ROW : null)}
          placeholderTextColor={c.textTertiary}
          selectionColor={focusColor}
          cursorColor={focusColor}
          accessibilityLabel={accessibilityLabel ?? label ?? inputProps.placeholder}
          aria-disabled={disabled}
          style={[
            styles.input,
            {
              color: c.text,
              fontFamily: type.fontFamily,
              fontSize: type.fontSize,
              letterSpacing: 'letterSpacing' in type ? type.letterSpacing : undefined,
              textAlign: align,
            },
            multiline
              ? {
                  lineHeight: type.lineHeight,
                  minHeight: restingInputHeight,
                  height: webHeight,
                  maxHeight: inputMaxHeight,
                  // Centre the first line in the resting height; later lines grow the box.
                  paddingVertical: Math.max(spacing.xs, (height - borderWidth.thick * 2 - type.lineHeight) / 2),
                  textAlignVertical: 'top',
                }
              : { height: restingInputHeight },
            isWeb && WEB_INPUT_RESET,
            inputStyle,
          ]}
          {...inputProps}
        />
        {trailing ? (
          <View style={[styles.adornment, multiline && { height: height - borderWidth.thick * 2 }]}>{trailing}</View>
        ) : null}
      </Animated.View>
      {footnote || count ? (
        <View style={styles.footer}>
          <Text
            variant="bodySm"
            color={errorMessage ? 'dangerText' : 'textTertiary'}
            accessibilityLiveRegion={errorMessage ? 'polite' : undefined}
            style={styles.footnote}>
            {footnote ?? ''}
          </Text>
          {count ? (
            <Text variant="bodySm" color="textTertiary" tabular>
              {count}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const fieldTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: ['borderColor', 'backgroundColor'],
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { paddingHorizontal: spacing.xxs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: borderWidth.thick,
  },
  multilineField: { alignItems: 'flex-end' },
  adornment: { alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, padding: 0, margin: 0, includeFontPadding: false },
  footer: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xxs },
  footnote: { flex: 1 },
  disabled: { opacity: uiOpacity.disabled },
});
