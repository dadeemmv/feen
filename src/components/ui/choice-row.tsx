/**
 * ChoiceRow — a selectable card row with a trailing Radio: story polls ("Piccolo sondaggio"),
 * onboarding answers (goal, experience, interests), settings pickers. Selected rows warm up to
 * the accent tint; colours glide with Reanimated CSS transitions.
 * Graded lesson answers are NOT ChoiceRows: they need correct/wrong states (lesson OptionTile).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import { duration, radius, spacing, useTheme, type TextVariant } from '@/theme';

import type { IconSource } from './icon';
import { IconTile } from './icon-tile';
import { borderWidth, controlHeight, uiOpacity } from './metrics';
import { PressableScale } from './pressable-scale';
import { Radio, type RadioTone } from './radio';
import { Text } from './text';
import type { Tone } from './tones';

export type ChoiceRowProps = {
  label: string;
  /** Secondary line under the label. */
  description?: string;
  selected: boolean;
  onPress: () => void;
  /** Checkbox look + `checkbox` role (multi-select). Default `false`. */
  multiple?: boolean;
  /** Leading emoji (rendered in a tinted tile). */
  emoji?: string;
  /** Leading icon (rendered in a tinted tile). */
  icon?: IconSource;
  /** Tint of the leading tile. Default `neutral`. */
  iconTone?: Tone;
  /** Replaces the Radio (e.g. a price Chip). */
  trailing?: ReactNode;
  /** Default `accent`. */
  tone?: RadioTone;
  /** Label typography. Default `labelLg`. */
  labelVariant?: TextVariant;
  disabled?: boolean;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function ChoiceRow({
  label,
  description,
  selected,
  onPress,
  multiple = false,
  emoji,
  icon,
  iconTone = 'neutral',
  trailing,
  tone = 'accent',
  labelVariant = 'labelLg',
  disabled = false,
  accessibilityHint,
  testID,
  style,
}: ChoiceRowProps) {
  const theme = useTheme();
  const c = theme.colors;
  const selectedBorder = tone === 'accent' ? c.accentBorder : c.brandBorder;
  const selectedBg = tone === 'accent' ? c.accentBg : c.brandBg;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo="large"
      haptic="selection"
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={description ? `${label}, ${description}` : label}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={style}>
      <Animated.View
        style={[
          styles.row,
          rowTransition,
          {
            backgroundColor: selected ? selectedBg : c.surface,
            borderColor: selected ? selectedBorder : c.border,
          },
          disabled && styles.disabled,
        ]}>
        {emoji || icon ? <IconTile emoji={emoji} icon={icon} tone={iconTone} size="sm" /> : null}
        <View style={styles.texts}>
          <Text variant={labelVariant} color="text">
            {label}
          </Text>
          {description ? (
            <Text variant="bodySm" color="textSecondary">
              {description}
            </Text>
          ) : null}
        </View>
        {trailing ?? <Radio selected={selected} tone={tone} shape={multiple ? 'square' : 'circle'} />}
      </Animated.View>
    </PressableScale>
  );
}

const rowTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: ['backgroundColor', 'borderColor'],
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: controlHeight.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: borderWidth.regular,
  },
  texts: { flex: 1, gap: spacing.xxxs },
  disabled: { opacity: uiOpacity.disabled },
});
