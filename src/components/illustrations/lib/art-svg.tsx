import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { type NumberProp } from 'react-native-svg';

import { svgA11y } from '@/components/icons/lib/icon-svg';

/** Props shared by every illustration. */
export type IllustrationProps = {
  /** Rendered width (points or percentage). Defaults to the artwork's natural width. */
  width?: NumberProp;
  /** Rendered height. When omitted and `width` is a number, it follows the aspect ratio. */
  height?: NumberProp;
  style?: StyleProp<ViewStyle>;
  /** When set the artwork is announced as an image; otherwise it is decorative. */
  accessibilityLabel?: string;
};

type ArtSvgProps = IllustrationProps & {
  /** Natural artboard size [width, height] in viewBox units. */
  size: readonly [number, number];
  /** 'meet' (default) letterboxes; 'slice' fills the box and crops (covers, patterns). */
  fit?: 'meet' | 'slice';
  /** Top-left of the visible window in artboard units, to frame a crop of a larger artwork. Default [0, 0]. */
  origin?: readonly [number, number];
  children: ReactNode;
};

/** Resolve the rendered size from the artboard aspect ratio. */
export function resolveArtSize(size: readonly [number, number], width?: NumberProp, height?: NumberProp) {
  const [w, h] = size;
  if (width === undefined && height === undefined) return { width: w, height: h };
  if (height === undefined) return { width, height: typeof width === 'number' ? (width * h) / w : '100%' };
  if (width === undefined) return { width: typeof height === 'number' ? (height * w) / h : '100%', height };
  return { width, height };
}

export function ArtSvg({ size, fit = 'meet', origin = [0, 0], width, height, style, accessibilityLabel, children }: ArtSvgProps) {
  const resolved = resolveArtSize(size, width, height);
  return (
    <Svg
      width={resolved.width}
      height={resolved.height}
      viewBox={`${origin[0]} ${origin[1]} ${size[0]} ${size[1]}`}
      preserveAspectRatio={`xMidYMid ${fit}`}
      style={style}
      {...svgA11y(accessibilityLabel)}
    >
      {children}
    </Svg>
  );
}

/** Standard artboards. */
export const ART = {
  /** Lesson / spot illustrations (4:3). */
  spot: [240, 180],
  /** Course covers (16:9, rendered with `fit="slice"`). */
  cover: [320, 180],
} as const;
