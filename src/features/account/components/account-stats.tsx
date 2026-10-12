/**
 * Three mini stats under the profile card (residents · lessons completed · bricks). Each tile is
 * a shortcut: the pact, the lessons list, the village.
 */
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { Users } from 'lucide-react-native';

import { CheckBadgeIcon, BrickIcon } from '@/components/icons';
import { HStack, PressableScale, StatTile, iconSize } from '@/components/ui';
import { formatCoins } from '@/lib/format';
import { countResidents, selectLessonsCompleted, useStore, useStoreShallow } from '@/store';

import { ACCOUNT_COPY } from '../copy';

function StatShortcut({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <PressableScale onPress={onPress} haptic="selection" accessibilityRole="button" accessibilityLabel={label} style={styles.flex}>
      {children}
    </PressableScale>
  );
}

export function AccountStats() {
  const streak = countResidents(useStoreShallow((s) => ({ activeDays: s.activeDays, pact: s.pact })));
  const lessons = useStore((s) => selectLessonsCompleted(s));
  const coins = useStore((s) => s.coins);
  const copy = ACCOUNT_COPY.stats;

  return (
    <HStack gap="xs" align="stretch">
      <StatShortcut label={`${streak} ${copy.streak}`} onPress={() => router.navigate('/pact')}>
        <StatTile icon={Users} value={streak} label={copy.streak} />
      </StatShortcut>
      <StatShortcut label={`${lessons} ${copy.lessons}`} onPress={() => router.navigate('/lessons')}>
        <StatTile icon={<CheckBadgeIcon size={iconSize.lg} muted={lessons === 0} />} value={lessons} label={copy.lessons} />
      </StatShortcut>
      <StatShortcut label={`${formatCoins(coins)} ${copy.coins}`} onPress={() => router.navigate('/')}>
        <StatTile icon={<BrickIcon size={iconSize.lg} />} value={formatCoins(coins)} label={copy.coins} />
      </StatShortcut>
    </HStack>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
