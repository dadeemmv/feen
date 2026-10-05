/**
 * The economy icon of a Shop product (kiwi coin, shield, heart, gold ∞ heart) plus the matching
 * tinted surface colour, shared by the product art band, the purchase medallion and toasts.
 */
import type { ShopItemKind } from '@/content/types';
import { HeartIcon, HeartInfinityIcon, KiwiCoinIcon, ShieldIcon } from '@/components/icons';
import type { SemanticColors } from '@/theme';

export type ShopItemIconProps = {
  kind: ShopItemKind;
  size: number;
  muted?: boolean;
};

export function ShopItemIcon({ kind, size, muted }: ShopItemIconProps) {
  switch (kind) {
    case 'daily-reward':
      return <KiwiCoinIcon size={size} muted={muted} />;
    case 'streak-shield':
      return <ShieldIcon size={size} muted={muted} />;
    case 'extra-life':
      return <HeartIcon size={size} muted={muted} />;
    case 'unlimited-hour':
      return <HeartInfinityIcon size={size} muted={muted} />;
  }
}

/** Tinted art surface per product (redlines: shield = sky, life = blush, unlimited = butter). */
export function shopItemTint(kind: ShopItemKind, colors: SemanticColors): string {
  switch (kind) {
    case 'daily-reward':
      return colors.brandSurface;
    case 'streak-shield':
      return colors.tintSky;
    case 'extra-life':
      return colors.tintBlush;
    case 'unlimited-hour':
      return colors.tintButter;
  }
}
