/**
 * Three mini stats under the profile card (streak · lessons completed · Kiwi). Each tile is a
 * shortcut: streak screen, the learning path, the Shop.
 */
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { CheckBadgeIcon, FlameIcon, KiwiCoinIcon } from '@/components/icons';
import { HStack, PressableScale, StatTile, iconSize } from '@/components/ui';
import { MAIN_COURSE_ID } from '@/content/courses';
import { formatCoins } from '@/lib/format';
import { selectLessonsCompleted, useStore } from '@/store';
import { useNow, useStreakInfo } from '@/store/hooks';

import { ACCOUNT_COPY } from '../copy';

function StatShortcut({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <PressableScale onPress={onPress} haptic="selection" accessibilityRole="button" accessibilityLabel={label} style={styles.flex}>
      {children}
    </PressableScale>
  );
}

export function AccountStats() {
  const now = useNow();
  const streak = useStreakInfo(now).count;
  const lessons = useStore((s) => selectLessonsCompleted(s));
  const coins = useStore((s) => s.coins);
  const copy = ACCOUNT_COPY.stats;

  return (
    <HStack gap="xs" align="stretch">
      <StatShortcut label={`${streak} ${copy.streak}`} onPress={() => router.push('/streak')}>
        <StatTile icon={<FlameIcon size={iconSize.lg} muted={streak === 0} />} value={streak} label={copy.streak} />
      </StatShortcut>
      <StatShortcut
        label={`${lessons} ${copy.lessons}`}
        onPress={() => router.push({ pathname: '/course/[id]', params: { id: MAIN_COURSE_ID } })}>
        <StatTile icon={<CheckBadgeIcon size={iconSize.lg} muted={lessons === 0} />} value={lessons} label={copy.lessons} />
      </StatShortcut>
      <StatShortcut label={`${formatCoins(coins)} ${copy.coins}`} onPress={() => router.navigate('/shop')}>
        <StatTile icon={<KiwiCoinIcon size={iconSize.lg} />} value={formatCoins(coins)} label={copy.coins} />
      </StatShortcut>
    </HStack>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
