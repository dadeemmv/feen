/**
 * Icon helpers. Every primitive that takes an icon accepts an `IconSource`:
 * - a Lucide component (`House`) → rendered with themed colour/size/stroke,
 * - a React element (`<FlameIcon size={20} />` from `@/components/icons`) → rendered as-is,
 * - a string → treated as an emoji glyph sized like an icon.
 */
import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme, type ColorToken } from '@/theme';

import { iconSize, iconStroke, type IconSizeToken } from './metrics';
import { Text } from './text';

export type IconSource = LucideIcon | ReactElement | string;

/** Emoji glyphs need a little extra line height to avoid clipping. */
const EMOJI_LINE_HEIGHT = 1.25;

export type IconProps = {
  icon: LucideIcon;
  size?: IconSizeToken | number;
  color?: ColorToken;
  /** Fill colour token (Lucide icons are outline by default). */
  fill?: ColorToken;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
};

export function resolveIconSize(size: IconSizeToken | number): number {
  return typeof size === 'number' ? size : iconSize[size];
}

/** Themed Lucide icon: `<Icon icon={Share} size="md" color="textSecondary" />`. */
export function Icon({ icon: IconComponent, size = 'lg', color = 'text', fill, strokeWidth, style }: IconProps) {
  const theme = useTheme();
  return (
    <IconComponent
      size={resolveIconSize(size)}
      color={theme.colors[color]}
      fill={fill ? theme.colors[fill] : 'none'}
      strokeWidth={strokeWidth ?? iconStroke.regular}
      style={style}
    />
  );
}

type RenderIconOptions = { size: number; color: string; strokeWidth?: number; fill?: string };

/** Render any `IconSource` with resolved (already themed) size/colour. */
export function renderIcon(source: IconSource | null | undefined, options: RenderIconOptions): ReactNode {
  if (source == null) return null;
  if (typeof source === 'string') {
    return (
      <Text
        style={[styles.emoji, { fontSize: options.size, lineHeight: Math.round(options.size * EMOJI_LINE_HEIGHT) }]}
        accessible={false}>
        {source}
      </Text>
    );
  }
  if (isValidElement(source)) return source;
  const IconComponent = source;
  return (
    <IconComponent
      size={options.size}
      color={options.color}
      fill={options.fill ?? 'none'}
      strokeWidth={options.strokeWidth ?? iconStroke.regular}
    />
  );
}

const styles = StyleSheet.create({
  emoji: { textAlign: 'center' },
});
