import { Circle, Defs, G, Path, Rect } from 'react-native-svg';

import { Linear } from '@/components/icons/lib/gradients';
import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { linePath, type Pt } from '../lib/chart-geometry';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

const SERIES: readonly Pt[] = [
  [46, 126],
  [70, 112],
  [92, 118],
  [116, 96],
  [138, 102],
  [162, 76],
  [190, 62],
];
const END = SERIES[SERIES.length - 1];

/** Lesson art "stock-chart": a price card with a rising area chart. */
export function StockChartArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'area', 'rim', 'bevel', 'flesh', 'halo');
  const ink = illustration.forest;
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.16} />
        <GlowGradient id={ids.halo} color={illustration.lime} opacity={0.7} />
        <Linear id={ids.area} stops={[[0, illustration.lime, 0.7], [1, illustration.lime, 0]]} />
        <KiwiCoinDefs ids={ids} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={124} cy={160} rx={96} ry={8} />

      {/* card */}
      <Rect x={32} y={24} width={180} height={128} rx={18} fill={illustration.ink} fillOpacity={0.06} transform="translate(0 4)" />
      <Rect x={32} y={24} width={180} height={128} rx={18} fill={illustration.white} stroke={illustration.forestLight} strokeWidth={1.2} />
      <Circle cx={52} cy={44} r={7} fill={illustration.lime} />
      <Rect x={64} y={38} width={34} height={5} rx={2.5} fill={ink} fillOpacity={0.8} />
      <Rect x={64} y={46} width={22} height={4} rx={2} fill={ink} fillOpacity={0.3} />
      <G>
        <Rect x={160} y={36} width={38} height={16} rx={8} fill={illustration.limeLight} />
        <Path d="M169 47L175 41L181 47M175 41V49" stroke={ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(-2 -1)" />
        <Rect x={181} y={42} width={11} height={4} rx={2} fill={ink} fillOpacity={0.7} />
      </G>
      <Path d="M46 76H198M46 101H198M46 126H198" stroke={illustration.forestLight} strokeWidth={1} strokeDasharray="3 4" />

      <Path d={linePath(SERIES, 140)} fill={paint(ids.area)} />
      <Path d={linePath(SERIES)} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <Circle cx={END[0]} cy={END[1]} r={14} fill={paint(ids.halo)} />
      <Circle cx={END[0]} cy={END[1]} r={5.5} fill={illustration.lime} stroke={ink} strokeWidth={2.5} />

      <KiwiCoin ids={ids} transform="translate(206 138) rotate(-10) scale(17)" />
      <Sparkle x={24} y={84} r={7} color={illustration.gold} />
      <Sparkle x={222} y={20} r={6} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
