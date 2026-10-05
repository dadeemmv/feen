import { Defs, Path } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { HEART_PATH, HeartDepth, HeartGloss } from './lib/heart-shape';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

/** Lives: rose heart with a glossy highlight. */
export function HeartIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('body');
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.body} stops={twoStops(muted ? gradients.muted : gradients.heart)} from={[0.2, 0]} to={[0.7, 1]} />
      </Defs>
      <Path d={HEART_PATH} fill={paint(ids.body)} />
      <HeartDepth color={illustration.ink} opacity={muted ? 0.08 : 0.12} />
      <HeartGloss />
    </IconSvg>
  );
}
