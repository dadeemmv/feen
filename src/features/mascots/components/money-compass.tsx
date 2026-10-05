/**
 * The money compass (political-compass style): four tinted quadrants — Risk Left, Risk Right,
 * Unrisk Left, Unrisk Right — each with its character's bust and title, the axis cross, the pole
 * labels around the square and the user's position as a lime dot that pops in. The user's quadrant
 * is at full strength, the others recede.
 */
import { StyleSheet, View } from 'react-native';

import { MascotArt } from '@/components/illustrations';
import { borderWidth, HStack, Text } from '@/components/ui';
import { AXIS_POLES, MASCOT_IDS, MASCOTS, type MascotId } from '@/content/personality';
import { PopIn } from '@/features/rewards';
import { duration, elevation, lightTheme, radius, spacing, useTheme, type ColorToken, type SemanticColors } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { mascotMetrics } from '../metrics';

export type MoneyCompassProps = {
  /** 0…100 towards Right. */
  right: number;
  /** 0…100 towards Risk. */
  risk: number;
  mascot: MascotId;
};

const QUADRANT_TINT: Record<MascotId, { bg: keyof SemanticColors; fg: ColorToken }> = {
  visionary: { bg: 'tintLilac', fg: 'tintLilacText' },
  shark: { bg: 'tintBlush', fg: 'tintBlushText' },
  giver: { bg: 'tintMint', fg: 'tintMintText' },
  value: { bg: 'tintSky', fg: 'tintSkyText' },
};

const clamp = (value: number) => Math.min(96, Math.max(4, value));

export function MoneyCompass({ right, risk, mascot }: MoneyCompassProps) {
  const { colors } = useTheme();
  // The square is always drawn on paper, so the receding quadrants fade to pastel on any surface.
  const paper = lightTheme.colors;
  const copy = MASCOT_COPY.compass;
  const goal = AXIS_POLES.goal;
  const riskPoles = AXIS_POLES.risk;

  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="image"
      accessibilityLabel={copy.a11y(MASCOTS[mascot].quadrant, right, risk)}>
      <Text variant="overline" color="textSecondary" align="center">
        {riskPoles.positive}
      </Text>

      <View style={[styles.square, { borderColor: colors.borderSubtle, backgroundColor: paper.surface }]}>
        {MASCOT_IDS.map((id, index) => {
          const tint = QUADRANT_TINT[id];
          const mine = id === mascot;
          const top = index < 2;
          const left = index % 2 === 0;
          return (
            <View
              key={id}
              style={[
                styles.quadrant,
                {
                  backgroundColor: paper[tint.bg],
                  opacity: mine ? 1 : mascotMetrics.compassDimmed,
                  alignItems: left ? 'flex-start' : 'flex-end',
                  justifyContent: top ? 'flex-start' : 'flex-end',
                },
              ]}>
              <View style={[styles.badge, { alignItems: left ? 'flex-start' : 'flex-end' }]}>
                <MascotArt id={id} framing="bust" width={mascotMetrics.compassBust} />
                <Text variant="labelSm" color={tint.fg} numberOfLines={1}>
                  {MASCOTS[id].title}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={[styles.axisH, { backgroundColor: paper.text }]} pointerEvents="none" />
        <View style={[styles.axisV, { backgroundColor: paper.text }]} pointerEvents="none" />

        <View
          pointerEvents="none"
          style={[styles.dotSlot, { left: `${clamp(right)}%`, top: `${clamp(100 - risk)}%` }]}>
          <PopIn delay={duration.slow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: paper.accentSolid, borderColor: paper.brandSolid, boxShadow: elevation.md },
              ]}
            />
          </PopIn>
        </View>
      </View>

      <Text variant="overline" color="textSecondary" align="center">
        {riskPoles.negative}
      </Text>

      <HStack justify="space-between" align="flex-start">
        <View>
          <Text variant="labelMd">{`← ${goal.negative}`}</Text>
          <Text variant="bodySm" color="textTertiary">
            {goal.negativeHint}
          </Text>
        </View>
        <View style={styles.alignEnd}>
          <Text variant="labelMd">{`${goal.positive} →`}</Text>
          <Text variant="bodySm" color="textTertiary">
            {goal.positiveHint}
          </Text>
        </View>
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  square: {
    width: '100%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radius.lg,
    borderWidth: borderWidth.thin,
    overflow: 'hidden',
  },
  quadrant: { width: '50%', height: '50%', padding: spacing.xs },
  badge: { gap: spacing.xxxs },
  axisH: { position: 'absolute', left: 0, right: 0, top: '50%', height: borderWidth.thick, marginTop: -borderWidth.thick / 2, opacity: mascotMetrics.compassAxisOpacity },
  axisV: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: borderWidth.thick, marginLeft: -borderWidth.thick / 2, opacity: mascotMetrics.compassAxisOpacity },
  dotSlot: {
    position: 'absolute',
    width: mascotMetrics.compassDot,
    height: mascotMetrics.compassDot,
    marginLeft: -mascotMetrics.compassDot / 2,
    marginTop: -mascotMetrics.compassDot / 2,
  },
  dot: {
    width: mascotMetrics.compassDot,
    height: mascotMetrics.compassDot,
    borderRadius: radius.pill,
    borderWidth: borderWidth.ring,
  },
  alignEnd: { alignItems: 'flex-end' },
});
