/**
 * Marathon challenge cards ("Sfide Maratona", spec §3.5):
 * - ChallengeCard: emoji tile, title, "+ 500" kiwi reward pill and the "x/7" pill progress.
 *   Reached → "Riscatta" (coins once, the reward pill bumps); claimed → success state.
 * - LockedChallengeCard: "🔒 Raggiungi 14 giorni di fila per sbloccare una nuova sfida".
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { CheckBadgeIcon, KiwiCoinIcon, LockIcon } from '@/components/icons';
import {
  Button,
  Card,
  Chip,
  EmojiTile,
  HStack,
  ProgressBar,
  Text,
  VStack,
  borderWidth,
  iconSize,
  useBump,
} from '@/components/ui';
import { formatCoins } from '@/lib/format';
import type { ResolvedChallenge } from '@/store';
import { duration, radius, spacing, useTheme } from '@/theme';

import { STREAK_COPY } from '../copy';
import { streakMetrics } from '../metrics';

export type ChallengeCardProps = {
  challenge: ResolvedChallenge;
  onClaim: (challenge: ResolvedChallenge) => boolean;
};

export function ChallengeCard({ challenge, onClaim }: ChallengeCardProps) {
  const { style: bumpStyle, bump } = useBump();
  const reward = formatCoins(challenge.reward);
  const claimable = challenge.reached && !challenge.claimed;

  const claim = () => {
    if (onClaim(challenge)) bump();
  };

  return (
    <Card variant={claimable ? 'accent' : 'surface'} padding="lg" contentStyle={styles.content}>
      <HStack gap="md">
        <EmojiTile emoji={challenge.emoji} tone="butter" size="lg" round />
        <VStack flex gap="xs">
          <Text variant="titleSm">{challenge.title}</Text>
          <HStack gap="xs">
            <Animated.View style={bumpStyle}>
              <Chip
                size="sm"
                variant="surface"
                label={STREAK_COPY.reward(reward)}
                textVariant="numeric"
                iconRight={<KiwiCoinIcon size={iconSize.sm} />}
                accessibilityLabel={STREAK_COPY.rewardA11y(reward)}
              />
            </Animated.View>
            {challenge.claimed ? <Chip size="sm" tone="success" icon={Check} label={STREAK_COPY.claimed} /> : null}
          </HStack>
        </VStack>
        {challenge.claimed ? (
          <Animated.View entering={FadeIn.duration(duration.base)} aria-hidden>
            <CheckBadgeIcon size={iconSize.xl} />
          </Animated.View>
        ) : null}
      </HStack>

      {claimable ? (
        <Button title={STREAK_COPY.claim} fullWidth shimmer onPress={claim} haptic={false} />
      ) : (
        <VStack gap="xs">
          <PillProgress current={challenge.current} total={challenge.days} />
          {challenge.claimed ? null : (
            <Text variant="bodySm" color="textTertiary" align="center">
              {STREAK_COPY.daysLeft(challenge.days - challenge.current)}
            </Text>
          )}
        </VStack>
      )}
    </Card>
  );
}

/** The video's "0/7" pill: lime track with the count centred on it. */
function PillProgress({ current, total }: { current: number; total: number }) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={STREAK_COPY.progressA11y(current, total)}
      accessibilityValue={{ min: 0, max: total, now: current }}
      style={[styles.pill, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
      <ProgressBar
        value={total === 0 ? 0 : current / total}
        tone="accent"
        size="lg"
        highlight={false}
        style={styles.pillFill}
      />
      <Text variant="labelMd" color="onAccent" tabular style={styles.pillLabel}>
        {STREAK_COPY.progress(current, total)}
      </Text>
    </View>
  );
}

export function LockedChallengeCard({ label }: { label: string }) {
  return (
    <Card variant="locked" padding="lg" accessibilityLabel={STREAK_COPY.lockedA11y(label)}>
      <HStack gap="md">
        <LockIcon size={iconSize.xl} />
        <Text variant="bodyMd" color="textSecondary" style={styles.flex}>
          {label}
        </Text>
      </HStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  flex: { flex: 1 },
  pill: {
    height: streakMetrics.challengePillHeight,
    borderRadius: radius.pill,
    borderWidth: borderWidth.regular,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pillFill: { ...StyleSheet.absoluteFill, height: '100%', borderRadius: radius.pill, backgroundColor: 'transparent' },
  pillLabel: { textAlign: 'center' },
});
