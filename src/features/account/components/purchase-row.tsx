/**
 * One purchase of the history: economy icon on its tinted tile, item title, date + time,
 * Kiwi spent on the right (plain tabular figure + coin, so long titles keep their room).
 */
import type { ReactElement } from 'react';
import { ShoppingBag } from 'lucide-react-native';

import { GiftIcon, HeartIcon, HeartInfinityIcon, KiwiCoinIcon, ShieldIcon } from '@/components/icons';
import { HStack, IconTile, iconSize, ListItem, Text, type IconSource, type Tone } from '@/components/ui';
import type { ShopItemKind } from '@/content/types';
import { formatLongDate } from '@/lib/dates';
import { formatCoins } from '@/lib/format';
import { findShopItem, type Purchase } from '@/store';

import { PURCHASES_COPY } from '../copy';

const GLYPH = iconSize.lg;

const ICONS: Record<ShopItemKind, { icon: ReactElement; tone: Tone }> = {
  'streak-shield': { icon: <ShieldIcon size={GLYPH} />, tone: 'shield' },
  'extra-life': { icon: <HeartIcon size={GLYPH} />, tone: 'lives' },
  'unlimited-hour': { icon: <HeartInfinityIcon size={GLYPH} />, tone: 'butter' },
  'daily-reward': { icon: <GiftIcon size={GLYPH} />, tone: 'accent' },
};

const pad = (value: number) => String(value).padStart(2, '0');

/** '30 settembre 2026 · 14:05'. */
function formatPurchaseDate(at: number): string {
  const date = new Date(at);
  return `${formatLongDate(date)} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PurchaseRow({ purchase }: { purchase: Purchase }) {
  const kind = findShopItem(purchase.itemId)?.kind;
  const visual = kind ? ICONS[kind] : undefined;
  const icon: IconSource = visual?.icon ?? ShoppingBag;
  const price = formatCoins(purchase.price);
  const date = formatPurchaseDate(purchase.at);

  return (
    <ListItem
      leading={<IconTile icon={icon} tone={visual?.tone ?? 'blush'} size="md" />}
      title={purchase.title}
      subtitle={date}
      accessibilityLabel={`${purchase.title}, ${PURCHASES_COPY.priceLabel(price)}, ${date}`}
      trailing={
        <HStack gap="xxs">
          <Text variant="labelLg" tabular>
            {purchase.price > 0 ? `−${price}` : PURCHASES_COPY.free}
          </Text>
          <KiwiCoinIcon size={iconSize.sm} />
        </HStack>
      }
    />
  );
}
