import { Circle, Defs, Ellipse, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration, mascotColors } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse } from '../parts/basics';
import { Cheeks, FurGradient, Gloss, HappyEye, MASCOT_SIZE } from './mascot-parts';

const c = mascotColors.koala;

/** Eucalyptus leaves along the sprig: [cx, cy, angle]. */
const LEAVES = [
  [128, 152, 40],
  [146, 146, -20],
  [150, 128, -60],
  [166, 134, 10],
  [164, 116, -40],
] as const;

/** Mochi il Koala — "Zen": eyes closed, a eucalyptus sprig, zero stress. */
export function KoalaMascot(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'fur', 'nose', 'leaf');
  return (
    <ArtSvg size={MASCOT_SIZE} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <FurGradient id={ids.fur} from={c.from} to={c.to} />
        <Linear id={ids.nose} stops={twoStops([c.noseLight, c.dark])} />
        <Linear id={ids.leaf} stops={twoStops([illustration.kiwiFlesh, illustration.kiwiFleshDark])} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={100} cy={190} rx={60} ry={7} />

      {/* body */}
      <Ellipse cx={100} cy={152} rx={46} ry={38} fill={paint(ids.fur)} />
      <Ellipse cx={100} cy={160} rx={28} ry={26} fill={c.light} />
      <Ellipse cx={80} cy={186} rx={15} ry={7} fill={c.to} />
      <Ellipse cx={120} cy={186} rx={15} ry={7} fill={c.to} />

      {/* eucalyptus sprig held across the belly */}
      <Path d="M86 176Q124 158 168 112" stroke={illustration.kiwiFleshDark} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      {LEAVES.map(([x, y, a]) => (
        <Ellipse key={`${x}-${y}`} cx={x} cy={y} rx={12} ry={6.5} transform={`rotate(${a} ${x} ${y})`} fill={paint(ids.leaf)} />
      ))}
      <Ellipse cx={92} cy={168} rx={10} ry={9} fill={c.to} />
      <Ellipse cx={124} cy={156} rx={10} ry={9} fill={c.to} />

      {/* fluffy ears */}
      <Circle cx={48} cy={72} r={29} fill={paint(ids.fur)} />
      <Circle cx={152} cy={72} r={29} fill={paint(ids.fur)} />
      <Circle cx={50} cy={75} r={17} fill={c.inner} />
      <Circle cx={150} cy={75} r={17} fill={c.inner} />

      {/* head */}
      <Ellipse cx={100} cy={96} rx={56} ry={47} fill={paint(ids.fur)} />
      <Gloss cx={72} cy={66} />
      <Cheeks y={118} dx={36} />
      <HappyEye x={74} y={98} />
      <HappyEye x={126} y={98} />

      {/* big nose + small smile */}
      <Ellipse cx={100} cy={110} rx={14} ry={17} fill={paint(ids.nose)} />
      <Ellipse cx={95} cy={102} rx={4} ry={3} fill={illustration.white} fillOpacity={0.35} />
      <Path d="M94 132Q100 136 106 132" stroke={c.dark} strokeWidth={2.8} strokeLinecap="round" fill="none" />
    </ArtSvg>
  );
}
