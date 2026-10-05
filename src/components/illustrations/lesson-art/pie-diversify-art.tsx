import { Circle, Defs, G, Path, Rect } from 'react-native-svg';

import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { slicePath } from '../lib/chart-geometry';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

const C = [96, 90] as const;
const R = 58;
/** [start, end (turn fractions), colour, exploded]. */
const SLICES = [
  [0, 0.4, illustration.lime, false],
  [0.4, 0.62, illustration.sky, false],
  [0.62, 0.8, illustration.gold, true],
  [0.8, 1, illustration.forest, false],
] as const;
const EXPLODE = 9;

const offsetFor = (start: number, end: number) => {
  const a = ((start + end) / 2) * Math.PI * 2;
  return [Math.round(EXPLODE * Math.sin(a) * 10) / 10, Math.round(-EXPLODE * Math.cos(a) * 10) / 10] as const;
};

/** Lesson art "pie-diversify": a portfolio pie with one slice pulled out, plus legend. */
export function PieDiversifyArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow');
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={100} cy={160} rx={66} ry={8} />

      {SLICES.map(([start, end, color, exploded]) => {
        const [dx, dy] = exploded ? offsetFor(start, end) : [0, 0];
        return (
          <G key={start} transform={`translate(${dx} ${dy})`}>
            <Path d={slicePath(C[0], C[1] + 6, R, start, end)} fill={illustration.ink} fillOpacity={0.12} />
            <Path d={slicePath(C[0], C[1], R, start, end)} fill={color} stroke={illustration.white} strokeWidth={3} strokeLinejoin="round" />
          </G>
        );
      })}
      <Circle cx={C[0]} cy={C[1]} r={20} fill={illustration.white} />
      <Circle cx={C[0]} cy={C[1]} r={8} fill={illustration.limeLight} />
      <Path d="M58 58A50 50 0 0 1 84 40" stroke={illustration.white} strokeOpacity={0.6} strokeWidth={4} strokeLinecap="round" fill="none" />

      {/* legend */}
      <G>
        {SLICES.map(([start, , color], i) => (
          <G key={start}>
            <Circle cx={180} cy={58 + i * 22} r={6} fill={color} />
            <Rect x={192} y={55 + i * 22} width={[32, 24, 28, 20][i]} height={6} rx={3} fill={illustration.forest} fillOpacity={0.25} />
          </G>
        ))}
      </G>
      <Sparkle x={160} y={26} r={8} color={illustration.gold} />
      <Sparkle x={30} y={30} r={5} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
