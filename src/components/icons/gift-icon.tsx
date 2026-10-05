import { Defs, Path, Rect } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

const BOW =
  'M24 16C20.4 10.2 14.6 9.6 14.6 13.1C14.6 15.6 18.8 16.2 24 16Z' +
  'M24 16C27.6 10.2 33.4 9.6 33.4 13.1C33.4 15.6 29.2 16.2 24 16Z';

/** Daily reward / free gift: lime box, evergreen ribbon. */
export function GiftIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('box', 'lid');
  const ribbon = muted ? illustration.mutedDeep : illustration.forest;
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.box} stops={twoStops(muted ? gradients.muted : [illustration.lime, illustration.kiwiFleshDark])} />
        <Linear id={ids.lid} stops={twoStops(muted ? [illustration.mutedLight, gradients.muted[0]] : [illustration.limeLight, illustration.lime])} />
      </Defs>
      <Path d={BOW} fill="none" stroke={ribbon} strokeWidth={3.4} strokeLinejoin="round" />
      <Rect x={9.5} y={22} width={29} height={21} rx={3.5} fill={paint(ids.box)} />
      <Rect x={9.5} y={23.5} width={29} height={2.5} fill={illustration.ink} fillOpacity={0.12} />
      <Rect x={7} y={15.5} width={34} height={8.5} rx={3} fill={paint(ids.lid)} />
      <Rect x={21.2} y={15.5} width={5.6} height={27.5} fill={ribbon} />
      <Rect x={10.5} y={17.6} width={7} height={2.2} rx={1.1} fill={illustration.white} fillOpacity={0.6} />
    </IconSvg>
  );
}
