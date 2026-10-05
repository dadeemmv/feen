/**
 * Product art band (150 high): tinted surface + big economy icon cropped by the bottom edge, or
 * the evergreen kiwi pattern for the daily reward; the amount pill ("+100", "1", "1h") sits on
 * top, the FREE badge in the corner. A shimmer sweeps across while the daily reward is ready.
 */
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock } from 'lucide-react-native';

import { KiwiPattern } from '@/components/illustrations';
import { Chip, Shimmer, Spotlight, Tag, uiOpacity } from '@/components/ui';
import type { ShopItem } from '@/content/types';
import { MINUTE_MS } from '@/lib/dates';
import { formatCoins, formatCountdown } from '@/lib/format';
import { gradients, spacing, useTheme } from '@/theme';

import { shopMetrics } from '../metrics';
import { ShopItemIcon, shopItemTint } from './shop-item-icon';

export type ShopItemArtProps = {
  item: ShopItem;
  /** Fades the art (claimed / unavailable). */
  dimmed?: boolean;
  /** Greyscale economy icons (daily reward already claimed). */
  muted?: boolean;
  /** Looping shimmer (daily reward ready to claim). */
  highlight?: boolean;
};

function amountLabel(item: ShopItem): string {
  switch (item.kind) {
    case 'daily-reward':
      return `+${formatCoins(item.amount)}`;
    case 'unlimited-hour':
      return formatCountdown(item.amount * MINUTE_MS);
    default:
      return formatCoins(item.amount);
  }
}

export function ShopItemArt({ item, dimmed = false, muted = false, highlight = false }: ShopItemArtProps) {
  const { colors } = useTheme();
  const isDaily = item.kind === 'daily-reward';
  const pillIcon = <ShopItemIcon kind={item.kind} size={shopMetrics.amountPillIcon} muted={muted} />;

  return (
    <View
      aria-hidden
      style={[styles.band, { backgroundColor: shopItemTint(item.kind, colors) }]}>
      <View style={[StyleSheet.absoluteFill, dimmed && styles.dimmed]}>
        {isDaily ? (
          <>
            <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
            <KiwiPattern
              density="sparse"
              mode={muted ? 'ghost' : 'vivid'}
              width="100%"
              height="100%"
              style={StyleSheet.absoluteFill}
            />
          </>
        ) : (
          <>
            <Spotlight colors={gradients.sheen} reach={{ x: 0.7, y: 1 }} />
            <View style={styles.bigIcon}>
              <ShopItemIcon kind={item.kind} size={shopMetrics.artIconSize} muted={muted} />
            </View>
          </>
        )}
      </View>

      {highlight ? <Shimmer /> : null}

      {item.badge && !muted ? <Tag label={item.badge} tone="accent" solid size="sm" style={styles.badge} /> : null}

      <View style={styles.pillSlot}>
        <Chip
          variant="surface"
          label={amountLabel(item)}
          textVariant="titleMd"
          icon={item.kind === 'unlimited-hour' ? Clock : undefined}
          iconRight={pillIcon}
          style={styles.pill}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { height: shopMetrics.artBandHeight, overflow: 'hidden' },
  dimmed: { opacity: uiOpacity.dimmed },
  bigIcon: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    bottom: -Math.round(shopMetrics.artIconSize * shopMetrics.artIconDrop),
  },
  badge: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  pillSlot: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  pill: {
    alignSelf: 'center',
    height: shopMetrics.amountPillHeight,
    paddingHorizontal: spacing.md,
    gap: spacing.xxs,
  },
});
