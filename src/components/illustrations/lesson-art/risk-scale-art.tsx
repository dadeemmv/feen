import { Circle, Defs, G, Path, Rect } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';
import { CoinStack, CoinStackDefs } from '../parts/coin-stack';

/** Beam pivots at (120, 58) tilted -7°: ends land at these points. */
const LEFT_END = [40.6, 67.7] as const;
const RIGHT_END = [199.4, 48.3] as const;
/** Pan bowl on a local grid centred on its rim (width 60). */
const PAN = 'M-30 0H30C28 12 16 18 0 18C-16 18 -28 12 -30 0Z';
const WARNING = 'M0 -30C2 -30 3.4 -29 4.4 -27.3L21 1.5C22 3.3 22 5 21 6.6C20 8.2 18.5 9 16.6 9H-16.6C-18.5 9 -20 8.2 -21 6.6C-22 5 -22 3.3 -21 1.5L-4.4 -27.3C-3.4 -29 -2 -30 0 -30Z';

function Pan({ id, x, y, strings }: { id: string; x: number; y: number; strings: readonly [number, number] }) {
  return (
    <G>
      <Path
        d={`M${strings[0]} ${strings[1]}L${x - 26} ${y}M${strings[0]} ${strings[1]}L${x + 26} ${y}`}
        stroke={illustration.goldDeep}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path d={PAN} transform={`translate(${x} ${y})`} fill={paint(id)} />
      <Rect x={x - 31} y={y - 2} width={62} height={4} rx={2} fill={illustration.kiwiRim} />
    </G>
  );
}

/** Lesson art "risk-scale": risk vs return on a balance scale. */
export function RiskScaleArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'gold', 'pillar', 'warn', 'edge', 'face', 'flesh');
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <Linear id={ids.gold} stops={twoStops(gradients.gold)} />
        <Linear id={ids.pillar} stops={twoStops([illustration.forest, illustration.forestDeep])} from={[0, 0]} to={[1, 0]} />
        <Linear id={ids.warn} stops={twoStops(gradients.flame)} />
        <CoinStackDefs ids={ids} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={120} cy={162} rx={80} ry={7} />

      {/* stand */}
      <Path d="M92 162H148L140 148H100Z" fill={paint(ids.pillar)} />
      <Rect x={116} y={56} width={8} height={94} rx={3} fill={paint(ids.pillar)} />

      {/* left pan: return (coins) — sits lower */}
      <CoinStack ids={ids} cx={LEFT_END[0]} baseY={114} r={16} count={3} />
      <Pan id={ids.gold} x={LEFT_END[0]} y={114} strings={LEFT_END} />

      {/* right pan: risk (warning sign) */}
      <G transform={`translate(${RIGHT_END[0]} 84)`}>
        <Path d={WARNING} fill={paint(ids.warn)} />
        <Rect x={-2.6} y={-18} width={5.2} height={14} rx={2.6} fill={illustration.white} />
        <Circle cx={0} cy={1.5} r={3} fill={illustration.white} />
      </G>
      <Pan id={ids.gold} x={RIGHT_END[0]} y={94} strings={RIGHT_END} />

      {/* beam */}
      <G transform="rotate(-7 120 58)">
        <Rect x={36} y={54} width={168} height={8} rx={4} fill={paint(ids.gold)} />
        <Rect x={42} y={55.5} width={60} height={2.4} rx={1.2} fill={illustration.white} fillOpacity={0.55} />
      </G>
      <Circle cx={120} cy={58} r={9} fill={paint(ids.gold)} />
      <Circle cx={120} cy={58} r={3.5} fill={illustration.kiwiRim} />

      <Sparkle x={206} y={20} r={7} color={illustration.gold} />
      <Sparkle x={28} y={30} r={5} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
