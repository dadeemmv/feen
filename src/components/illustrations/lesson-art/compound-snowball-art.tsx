import { Circle, Defs, Ellipse, G, Path } from 'react-native-svg';

import { Linear, Radial, twoStops } from '@/components/icons/lib/gradients';
import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { Sparkle } from '../parts/basics';

/**
 * Slope y = 60 + x / 3. Each ball touches the slope at contact x; its centre sits along the
 * slope normal (0.316, -0.949) at distance r. [contactX, r, opacity].
 */
const BALLS = [
  [40, 5, 0.55],
  [80, 9, 0.7],
  [122, 14, 0.85],
] as const;
const NX = 0.316;
const NY = -0.949;
const slopeY = (x: number) => 60 + x / 3;
/** Snow slope with rounded shoulders that fades out towards the bottom (floats like spot art). */
const HILL = 'M16 65.3L222 134C230 136.7 234 143 234 150V176H6V74.7C6 68.5 10.5 63.5 16 65.3Z';
const RIDGE = 'M16 65.3L222 134';
const BIG = { x: 178 + 34 * NX, y: slopeY(178) + 34 * NY, r: 34 };
/** Kiwi coins caught in the big snowball: [dx, dy, r, rotation]. */
const COINS = [
  [-12, -12, 7.5, -20],
  [14, 10, 6.5, 25],
  [16, -18, 5, 10],
  [-18, 14, 4.5, -5],
] as const;

/** Lesson art "compound-snowball": interest on interest — a snowball growing as it rolls. */
export function CompoundSnowballArt(props: IllustrationProps) {
  const ids = useSvgIds('hill', 'snow', 'rim', 'bevel', 'flesh');
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <Linear id={ids.hill} stops={twoStops([illustration.sky, illustration.mint], [0.8, 0])} />
        <Radial
          id={ids.snow}
          center={[0.38, 0.32]}
          r={0.72}
          stops={[
            [0, illustration.white],
            [0.55, illustration.white],
            [1, illustration.sky],
          ]}
        />
        <KiwiCoinDefs ids={ids} />
      </Defs>

      <Path d={HILL} fill={paint(ids.hill)} />
      <Path d={RIDGE} stroke={illustration.white} strokeWidth={3} strokeLinecap="round" />
      {/* the track widens as the ball grows */}
      <Path d="M36 72L178 119L176 124L34 75Z" fill={illustration.white} fillOpacity={0.7} />

      {BALLS.map(([x, r, opacity]) => (
        <G key={x} opacity={opacity}>
          <Circle cx={x + r * NX} cy={slopeY(x) + r * NY} r={r} fill={paint(ids.snow)} />
        </G>
      ))}

      {/* motion lines */}
      <Path d="M126 64H144M118 76H140M130 52H144" stroke={illustration.sky} strokeWidth={3} strokeLinecap="round" />

      <Ellipse cx={BIG.x} cy={BIG.y + BIG.r + 2} rx={26} ry={4} fill={illustration.ink} fillOpacity={0.08} />
      <Circle cx={BIG.x} cy={BIG.y} r={BIG.r} fill={paint(ids.snow)} />
      {COINS.map(([dx, dy, r, rot]) => (
        <KiwiCoin key={dx} ids={ids} detail="min" glint={false} transform={`translate(${BIG.x + dx} ${BIG.y + dy}) rotate(${rot}) scale(${r})`} />
      ))}
      <Ellipse cx={BIG.x - 12} cy={BIG.y - 20} rx={9} ry={5} transform={`rotate(-30 ${BIG.x - 12} ${BIG.y - 20})`} fill={illustration.white} />

      <Sparkle x={214} y={28} r={8} color={illustration.sky} />
      <Sparkle x={60} y={30} r={6} color={illustration.gold} />
    </ArtSvg>
  );
}
