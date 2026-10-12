import { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

/**
 * The village's currency: a brick in isometric view, light from the left like the buildings.
 * Bricks are earned only by learning and buy houses, trees and squares — never knowledge.
 */
export function BrickIcon({ muted, size = 24, ...rest }: IconProps) {
  const ids = useSvgIds('top', 'left', 'right');
  const [top, left, right, mortar] = muted
    ? ['#D9D9D9', '#BDBDBD', '#9E9E9E', '#8A8A8A']
    : ['#F2946A', '#E0703F', '#B4512A', '#9A4322'];
  return (
    <IconSvg size={size} {...rest}>
      <Defs>
        <LinearGradient id={ids.top} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.35} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id={ids.left} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0.08} />
        </LinearGradient>
        <LinearGradient id={ids.right} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.04} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0.18} />
        </LinearGradient>
      </Defs>
      {/* Top, left and right faces of a 2:1 isometric brick. */}
      <Path d="M6 19 L26 9 L42 17 L22 27 Z" fill={top} />
      <Path d="M6 19 L26 9 L42 17 L22 27 Z" fill={paint(ids.top)} />
      <Path d="M6 19 L22 27 L22 39 L6 31 Z" fill={left} />
      <Path d="M6 19 L22 27 L22 39 L6 31 Z" fill={paint(ids.left)} />
      <Path d="M22 27 L42 17 L42 29 L22 39 Z" fill={right} />
      <Path d="M22 27 L42 17 L42 29 L22 39 Z" fill={paint(ids.right)} />
      {/* Two frogs on top, like a real brick. */}
      <Path d="M15 18.5 L19 16.5 L23 18.5 L19 20.5 Z" fill={mortar} opacity={0.35} />
      <Path d="M25 13.5 L29 11.5 L33 13.5 L29 15.5 Z" fill={mortar} opacity={0.35} />
    </IconSvg>
  );
}
