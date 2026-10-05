/**
 * Sticker — the tilted "magazine" label slapped on a story (redlines: rotated −6°…−10°, radius
 * lg, solid tint, `titleSm` white). It lands with a bouncy pop after the content it decorates.
 * Ignores touches, so the poll option under it stays tappable.
 */
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { elevation, radius, spacing, useTheme } from '@/theme';

import { useStickerPop } from '../lib/use-sticker-pop';

export type StickerTone = 'mint' | 'lime';

export type StickerProps = {
  text: string;
  /** Rotation in degrees (negative = counter-clockwise). */
  tilt: number;
  /** `mint` = deep teal on mint stories, `lime` = lime on evergreen stories. */
  tone?: StickerTone;
  /** Delay before the pop (ms). */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function Sticker({ text, tilt, tone = 'mint', delay = 0, style }: StickerProps) {
  const { colors } = useTheme();
  const popStyle = useStickerPop(tilt, delay);
  const background = tone === 'mint' ? colors.tintMintText : colors.accentSolid;
  return (
    <Animated.View style={[styles.sticker, { backgroundColor: background }, popStyle, style]}>
      <Text variant="titleSm" align="center" color={tone === 'mint' ? 'textInverse' : 'onAccent'}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sticker: {
    pointerEvents: 'none',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    boxShadow: elevation.md,
  },
});
