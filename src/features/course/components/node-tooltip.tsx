/**
 * "INIZIA DA QUI" / "RIPRENDI DA QUI" — evergreen pill with a caret hanging under the current
 * node, gently bobbing. Tapping it opens the lesson like the node itself.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Play, RotateCcw } from 'lucide-react-native';

import { Icon, iconStroke, PressableScale, Text, useReduceMotion } from '@/components/ui';
import { duration, easing, elevation, radius, spacing, useTheme } from '@/theme';

import { PATH_MOTION, TOOLTIP } from '../constants';
import { COURSE_COPY } from '../copy';
import type { PathNodeLayout } from '../path-layout';

export type NodeTooltipProps = {
  node: PathNodeLayout;
  resume: boolean;
  onPress: () => void;
};

const CARET_PATH = `M0 ${TOOLTIP.caret} L${TOOLTIP.caret} 0 L${TOOLTIP.caret * 2} ${TOOLTIP.caret} Z`;

export function NodeTooltip({ node, resume, onPress }: NodeTooltipProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const bob = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      bob.set(0);
      return;
    }
    bob.set(
      withRepeat(
        withSequence(
          withTiming(PATH_MOTION.bob, { duration: PATH_MOTION.bobHalf, easing: easing.inOut }),
          withTiming(0, { duration: PATH_MOTION.bobHalf, easing: easing.inOut }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(bob);
  }, [reduceMotion, bob]);

  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.get() }] }));
  const label = resume ? COURSE_COPY.resumeHere : COURSE_COPY.startHere;
  const entering = reduceMotion ? undefined : FadeIn.duration(duration.base).easing(easing.enter).delay(duration.slow);

  return (
    <Animated.View
      entering={entering}
      style={[styles.slot, { left: node.x, top: node.y + node.height + TOOLTIP.offset, width: node.width }]}>
      <Animated.View style={[styles.center, bobStyle]}>
        <PressableScale
          onPress={onPress}
          scaleTo="small"
          haptic="light"
          accessibilityLabel={label}
          accessibilityHint={resume ? COURSE_COPY.nodeHint.resume : COURSE_COPY.nodeHint.current}
          style={styles.center}>
          <Svg width={TOOLTIP.caret * 2} height={TOOLTIP.caret} style={styles.caret}>
            <Path d={CARET_PATH} fill={theme.colors.brandSolid} />
          </Svg>
          <View style={[styles.pill, { backgroundColor: theme.colors.brandSolid }]}>
            <Icon icon={resume ? RotateCcw : Play} size="xs" color="accentSolid" fill={resume ? undefined : 'accentSolid'} strokeWidth={iconStroke.bold} />
            <Text variant="labelMd" color="onBrand" style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </PressableScale>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  slot: { position: 'absolute', alignItems: 'center' },
  center: { alignItems: 'center' },
  caret: { marginBottom: -spacing.xxxs / 2 },
  pill: {
    height: TOOLTIP.height,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - spacing.xxxs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    boxShadow: elevation.md,
  },
  label: { textTransform: 'uppercase' },
});
