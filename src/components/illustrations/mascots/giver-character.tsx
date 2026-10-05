import { Defs, Path, Rect } from 'react-native-svg';

import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration, mascotColors as c } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient } from '../parts/basics';
import {
  Brows,
  Cheeks,
  Eyes,
  FloorShadow,
  framingProps,
  Glasses,
  Grad,
  Hand,
  Head,
  Legs,
  Limb,
  Mouth,
  Neck,
  Nose,
  Shoes,
  TORSO,
  type Framing,
} from './character-parts';

/**
 * Teo — "Il Filantropo" (unrisk · left): the calm builder who gives back. Short ash hair with a
 * side part, black rectangular glasses, periwinkle V-neck sweater over a white shirt, khakis, and
 * the little dream house held in both hands.
 */
export function GiverCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const ids = useSvgIds('shadow', 'skin', 'sweater', 'khaki', 'hair', 'roof');
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <Grad id={ids.skin} pair={c.skin} />
        <Grad id={ids.sweater} pair={c.sweater} />
        <Grad id={ids.khaki} pair={c.khaki} />
        <Grad id={ids.hair} pair={c.hairAsh} />
        <Grad id={ids.roof} pair={c.roof} />
      </Defs>
      <FloorShadow id={ids.shadow} />

      {/* khakis + sweater over a shirt */}
      <Legs fill={paint(ids.khaki)} />
      <Shoes />
      <Neck skinId={ids.skin} />
      <Path d={TORSO} fill={paint(ids.sweater)} />
      <Path d="M86 101L100 130L114 101Z" fill={c.shirt} />
      <Path d="M86 101L93 115L100 106L107 115L114 101" fill={c.shirt} stroke={c.shirtShade} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M84 101L100 134L116 101" stroke={c.sweater[1]} strokeWidth={3} strokeLinejoin="round" fill="none" />
      <Path d="M68 202H132" stroke={c.sweater[1]} strokeWidth={5} strokeLinecap="round" />

      {/* both arms forward, holding the house */}
      <Limb d="M70 116C60 140 66 162 86 168" stroke={paint(ids.sweater)} />
      <Limb d="M130 116C140 140 134 162 114 168" stroke={paint(ids.sweater)} />
      <Rect x={83} y={144} width={34} height={26} rx={2} fill={c.wallCream} />
      <Path d="M78 147L100 127L122 147Z" fill={paint(ids.roof)} stroke={paint(ids.roof)} strokeWidth={3} strokeLinejoin="round" />
      <Rect x={95} y={154} width={10} height={16} rx={2} fill={illustration.lime} />
      <Rect x={87} y={150} width={6} height={6} rx={1} fill={illustration.sky} />
      <Rect x={107} y={150} width={6} height={6} rx={1} fill={illustration.sky} />
      <Rect x={110} y={129} width={5} height={10} fill={c.roof[1]} />
      <Hand x={86} y={168} skinId={ids.skin} />
      <Hand x={114} y={168} skinId={ids.skin} />

      {/* head */}
      <Head skinId={ids.skin} />
      <Path
        d="M70 58C67 38 82 27 100 27C120 27 134 38 130 58C128 50 124 45 118 42C108 41 94 44 86 40C79 44 73 50 70 58Z"
        fill={paint(ids.hair)}
      />
      <Path d="M86 40Q92 34 104 33" stroke={c.hairAsh[1]} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Brows color={c.hairAsh[1]} width={2.8} />
      <Eyes style="happy" />
      <Glasses style="rect" color={c.glassesBlack} />
      <Nose />
      <Cheeks />
      <Mouth style="grin" />
    </ArtSvg>
  );
}
