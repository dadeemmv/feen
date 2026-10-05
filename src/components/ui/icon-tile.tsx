/**
 * IconTile — tinted rounded square holding an icon or an emoji: leading glyph of list rows
 * (Account menu), shop cards, info rows. The art direction replaces bare emoji with these tiles.
 */
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, useTheme } from '@/theme';

import { renderIcon, type IconSource } from './icon';
import { iconSize, iconStroke, tileSize } from './metrics';
import { resolveTone, type Tone } from './tones';

export type IconTileSize = keyof typeof tileSize;

export type IconTileProps = {
  /** Lucide component, element, or emoji string. */
  icon?: IconSource;
  /** Shorthand for an emoji glyph. */
  emoji?: string;
  /** Default `brand`. */
  tone?: Tone;
  /** sm 32 · md 40 · lg 48 · xl 56. Default `md`. */
  size?: IconTileSize;
  /** Solid fill with contrasting glyph. */
  solid?: boolean;
  /** Circle instead of rounded square. */
  round?: boolean;
  style?: StyleProp<ViewStyle>;
};

const GLYPH: Record<IconTileSize, number> = { sm: iconSize.sm, md: iconSize.md, lg: iconSize.lg, xl: iconSize.xl };
const EMOJI_SCALE = 1.1;
const CORNER: Record<IconTileSize, number> = { sm: radius.sm, md: radius.md, lg: radius.md, xl: radius.lg };

export function IconTile({ icon, emoji, tone = 'brand', size = 'md', solid = false, round = false, style }: IconTileProps) {
  const theme = useTheme();
  const colors = resolveTone(theme, tone);
  const dimension = tileSize[size];
  const source = emoji ?? icon;
  const glyph = typeof source === 'string' ? Math.round(GLYPH[size] * EMOJI_SCALE) : GLYPH[size];

  return (
    <View
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: round ? radius.pill : CORNER[size],
          backgroundColor: solid ? colors.solid : colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      {renderIcon(source, { size: glyph, color: solid ? colors.onSolid : colors.fg, strokeWidth: iconStroke.regular })}
    </View>
  );
}

/** Emoji-first alias: `<EmojiTile emoji="📚" tone="mint" />`. */
export function EmojiTile(props: Omit<IconTileProps, 'icon'> & { emoji: string }) {
  return <IconTile {...props} />;
}
