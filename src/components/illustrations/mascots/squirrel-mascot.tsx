import { Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration, mascotColors } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse } from '../parts/basics';
import { Cheeks, Eye, FurGradient, Gloss, MASCOT_SIZE, mirrorPath } from './mascot-parts';

const c = mascotColors.squirrel;

/** Ear with a tufted tip, drawn on the left and mirrored. */
const EAR = 'M60 70C52 48 54 30 66 18C70 26 78 34 82 44C86 52 86 60 84 66Z';
const EAR_INNER = 'M66 62C61 50 62 38 68 30C72 38 76 46 78 56Z';

/** Nocciola lo Scoiattolo — "Il Previdente": hugs a Kiwi coin, tail curled behind. */
export function SquirrelMascot(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'fur', 'tail', 'rim', 'bevel', 'flesh');
  return (
    <ArtSvg size={MASCOT_SIZE} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <FurGradient id={ids.fur} from={c.from} to={c.to} />
        <FurGradient id={ids.tail} from={c.to} to={c.from} />
        <KiwiCoinDefs ids={ids} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={104} cy={190} rx={66} ry={7} />

      {/* tail, curled behind the right side */}
      <Path
        d="M120 184C162 192 196 160 192 116C189 80 168 52 144 56C126 59 122 80 138 88C156 96 164 118 154 140C146 158 130 164 116 168Z"
        fill={paint(ids.tail)}
      />
      <Path
        d="M150 70C166 74 180 94 180 118C180 140 168 160 150 170"
        stroke={c.light}
        strokeOpacity={0.55}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />

      {/* body */}
      <Ellipse cx={100} cy={152} rx={44} ry={38} fill={paint(ids.fur)} />
      <Ellipse cx={100} cy={160} rx={27} ry={26} fill={c.light} />
      <Ellipse cx={80} cy={186} rx={15} ry={7} fill={c.to} />
      <Ellipse cx={120} cy={186} rx={15} ry={7} fill={c.to} />

      {/* coin + paws */}
      <KiwiCoin ids={ids} transform="translate(100 156) scale(19)" />
      <Ellipse cx={81} cy={160} rx={9} ry={8} fill={c.from} />
      <Ellipse cx={119} cy={160} rx={9} ry={8} fill={c.from} />

      {/* ears */}
      <Path d={EAR} fill={paint(ids.fur)} />
      <Path d={mirrorPath(EAR)} fill={paint(ids.fur)} />
      <Path d={EAR_INNER} fill={c.light} fillOpacity={0.85} />
      <Path d={mirrorPath(EAR_INNER)} fill={c.light} fillOpacity={0.85} />

      {/* head */}
      <Ellipse cx={100} cy={94} rx={56} ry={48} fill={paint(ids.fur)} />
      <Gloss cx={70} cy={66} />
      <Ellipse cx={100} cy={118} rx={22} ry={16} fill={c.light} />
      <Cheeks y={112} dx={38} />
      <Eye x={78} y={96} />
      <Eye x={122} y={96} />

      {/* nose, smile, teeth */}
      <G>
        <Ellipse cx={100} cy={109} rx={5.5} ry={4} fill={c.dark} />
        <Rect x={96.5} y={118} width={7} height={6} rx={1.6} fill={illustration.white} />
        <Path d="M91 116Q100 124 109 116" stroke={c.dark} strokeWidth={3} strokeLinecap="round" fill="none" />
      </G>
    </ArtSvg>
  );
}
