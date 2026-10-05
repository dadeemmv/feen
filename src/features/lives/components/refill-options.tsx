/**
 * RefillOptions — "Ricarica con i Kiwi": the two lives items of the Shop (1 vita · 500,
 * vite illimitate per 1 ora · 1000) as tappable rows inside the lives sheets. A tap buys right
 * away (the price is on the row); a missing balance shakes the row and spells out the gap.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { KiwiCoinIcon } from '@/components/icons';
import { HStack, PressableScale, Text, VStack, hairline, iconSize, tileSize, uiOpacity, useShake } from '@/components/ui';
import { getShopItem } from '@/content/shop';
import type { ShopItem } from '@/content/types';
import { ShopItemIcon, shopItemTint } from '@/features/shop/components/shop-item-icon';
import { CoinPrice } from '@/features/shop/components/price-pill';
import { purchaseItem } from '@/features/shop/lib/purchase';
import { haptics } from '@/lib/haptics';
import { getAvailabilityIssue, useStore, useStoreShallow } from '@/store';
import { radius, spacing, useTheme } from '@/theme';

import { LIVES_COPY } from '../copy';

export type RefillKind = 'extra-life' | 'unlimited-hour';

export type RefillOptionsProps = {
  now: number;
  /** Called after a successful purchase. */
  onPurchased?: (kind: RefillKind) => void;
};

const ITEM_IDS: { id: string; copy: { title: string; subtitle: string } }[] = [
  { id: 'extra-life-1', copy: LIVES_COPY.refillLife },
  { id: 'unlimited-1h', copy: LIVES_COPY.refillUnlimited },
];

export function RefillOptions({ now, onPurchased }: RefillOptionsProps) {
  const coins = useStore((s) => s.coins);
  const [showHint, setShowHint] = useState(false);

  return (
    <VStack gap="xs">
      <HStack justify="space-between">
        <Text variant="overline" color="textTertiary">
          {LIVES_COPY.refillTitle}
        </Text>
        <HStack gap="xxs">
          <Text variant="labelSm" color="textSecondary" tabular>
            {LIVES_COPY.balance(coins)}
          </Text>
          <KiwiCoinIcon size={iconSize.sm} />
        </HStack>
      </HStack>
      {ITEM_IDS.map(({ id, copy }) => {
        const item = getShopItem(id);
        if (!item) return null;
        return (
          <RefillRow
            key={id}
            item={item}
            title={copy.title}
            subtitle={copy.subtitle}
            now={now}
            onInsufficient={() => setShowHint(true)}
            onPurchased={() => onPurchased?.(item.kind as RefillKind)}
          />
        );
      })}
      {showHint ? (
        <Text variant="bodySm" color="textSecondary" align="center" style={styles.hint}>
          {LIVES_COPY.insufficientHint}
        </Text>
      ) : null}
    </VStack>
  );
}

type RowProps = {
  item: ShopItem;
  title: string;
  subtitle: string;
  now: number;
  onInsufficient: () => void;
  onPurchased: () => void;
};

function RefillRow({ item, title, subtitle, now, onInsufficient, onPurchased }: RowProps) {
  const theme = useTheme();
  const { style: shakeStyle, shake } = useShake();
  const state = useStoreShallow((s) => ({
    coins: s.coins,
    lives: s.lives,
    maxLives: s.maxLives,
    lastLifeAt: s.lastLifeAt,
    unlimitedUntil: s.unlimitedUntil,
    proUntil: s.proUntil,
    dailyRewardClaimedOn: s.dailyRewardClaimedOn,
  }));
  const unavailable = getAvailabilityIssue(item, state, now) !== null;
  const missing = Math.max(0, item.price - state.coins);

  const press = () => {
    if (missing > 0) {
      haptics.error();
      shake();
      onInsufficient();
      return;
    }
    const outcome = purchaseItem(item, now);
    if (outcome.ok) onPurchased();
    else shake();
  };

  return (
    <Animated.View style={shakeStyle}>
      <PressableScale
        onPress={press}
        disabled={unavailable}
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={LIVES_COPY.priceA11y(title, item.price)}
        accessibilityHint={missing > 0 ? LIVES_COPY.missing(missing) : subtitle}
        style={[
          styles.row,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          unavailable && styles.unavailable,
        ]}>
        <View style={[styles.tile, { backgroundColor: shopItemTint(item.kind, theme.colors) }]}>
          <ShopItemIcon kind={item.kind} size={iconSize.xl} />
        </View>
        <VStack flex gap="xxxs">
          <Text variant="titleSm" numberOfLines={2}>
            {title}
          </Text>
          <Text variant="bodySm" color={missing > 0 ? 'dangerText' : 'textSecondary'} numberOfLines={1}>
            {missing > 0 ? LIVES_COPY.missing(missing) : subtitle}
          </Text>
        </VStack>
        <CoinPrice price={item.price} size="sm" />
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: hairline,
  },
  unavailable: { opacity: uiOpacity.disabled },
  tile: {
    width: tileSize.lg,
    height: tileSize.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { marginTop: spacing.xxs },
});
