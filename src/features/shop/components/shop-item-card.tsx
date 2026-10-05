/**
 * ShopItemCard — one Shop product: art band (tinted surface + economy icon + amount pill), then
 * overline, title and the price / status pill. The whole card is the tap target; it is disabled
 * while the item cannot be bought (daily reward claimed, lives already full, Pro active).
 *
 *   <ShopItemCard {...getShopItemView(item, state, now)} onPress={openPurchase} />
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Card, HStack, Text } from '@/components/ui';
import { spacing } from '@/theme';

import { SHOP_COPY } from '../copy';
import type { ShopItemView } from '../lib/shop-item-view';
import { PricePill } from './price-pill';
import { ShopItemArt } from './shop-item-art';

export type ShopItemCardProps = ShopItemView & {
  onPress: (item: ShopItemView['item']) => void;
  style?: StyleProp<ViewStyle>;
};

export function ShopItemCard({ item, status, meta, onPress, style }: ShopItemCardProps) {
  const inactive = status.type === 'claimed' || status.type === 'unavailable';
  const unaffordable = status.type === 'buyable' && !status.affordable;
  const hint = unaffordable ? SHOP_COPY.missing(status.missing) : meta;

  const label =
    status.type === 'free'
      ? SHOP_COPY.a11yFree(item.title)
      : status.type === 'buyable'
        ? SHOP_COPY.a11yPrice(item.title, item.price)
        : `${item.title}, ${status.type === 'claimed' ? SHOP_COPY.claimed : status.label}`;

  return (
    <Card
      padding="none"
      onPress={() => onPress(item)}
      disabled={inactive}
      haptic="light"
      accessibilityLabel={hint ? `${label}. ${hint}` : label}
      accessibilityHint={status.type === 'free' ? SHOP_COPY.a11yHintClaim : SHOP_COPY.a11yHintBuy}
      style={[styles.card, style]}>
      <ShopItemArt
        item={item}
        dimmed={inactive}
        muted={status.type === 'claimed'}
        highlight={status.type === 'free'}
      />
      <View style={styles.body}>
        <Text variant="overline" color="textTertiary">
          {item.overline}
        </Text>
        <Text variant="titleMd" numberOfLines={2}>
          {item.title}
        </Text>
        <HStack gap="xs" justify="space-between" style={styles.footer}>
          <PricePill price={item.price} status={status} />
          {hint ? (
            <Text
              variant="labelSm"
              color={unaffordable ? 'dangerText' : 'textSecondary'}
              numberOfLines={1}
              style={styles.hint}>
              {hint}
            </Text>
          ) : null}
        </HStack>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  body: { padding: spacing.md, gap: spacing.xxs },
  footer: { marginTop: spacing.xs },
  hint: { flexShrink: 1, textAlign: 'right' },
});
