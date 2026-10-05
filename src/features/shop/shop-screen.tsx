/**
 * Shop tab (docs/PRODUCT_SPEC.md §3.7, SCREEN_SPECS "Shop").
 *
 * Status header · "Shop" + countdown to the daily reset · product cards (daily reward, shield,
 * extra life, unlimited hour) · Finanz Pro banner. The daily reward is claimed with one tap and
 * celebrated in a dialog; paid items open the purchase sheet (price → balance → balance after).
 */
import { useState, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router'; // QA-TEMP
import { LivesSheet, OutOfLivesSheet } from '@/features/lives'; // QA-TEMP

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { ScreenTitle, Screen, SectionHeader, VStack, toast, useReduceMotion } from '@/components/ui';
import { SHOP_ITEMS } from '@/content/shop';
import type { ShopItem } from '@/content/types';
import { haptics } from '@/lib/haptics';
import { isProActive, useStore, useStoreShallow } from '@/store';
import { useNow } from '@/store/hooks';
import { duration, easing, spacing } from '@/theme';

import { DailyRewardDialog } from './components/daily-reward-dialog';
import { ProBanner } from './components/pro-banner';
import { PurchaseSheet } from './components/purchase-sheet';
import { ShopCountdown } from './components/shop-countdown';
import { ShopItemCard } from './components/shop-item-card';
import { SHOP_COPY } from './copy';
import { openPro } from './lib/navigation';
import { getShopItemView } from './lib/shop-item-view';
import { shopMetrics } from './metrics';

const DAILY_ITEMS = SHOP_ITEMS.filter((item) => item.kind === 'daily-reward');
const BOOST_ITEMS = SHOP_ITEMS.filter((item) => item.kind !== 'daily-reward');

export function ShopScreen() {
  // Minute resolution: the reset countdown chip ticks on its own.
  const now = useNow();
  const state = useStoreShallow((s) => ({
    coins: s.coins,
    lives: s.lives,
    maxLives: s.maxLives,
    lastLifeAt: s.lastLifeAt,
    unlimitedUntil: s.unlimitedUntil,
    proUntil: s.proUntil,
    dailyRewardClaimedOn: s.dailyRewardClaimedOn,
    shields: s.shields,
  }));
  const claimDailyReward = useStore((s) => s.claimDailyReward);

  const [purchase, setPurchase] = useState<{ item: ShopItem | null; visible: boolean }>({ item: null, visible: false });
  const [reward, setReward] = useState({ visible: false, amount: 0 });

  const openItem = (item: ShopItem) => {
    if (item.kind !== 'daily-reward') {
      setPurchase({ item, visible: true });
      return;
    }
    const result = claimDailyReward(Date.now());
    if (result.ok) {
      haptics.success();
      setReward({ visible: true, amount: item.amount });
    } else {
      haptics.error();
      toast.show({ message: SHOP_COPY.failure[result.reason], tone: 'neutral' });
    }
  };

  const renderCard = (item: ShopItem) => (
    <Entrance key={item.id} index={SHOP_ITEMS.indexOf(item)}>
      <ShopItemCard {...getShopItemView(item, state, now)} onPress={openItem} />
    </Entrance>
  );

  return (
    <Screen withTabBar header={<ConnectedStatusHeader />}>
      <ScreenTitle title={SHOP_COPY.title} trailing={<ShopCountdown />} />

      <VStack gap="md">
        <SectionHeader title={SHOP_COPY.sectionDaily} />
        {DAILY_ITEMS.map(renderCard)}

        <SectionHeader title={SHOP_COPY.sectionBoosts} style={styles.section} />
        {BOOST_ITEMS.map(renderCard)}

        <SectionHeader title={SHOP_COPY.sectionPro} style={styles.section} />
        <Entrance index={SHOP_ITEMS.length}>
          <ProBanner activeUntil={isProActive(state, now) ? state.proUntil : null} onPress={openPro} />
        </Entrance>
      </VStack>

      <PurchaseSheet
        item={purchase.item}
        visible={purchase.visible}
        onClose={() => setPurchase((p) => ({ ...p, visible: false }))}
        onClosed={() => setPurchase({ item: null, visible: false })}
      />
      <QaSheets />
      <DailyRewardDialog
        visible={reward.visible}
        amount={reward.amount}
        onClose={() => setReward((r) => ({ ...r, visible: false }))}
      />
    </Screen>
  );
}

/** Cards rise in one after the other on first render (plain fade under reduced motion). */
function Entrance({ index, children }: { index: number; children: ReactNode }) {
  const reduceMotion = useReduceMotion();
  const entering = reduceMotion
    ? undefined
    : FadeInDown.duration(duration.base)
        .delay(index * shopMetrics.entranceStagger)
        .easing(easing.enter);
  return <Animated.View entering={entering}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.md },
});

// QA-TEMP
function QaSheets() {
  const { qa } = useLocalSearchParams<{ qa?: string }>();
  const [open, setOpen] = useState(true);
  return (
    <>
      <LivesSheet visible={qa === 'lives' && open} onClose={() => setOpen(false)} />
      <OutOfLivesSheet visible={qa === 'out' && open} onClose={() => setOpen(false)} />
      <OutOfLivesSheet visible={qa === 'outlesson' && open} fromLesson onClose={() => setOpen(false)} />
    </>
  );
}
