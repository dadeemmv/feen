/**
 * FriendSlots — the "X/3 amici invitati" tracker: one circle per friend needed for the referral
 * reward. Empty slots are dashed with a "+ person" glyph, filled ones are lime with a check.
 * Reads colours from the nearest colour mode, so it works on the brand promo card and on paper.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Check, UserPlus } from 'lucide-react-native';

import { Icon, avatarSize, borderWidth, iconSize, iconStroke } from '@/components/ui';
import { radius, spacing, useTheme } from '@/theme';

import { INVITE_COPY } from '../copy';

export type FriendSlotsProps = {
  invited: number;
  total: number;
  /** Circle diameter. Default `avatarSize.md` (44). */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function FriendSlots({ invited, total, size = avatarSize.md, style }: FriendSlotsProps) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: total }, (_, index) => {
        const filled = index < invited;
        return (
          <View key={index} style={styles.slotWrap}>
            {index > 0 ? (
              <View
                style={[styles.link, { backgroundColor: filled ? colors.accentSolid : colors.border }]}
                aria-hidden
              />
            ) : null}
            <View
              accessible
              accessibilityRole="image"
              accessibilityLabel={filled ? INVITE_COPY.slotFilledA11y(index) : INVITE_COPY.slotEmptyA11y(index)}
              style={[
                styles.slot,
                { width: size, height: size },
                filled
                  ? { backgroundColor: colors.accentSolid, borderColor: colors.accentSolid }
                  : { backgroundColor: colors.fill, borderColor: colors.borderStrong, borderStyle: 'dashed' },
              ]}>
              <Icon
                icon={filled ? Check : UserPlus}
                size={filled ? iconSize.md : iconSize.sm}
                color={filled ? 'onAccent' : 'textTertiary'}
                strokeWidth={filled ? iconStroke.heavy : iconStroke.regular}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  slotWrap: { flexDirection: 'row', alignItems: 'center' },
  link: { width: spacing.lg, height: borderWidth.thick, borderRadius: radius.pill },
  slot: {
    borderRadius: radius.pill,
    borderWidth: borderWidth.regular,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
