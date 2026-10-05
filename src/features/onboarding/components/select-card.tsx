/**
 * Selectable answer card of the onboarding grids (interests, daily goal): white card with a
 * hairline that turns into a lime-tinted card with a 2 pt lime border when selected.
 * Colours glide with CSS transitions; the corner indicator pops (Radio).
 */
import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import { borderWidth, PressableScale, Radio } from '@/components/ui';
import { duration, elevation, radius, spacing, useTheme } from '@/theme';

export type SelectCardProps = {
  selected: boolean;
  onPress: () => void;
  /** Checkbox (multi-select) or radio semantics. */
  multiple?: boolean;
  accessibilityLabel: string;
  children: ReactNode;
  /** Hide the corner indicator (e.g. when the card shows its own). */
  indicator?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function SelectCard({
  selected,
  onPress,
  multiple = false,
  accessibilityLabel,
  children,
  indicator = true,
  style,
  contentStyle,
}: SelectCardProps) {
  const { colors } = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      scaleTo="large"
      haptic="selection"
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={accessibilityLabel}
      style={style}>
      <Animated.View
        style={[
          styles.card,
          cardTransition,
          {
            backgroundColor: selected ? colors.accentBg : colors.surface,
            borderColor: selected ? colors.accentSolid : colors.borderSubtle,
            boxShadow: selected ? elevation.none : elevation.sm,
          },
          contentStyle,
        ]}>
        {children}
        {indicator ? (
          <Radio selected={selected} size="sm" shape={multiple ? 'square' : 'circle'} style={styles.indicator} />
        ) : null}
      </Animated.View>
    </PressableScale>
  );
}

const cardTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: ['backgroundColor', 'borderColor'],
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: borderWidth.thick,
  },
  indicator: { position: 'absolute', top: spacing.sm, right: spacing.sm },
});
