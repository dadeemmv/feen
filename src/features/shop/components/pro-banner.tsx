/**
 * ProBanner — the "Finanz Pro" card that closes the Shop: evergreen card with the gem, the three
 * headline benefits and a CTA to the paywall. When Pro is already active it becomes a calm
 * membership summary that still opens the paywall ("Dettagli abbonamento").
 */
import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { GemIcon, HeartInfinityIcon } from '@/components/icons';
import { Button, Card, HStack, Tag, Text, VStack, iconSize } from '@/components/ui';
import { formatLongDate } from '@/lib/dates';
import { spacing } from '@/theme';

import { SHOP_COPY } from '../copy';
import { shopMetrics } from '../metrics';

export type ProBannerProps = {
  /** Pro expiry (epoch ms) when active, otherwise null. */
  activeUntil: number | null;
  onPress: () => void;
};

export function ProBanner({ activeUntil, onPress }: ProBannerProps) {
  const active = activeUntil !== null;
  return (
    <Card
      variant="brand"
      spotlight
      padding="lg"
      contentStyle={styles.content}>
      <HStack gap="md" align="flex-start">
        <VStack flex gap="xs">
          <Tag label={SHOP_COPY.proTag} tone="pro" solid size="sm" style={styles.tag} />
          <Text variant="displaySm" accessibilityRole="header">
            {active ? SHOP_COPY.proActiveTitle : SHOP_COPY.proTitle}
          </Text>
          <Text variant="bodyMd" color="textSecondary">
            {active ? SHOP_COPY.proActiveBody(formatLongDate(activeUntil)) : SHOP_COPY.proBody}
          </Text>
        </VStack>
        <View style={styles.art} aria-hidden>
          <GemIcon size={shopMetrics.proBannerIcon} />
          <View style={styles.heart}>
            <HeartInfinityIcon size={iconSize.xl} />
          </View>
        </View>
      </HStack>
      <Button
        title={active ? SHOP_COPY.proActiveCta : SHOP_COPY.proCta}
        variant={active ? 'outline' : 'primary'}
        iconRight={active ? ChevronRight : undefined}
        size="md"
        glow={!active}
        shimmer={!active}
        fullWidth
        onPress={onPress}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  tag: { alignSelf: 'flex-start' },
  art: { paddingTop: spacing.xs, paddingRight: spacing.xxs },
  heart: { position: 'absolute', right: -spacing.xxs, bottom: -spacing.xs },
});
