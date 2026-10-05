import { Path, Polygon } from 'react-native-svg';

import { Linear } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';

import { arrowHead, linePath, type Pt } from '../lib/chart-geometry';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';
import { CoinStack, CoinStackDefs } from '../parts/coin-stack';
import { Sprout, SproutDefs } from '../parts/sprout';
import { CoverFrame, coverInk, type CourseCoverProps } from './cover-frame';

const CHART: readonly Pt[] = [
  [-4, 150],
  [40, 138],
  [78, 146],
  [116, 116],
  [152, 124],
  [190, 90],
  [226, 98],
  [262, 62],
  [292, 50],
];
const TIP: Pt = [304, 45];

/** "Fai il tuo primo investimento": a sprout growing out of a stack of kiwi coins, rising chart behind. */
export function FirstInvestmentCover({ background = 'brand', ...props }: CourseCoverProps) {
  const ids = useSvgIds('area', 'shadow', 'edge', 'face', 'flesh', 'leaf');
  const ink = coverInk[background];
  return (
    <CoverFrame
      background={background}
      {...props}
      defs={
        <>
          <Linear id={ids.area} stops={[[0, ink.line, 0.24], [0.8, ink.line, 0]]} />
          <GlowGradient id={ids.shadow} color={ink.shadow} opacity={ink.shadowOpacity} />
          <CoinStackDefs ids={ids} />
          <SproutDefs leafId={ids.leaf} />
        </>
      }
    >
      <Path d={linePath([...CHART, TIP], 180)} fill={paint(ids.area)} />
      <Path d={linePath([...CHART, TIP])} stroke={ink.line} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <Polygon points={arrowHead(CHART[CHART.length - 1], [TIP[0] + 6, TIP[1] - 2], 14, 8)} fill={ink.line} strokeLinejoin="round" stroke={ink.line} strokeWidth={2} />

      <SoftEllipse id={ids.shadow} cx={148} cy={166} rx={112} ry={10} />
      <CoinStack ids={ids} cx={88} baseY={166} r={22} count={2} />
      <CoinStack ids={ids} cx={206} baseY={167} r={26} count={3} />
      <CoinStack ids={ids} cx={146} baseY={168} r={30} count={5} />
      <Sprout leafId={ids.leaf} transform="translate(146 118) scale(1.25)" />

      <Sparkle x={58} y={58} r={9} color={ink.sparkle} />
      <Sparkle x={236} y={34} r={5} color={ink.sparkle} opacity={0.8} />
      <Sparkle x={262} y={124} r={6} color={ink.line} />
    </CoverFrame>
  );
}
