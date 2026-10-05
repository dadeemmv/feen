/**
 * I tuoi acquisti: purchase history from `economy.purchases` (newest first), grouped by month,
 * with a spend summary. Empty state → Shop.
 */
import { router } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';

import { KiwiCoinIcon } from '@/components/icons';
import { EmptyBox } from '@/components/illustrations';
import { Card, EmptyState, HStack, iconSize, ListGroup, StatTile, VStack } from '@/components/ui';
import { formatMonthYear } from '@/lib/dates';
import { formatCoins } from '@/lib/format';
import { useStore, type Purchase } from '@/store';

import { PurchaseRow } from '../components/purchase-row';
import { SectionPage } from '../components/section-page';
import { MENU_COPY, PURCHASES_COPY } from '../copy';
import { accountMetrics } from '../metrics';

type MonthGroup = { key: string; title: string; purchases: Purchase[] };

/** Consecutive purchases of the same month (the list is already newest first). */
function groupByMonth(purchases: readonly Purchase[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const purchase of purchases) {
    const date = new Date(purchase.at);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const last = groups[groups.length - 1];
    if (last?.key === key) last.purchases.push(purchase);
    else groups.push({ key, title: formatMonthYear(date.getFullYear(), date.getMonth()), purchases: [purchase] });
  }
  return groups;
}

export function PurchasesSection() {
  const purchases = useStore((s) => s.purchases);
  const copy = PURCHASES_COPY;
  const title = MENU_COPY.purchases.title;

  if (purchases.length === 0) {
    return (
      <SectionPage title={title} subtitle={copy.subtitle}>
        <Card padding="none">
          <EmptyState
            illustration={<EmptyBox width={accountMetrics.emptyArt} />}
            title={copy.emptyTitle}
            message={copy.emptyMessage}
            action={{ label: copy.emptyCta, onPress: () => router.navigate('/shop') }}
          />
        </Card>
      </SectionPage>
    );
  }

  const spent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);

  return (
    <SectionPage title={title} subtitle={copy.subtitle}>
      <HStack gap="xs" align="stretch">
        <StatTile icon={<KiwiCoinIcon size={iconSize.lg} />} value={formatCoins(spent)} label={copy.total} />
        <StatTile icon={ShoppingBag} tone="blush" value={purchases.length} label={copy.countLabel} />
      </HStack>
      <VStack gap="xl">
        {groupByMonth(purchases).map((group) => (
          <ListGroup key={group.key} title={group.title}>
            {group.purchases.map((purchase) => (
              <PurchaseRow key={purchase.id} purchase={purchase} />
            ))}
          </ListGroup>
        ))}
      </VStack>
    </SectionPage>
  );
}
