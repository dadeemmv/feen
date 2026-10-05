/**
 * Level banner — full-width pill row that opens every level of the path ("🤓 LIVELLO 1" in the
 * video): emoji tile, "LIVELLO n" overline + level title, and the level status on the right
 * (n/m chapters, a check when done, a padlock when not reached yet).
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { LockIcon } from '@/components/icons';
import { EmojiTile, hairline, Icon, iconSize, iconStroke, Text, useReduceMotion } from '@/components/ui';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { PATH_MOTION } from '../constants';
import { COURSE_COPY, DEFAULT_LEVEL_EMOJI, LEVEL_EMOJI } from '../copy';
import type { PathRect } from '../path-layout';

export type LevelBannerState = 'done' | 'active' | 'locked';

export type LevelBannerProps = {
  rect: PathRect;
  number: number;
  title: string;
  completed: number;
  total: number;
  state: LevelBannerState;
  /** Position in the entrance stagger. */
  order: number;
};

export function LevelBanner({ rect, number, title, completed, total, state, order }: LevelBannerProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const done = state === 'done';
  const entering = reduceMotion
    ? undefined
    : FadeInDown.duration(duration.base)
        .easing(easing.enter)
        .delay(Math.min(order, PATH_MOTION.staggerCap) * PATH_MOTION.stagger);

  return (
    <Animated.View
      entering={entering}
      accessible
      accessibilityRole="header"
      accessibilityLabel={COURSE_COPY.levelA11y(number, title, completed, total)}
      style={[
        styles.banner,
        {
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          backgroundColor: done ? theme.colors.brandBg : theme.colors.fill,
          borderColor: done ? theme.colors.brandBorder : theme.colors.borderSubtle,
        },
      ]}>
      <EmojiTile emoji={LEVEL_EMOJI[number] ?? DEFAULT_LEVEL_EMOJI} tone={done ? 'brand' : 'neutral'} size="sm" round style={!done && { backgroundColor: theme.colors.surface }} />
      <View style={styles.label}>
        <Text variant="overline" color={done ? 'brandText' : 'textTertiary'}>
          {COURSE_COPY.level(number)}
        </Text>
        <Text variant="titleSm" color={state === 'locked' ? 'textSecondary' : 'text'} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {done ? (
        <View style={[styles.done, { backgroundColor: theme.colors.brandSolid }]}>
          <Icon icon={Check} size="sm" color="onBrand" strokeWidth={iconStroke.heavy} />
        </View>
      ) : state === 'locked' ? (
        <LockIcon size={iconSize.md} muted />
      ) : (
        <Text variant="labelMd" color="textSecondary" tabular>
          {COURSE_COPY.levelProgress(completed, total)}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.xs + spacing.xxxs,
    paddingRight: spacing.md,
    borderRadius: radius.lg,
    borderWidth: hairline,
  },
  label: { flex: 1, gap: spacing.xxxs / 2 },
  done: {
    width: iconSize.lg,
    height: iconSize.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
