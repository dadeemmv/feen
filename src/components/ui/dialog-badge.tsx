/**
 * DialogBadge — the 88pt circle that overlaps a dialog's top edge and pops in with
 * spring.bouncy: a tinted halo holding a solid disc with a check / cross / warning glyph, an
 * emoji, or any custom node.
 */
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Check, TriangleAlert, X } from 'lucide-react-native';

import { duration, elevation, radius, spacing, useTheme } from '@/theme';

import { dialogBadgeSize, iconStroke } from './metrics';
import { feedbackMotion, popAnimation } from './motion-presets';
import { Text } from './text';
import { resolveTone } from './tones';
import { useReduceMotion } from './use-reduce-motion';

export type DialogTone = 'success' | 'danger' | 'warning' | 'neutral';

export type DialogBadgePreset =
  | 'success'
  | 'danger'
  | 'warning'
  | { type: 'emoji'; emoji: string }
  | { type: 'node'; node: ReactNode };

export type DialogBadgeProps = {
  badge: DialogBadgePreset;
  /** Colours the halo (emoji/node badges). Default follows the preset. */
  tone?: DialogTone;
  /** Diameter. Default 88 (`dialogBadgeSize`). */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Disc / glyph / emoji sizes relative to the badge. */
const DISC_RATIO = 0.68;
const GLYPH_RATIO = 0.36;
const EMOJI_RATIO = 0.5;
const EMOJI_LINE_HEIGHT = 1.2;

export function DialogBadge({ badge, tone, size = dialogBadgeSize, style }: DialogBadgeProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(reduceMotion ? 1 : feedbackMotion.popFromScale);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    scale.set(withDelay(duration.fast, popAnimation()));
    opacity.set(withDelay(duration.fast, withTiming(1, { duration: duration.fast })));
  }, [reduceMotion, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get(), transform: [{ scale: scale.get() }] }));

  const presetTone: DialogTone = typeof badge === 'string' ? badge : (tone ?? 'neutral');
  const colors = resolveTone(theme, presetTone === 'neutral' ? 'butter' : presetTone);
  const disc = Math.round(size * DISC_RATIO);
  const glyph = Math.round(size * GLYPH_RATIO);

  let content: ReactNode;
  if (typeof badge === 'string') {
    const Glyph = badge === 'success' ? Check : badge === 'danger' ? X : TriangleAlert;
    content = (
      <View style={[styles.disc, { width: disc, height: disc, backgroundColor: colors.solid }]}>
        <Glyph size={glyph} color={colors.onSolid} strokeWidth={iconStroke.heavy} />
      </View>
    );
  } else if (badge.type === 'emoji') {
    const emojiSize = Math.round(size * EMOJI_RATIO);
    content = (
      <Text style={{ fontSize: emojiSize, lineHeight: Math.round(emojiSize * EMOJI_LINE_HEIGHT) }}>{badge.emoji}</Text>
    );
  } else {
    content = badge.node;
  }

  return (
    <Animated.View
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.halo,
        {
          width: size,
          height: size,
          backgroundColor: colors.bg,
          borderColor: theme.colors.surface,
        },
        animatedStyle,
        style,
      ]}>
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  halo: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: spacing.xxs,
    boxShadow: elevation.md,
  },
  disc: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
