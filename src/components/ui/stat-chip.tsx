/**
 * StatChip — the economy counters in the status row (streak 🔥, lives ❤️, kiwi coins).
 * White hairline pill, tabular value that rolls on change, the whole chip bumps
 * (1 → 1.18 → 1, spring.bouncy) and shakes horizontally when the value drops (life lost).
 *
 * Pass the economy SVG icon from `@/components/icons` through `icon`; a Lucide glyph is used as a
 * fallback so the chip works standalone.
 */
import { useEffect, useRef, useEffectEvent, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Circle, Flame, Heart, Infinity as InfinityIcon } from 'lucide-react-native';

import { gradients, useTheme } from '@/theme';

import { Chip } from './chip';
import { iconSize, iconStroke, uiOpacity } from './metrics';
import { bumpAnimation, shakeAnimation } from './motion-presets';
import { RollingNumber } from './rolling-number';
import { useReduceMotion } from './use-reduce-motion';

export type StatKind = 'streak' | 'lives' | 'coins';

export type StatChipProps = {
  kind: StatKind;
  value: number;
  onPress?: () => void;
  /** Lives only: shows ∞ with a gold heart (Pro / unlimited hour). */
  unlimited?: boolean;
  /** Economy icon node (e.g. `<FlameIcon size={20} />`). Defaults to a Lucide glyph. */
  icon?: ReactNode;
  /** Grey icon (inactive streak). Default: streak with value 0. */
  muted?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_LABEL: Record<StatKind, (value: number) => string> = {
  streak: (v) => (v === 1 ? '1 giorno di fila' : `${v} giorni di fila`),
  lives: (v) => (v === 1 ? '1 vita' : `${v} vite`),
  coins: (v) => `${v} kiwi`,
};

export function StatChip({ kind, value, onPress, unlimited = false, icon, muted, accessibilityLabel, style }: StatChipProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const previous = useRef(value);
  const isUnlimited = kind === 'lives' && unlimited;
  const isMuted = muted ?? (kind === 'streak' && value === 0);

  const onValueChange = useEffectEvent((before: number, after: number) => {
    if (reduceMotion) return;
    cancelAnimation(scale);
    scale.set(bumpAnimation());
    if (after < before) {
      cancelAnimation(offsetX);
      offsetX.set(shakeAnimation());
    }
  });

  useEffect(() => {
    const before = previous.current;
    previous.current = value;
    if (before !== value) onValueChange(before, value);
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.get() }, { scale: scale.get() }],
  }));

  const fallbackIcon = (() => {
    const size = iconSize.md;
    const stroke = iconStroke.regular;
    if (isMuted) {
      const Glyph = kind === 'streak' ? Flame : kind === 'lives' ? Heart : Circle;
      return <Glyph size={size} color={theme.colors.textTertiary} fill={theme.colors.fill} strokeWidth={stroke} />;
    }
    switch (kind) {
      case 'streak':
        return <Flame size={size} color={theme.colors.streak} fill={gradients.flame[0]} strokeWidth={stroke} />;
      case 'lives':
        return isUnlimited ? (
          <Heart size={size} color={gradients.gold[1]} fill={gradients.gold[0]} strokeWidth={stroke} />
        ) : (
          <Heart size={size} color={theme.colors.lives} fill={gradients.heart[0]} strokeWidth={stroke} />
        );
      case 'coins':
        return <Circle size={size} color={theme.colors.coin} fill={gradients.gold[0]} strokeWidth={stroke} />;
    }
  })();

  const label =
    accessibilityLabel ?? (isUnlimited ? 'Vite illimitate' : DEFAULT_LABEL[kind](value));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Chip
        variant="surface"
        onPress={onPress}
        haptic="selection"
        accessibilityLabel={label}
        style={styles.chip}>
        {isUnlimited ? (
          <InfinityIcon size={iconSize.md} color={theme.colors.text} strokeWidth={iconStroke.bold} />
        ) : (
          <RollingNumber value={value} />
        )}
        <View style={isMuted && icon ? styles.mutedIcon : undefined}>{icon ?? fallbackIcon}</View>
      </Chip>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'auto' },
  mutedIcon: { opacity: uiOpacity.mutedIcon },
});
