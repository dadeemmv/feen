import { Defs, G, Path, Rect } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
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
  Grad,
  Hand,
  Head,
  Legs,
  Limb,
  Mouth,
  Neck,
  Nose,
  Shoes,
  Tie,
  TORSO,
  type Framing,
} from './character-parts';

/** Fanned banknotes: [rotation°]. */
const BILLS = [-28, -8, 12] as const;

/**
 * Max — "Lo Squalo" (risk · right): the high-octane trader. Slicked-back dark hair, white shirt
 * with rolled sleeves and red suspenders, loosened gold tie, a fan of banknotes held high and a
 * gold watch.
 */
export function SharkCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const ids = useSvgIds('shadow', 'skin', 'hair', 'bill', 'shirt');
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <Grad id={ids.skin} pair={c.tan} />
        <Grad id={ids.hair} pair={c.hairDark} />
        <Grad id={ids.bill} pair={c.banknote} />
        <Linear id={ids.shirt} stops={twoStops([c.shirt, c.shirtShade])} from={[0.2, 0]} to={[0.8, 1]} />
      </Defs>
      <FloorShadow id={ids.shadow} />

      {/* trousers + shirt */}
      <Legs fill={c.trouserDark} />
      <Shoes color={c.trouserDark} />
      <Neck skinId={ids.skin} />
      <Path d={TORSO} fill={paint(ids.shirt)} />
      <Path d="M86 101L100 118L114 101Z" fill={paint(ids.skin)} />
      <Path d="M86 101L93 117L100 108L107 117L114 101" stroke={c.shirtShade} strokeWidth={1.4} strokeLinejoin="round" fill="none" />
      <Tie color={c.tieGold} tilt={8} />
      {/* suspenders + belt */}
      <Path d="M82 103L84 206M118 103L116 206" stroke={c.suspenders} strokeWidth={6} strokeLinecap="round" />
      <Rect x={68} y={198} width={64} height={9} rx={2} fill={c.shoe} />
      <Rect x={95} y={198} width={10} height={9} rx={1.5} fill={c.glassesGold} />

      {/* left arm, rolled sleeve */}
      <Limb d="M70 116C62 136 60 152 61 168" stroke={paint(ids.shirt)} />
      <Limb d="M61 166C61 176 62 184 63 190" stroke={paint(ids.skin)} width={13} />
      <Hand x={63} y={194} skinId={ids.skin} />

      {/* right arm up, rolled sleeve, cash fan */}
      <Limb d="M130 116C142 104 148 92 146 80" stroke={paint(ids.shirt)} />
      <Limb d="M146 82C147 76 147 70 146 64" stroke={paint(ids.skin)} width={13} />
      <Rect x={140} y={74} width={13} height={6} rx={2} fill={c.glassesGold} />
      <G>
        {BILLS.map((a) => (
          <G key={a} transform={`rotate(${a} 146 60)`}>
            <Rect x={132} y={30} width={28} height={30} rx={3} fill={paint(ids.bill)} />
            <Rect x={135.5} y={33.5} width={21} height={23} rx={2} stroke={illustration.forest} strokeOpacity={0.35} strokeWidth={1.4} fill="none" />
            <Path d="M146 40V50M143 42.5Q146 40.5 149 42.5Q146 45 143 47.5Q146 49.5 149 47.5" stroke={illustration.forest} strokeOpacity={0.55} strokeWidth={1.4} strokeLinecap="round" fill="none" />
          </G>
        ))}
      </G>
      <Hand x={146} y={62} skinId={ids.skin} />

      {/* head */}
      <Head skinId={ids.skin} />
      <Path
        d="M71 58C67 30 86 15 104 16C125 17 137 32 131 58C129 50 125 44 120 40C112 34 92 33 82 40C77 44 73 50 71 58Z"
        fill={paint(ids.hair)}
      />
      <Path d="M86 26Q100 20 118 26M88 32Q102 27 116 32" stroke={illustration.white} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Brows color={c.hairDark[1]} width={3.2} lift={[0, 3]} />
      <Eyes />
      <Nose />
      <Cheeks />
      <Mouth style="grin" />
    </ArtSvg>
  );
}
