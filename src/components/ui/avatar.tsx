/**
 * Avatar — circle with an emoji (🤠) or initials. `ring` wraps it in a StoryRing:
 * lime→mint gradient when unseen, neutral grey when seen (Home stories row).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { gradients, radius, useTheme, type ColorToken, type TextVariant } from '@/theme';

import { avatarSize, borderWidth } from './metrics';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { resolveTone, type Tone } from './tones';

export type AvatarSize = keyof typeof avatarSize;

export type AvatarProps = {
  emoji?: string;
  /** Used for initials when no emoji ("Alberto Rossi" → "AR"). */
  name?: string;
  /** xs 28 · sm 36 · md 44 · lg 64 · xl 88, or a number. Default `md`. */
  size?: AvatarSize | number;
  /** Background tint. Default `accent`. */
  tone?: Tone;
  /** Story ring state. */
  ring?: 'unseen' | 'seen';
  /** Colour between ring and avatar (match the surface below). Default `background`. */
  ringGapColor?: ColorToken;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Emoji glyph size and line height relative to the avatar diameter. */
const EMOJI_RATIO = 0.55;
const EMOJI_LINE_HEIGHT = 1.2;

function initialsOf(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0]?.[0]];
  return letters.join('').toUpperCase();
}

function initialsVariant(diameter: number): TextVariant {
  if (diameter <= avatarSize.sm) return 'labelMd';
  if (diameter <= avatarSize.md) return 'labelLg';
  if (diameter <= avatarSize.lg) return 'titleLg';
  return 'displaySm';
}

export function Avatar({
  emoji,
  name,
  size = 'md',
  tone = 'accent',
  ring,
  ringGapColor = 'background',
  onPress,
  accessibilityLabel,
  style,
}: AvatarProps) {
  const theme = useTheme();
  const diameter = typeof size === 'number' ? size : avatarSize[size];
  const colors = resolveTone(theme, tone);
  const emojiSize = Math.round(diameter * EMOJI_RATIO);

  const face = (
    <View
      style={[
        styles.face,
        { width: diameter, height: diameter, backgroundColor: colors.bg },
      ]}>
      {emoji ? (
        <Text style={{ fontSize: emojiSize, lineHeight: Math.round(emojiSize * EMOJI_LINE_HEIGHT) }} accessible={false}>
          {emoji}
        </Text>
      ) : (
        <Text variant={initialsVariant(diameter)} style={{ color: colors.fg }} accessible={false}>
          {initialsOf(name)}
        </Text>
      )}
    </View>
  );

  const content = ring ? (
    <StoryRing seen={ring === 'seen'} size={diameter} gapColor={ringGapColor}>
      {face}
    </StoryRing>
  ) : (
    face
  );

  const label = accessibilityLabel ?? name ?? 'Profilo';
  if (onPress) {
    return (
      <PressableScale onPress={onPress} scaleTo="small" haptic="selection" accessibilityLabel={label} style={style}>
        {content}
      </PressableScale>
    );
  }
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={style}>
      {content}
    </View>
  );
}

export type StoryRingProps = {
  children: ReactNode;
  /** Grey ring when the story has been seen. */
  seen?: boolean;
  /** Diameter of the content inside the ring. */
  size: number;
  /** Ring stroke. Default `borderWidth.ring`. */
  thickness?: number;
  /** Space between ring and content. Default `borderWidth.ring`. */
  gap?: number;
  /** Colour of that space. Default `background`. */
  gapColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};

export function StoryRing({
  children,
  seen = false,
  size,
  thickness = borderWidth.ring,
  gap = borderWidth.ring,
  gapColor = 'background',
  style,
}: StoryRingProps) {
  const theme = useTheme();
  const outer = size + (thickness + gap) * 2;

  return (
    <View style={[styles.ring, { width: outer, height: outer }, style]}>
      {seen ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.border }]} />
      ) : (
        <LinearGradient
          colors={gradients.storyRing}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View
        style={[
          styles.gap,
          { top: thickness, left: thickness, right: thickness, bottom: thickness },
          { backgroundColor: theme.colors[gapColor] },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  face: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  ring: { borderRadius: radius.pill, overflow: 'hidden' },
  gap: { position: 'absolute', borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
