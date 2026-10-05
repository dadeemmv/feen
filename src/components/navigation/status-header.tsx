/**
 * StatusHeader — the chips row on top of Home / Academy / Shop / Course / Account / Lesson:
 * optional left slot (back button or lesson controls), then streak · lives · coins StatChips
 * (always in that order) and the avatar. PRESENTATIONAL: it never reads the store; the shell
 * wraps it in a connected version that passes values + handlers.
 *
 *   <Screen header={<StatusHeader streak={0} lives={3} coins={0} avatarEmoji="🤠" onAvatarPress={…} />}>
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { FlameIcon, HeartIcon, HeartInfinityIcon, KiwiCoinIcon } from '@/components/icons';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { iconSize } from '@/components/ui/metrics';
import { StatChip, type StatKind } from '@/components/ui/stat-chip';
import { layout, spacing } from '@/theme';

export type StatusHeaderProps = {
  streak?: number;
  lives?: number;
  coins?: number;
  /** Lives chip shows ∞ with the gold heart (Pro / unlimited hour). */
  unlimited?: boolean;
  /** Which chips to show, in this order. Default `['streak', 'lives', 'coins']`. */
  stats?: StatKind[];
  onStreakPress?: () => void;
  onLivesPress?: () => void;
  onCoinsPress?: () => void;
  /** Avatar at the far right. Default `true`. */
  showAvatar?: boolean;
  avatarEmoji?: string;
  /** Used for initials / label when there is no emoji. */
  avatarName?: string;
  onAvatarPress?: () => void;
  /** Left slot (e.g. lesson X / flag / share IconButtons). Overrides `onBack`. */
  left?: ReactNode;
  /** Shorthand: renders a surface back IconButton ("Indietro") in the left slot. */
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_STATS: StatKind[] = ['streak', 'lives', 'coins'];
const CHIP_ICON = iconSize.md;

export function StatusHeader({
  streak = 0,
  lives = 0,
  coins = 0,
  unlimited = false,
  stats = DEFAULT_STATS,
  onStreakPress,
  onLivesPress,
  onCoinsPress,
  showAvatar = true,
  avatarEmoji,
  avatarName,
  onAvatarPress,
  left,
  onBack,
  style,
}: StatusHeaderProps) {
  const leftNode =
    left ?? (onBack ? <IconButton icon={ArrowLeft} accessibilityLabel="Indietro" onPress={onBack} variant="surface" /> : null);

  const renderStat = (kind: StatKind) => {
    switch (kind) {
      case 'streak':
        return (
          <StatChip
            key={kind}
            kind="streak"
            value={streak}
            onPress={onStreakPress}
            // The economy icon greys itself; skip the chip's generic dimming.
            muted={false}
            icon={<FlameIcon size={CHIP_ICON} muted={streak === 0} />}
          />
        );
      case 'lives':
        return (
          <StatChip
            key={kind}
            kind="lives"
            value={lives}
            unlimited={unlimited}
            onPress={onLivesPress}
            icon={unlimited ? <HeartInfinityIcon size={CHIP_ICON} /> : <HeartIcon size={CHIP_ICON} muted={lives === 0} />}
          />
        );
      case 'coins':
        return (
          <StatChip key={kind} kind="coins" value={coins} onPress={onCoinsPress} icon={<KiwiCoinIcon size={CHIP_ICON} />} />
        );
    }
  };

  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>{leftNode}</View>
      <View style={styles.right}>
        {stats.map(renderStat)}
        {showAvatar ? (
          <Avatar
            emoji={avatarEmoji}
            name={avatarName}
            size="sm"
            onPress={onAvatarPress}
            accessibilityLabel="Il tuo account"
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenX,
    gap: spacing.xs,
  },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
