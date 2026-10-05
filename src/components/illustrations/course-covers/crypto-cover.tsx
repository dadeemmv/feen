import { Circle, Ellipse, G, Path, Polygon } from 'react-native-svg';

import { Linear, Radial, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { hexPoints } from '../lib/chart-geometry';
import { Sparkle } from '../parts/basics';
import { CoverFrame, coverInk, type CourseCoverProps } from './cover-frame';

const CENTER = [160, 92] as const;
/** [x, y, r, paint] — satellite blocks of the network. */
const NODES = [
  [64, 48, 13, 'lime'],
  [72, 136, 10, 'gold'],
  [252, 42, 11, 'gold'],
  [262, 132, 14, 'lime'],
  [116, 22, 6, 'lime'],
  [214, 164, 7, 'lime'],
] as const;
const LINKS = 'M160 92L64 48M160 92L72 136M160 92L252 42M160 92L262 132M64 48L116 22M72 136L64 48M252 42L262 132M262 132L214 164';
/** Node glyph inside the central token: three linked dots. */
const GLYPH_LINKS = 'M146 100L160 78L174 100Z';

/** "Crypto e blockchain": a hexagonal token at the centre of a glowing network of blocks. */
export function CryptoCover({ background = 'brand', ...props }: CourseCoverProps) {
  const ids = useSvgIds('gold', 'lime', 'core', 'glow');
  const ink = coverInk[background];
  const coreFill = background === 'brand' ? illustration.forestDeep : illustration.forest;
  return (
    <CoverFrame
      background={background}
      {...props}
      defs={
        <>
          <Linear id={ids.gold} stops={twoStops(gradients.gold)} from={[0.2, 0]} to={[0.8, 1]} />
          <Linear id={ids.lime} stops={twoStops([illustration.limeLight, illustration.kiwiFlesh])} from={[0.2, 0]} to={[0.8, 1]} />
          <Linear id={ids.core} stops={twoStops([illustration.forest, coreFill])} />
          <Radial id={ids.glow} stops={[[0, illustration.lime, 0.45], [1, illustration.lime, 0]]} />
        </>
      }
    >
      <Ellipse cx={CENTER[0]} cy={CENTER[1]} rx={96} ry={78} fill={paint(ids.glow)} />
      <Ellipse
        cx={CENTER[0]}
        cy={CENTER[1]}
        rx={124}
        ry={42}
        transform={`rotate(-14 ${CENTER[0]} ${CENTER[1]})`}
        stroke={ink.line}
        strokeOpacity={0.3}
        strokeWidth={1.5}
        fill="none"
      />
      <Path d={LINKS} stroke={ink.line} strokeOpacity={0.55} strokeWidth={2} strokeDasharray="1 6" strokeLinecap="round" fill="none" />

      {NODES.map(([x, y, r, tone]) => (
        <G key={`${x}-${y}`}>
          <Polygon points={hexPoints(x, y, r)} fill={paint(tone === 'gold' ? ids.gold : ids.lime)} strokeLinejoin="round" stroke={paint(tone === 'gold' ? ids.gold : ids.lime)} strokeWidth={2} />
          <Circle cx={x} cy={y} r={r * 0.32} fill={coreFill} fillOpacity={0.8} />
        </G>
      ))}

      {/* central token */}
      <Polygon points={hexPoints(CENTER[0], CENTER[1] + 4, 46)} fill={illustration.kiwiRim} strokeLinejoin="round" stroke={illustration.kiwiRim} strokeWidth={6} />
      <Polygon points={hexPoints(CENTER[0], CENTER[1], 46)} fill={paint(ids.gold)} strokeLinejoin="round" stroke={paint(ids.gold)} strokeWidth={6} />
      <Polygon points={hexPoints(CENTER[0], CENTER[1], 34)} fill={paint(ids.core)} strokeLinejoin="round" stroke={paint(ids.core)} strokeWidth={4} />
      <Path d={GLYPH_LINKS} stroke={illustration.lime} strokeWidth={3} strokeLinejoin="round" fill="none" />
      <G fill={illustration.lime}>
        <Circle cx={160} cy={78} r={6} />
        <Circle cx={146} cy={100} r={6} />
        <Circle cx={174} cy={100} r={6} />
      </G>
      <Path d="M130 66L148 52" stroke={illustration.white} strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />

      <Sparkle x={210} y={30} r={7} color={ink.sparkle} />
      <Sparkle x={102} y={150} r={5} color={ink.line} />
    </CoverFrame>
  );
}
