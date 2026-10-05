import { Defs, Path } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

const BOLT =
  'M28.2 3.6L10.6 26.6C10 27.4 10.6 28.6 11.6 28.6H22L18.9 42.6C18.6 44 20.4 44.8 21.2 43.6' +
  'L37.4 20.8C38 20 37.4 18.8 36.4 18.8H26L30 5.4C30.4 4 29.1 2.9 28.2 3.6Z';
/** Upper-left facet, lighter. */
const BOLT_FACET = 'M28.2 3.6L10.6 26.6C10 27.4 10.6 28.6 11.6 28.6H22L26 18.8Z';

/** XP bolt. */
export function BoltIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('body');
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.body} stops={twoStops(muted ? gradients.muted : gradients.gold)} from={[0.3, 0]} to={[0.7, 1]} />
      </Defs>
      <Path d={BOLT} fill={paint(ids.body)} />
      <Path d={BOLT_FACET} fill={illustration.white} fillOpacity={0.3} />
      <Path d={BOLT} fill="none" stroke={muted ? illustration.mutedDeep : illustration.goldDeep} strokeOpacity={0.35} strokeWidth={1} />
    </IconSvg>
  );
}
