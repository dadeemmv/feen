import type { ReactNode } from 'react';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';
import Svg from 'react-native-svg';

/** Props shared by every economy icon. */
export type IconProps = {
  /** Rendered width & height in points (icons are square). Default 24. */
  size?: number;
  /** Greyscale "locked / unavailable" rendering. */
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
  /** When set the icon is announced as an image; otherwise it is decorative (hidden). */
  accessibilityLabel?: string;
};

/** Every icon is drawn on a 48×48 grid. */
export const ICON_GRID = 48;
const VIEW_BOX = `0 0 ${ICON_GRID} ${ICON_GRID}`;

/**
 * Accessibility props that are valid on both platforms. react-native-svg forwards unknown props
 * to the DOM on web, so RN-only props (`accessible`, `accessibilityLabel`) must not reach it.
 */
export function svgA11y(label?: string) {
  if (Platform.OS === 'web') {
    return label ? ({ role: 'img', 'aria-label': label } as const) : ({ 'aria-hidden': true } as const);
  }
  return label
    ? ({ accessible: true, accessibilityLabel: label, accessibilityRole: 'image' } as const)
    : ({ accessible: false, importantForAccessibility: 'no-hide-descendants' } as const);
}

type IconSvgProps = Omit<IconProps, 'muted'> & { children: ReactNode; viewBox?: string };

export function IconSvg({ size = 24, style, accessibilityLabel, viewBox = VIEW_BOX, children }: IconSvgProps) {
  return (
    <Svg width={size} height={size} viewBox={viewBox} style={style} {...svgA11y(accessibilityLabel)}>
      {children}
    </Svg>
  );
}
