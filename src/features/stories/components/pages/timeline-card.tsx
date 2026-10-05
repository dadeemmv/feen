/**
 * One step of the "CHI SIAMO??" timeline: a white card (radius lg, padding md) with centred
 * `bodyLg` text where the emphasis words are extra-bold, and an optional emoji sticker (or the
 * Finanz logo tile for `STORY_BRAND_MARK`) overlapping one corner, landing with a little pop.
 */
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { FinanzLogo } from '@/components/icons';
import { Text } from '@/components/ui';
import { STORY_BRAND_MARK } from '@/content/stories';
import { ColorModeProvider, elevation, radius, spacing, useTheme } from '@/theme';

import { splitEmphasis } from '../../lib/story-pages';
import { useStickerPop } from '../../lib/use-sticker-pop';
import { storyMetrics } from '../../metrics';

export type StickerCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type TimelineCardProps = {
  text: string;
  emphasis?: string[];
  emoji?: string;
  corner: StickerCorner;
  /** Landing delay of the emoji sticker (ms). */
  stickerDelay: number;
  compact: boolean;
};

export function TimelineCard(props: TimelineCardProps) {
  // Cards are white paper on the evergreen page: light tokens inside.
  return (
    <ColorModeProvider mode="light">
      <TimelineCardBody {...props} />
    </ColorModeProvider>
  );
}

function TimelineCardBody({ text, emphasis, emoji, corner, stickerDelay, compact }: TimelineCardProps) {
  const { colors } = useTheme();
  const variant = compact ? 'bodyMd' : 'bodyLg';
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text variant={variant} color="brandText" align="center">
        {splitEmphasis(text, emphasis).map((run, index) =>
          run.bold ? (
            <Text key={index} variant={variant} color="brandText" weight="extraBold">
              {run.text}
            </Text>
          ) : (
            run.text
          ),
        )}
      </Text>
      {emoji ? <EmojiSticker emoji={emoji} corner={corner} delay={stickerDelay} /> : null}
    </View>
  );
}

const SIZE = storyMetrics.stickerEmoji;
const OUTSIDE = -SIZE * storyMetrics.emojiOverlap;

const CORNER_STYLE: Record<StickerCorner, { top?: number; bottom?: number; left?: number; right?: number }> = {
  'top-left': { top: OUTSIDE, left: OUTSIDE },
  'top-right': { top: OUTSIDE, right: OUTSIDE },
  'bottom-left': { bottom: OUTSIDE, left: OUTSIDE },
  'bottom-right': { bottom: OUTSIDE, right: OUTSIDE },
};

function EmojiSticker({ emoji, corner, delay }: { emoji: string; corner: StickerCorner; delay: number }) {
  // Lean outwards: left corners tilt counter-clockwise, right corners clockwise.
  const tilt = corner.endsWith('left') ? -storyMetrics.emojiTilt : storyMetrics.emojiTilt;
  const popStyle = useStickerPop(tilt, delay);
  return (
    <Animated.View style={[styles.sticker, CORNER_STYLE[corner], popStyle]} aria-hidden>
      {emoji === STORY_BRAND_MARK ? (
        <FinanzLogo size={SIZE} />
      ) : (
        <Text variant="displayMd" style={styles.emoji}>
          {emoji}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    boxShadow: elevation.lg,
  },
  sticker: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  // Emoji glyphs carry their own colour; the display line height would clip them.
  emoji: { lineHeight: SIZE + spacing.xxs },
});
