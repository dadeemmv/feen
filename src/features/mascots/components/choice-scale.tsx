/**
 * The scale between two equally good answers (concept board, screen 1): seven circles in the
 * rhythm of the 16Personalities test, largest at the extremes, with the two answers written
 * under the ends. The chosen circle fills with ink and pops a check.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { HStack, iconStroke, PressableScale, Text } from '@/components/ui';
import { CHOICE_SCALE, choiceLabel, type ChoiceValue } from '@/content/personality';
import { PopIn } from '@/features/rewards';
import { duration, radius, useTheme } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { mascotMetrics } from '../metrics';

export type ChoiceScaleProps = {
  /** Answer under the left end. */
  left: string;
  /** Answer under the right end. */
  right: string;
  value: ChoiceValue | undefined;
  onChange: (value: ChoiceValue) => void;
};

const diameterFor = (value: ChoiceValue) => mascotMetrics.likertDiameters[3 - Math.abs(value)];

export function ChoiceScale({ left, right, value, onChange }: ChoiceScaleProps) {
  const { colors } = useTheme();
  const copy = MASCOT_COPY.quiz;

  return (
    <View style={styles.root}>
      <HStack justify="space-between" accessibilityRole="radiogroup" accessibilityLabel={copy.scaleLabel}>
        {CHOICE_SCALE.map((option) => {
          const selected = value === option;
          const size = diameterFor(option);
          const color = option === 0 ? colors.borderStrong : colors.accentSolid;
          return (
            <PressableScale
              key={option}
              onPress={() => onChange(option)}
              scaleTo="small"
              haptic="selection"
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={choiceLabel(option, left, right)}
              style={styles.target}>
              <Animated.View
                style={[
                  styles.circle,
                  circleTransition,
                  {
                    width: size,
                    height: size,
                    borderColor: color,
                    backgroundColor: selected ? colors.accentSolid : colors.background,
                  },
                ]}>
                {selected ? (
                  <PopIn>
                    <Check size={Math.round(size * 0.5)} color={colors.onAccent} strokeWidth={iconStroke.heavy} />
                  </PopIn>
                ) : null}
              </Animated.View>
            </PressableScale>
          );
        })}
      </HStack>
      <HStack justify="space-between" align="flex-start" gap="lg">
        <Text variant="titleSm" style={styles.answer}>
          {left}
        </Text>
        <Text variant="titleSm" align="right" style={styles.answer}>
          {right}
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
  root: { gap: mascotMetrics.likertTarget / 3 },
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
  answer: { flex: 1 },
});
