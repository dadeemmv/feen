/**
 * Shop feature: the Shop tab, the product card and the purchase confirmation sheet
 * (reused by the lives sheets through `purchaseItem`).
 */
export { DailyRewardDialog, type DailyRewardDialogProps } from './components/daily-reward-dialog';
export { CoinPrice, PricePill, type PricePillProps } from './components/price-pill';
export { ProBanner, type ProBannerProps } from './components/pro-banner';
export { PurchaseSheet, type PurchaseSheetProps } from './components/purchase-sheet';
export { ShopItemCard, type ShopItemCardProps } from './components/shop-item-card';
export { ShopItemIcon, shopItemTint, type ShopItemIconProps } from './components/shop-item-icon';
export { purchaseItem, successToast, type PurchaseOutcome } from './lib/purchase';
export { getShopItemView, type ShopItemStatus, type ShopItemView } from './lib/shop-item-view';
export { ShopScreen } from './shop-screen';
