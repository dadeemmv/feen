/**
 * The two axes of the test as a 2 × 2 grid: Oggi | Domani across, Audacia on top and Prudenza
 * below. Each quadrant is tinted with its animal's colour, with the bust and the title; the
 * user's quadrant is at full strength, the others recede. The user's position is an ink dot
 * that pops in.
 */
import { StyleSheet, View } from 'react-native';

import { MascotArt } from '@/components/illustrations';
import { borderWidth, HStack, Text } from '@/components/ui';
import { AXIS_POLES, MASCOT_IDS, MASCOTS, type MascotId } from '@/content/personality';
import { PopIn } from '@/features/rewards';
import { characterColors, duration, galleryColors, radius, spacing } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { mascotMetrics } from '../metrics';

export type AxesGridProps = {
  /** 0…100 towards Domani. */
  future: number;
  /** 0…100 towards Audacia. */
  risk: number;
  mascot: MascotId;
};

const clamp = (value: number) => Math.min(94, Math.max(6, value));

export function AxesGrid({ future, risk, mascot }: AxesGridProps) {
  const copy = MASCOT_COPY.grid;
  const { horizon, risk: riskPoles } = AXIS_POLES;

  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="image"
      accessibilityLabel={copy.a11y(MASCOTS[mascot].quadrant, future, risk)}>
      <Text variant="labelMd" color="textSecondary" align="center">
        {riskPoles.positive}
      </Text>

      <View style={styles.square}>
        {MASCOT_IDS.map((id, index) => {
          const tones = characterColors[id];
          const mine = id === mascot;
          const top = index < 2;
          const left = index % 2 === 0;
          return (
            <View
              key={id}
              style={[
                styles.quadrant,
                {
                  backgroundColor: tones.tint,
                  opacity: mine ? 1 : mascotMetrics.compassDimmed,
                  alignItems: left ? 'flex-start' : 'flex-end',
                  justifyContent: top ? 'flex-start' : 'flex-end',
                },
              ]}>
              <View style={[styles.badge, { alignItems: left ? 'flex-start' : 'flex-end' }]}>
                <MascotArt id={id} framing="bust" width={mascotMetrics.compassBust} />
                <Text variant="labelSm" style={{ color: tones.deep }} numberOfLines={1}>
                  {MASCOTS[id].title}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.axisH} pointerEvents="none" />
        <View style={styles.axisV} pointerEvents="none" />

        <View pointerEvents="none" style={[styles.dotSlot, { left: `${clamp(future)}%`, top: `${clamp(100 - risk)}%` }]}>
          <PopIn delay={duration.slow}>
            <View style={styles.dot} />
          </PopIn>
        </View>
      </View>

      <Text variant="labelMd" color="textSecondary" align="center">
        {riskPoles.negative}
      </Text>

      <HStack justify="space-between">
        <Text variant="labelMd">{`← ${horizon.negative}`}</Text>
        <Text variant="labelMd">{`${horizon.positive} →`}</Text>
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  // White under the quadrants: the dimmed ones fade towards white, not into the indigo card.
  square: {
    width: '100%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: galleryColors.paper,
  },
  quadrant: { width: '50%', height: '50%', padding: spacing.sm },
  badge: { gap: spacing.xxs },
  axisH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: borderWidth.thick,
    marginTop: -borderWidth.thick / 2,
    backgroundColor: galleryColors.paper,
  },
  axisV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: borderWidth.thick,
    marginLeft: -borderWidth.thick / 2,
    backgroundColor: galleryColors.paper,
  },
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
    borderColor: galleryColors.paper,
    backgroundColor: galleryColors.ink,
  },
});
