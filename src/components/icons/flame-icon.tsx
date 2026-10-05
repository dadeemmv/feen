import { Defs, Path } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

/** Outer flame with a small side tongue on the left (48 grid). */
export const FLAME_OUTER =
  'M25.5 3.5C27.2 10.5 38.5 16 38.5 29C38.5 38 32 44.5 24 44.5C16 44.5 9.5 38.5 9.5 30.5' +
  'C9.5 24.5 12.5 20.5 15.5 18C15.5 21.5 17 24 19.5 25C18.5 15.5 21 8.5 25.5 3.5Z';
/** Hot inner core. */
export const FLAME_CORE =
  'M24.5 21C26 26 31.5 28.5 31.5 34.5C31.5 39 28.2 41.5 24 41.5C19.8 41.5 16.5 39 16.5 35' +
  'C16.5 32 18.3 30 20 28.8C20.2 31 21 32.2 22.2 32.8C21.8 28.5 22.5 24.5 24.5 21Z';

/** Streak flame: orange gradient body with a yellow inner core. */
export function FlameIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('outer', 'core');
  const outer = muted ? gradients.muted : gradients.flame;
  const core: readonly [string, string] = muted
    ? [illustration.mutedLight, illustration.white]
    : [gradients.flame[0], illustration.flameCore];

  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.outer} stops={twoStops(outer)} from={[0.3, 0]} to={[0.6, 1]} />
        <Linear id={ids.core} stops={twoStops(core)} from={[0.5, 0]} to={[0.5, 1]} />
      </Defs>
      <Path d={FLAME_OUTER} fill={paint(ids.outer)} />
      <Path d={FLAME_CORE} fill={paint(ids.core)} />
      <Path
        d="M13.6 31.5C13.4 28.5 14.3 26 15.8 24.3"
        stroke={illustration.white}
        strokeOpacity={0.5}
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
      />
    </IconSvg>
  );
}
