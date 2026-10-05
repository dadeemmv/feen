import { G, Path, Polygon } from 'react-native-svg';

import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients } from '@/theme';

import { arrowHead, type Pt } from '../lib/chart-geometry';
import { Sparkle } from '../parts/basics';
import { Candles, type Candle } from '../parts/candles';
import { CoverFrame, coverInk, type CourseCoverProps } from './cover-frame';

const CANDLES: readonly Candle[] = [
  [64, 148, 126, 120, 154],
  [96, 126, 144, 120, 150],
  [128, 144, 104, 94, 148],
  [160, 104, 122, 98, 128],
  [192, 122, 80, 70, 126],
  [224, 80, 98, 74, 104],
  [256, 98, 50, 40, 102],
];
const ARROW = 'M34 158C118 158 196 124 272 58';
const ARROW_FROM: Pt = [264, 65];
const ARROW_TIP: Pt = [290, 40];

/** "Investi in azioni": candlestick chart with a bold upward arrow. */
export function StocksCover({ background = 'brand', ...props }: CourseCoverProps) {
  const ids = useSvgIds('arrow', 'rim', 'bevel', 'flesh');
  const ink = coverInk[background];
  return (
    <CoverFrame
      background={background}
      {...props}
      defs={
        <>
          <Linear id={ids.arrow} stops={twoStops(gradients.gold)} from={[0, 1]} to={[1, 0]} />
          <KiwiCoinDefs ids={ids} />
        </>
      }
    >
      <Path d="M40 164H280" stroke={ink.grid} strokeOpacity={ink.gridOpacity * 2} strokeWidth={1.5} strokeLinecap="round" />
      <Path d={ARROW} stroke={paint(ids.arrow)} strokeWidth={10} strokeLinecap="round" fill="none" />
      <Polygon points={arrowHead(ARROW_FROM, ARROW_TIP, 26, 16)} fill={gradients.gold[0]} stroke={gradients.gold[0]} strokeWidth={3} strokeLinejoin="round" />
      {/* halo keeps the candles readable where they cross the arrow */}
      <G stroke={ink.halo} strokeWidth={4} strokeLinejoin="round">
        <Candles data={CANDLES} width={20} up={ink.halo} down={ink.halo} />
      </G>
      <Candles data={CANDLES} width={20} up={ink.line} />

      <KiwiCoin ids={ids} transform="translate(292 136) rotate(-12) scale(17)" />
      <Sparkle x={48} y={54} r={8} color={ink.sparkle} />
      <Sparkle x={196} y={34} r={5} color={ink.line} />
    </CoverFrame>
  );
}
