/**
 * Collapsing course cover: an inset rounded card (220) whose art parallaxes and fades as the
 * path scrolls up under the sticky status row, and stretches when pulled down (iOS bounce).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { CourseCover, isCourseCoverKey } from '@/components/illustrations';
import { uiOpacity } from '@/components/ui';
import type { IllustrationKey } from '@/content/types';
import { elevation, radius, spacing, useTheme } from '@/theme';

import { COVER } from '../constants';

export type CourseCoverHeaderProps = {
  cover: IllustrationKey;
  scrollY: SharedValue<number>;
  accessibilityLabel: string;
  /** Overlay pinned to the cover's top-left corner (e.g. "In arrivo"). */
  badge?: ReactNode;
  /** Dims the art (coming-soon course). */
  dimmed?: boolean;
};

export function CourseCoverHeader({ cover, scrollY, accessibilityLabel, badge, dimmed = false }: CourseCoverHeaderProps) {
  const theme = useTheme();

  const artStyle = useAnimatedStyle(() => {
    const y = scrollY.get();
    // Pull-down: grow from the top edge. Scroll-up: lag behind the card (parallax) and fade.
    const stretch = y < 0 ? 1 + (-y / COVER.height) * COVER.stretch : 1;
    return {
      opacity: interpolate(y, [0, COVER.height], [1, COVER.fadeTo], Extrapolation.CLAMP),
      transform: [
        { translateY: y > 0 ? y * COVER.parallax : y / 2 },
        { scale: stretch },
      ],
    };
  });

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, { backgroundColor: theme.colors.brandSurface }]}>
      <Animated.View style={[StyleSheet.absoluteFill, artStyle]}>
        <View style={[StyleSheet.absoluteFill, dimmed && styles.dimmed]}>
          {isCourseCoverKey(cover) ? <CourseCover variant={cover} width="100%" height="100%" /> : null}
        </View>
      </Animated.View>
      {badge ? <View style={styles.badge}>{badge}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: COVER.height,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    boxShadow: elevation.md,
    marginTop: spacing.xxs,
  },
  dimmed: { opacity: uiOpacity.dimmed },
  badge: { position: 'absolute', top: spacing.md, left: spacing.md },
});
