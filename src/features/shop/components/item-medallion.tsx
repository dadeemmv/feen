/**
 * ItemMedallion — the product's economy icon on a tinted disc at the top of the purchase sheet.
 * Pops in when the sheet opens and bumps when the purchase succeeds (`celebrate`).
 */
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { CheckBadgeIcon } from '@/components/icons';
import { bumpAnimation, feedbackMotion, iconSize, popAnimation, useReduceMotion } from '@/components/ui';
import { PopIn } from '@/features/lives/components/pop-in';
import type { ShopItemKind } from '@/content/types';
import { elevation, radius, spacing, useTheme } from '@/theme';

import { shopMetrics } from '../metrics';
import { ShopItemIcon, shopItemTint } from './shop-item-icon';

export type ItemMedallionProps = {
  kind: ShopItemKind;
  /** Flip to true to play the success bump. */
  celebrate?: boolean;
};

export function ItemMedallion({ kind, celebrate = false }: ItemMedallionProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(reduceMotion ? 1 : feedbackMotion.popFromScale);

  useEffect(() => {
    if (!reduceMotion) scale.set(popAnimation());
  }, [reduceMotion, scale]);

  useEffect(() => {
    if (celebrate && !reduceMotion) scale.set(bumpAnimation());
  }, [celebrate, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const background = kind === 'daily-reward' ? colors.coinBg : shopItemTint(kind, colors);

  return (
    <Animated.View
      aria-hidden
      style={[styles.disc, { backgroundColor: background, borderColor: colors.surface }, animatedStyle]}>
      <ShopItemIcon kind={kind} size={shopMetrics.medallionIcon} />
      {celebrate ? (
        <PopIn style={styles.check}>
          <CheckBadgeIcon size={iconSize.xl} />
        </PopIn>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: shopMetrics.medallion,
    height: shopMetrics.medallion,
    borderRadius: radius.pill,
    borderWidth: spacing.xxs,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    boxShadow: elevation.md,
  },
  check: { position: 'absolute', right: -spacing.xxs, bottom: -spacing.xxs },
});
