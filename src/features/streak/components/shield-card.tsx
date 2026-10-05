/**
 * ShieldCard — "Scudo salva-streak" (spec §3.5): the shield pair, the reference copy, how many
 * shields the user owns (or that one is saving the streak right now), a "Come funzionano" link
 * to the info sheet and the "Acquista scudi" CTA to the Shop tab.
 */
import { StyleSheet, View } from 'react-native';
import { Info } from 'lucide-react-native';

import { ShieldIcon } from '@/components/icons';
import { ShieldPair } from '@/components/illustrations';
import { Button, Card, Chip, HStack, Text, VStack, iconSize } from '@/components/ui';
import { spacing } from '@/theme';

import { STREAK_COPY } from '../copy';
import { streakMetrics } from '../metrics';

export type ShieldCardProps = {
  shields: number;
  /** An owned shield is bridging yesterday (consumed on the next sync). */
  saving: boolean;
  onBuy: () => void;
  onInfo: () => void;
};

export function ShieldCard({ shields, saving, onBuy, onInfo }: ShieldCardProps) {
  return (
    <Card padding="lg" contentStyle={styles.content}>
      <HStack gap="md" align="flex-start">
        <View style={styles.art} aria-hidden>
          <ShieldPair width={streakMetrics.shieldArtWidth} />
        </View>
        <VStack flex gap="xxs">
          <Text variant="titleMd" accessibilityRole="header">
            {STREAK_COPY.shieldTitle}
          </Text>
          <Text variant="bodyMd" color="textSecondary">
            {STREAK_COPY.shieldBody}
          </Text>
        </VStack>
      </HStack>

      <HStack gap="xs" justify="space-between" wrap>
        <Chip
          size="sm"
          tone="shield"
          icon={<ShieldIcon size={iconSize.sm} muted={shields === 0} />}
          label={saving ? STREAK_COPY.shieldSaving : STREAK_COPY.shieldOwned(shields)}
        />
        <Button
          title={STREAK_COPY.shieldInfo}
          variant="ghost"
          size="sm"
          iconLeft={Info}
          haptic="selection"
          onPress={onInfo}
          accessibilityHint={STREAK_COPY.shieldInfoHint}
        />
      </HStack>

      <Button title={STREAK_COPY.shieldCta} fullWidth onPress={onBuy} />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  art: { paddingTop: spacing.xxs },
});
