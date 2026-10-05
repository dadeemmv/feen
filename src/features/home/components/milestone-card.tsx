/**
 * One Home milestone ("Sblocca dopo n lezioni", spec §3.3 / redlines "Home" §5).
 *
 * - locked   → white card, muted reward jewel with a padlock, label, progress row "0/2".
 * - reached  → accent card, full-colour jewel, "Riscatta" pill, gentle pulse (claim → reveal).
 * - claimed  → white card, jewel with a check badge, "Riscattato".
 *
 * The whole card is a button: it always opens the reward dialog (preview, claim or recap).
 */
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Card, Chip, HStack, ProgressBar, Text, resolveTone, useReduceMotion, type Tone } from '@/components/ui';
import { milestoneLockedLabel } from '@/content/shop';
import type { MilestoneReward } from '@/content/extra-types';
import { formatFraction } from '@/lib/format';
import { RewardIcon, type RewardStatus } from '@/features/rewards';
import type { ResolvedMilestone } from '@/store';
import { easing, radius, spacing, useTheme } from '@/theme';

import { HOME_COPY } from '../copy';
import { homeMetrics } from '../metrics';

export type MilestoneCardProps = {
  milestone: ResolvedMilestone;
  onPress: (milestone: ResolvedMilestone) => void;
};

const REWARD_TONE: Record<MilestoneReward['kind'], Tone> = { shield: 'shield', coins: 'coin', pro: 'pro' };

export function MilestoneCard({ milestone, onPress }: MilestoneCardProps) {
  const theme = useTheme();
  const status: RewardStatus = milestone.claimed ? 'claimed' : milestone.reached ? 'claimable' : 'locked';
  const claimable = status === 'claimable';
  const disc = status === 'locked' ? theme.colors.fill : resolveTone(theme, REWARD_TONE[milestone.reward.kind]).bg;
  const label = milestoneLockedLabel(milestone.threshold);

  return (
    <PulseWhen active={claimable} style={styles.slot}>
      <Card
        variant={claimable ? 'accent' : 'surface'}
        padding="sm"
        radius="lg"
        onPress={() => onPress(milestone)}
        haptic={claimable ? 'medium' : 'selection'}
        accessibilityLabel={HOME_COPY.milestones.a11y({
          title: milestone.title,
          label,
          current: milestone.current,
          threshold: milestone.threshold,
          reached: milestone.reached,
          claimed: milestone.claimed,
        })}
        accessibilityHint={HOME_COPY.milestones.hint}
        style={styles.card}
        contentStyle={styles.content}>
        <View style={[styles.disc, { backgroundColor: disc }]}>
          <RewardIcon kind={milestone.reward.kind} size={homeMetrics.milestoneIcon} status={status} />
        </View>

        <View style={styles.label}>
          <Text
            variant="labelSm"
            align="center"
            color={status === 'locked' ? 'textSecondary' : 'text'}
            numberOfLines={2}>
            {status === 'locked' ? label : milestone.title}
          </Text>
        </View>

        <View style={styles.footer}>
          {status === 'locked' ? (
            <HStack gap="xxs">
              <ProgressBar value={milestone.progress} size="sm" tone="brand" highlight={false} style={styles.bar} />
              <Text variant="labelSm" color="textTertiary" tabular>
                {formatFraction(milestone.current, milestone.threshold)}
              </Text>
            </HStack>
          ) : claimable ? (
            <Chip label={HOME_COPY.milestones.claim} tone="accent" variant="solid" size="sm" style={styles.pill} />
          ) : (
            <Chip label={HOME_COPY.milestones.claimed} tone="success" size="sm" style={styles.pill} />
          )}
        </View>
      </Card>
    </PulseWhen>
  );
}

/** Gentle breathing scale while `active` (reached, unclaimed). Static under reduced motion. */
function PulseWhen({ active, style, children }: { active: boolean; style: StyleProp<ViewStyle>; children: ReactNode }) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!active || reduceMotion) {
      cancelAnimation(scale);
      scale.set(withTiming(1, { duration: homeMetrics.milestonePulseHalf / 2 }));
      return;
    }
    const half = homeMetrics.milestonePulseHalf;
    scale.set(
      withRepeat(
        withSequence(
          withTiming(homeMetrics.milestonePulseScale, { duration: half, easing: easing.inOut }),
          withTiming(1, { duration: half, easing: easing.inOut }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(scale);
  }, [active, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  slot: { flex: 1, minWidth: 0 },
  card: { flex: 1 },
  content: { alignItems: 'center', gap: spacing.xs },
  disc: {
    width: homeMetrics.milestoneDisc,
    height: homeMetrics.milestoneDisc,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { minHeight: homeMetrics.milestoneLabelHeight, justifyContent: 'center', alignSelf: 'stretch' },
  footer: { height: homeMetrics.milestoneFooterHeight, justifyContent: 'center', alignSelf: 'stretch' },
  bar: { flex: 1 },
  pill: { alignSelf: 'center' },
});
