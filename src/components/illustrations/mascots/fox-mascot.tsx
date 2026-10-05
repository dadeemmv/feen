import { ClipPath, Defs, Ellipse, G, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, mascotColors } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse } from '../parts/basics';
import { Cheeks, Eye, FurGradient, Gloss, MASCOT_SIZE, mirrorPath, WinkEye } from './mascot-parts';

const c = mascotColors.fox;

const TAIL = 'M80 184C34 194 4 158 16 118C22 98 40 90 50 100C58 110 54 130 62 148C68 160 78 166 92 170Z';
const EAR = 'M50 80L56 20L96 58Z';
const EAR_INNER = 'M58 66L61 34L82 56Z';
const EAR_TIP = 'M53 50L56 20L72 35Z';
/** White lower face: fur sweeping from the cheeks to the chin. */
const MASK =
  'M44 92C46 122 72 142 100 142C128 142 154 122 156 92C144 108 124 110 112 104C106 110 94 110 88 104C76 110 56 108 44 92Z';

/** Lampo la Volpe — "Intraprendente": lime scarf in the wind, always winking at a chance. */
export function FoxMascot(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'fur', 'tail', 'tailClip', 'headClip', 'scarf');
  return (
    <ArtSvg size={MASCOT_SIZE} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <FurGradient id={ids.fur} from={c.from} to={c.to} />
        <FurGradient id={ids.tail} from={c.to} to={c.from} />
        <Linear id={ids.scarf} stops={twoStops(gradients.accent)} />
        <ClipPath id={ids.tailClip}>
          <Path d={TAIL} />
        </ClipPath>
        <ClipPath id={ids.headClip}>
          <Ellipse cx={100} cy={94} rx={58} ry={46} />
        </ClipPath>
      </Defs>
      <SoftEllipse id={ids.shadow} cx={96} cy={190} rx={66} ry={7} />

      {/* tail with a white tip, behind the left side */}
      <Path d={TAIL} fill={paint(ids.tail)} />
      <G clipPath={`url(#${ids.tailClip})`}>
        <Ellipse cx={26} cy={108} rx={26} ry={22} transform="rotate(-30 26 108)" fill={c.light} />
      </G>

      {/* body */}
      <Ellipse cx={100} cy={154} rx={42} ry={36} fill={paint(ids.fur)} />
      <Ellipse cx={100} cy={164} rx={22} ry={24} fill={c.light} />
      <Ellipse cx={81} cy={186} rx={14} ry={7} fill={c.dark} fillOpacity={0.85} />
      <Ellipse cx={119} cy={186} rx={14} ry={7} fill={c.dark} fillOpacity={0.85} />

      {/* scarf with a flying end */}
      <Path d="M122 140L146 168L156 158L136 134Z" fill={paint(ids.scarf)} />
      <Path d="M58 128Q100 150 142 128L144 140Q100 164 56 140Z" fill={paint(ids.scarf)} />

      {/* ears */}
      <Path d={EAR} fill={paint(ids.fur)} stroke={paint(ids.fur)} strokeWidth={6} strokeLinejoin="round" />
      <Path d={mirrorPath(EAR)} fill={paint(ids.fur)} stroke={paint(ids.fur)} strokeWidth={6} strokeLinejoin="round" />
      <Path d={EAR_TIP} fill={c.dark} stroke={c.dark} strokeWidth={6} strokeLinejoin="round" />
      <Path d={mirrorPath(EAR_TIP)} fill={c.dark} stroke={c.dark} strokeWidth={6} strokeLinejoin="round" />
      <Path d={EAR_INNER} fill={c.light} fillOpacity={0.8} />
      <Path d={mirrorPath(EAR_INNER)} fill={c.light} fillOpacity={0.8} />

      {/* head */}
      <Ellipse cx={100} cy={94} rx={58} ry={46} fill={paint(ids.fur)} />
      <Gloss cx={68} cy={68} />
      <Path d={MASK} fill={c.light} clipPath={`url(#${ids.headClip})`} />
      <Cheeks y={114} dx={40} />
      <WinkEye x={78} y={95} />
      <Eye x={122} y={95} />

      {/* nose + grin */}
      <Ellipse cx={100} cy={116} rx={6.5} ry={4.6} fill={c.dark} />
      <Path d="M90 124Q100 132 110 124" stroke={c.dark} strokeWidth={3} strokeLinecap="round" fill="none" />
    </ArtSvg>
  );
}
