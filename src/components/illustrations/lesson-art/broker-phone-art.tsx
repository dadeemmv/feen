import { Circle, Defs, G, Path, Rect } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { linePath, type Pt } from '../lib/chart-geometry';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

const SERIES: readonly Pt[] = [
  [88, 104],
  [100, 96],
  [110, 100],
  [122, 86],
  [134, 90],
  [150, 72],
];

/** Lesson art "broker-phone": a phone running a trading app (buy/sell, live chart). */
export function BrokerPhoneArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'body', 'area', 'up', 'rim', 'bevel', 'flesh');
  const ink = illustration.forest;
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <Linear id={ids.body} stops={twoStops(gradients.hero)} from={[0, 0]} to={[1, 1]} />
        <Linear id={ids.area} stops={[[0, illustration.lime, 0.75], [1, illustration.lime, 0]]} />
        <Linear id={ids.up} stops={twoStops(gradients.accent)} />
        <KiwiCoinDefs ids={ids} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={120} cy={170} rx={64} ry={6} />

      {/* phone */}
      <Rect x={74} y={10} width={92} height={158} rx={18} fill={paint(ids.body)} />
      <Rect x={80} y={16} width={80} height={146} rx={13} fill={illustration.paper} />
      <Rect x={106} y={21} width={28} height={7} rx={3.5} fill={illustration.forestDeep} />
      <Rect x={88} y={38} width={30} height={4} rx={2} fill={ink} fillOpacity={0.35} />
      <Rect x={88} y={46} width={46} height={8} rx={4} fill={ink} fillOpacity={0.9} />
      <Rect x={138} y={46} width={16} height={8} rx={4} fill={illustration.limeLight} />
      <Path d={linePath(SERIES, 114)} fill={paint(ids.area)} />
      <Path d={linePath(SERIES)} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <Circle cx={150} cy={72} r={3.5} fill={illustration.lime} stroke={ink} strokeWidth={2} />
      <G>
        <Rect x={88} y={122} width={64} height={8} rx={4} fill={ink} fillOpacity={0.08} />
        <Rect x={88} y={136} width={31} height={16} rx={8} fill={illustration.lime} />
        <Rect x={98} y={142} width={11} height={4} rx={2} fill={illustration.forestDeep} />
        <Rect x={121} y={136} width={31} height={16} rx={8} fill={illustration.white} stroke={illustration.red} strokeWidth={1.5} />
        <Rect x={131} y={142} width={11} height={4} rx={2} fill={illustration.red} />
      </G>
      <Rect x={84} y={20} width={10} height={60} rx={5} fill={illustration.white} fillOpacity={0.35} />

      {/* floating badges */}
      <G>
        <Circle cx={50} cy={70} r={18} fill={paint(ids.up)} />
        <Path d="M42 76L50 66L58 76M50 66V80" stroke={illustration.forestDeep} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(0 -2)" />
      </G>
      <KiwiCoin ids={ids} transform="translate(192 52) rotate(12) scale(17)" />
      <Sparkle x={196} y={112} r={8} color={illustration.gold} />
      <Sparkle x={40} y={124} r={6} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
