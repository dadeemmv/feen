/**
 * Tag — overline pill that labels a step or a card: "🎩 INDOVINA", "⭐ BASE", "BONUS", "PRO".
 * Content tones (butter default, like the video's yellow pill) plus accent/neutral and any
 * semantic tone.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

import { renderIcon, type IconSource } from './icon';
import { iconSize, iconStroke, tagHeight } from './metrics';
import { Text } from './text';
import { resolveTone, type Tone } from './tones';

export type TagProps = {
  label: string;
  /** Emoji glyph before the label. */
  emoji?: string;
  /** Icon before the label (ignored when `emoji` is set). */
  icon?: IconSource;
  /** Default `butter`. */
  tone?: Tone;
  /** Solid fill instead of the soft tint. */
  solid?: boolean;
  /** sm 22 · md 28. Default `md`. */
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

export function Tag({ label, emoji, icon, tone = 'butter', solid = false, size = 'md', style }: TagProps) {
  const theme = useTheme();
  const colors = resolveTone(theme, tone);
  const fg = solid ? colors.onSolid : colors.fg;
  // `tintButter` is tuned for large lesson rows and vanishes on white cards as a small pill;
  // the step pill uses the next amber step (warningBg) so it reads as the video's yellow tag.
  const softBg = tone === 'butter' ? theme.colors.warningBg : colors.bg;
  const glyphSize = size === 'sm' ? iconSize.xs : iconSize.sm;

  return (
    <View
      accessible
      accessibilityLabel={label}
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: solid ? colors.solid : softBg },
        style,
      ]}>
      {renderIcon(emoji ?? icon, { size: glyphSize, color: fg, strokeWidth: iconStroke.bold })}
      <Text variant="overline" style={{ color: fg }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    gap: spacing.xxs + spacing.xxxs,
  },
  sm: { height: tagHeight.sm, paddingHorizontal: spacing.xs },
  md: { height: tagHeight.md, paddingHorizontal: spacing.sm },
});
