import { Circle, Ellipse, G, Path } from 'react-native-svg';

import { illustration } from '@/theme';

/** Plump heart on the 48 grid (soft bottom point). */
export const HEART_PATH =
  'M24 41.5C23.2 41.5 22.4 41.2 21.7 40.7C13.5 34.8 5 27.2 5 18C5 11.6 9.9 7 15.6 7' +
  'C19.3 7 22.2 8.9 24 11.9C25.8 8.9 28.7 7 32.4 7C38.1 7 43 11.6 43 18' +
  'C43 27.2 34.5 34.8 26.3 40.7C25.6 41.2 24.8 41.5 24 41.5Z';

const HEART_DEPTH_PATH =
  'M43 18C43 27.2 34.5 34.8 26.3 40.7C25.6 41.2 24.8 41.5 24 41.5C23.2 41.5 22.4 41.2 21.7 40.7' +
  'C30.5 34.5 38.5 27.5 40.2 17.2C40.8 13.5 39.8 10.5 38.4 9C41.3 10.9 43 14.2 43 18Z';

/** Glossy highlight shared by every heart (top-left lobe). */
export function HeartGloss({ opacity = 0.6 }: { opacity?: number }) {
  return (
    <G fill={illustration.white}>
      <Ellipse cx={14.6} cy={15.4} rx={4.6} ry={2.7} transform="rotate(-40 14.6 15.4)" fillOpacity={opacity} />
      <Circle cx={10.6} cy={21.6} r={1.5} fillOpacity={opacity * 0.75} />
    </G>
  );
}

/** Subtle darker crescent on the lower-right to give the heart volume. */
export function HeartDepth({ color, opacity = 0.18 }: { color: string; opacity?: number }) {
  return (
    <Path
      d={HEART_DEPTH_PATH}
      fill={color}
      fillOpacity={opacity}
    />
  );
}
