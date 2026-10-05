/**
 * ReferralSheet — "30 giorni di Finanz Pro" promo (spec §3.1). Home opens it on launch (local
 * state); it is also the `referral` global overlay, so any screen can `openSheet('referral')`.
 *
 * Brand card with the wax-sealed envelopes and the invited-friends tracker, lime CTA
 * "Condividilo ad un amico" → closes, then pushes /invite once the sheet has animated out.
 * Swipe down, the scrim or "Più tardi" dismiss it.
 */
import { useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

import { REFERRAL_ENVELOPES_SIZE, ReferralEnvelopes } from '@/components/illustrations';
import { Button, Card, Sheet, Text, VStack, avatarSize } from '@/components/ui';
import { REFERRAL_PROMO } from '@/content/shop';
import { useStore } from '@/store';
import { layout, spacing } from '@/theme';

import { FriendSlots } from './components/friend-slots';
import { INVITE_COPY } from './copy';

export type ReferralSheetProps = { visible: boolean; onClose: () => void };

export function ReferralSheet({ visible, onClose }: ReferralSheetProps) {
  // Navigation waits for the sheet to finish closing (never push under a closing Modal).
  const afterClose = useRef<(() => void) | null>(null);
  const openInvite = () => {
    afterClose.current = () => router.push('/invite');
    onClose();
  };
  const handleClosed = () => {
    const action = afterClose.current;
    afterClose.current = null;
    action?.();
  };

  return (
    <Sheet visible={visible} onClose={onClose} onClosed={handleClosed} accessibilityLabel={INVITE_COPY.sheet.a11y}>
      <ReferralPromoContent onShare={openInvite} onLater={onClose} />
    </Sheet>
  );
}

function ReferralPromoContent({ onShare, onLater }: { onShare: () => void; onLater: () => void }) {
  const invited = useStore((s) => Math.min(s.invitedFriends, REFERRAL_PROMO.friendsRequired));
  const { width } = useWindowDimensions();
  // Sheet gutter + card padding on both sides.
  const artWidth = Math.min(
    REFERRAL_ENVELOPES_SIZE[0],
    Math.min(width, layout.maxContentWidth) - (layout.screenX + layout.cardPadding) * 2,
  );

  return (
    <VStack gap="md">
      <Card variant="brand" spotlight padding="lg" contentStyle={styles.card}>
        <VStack gap="xxs" align="center">
          <Text variant="displaySm" align="center" accessibilityRole="header">
            {REFERRAL_PROMO.title}
          </Text>
          <Text variant="bodyMd" color="textSecondary" align="center">
            {REFERRAL_PROMO.subtitle}
          </Text>
        </VStack>
        <ReferralEnvelopes width={artWidth} />
        <VStack gap="xs" align="center">
          <FriendSlots invited={invited} total={REFERRAL_PROMO.friendsRequired} size={avatarSize.sm} />
          <Text variant="labelSm" color="textSecondary" tabular>
            {INVITE_COPY.progressLabel(invited, REFERRAL_PROMO.friendsRequired)}
          </Text>
        </VStack>
      </Card>
      <VStack gap="xxs">
        <Button title={REFERRAL_PROMO.cta} iconRight={ArrowRight} fullWidth onPress={onShare} />
        <Button title={INVITE_COPY.sheet.later} variant="ghost" size="md" fullWidth onPress={onLater} />
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.md },
});
