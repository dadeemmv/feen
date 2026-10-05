/**
 * ShopCountdown — the clock chip next to the "Shop" title: time left until the daily offers
 * (and the free reward) reset at local midnight, "2h 26min" style. Ticks on its own every
 * second so the rest of the screen only re-renders once a minute.
 */
import { Clock } from 'lucide-react-native';

import { Chip } from '@/components/ui';
import { msUntilMidnight } from '@/lib/dates';
import { formatCountdown } from '@/lib/format';
import { useNow } from '@/store/hooks';

import { SHOP_COPY } from '../copy';

const TICK_MS = 1000;

export function ShopCountdown() {
  const now = useNow(TICK_MS);
  const label = formatCountdown(msUntilMidnight(now));
  return (
    <Chip
      icon={Clock}
      label={label}
      variant="surface"
      textVariant="labelMd"
      accessibilityLabel={SHOP_COPY.countdownLabel(label)}
    />
  );
}
