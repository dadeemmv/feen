/**
 * DailyRewardDialog — the celebration after claiming "Ricompensa giornaliera": the kiwi coin pops
 * in on the badge, confetti bursts from it, "+100" counts up and the new balance rolls in.
 * The coins are already credited when it opens (the status-header chip bumps behind the scrim).
 */
import { StyleSheet, View } from 'react-native';

import { KiwiCoinIcon } from '@/components/icons';
import { Confetti, CountUp, Dialog, HStack, RollingNumber, Text, VStack, iconSize } from '@/components/ui';
import { formatCoins, formatSignedCoins } from '@/lib/format';
import { useStore } from '@/store';
import { duration, spacing } from '@/theme';

import { SHOP_COPY } from '../copy';
import { shopMetrics } from '../metrics';

export type DailyRewardDialogProps = {
  visible: boolean;
  /** Coins granted (snapshot taken when claiming). */
  amount: number;
  onClose: () => void;
};

/** Confetti bursts from behind the amount (the card clips it, so it starts inside). */
const CONFETTI_ORIGIN = { x: 0.5, y: 0.45 };

export function DailyRewardDialog({ visible, amount, onClose }: DailyRewardDialogProps) {
  const coins = useStore((s) => s.coins);

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      tone="neutral"
      haptic={false}
      icon={<KiwiCoinIcon size={shopMetrics.rewardBadgeIcon} />}
      title={SHOP_COPY.rewardTitle}
      message={<RewardBody amount={amount} coins={coins} />}
      primaryAction={{ label: SHOP_COPY.rewardCta, onPress: onClose }}>
      <View style={styles.confetti}>
        <Confetti run={visible} origin={CONFETTI_ORIGIN} />
      </View>
    </Dialog>
  );
}

function RewardBody({ amount, coins }: { amount: number; coins: number }) {
  return (
    <VStack gap="xs" align="center" style={styles.body}>
        <View accessible accessibilityLabel={`${formatSignedCoins(amount)} ${SHOP_COPY.kiwi}`}>
          <CountUp
            value={amount}
            delay={duration.base}
            format={formatSignedCoins}
            variant="displayLg"
            color="coin"
            align="center"
          />
        </View>
        <HStack gap="xxs" accessible accessibilityLabel={SHOP_COPY.rewardBalance(coins)}>
          <Text variant="labelMd" color="textSecondary">
            {SHOP_COPY.balanceRow}
          </Text>
          <RollingNumber value={coins} format={formatCoins} variant="labelMd" />
          <KiwiCoinIcon size={iconSize.sm} />
        </HStack>
        <Text variant="bodyMd" color="textSecondary" align="center">
          {SHOP_COPY.rewardMessage(amount)}
        </Text>
    </VStack>
  );
}

const styles = StyleSheet.create({
  body: { marginBottom: spacing.xs },
  confetti: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
});
