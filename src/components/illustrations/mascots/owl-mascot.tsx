import { Circle, Defs, Ellipse, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration, mascotColors } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse } from '../parts/basics';
import { Cheeks, Eye, FurGradient, Gloss, MASCOT_SIZE, mirrorPath } from './mascot-parts';

const c = mascotColors.owl;

const TUFT = 'M50 74C42 56 42 38 50 26C60 36 72 48 80 60Z';
const WING = 'M46 112C30 128 30 162 50 178C60 168 64 140 58 116Z';
/** Feather chevrons on the belly, rows of "v" marks. */
const CHEVRONS = [
  [90, 146],
  [110, 146],
  [80, 162],
  [100, 162],
  [120, 162],
  [90, 178],
  [110, 178],
] as const;

/** Otto il Gufo — "Lo Stratega": round glasses, a plan for everything. */
export function OwlMascot(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'fur', 'wing', 'gold');
  return (
    <ArtSvg size={MASCOT_SIZE} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <FurGradient id={ids.fur} from={c.from} to={c.to} />
        <FurGradient id={ids.wing} from={c.to} to={c.dark} />
        <Linear id={ids.gold} stops={twoStops(gradients.gold)} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={100} cy={190} rx={60} ry={7} />

      {/* ear tufts + egg body */}
      <Path d={TUFT} fill={paint(ids.wing)} />
      <Path d={mirrorPath(TUFT)} fill={paint(ids.wing)} />
      <Ellipse cx={100} cy={118} rx={62} ry={68} fill={paint(ids.fur)} />
      <Gloss cx={66} cy={72} rx={18} ry={9} />

      {/* belly + chevrons */}
      <Ellipse cx={100} cy={160} rx={36} ry={28} fill={c.light} fillOpacity={0.9} />
      {CHEVRONS.map(([x, y]) => (
        <Path
          key={`${x}-${y}`}
          d={`M${x - 5} ${y - 3}L${x} ${y + 2}L${x + 5} ${y - 3}`}
          stroke={c.from}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}

      {/* wings */}
      <Path d={WING} fill={paint(ids.wing)} />
      <Path d={mirrorPath(WING)} fill={paint(ids.wing)} />

      {/* face discs */}
      <Circle cx={77} cy={98} r={27} fill={c.light} />
      <Circle cx={123} cy={98} r={27} fill={c.light} />
      <Cheeks y={118} dx={44} rx={8} />

      {/* eyes behind round glasses */}
      <Eye x={78} y={98} r={10} />
      <Eye x={122} y={98} r={10} />
      <Circle cx={78} cy={98} r={19} stroke={paint(ids.gold)} strokeWidth={4.5} fill={illustration.white} fillOpacity={0.12} />
      <Circle cx={122} cy={98} r={19} stroke={paint(ids.gold)} strokeWidth={4.5} fill={illustration.white} fillOpacity={0.12} />
      <Path d="M96 94Q100 89 104 94" stroke={illustration.goldDeep} strokeWidth={4} strokeLinecap="round" fill="none" />

      {/* beak + feet */}
      <Path d="M93 116L107 116L100 129Z" fill={paint(ids.gold)} stroke={paint(ids.gold)} strokeWidth={3} strokeLinejoin="round" />
      <Ellipse cx={84} cy={186} rx={11} ry={5.5} fill={illustration.goldDeep} />
      <Ellipse cx={116} cy={186} rx={11} ry={5.5} fill={illustration.goldDeep} />
    </ArtSvg>
  );
}
