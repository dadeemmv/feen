/**
 * Referral promo on Account: "30 giorni di Finanz Pro" brand card with the wax-sealed envelopes,
 * the invited-friends progress and the "Condividilo ad un amico" CTA (→ Invite a friend).
 */
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';

import { ReferralEnvelopes, REFERRAL_ENVELOPES_SIZE } from '@/components/illustrations';
import { Button, Card, Chip, Text, VStack } from '@/components/ui';
import { REFERRAL_PROMO } from '@/content/shop';
import { useStore } from '@/store';
import { layout, spacing } from '@/theme';

import { ACCOUNT_COPY } from '../copy';
import { useContentWidth } from '../lib/use-content-width';

export function ReferralCard() {
  const invited = useStore((s) => s.invitedFriends);
  const artWidth = Math.min(REFERRAL_ENVELOPES_SIZE[0], useContentWidth(layout.cardPadding));
  const total = REFERRAL_PROMO.friendsRequired;

  return (
    <Card variant="brand" spotlight padding="lg" contentStyle={styles.content}>
      <VStack gap="xxs" align="center">
        <Text variant="displaySm" align="center" accessibilityRole="header">
          {REFERRAL_PROMO.title}
        </Text>
        <Text variant="bodyMd" color="textSecondary" align="center">
          {REFERRAL_PROMO.subtitle}
        </Text>
      </VStack>
      <ReferralEnvelopes width={artWidth} />
      <Chip
        icon={Users}
        size="sm"
        label={ACCOUNT_COPY.referral.friendsProgress(Math.min(invited, total), total)}
        style={styles.chip}
      />
      <Button title={REFERRAL_PROMO.cta} glow fullWidth onPress={() => router.push('/invite')} />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.md },
  chip: { alignSelf: 'center' },
});
