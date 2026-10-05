/**
 * RewardIcon — the economy "jewel" of a milestone reward (shield · kiwi coin · Pro gem), with an
 * optional status badge on its bottom-right corner (padlock while locked, check once claimed).
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CheckBadgeIcon, GemIcon, KiwiCoinIcon, LockIcon, ShieldIcon } from '@/components/icons';
import type { MilestoneReward } from '@/content/extra-types';
import { radius, useTheme } from '@/theme';

export type RewardStatus = 'locked' | 'claimable' | 'claimed';

export type RewardIconProps = {
  kind: MilestoneReward['kind'];
  /** Icon size in pt. */
  size: number;
  /** Adds the lock (locked) or check (claimed) badge. `claimable` shows no badge. */
  status?: RewardStatus;
  style?: StyleProp<ViewStyle>;
};

/** Status badge disc relative to the icon, and the glyph inside the disc. */
const BADGE_RATIO = 0.5;
const BADGE_GLYPH_RATIO = 0.78;

export function RewardIcon({ kind, size, status = 'claimable', style }: RewardIconProps) {
  const theme = useTheme();
  const muted = status === 'locked';
  const badge = Math.round(size * BADGE_RATIO);
  const glyph = Math.round(badge * BADGE_GLYPH_RATIO);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {kind === 'shield' ? (
        <ShieldIcon size={size} muted={muted} />
      ) : kind === 'coins' ? (
        <KiwiCoinIcon size={size} muted={muted} />
      ) : (
        <GemIcon size={size} muted={muted} />
      )}
      {status !== 'claimable' ? (
        <View
          style={[
            styles.badge,
            { width: badge, height: badge, backgroundColor: theme.colors.surface, borderRadius: radius.pill },
          ]}>
          {status === 'locked' ? <LockIcon size={glyph} /> : <CheckBadgeIcon size={glyph} />}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: '-14%',
    bottom: '-10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
