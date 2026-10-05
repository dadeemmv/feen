/**
 * Spotlight — soft radial lime light falling from the top edge (hero cards, streak header).
 * SVG RadialGradient so it renders identically on iOS, Android and web. Place it inside a
 * clipped container; it fills its parent and ignores touches.
 */
import { useId } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { gradients } from '@/theme';

export type SpotlightProps = {
  /** Light centre as fractions of the box. Default top-centre `{ x: 0.5, y: 0 }`. */
  origin?: { x: number; y: number };
  /** Horizontal / vertical reach as fractions of the box. Default `{ x: 0.8, y: 0.9 }`. */
  reach?: { x: number; y: number };
  /** Two colour stops (inner → outer). Default `gradients.heroSpotlight`. */
  colors?: readonly [string, string];
  style?: StyleProp<ViewStyle>;
};

const pct = (value: number) => `${Math.round(value * 100)}%`;

export function Spotlight({
  origin = { x: 0.5, y: 0 },
  reach = { x: 0.8, y: 0.9 },
  colors = gradients.heroSpotlight,
  style,
}: SpotlightProps) {
  const id = `spot-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <View style={[StyleSheet.absoluteFill, styles.noTouch, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient
            id={id}
            cx={pct(origin.x)}
            cy={pct(origin.y)}
            fx={pct(origin.x)}
            fy={pct(origin.y)}
            rx={pct(reach.x)}
            ry={pct(reach.y)}
            gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  noTouch: { pointerEvents: 'none' },
});
