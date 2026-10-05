/**
 * RewardDialog — the reveal of a Home milestone reward ("Sblocca dopo n lezioni").
 *
 * - reached, not claimed → the reward jewel pops in with confetti, "Riscatta premio" commits
 *   `claimMilestone` and flips the dialog to its celebration state (second pop + confetti).
 * - locked → a preview of the reward with the lessons still missing and a CTA to the course.
 * - already claimed → a calm confirmation of what the reward does.
 *
 * Pass a SNAPSHOT of the milestone taken when opening, so the content stays stable while the
 * dialog animates out (the kit's Dialog rule).
 */
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Gift } from 'lucide-react-native';

import { Chip, Confetti, Dialog, ProgressBar, Text, VStack, dialogBadgeSize, iconSize, type Tone } from '@/components/ui';
import type { MilestoneReward } from '@/content/extra-types';
import { haptics } from '@/lib/haptics';
import { useStore, type ResolvedMilestone } from '@/store';
import { spacing } from '@/theme';

import { REWARD_COPY, rewardAmountLabel, rewardClaimedMessage } from './copy';
import { PopIn } from './pop-in';
import { RewardIcon, type RewardStatus } from './reward-icon';

export type RewardDialogProps = {
  /** Snapshot of the milestone taken when the dialog opened. */
  milestone: ResolvedMilestone | null;
  visible: boolean;
  onClose: () => void;
  /** After the exit animation (run navigation here, never under a closing Modal). */
  onClosed?: () => void;
  /** CTA of the locked preview (Home: open the course path). Defaults to closing. */
  onContinue?: () => void;
};

/** Jewel size inside the 88 pt dialog badge. */
const BADGE_ICON = Math.round(dialogBadgeSize * 0.6);
/** Confetti bursts from the badge on the card's top edge. */
const CONFETTI_ORIGIN = { x: 0.5, y: 0 };

const REWARD_TONE: Record<MilestoneReward['kind'], Tone> = { shield: 'shield', coins: 'coin', pro: 'pro' };

export function RewardDialog({ milestone, visible, onClose, onClosed, onContinue }: RewardDialogProps) {
  const claimMilestone = useStore((s) => s.claimMilestone);
  // `claimedNow` resets every time the dialog opens and survives the exit animation.
  const [session, setSession] = useState({ visible, claimedNow: false });
  if (session.visible !== visible) setSession({ visible, claimedNow: visible ? false : session.claimedNow });
  const claimedNow = session.claimedNow;

  if (!milestone) return null;

  const status: RewardStatus = milestone.claimed || claimedNow ? 'claimed' : milestone.reached ? 'claimable' : 'locked';
  const reward = milestone.reward;
  const amountChip = (
    <Chip
      label={rewardAmountLabel(reward)}
      icon={<RewardIcon kind={reward.kind} size={iconSize.sm} />}
      tone={REWARD_TONE[reward.kind]}
      size="sm"
      style={styles.chip}
    />
  );

  const claim = () => {
    const result = claimMilestone(milestone.id);
    if (result.ok) {
      haptics.success();
      setSession({ visible, claimedNow: true });
    } else {
      haptics.error();
      onClose();
    }
  };

  const badge = (
    <PopIn key={status}>
      <RewardIcon kind={reward.kind} size={BADGE_ICON} status={status} />
    </PopIn>
  );

  if (status === 'locked') {
    const remaining = Math.max(0, milestone.threshold - milestone.current);
    return (
      <Dialog
        visible={visible}
        onClose={onClose}
        onClosed={onClosed}
        tone="neutral"
        icon={badge}
        title={milestone.title}
        message={REWARD_COPY.lockedMessage(remaining)}
        primaryAction={{ label: REWARD_COPY.lockedCta, onPress: onContinue ?? onClose }}>
        <VStack gap="xs" style={styles.progress}>
          <ProgressBar
            value={milestone.progress}
            size="sm"
            tone="accent"
            accessibilityLabel={REWARD_COPY.progressLabel(milestone.current, milestone.threshold)}
          />
          <Text variant="labelSm" color="textTertiary" align="center" tabular>
            {REWARD_COPY.progressLabel(milestone.current, milestone.threshold)}
          </Text>
        </VStack>
      </Dialog>
    );
  }

  if (status === 'claimable') {
    return (
      <Dialog
        visible={visible}
        onClose={onClose}
        onClosed={onClosed}
        tone="success"
        icon={badge}
        title={REWARD_COPY.claimableTitle}
        message={milestone.description}
        primaryAction={{ label: REWARD_COPY.claimCta, onPress: claim, iconLeft: Gift }}>
        {amountChip}
        <Confetti key="reveal" run={visible} origin={CONFETTI_ORIGIN} />
      </Dialog>
    );
  }

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      onClosed={onClosed}
      tone="success"
      // Opening an already-claimed card is informational: no celebration haptic.
      haptic={false}
      icon={badge}
      title={claimedNow ? REWARD_COPY.claimedTitle : milestone.title}
      message={rewardClaimedMessage(reward)}
      primaryAction={{ label: claimedNow ? REWARD_COPY.claimedCta : REWARD_COPY.alreadyClaimedCta, onPress: onClose }}>
      {amountChip}
      <Confetti key="claimed" run={claimedNow} origin={CONFETTI_ORIGIN} />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'center' },
  progress: { marginTop: spacing.xs },
});
