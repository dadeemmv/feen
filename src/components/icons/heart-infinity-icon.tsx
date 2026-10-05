import { Defs, Path } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { HEART_PATH, HeartDepth, HeartGloss } from './lib/heart-shape';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

const INFINITY =
  'M24 24C21.6 20.8 19.6 19.7 17.6 19.7C15.2 19.7 13.4 21.6 13.4 24C13.4 26.4 15.2 28.3 17.6 28.3' +
  'C19.6 28.3 21.6 27.2 24 24C26.4 20.8 28.4 19.7 30.4 19.7C32.8 19.7 34.6 21.6 34.6 24' +
  'C34.6 26.4 32.8 28.3 30.4 28.3C28.4 28.3 26.4 27.2 24 24Z';

/** Unlimited lives / Pro: gold heart carrying an embossed ∞. */
export function HeartInfinityIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('body');
  const emboss = muted ? illustration.mutedDeep : illustration.kiwiRim;
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.body} stops={twoStops(muted ? gradients.muted : gradients.gold)} from={[0.2, 0]} to={[0.7, 1]} />
      </Defs>
      <Path d={HEART_PATH} fill={paint(ids.body)} />
      <HeartDepth color={emboss} opacity={0.22} />
      <HeartGloss opacity={0.7} />
      <Path d={INFINITY} transform="translate(0 1.2)" stroke={emboss} strokeOpacity={0.55} strokeWidth={3.6} fill="none" />
      <Path d={INFINITY} stroke={illustration.white} strokeWidth={3.4} strokeLinejoin="round" fill="none" />
    </IconSvg>
  );
}
