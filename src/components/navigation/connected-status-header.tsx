/**
 * ConnectedStatusHeader — `StatusHeader` wired to the app store, with the default destinations
 * of every chip (docs/PRODUCT_SPEC.md §1):
 *   streak → /streak · lives → Lives sheet · coins → Shop tab · avatar → /account
 *
 *   <Screen withTabBar header={<ConnectedStatusHeader />}>…            // tab root
 *   <Screen header={<ConnectedStatusHeader onBack={router.back} />}>…   // pushed page
 *   <ConnectedStatusHeader stats={['lives', 'coins']} showAvatar={false} left={…} />  // lesson
 *
 * Kept out of the `@/components/navigation` barrel on purpose: the barrel stays presentational
 * (no store import), screens import this file directly.
 */
import { router } from 'expo-router';

import { useLives, useNow, useStreakInfo } from '@/store/hooks';
import { useStore, useStoreShallow } from '@/store';
import { openSheet } from '@/store/ui';

import { StatusHeader, type StatusHeaderProps } from './status-header';

/** Everything except the values, which always come from the store. Handlers override defaults. */
export type ConnectedStatusHeaderProps = Omit<
  StatusHeaderProps,
  'streak' | 'lives' | 'coins' | 'unlimited' | 'avatarEmoji' | 'avatarName'
>;

const openStreak = () => router.push('/streak');
const openLives = () => openSheet('lives');
const openShop = () => router.navigate('/shop');
const openAccount = () => router.push('/account');

export function ConnectedStatusHeader({
  onStreakPress = openStreak,
  onLivesPress = openLives,
  onCoinsPress = openShop,
  onAvatarPress = openAccount,
  ...rest
}: ConnectedStatusHeaderProps) {
  // Minute resolution is enough: lives refill every 2 h, the streak changes at midnight.
  const now = useNow();
  const streak = useStreakInfo(now).count;
  const lives = useLives(now);
  const coins = useStore((s) => s.coins);
  const profile = useStoreShallow((s) => ({ avatar: s.avatar, name: s.name }));

  return (
    <StatusHeader
      streak={streak}
      lives={lives.lives}
      unlimited={lives.unlimited}
      coins={coins}
      avatarEmoji={profile.avatar}
      avatarName={profile.name}
      onStreakPress={onStreakPress}
      onLivesPress={onLivesPress}
      onCoinsPress={onCoinsPress}
      onAvatarPress={onAvatarPress}
      {...rest}
    />
  );
}
