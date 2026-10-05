/**
 * Interest pill for the "I tuoi interessi" grid: a 44 pt pill (touch target) with the topic
 * icon; selected turns evergreen with a check that pops in. Checkbox semantics.
 */
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { type CSSTransitionProperties, ZoomIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { borderWidth, Icon, iconSize, iconStroke, PressableScale, Text, useReduceMotion } from '@/components/ui';
import type { Interest } from '@/features/onboarding/data/interests';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { accountMetrics } from '../metrics';

export type InterestToggleProps = {
  interest: Interest;
  selected: boolean;
  onToggle: () => void;
};

export function InterestToggle({ interest, selected, onToggle }: InterestToggleProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <PressableScale
      onPress={onToggle}
      scaleTo="small"
      haptic="selection"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={interest.label}>
      <Animated.View
        style={[
          styles.pill,
          pillTransition,
          {
            backgroundColor: selected ? colors.brandSolid : colors.surface,
            borderColor: selected ? colors.brandSolid : colors.border,
          },
        ]}>
        <Icon
          icon={interest.icon}
          size={iconSize.sm}
          color={selected ? 'onBrand' : 'textSecondary'}
          strokeWidth={iconStroke.bold}
        />
        <Text variant="labelLg" color={selected ? 'onBrand' : 'text'} numberOfLines={1}>
          {interest.label}
        </Text>
        {selected ? (
          <Animated.View entering={reduceMotion ? undefined : ZoomIn.duration(duration.fast).easing(easing.enter)}>
            <Icon icon={Check} size={iconSize.sm} color="accentSolid" strokeWidth={iconStroke.heavy} />
          </Animated.View>
        ) : null}
      </Animated.View>
    </PressableScale>
  );
}

const pillTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: ['backgroundColor', 'borderColor'],
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: accountMetrics.toggleHeight,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: borderWidth.regular,
  },
});
