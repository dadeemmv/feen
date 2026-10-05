/**
 * The 16Personalities-style agreement scale: seven circles from "D'accordo" (left, evergreen)
 * to "In disaccordo" (right, violet), largest at the extremes. The chosen circle fills and pops
 * a check; colours glide with CSS transitions.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { HStack, iconStroke, PressableScale, Text } from '@/components/ui';
import { AGREEMENT_SCALE, type AgreementValue } from '@/content/personality';
import { PopIn } from '@/features/rewards';
import { duration, radius, useTheme, type SemanticColors } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { mascotMetrics } from '../metrics';

export type LikertScaleProps = {
  value: AgreementValue | undefined;
  onChange: (value: AgreementValue) => void;
};

const diameterFor = (value: AgreementValue) => mascotMetrics.likertDiameters[3 - Math.abs(value)];

function sideColor(colors: SemanticColors, value: AgreementValue) {
  if (value > 0) return colors.brandSolid;
  if (value < 0) return colors.pro;
  return colors.borderStrong;
}

export function LikertScale({ value, onChange }: LikertScaleProps) {
  const { colors } = useTheme();
  const copy = MASCOT_COPY.quiz;

  return (
    <View style={styles.root}>
      <HStack justify="space-between" accessibilityRole="radiogroup" accessibilityLabel={copy.scaleLabel}>
        {AGREEMENT_SCALE.map((option) => {
          const selected = value === option.value;
          const size = diameterFor(option.value);
          const color = sideColor(colors, option.value);
          return (
            <PressableScale
              key={option.value}
              onPress={() => onChange(option.value)}
              scaleTo="small"
              haptic="selection"
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={option.label}
              style={styles.target}>
              <Animated.View
                style={[
                  styles.circle,
                  circleTransition,
                  {
                    width: size,
                    height: size,
                    borderColor: color,
                    backgroundColor: selected ? color : colors.surface,
                  },
                ]}>
                {selected ? (
                  <PopIn>
                    <Check size={Math.round(size * 0.5)} color={colors.onBrand} strokeWidth={iconStroke.heavy} />
                  </PopIn>
                ) : null}
              </Animated.View>
            </PressableScale>
          );
        })}
      </HStack>
      <HStack justify="space-between">
        <Text variant="labelMd" color="brandText">
          {copy.agree}
        </Text>
        <Text variant="labelMd" color="pro">
          {copy.disagree}
        </Text>
      </HStack>
    </View>
  );
}

const circleTransition: CSSTransitionProperties = {
  transitionProperty: ['backgroundColor'],
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const styles = StyleSheet.create({
  root: { gap: mascotMetrics.likertTarget / 4 },
  target: {
    width: mascotMetrics.likertTarget,
    height: mascotMetrics.likertDiameters[0] + mascotMetrics.likertBorder * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: radius.pill,
    borderWidth: mascotMetrics.likertBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
