/**
 * Referral progress: "0/3 amici invitati" with one slot per friend, and the reward they unlock
 * ("30 giorni di Finanz Pro"). Honest by design: it only reflects `profile.invitedFriends`.
 */
import { StyleSheet, View } from 'react-native';

import { GemIcon, LockIcon } from '@/components/icons';
import { Card, Chip, HStack, Text, VStack, iconSize, tileSize } from '@/components/ui';
import { REFERRAL_PROMO } from '@/content/shop';
import { formatFraction } from '@/lib/format';
import { radius, spacing, useTheme } from '@/theme';

import { INVITE_COPY } from '../copy';
import { FriendSlots } from './friend-slots';

export type InviteProgressCardProps = { invited: number };

export function InviteProgressCard({ invited }: InviteProgressCardProps) {
  const theme = useTheme();
  const total = REFERRAL_PROMO.friendsRequired;
  const count = Math.min(invited, total);
  const done = count >= total;

  return (
    <Card padding="lg" contentStyle={styles.content}>
      <HStack justify="space-between">
        <Text variant="titleMd" accessibilityRole="header">
          {INVITE_COPY.progressTitle}
        </Text>
        <Chip
          label={formatFraction(count, total)}
          size="sm"
          tone={done ? 'success' : 'neutral'}
          accessibilityLabel={INVITE_COPY.progressLabel(count, total)}
        />
      </HStack>

      <FriendSlots invited={count} total={total} />
      <Text variant="bodySm" color="textSecondary" align="center">
        {INVITE_COPY.progressHint(total - count)}
      </Text>

      <View style={[styles.reward, { backgroundColor: theme.colors.proBg }]}>
        <GemIcon size={tileSize.sm} muted={!done} />
        <VStack flex gap="xxxs">
          <Text variant="titleSm" numberOfLines={1}>
            {INVITE_COPY.rewardLabel}
          </Text>
          <Text variant="bodySm" color="textSecondary" numberOfLines={1}>
            {INVITE_COPY.rewardCaption}
          </Text>
        </VStack>
        {done ? null : <LockIcon size={iconSize.lg} />}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
});
