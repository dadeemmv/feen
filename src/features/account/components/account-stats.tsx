/**
 * Three mini stats under the profile card (residents · buildings built · bricks), all counted in
 * the village. Each tile is a shortcut: the pact, the lessons list, what bricks can build.
 * Palette roles: residents in green (positive), buildings in lilac (achievements), bricks in sun.
 */
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { Landmark, Users } from 'lucide-react-native';

import { BrickIcon } from '@/components/icons';
import { HStack, PressableScale, StatTile, iconSize } from '@/components/ui';
import { BUILDING_IDS } from '@/content/village';
import { formatCoins } from '@/lib/format';
import { countResidents, isBuilt, useStore, useStoreShallow } from '@/store';

import { ACCOUNT_COPY } from '../copy';

function StatShortcut({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <PressableScale onPress={onPress} haptic="selection" accessibilityRole="button" accessibilityLabel={label} style={styles.flex}>
      {children}
    </PressableScale>
  );
}

export function AccountStats() {
  const s = useStoreShallow((st) => ({ activeDays: st.activeDays, pact: st.pact, chapterRecords: st.chapterRecords }));
  const residents = countResidents(s);
  const built = BUILDING_IDS.filter((id) => isBuilt(id, s)).length;
  const coins = useStore((st) => st.coins);
  const copy = ACCOUNT_COPY.stats;

  return (
    <HStack gap="xs" align="stretch">
      <StatShortcut label={`${residents} ${copy.streak}`} onPress={() => router.navigate('/pact')}>
        <StatTile icon={Users} value={residents} label={copy.streak} tone="success" />
      </StatShortcut>
      <StatShortcut label={`${built} ${copy.built}`} onPress={() => router.navigate('/lessons')}>
        <StatTile icon={Landmark} value={built} label={copy.built} tone="lilac" />
      </StatShortcut>
      <StatShortcut label={`${formatCoins(coins)} ${copy.coins}`} onPress={() => router.push('/build')}>
        <StatTile icon={<BrickIcon size={iconSize.lg} />} value={formatCoins(coins)} label={copy.coins} />
      </StatShortcut>
    </HStack>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
