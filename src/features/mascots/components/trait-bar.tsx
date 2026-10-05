/**
 * One personality axis as a split bar: "Presente 28%" on the left, "Futuro 72%" on the right,
 * the winning side in lime and bold, the other one muted (16Personalities result rows).
 */
import { StyleSheet, View } from 'react-native';

import { HStack, Text } from '@/components/ui';
import { radius, spacing, useTheme } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { mascotMetrics } from '../metrics';

export type TraitBarProps = {
  left: string;
  right: string;
  /** 0…100 lean towards the right pole. */
  value: number;
};

export function TraitBar({ left, right, value }: TraitBarProps) {
  const { colors } = useTheme();
  const rightValue = Math.min(100, Math.max(0, Math.round(value)));
  const leftValue = 100 - rightValue;
  const rightWins = rightValue >= leftValue;

  return (
    <View
      style={styles.root}
      accessible
      accessibilityLabel={MASCOT_COPY.reveal.traitA11y(left, leftValue, right, rightValue)}>
      <HStack justify="space-between">
        <Text variant={rightWins ? 'labelMd' : 'labelLg'} color={rightWins ? 'textTertiary' : 'accentText'} tabular>
          {`${left} ${leftValue}%`}
        </Text>
        <Text variant={rightWins ? 'labelLg' : 'labelMd'} color={rightWins ? 'accentText' : 'textTertiary'} tabular>
          {`${rightValue}% ${right}`}
        </Text>
      </HStack>
      <View style={[styles.track, { backgroundColor: colors.fill }]}>
        <View
          style={[
            styles.segment,
            {
              width: `${rightWins ? rightValue : leftValue}%`,
              backgroundColor: colors.accentSolid,
              alignSelf: rightWins ? 'flex-end' : 'flex-start',
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  track: { height: mascotMetrics.traitBar, borderRadius: radius.pill, overflow: 'hidden' },
  segment: { height: '100%', borderRadius: radius.pill },
});
