/**
 * Price / status pill of a product: "500 🥝", "Gratuito 🎁", "Riscattata · torna tra 5h",
 * "Vite al massimo".
 */
import { Check, CircleCheck } from 'lucide-react-native';

import { GiftIcon, KiwiCoinIcon } from '@/components/icons';
import { Chip, type ChipSize } from '@/components/ui';
import { formatCoins } from '@/lib/format';

import { SHOP_COPY } from '../copy';
import type { ShopItemStatus } from '../lib/shop-item-view';
import { shopMetrics } from '../metrics';

export type PricePillProps = {
  price: number;
  status: ShopItemStatus;
  size?: ChipSize;
};

export function PricePill({ price, status, size = 'md' }: PricePillProps) {
  switch (status.type) {
    case 'free':
      return (
        <Chip
          size={size}
          tone="accent"
          label={SHOP_COPY.free}
          iconRight={<GiftIcon size={shopMetrics.priceIcon} />}
        />
      );
    case 'claimed':
      return (
        <Chip
          size={size}
          tone="success"
          icon={Check}
          label={`${SHOP_COPY.claimed} · ${SHOP_COPY.comeBackIn(status.resetsIn).toLowerCase()}`}
        />
      );
    case 'unavailable':
      return <Chip size={size} icon={CircleCheck} label={status.label} />;
    case 'buyable':
      return <CoinPrice price={price} size={size} />;
  }
}

/** Neutral pill with a tabular amount and the kiwi coin: "1.000 🥝". */
export function CoinPrice({ price, size = 'md' }: { price: number; size?: ChipSize }) {
  return (
    <Chip
      size={size}
      label={formatCoins(price)}
      textVariant="numeric"
      iconRight={<KiwiCoinIcon size={shopMetrics.priceIcon} />}
      accessibilityLabel={`${formatCoins(price)} ${SHOP_COPY.kiwi}`}
    />
  );
}
