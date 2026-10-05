import { Circle, Defs, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration, mascotColors as c } from '@/theme';

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
  Lapels,
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
 * Vera — "La Visionaria" (risk · left): the conviction investor in disruptive tech. Shoulder-length
 * honey hair with a side part, round black glasses, gold studs, royal-blue jacket, one hand on the
 * hip and a rocket raised in the other.
 */
export function VisionaryCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const ids = useSvgIds('shadow', 'skin', 'suit', 'hair', 'rocket', 'fin');
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <Grad id={ids.skin} pair={c.skin} />
        <Grad id={ids.suit} pair={c.suitRoyal} />
        <Grad id={ids.hair} pair={c.hairHoney} />
        <Linear id={ids.rocket} stops={twoStops([illustration.white, c.shirtShade])} from={[0, 0]} to={[1, 0]} />
        <Linear id={ids.fin} stops={twoStops(gradients.accent)} />
      </Defs>
      <FloorShadow id={ids.shadow} />

      {/* hair falling behind the shoulders */}
      <Path
        d="M68 60C66 34 82 23 100 23C120 23 136 34 133 62C135 82 138 98 134 110C124 116 114 112 112 102L88 102C86 112 76 116 66 110C62 98 65 82 68 60Z"
        fill={paint(ids.hair)}
      />

      {/* trousers + jacket */}
      <Legs fill={c.trouserDark} />
      <Shoes />
      <Neck skinId={ids.skin} />
      <Path d={TORSO} fill={paint(ids.suit)} />
      <Path d="M88 101L100 126L112 101Z" fill={c.shirt} />
      <Lapels fill={c.suitRoyal[1]} />
      <Circle cx={104} cy={160} r={2.2} fill={c.suitRoyal[1]} />
      <Circle cx={104} cy={180} r={2.2} fill={c.suitRoyal[1]} />

      {/* left hand on the hip */}
      <Limb d="M70 116C56 134 58 152 76 162" stroke={paint(ids.suit)} />
      <Hand x={78} y={162} skinId={ids.skin} r={7} />

      {/* right arm up with the rocket */}
      <Limb d="M130 116C142 104 148 92 146 76" stroke={paint(ids.suit)} />
      <Path d="M138 52L130 64L139 61Z M154 52L162 64L153 61Z" fill={paint(ids.fin)} stroke={paint(ids.fin)} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M146 10C155 18 158 32 155 58L137 58C134 32 137 18 146 10Z" fill={paint(ids.rocket)} />
      <Path d="M146 10C150 13 153 18 154.5 23L137.5 23C139 18 142 13 146 10Z" fill={paint(ids.fin)} />
      <Circle cx={146} cy={36} r={5.5} fill={illustration.sky} stroke={c.shirtShade} strokeWidth={2} />
      <Circle cx={144.5} cy={34.5} r={1.6} fill={illustration.white} />
      <Hand x={146} y={66} skinId={ids.skin} />

      {/* head */}
      <Head skinId={ids.skin} />
      <Circle cx={71} cy={76} r={2.4} fill={c.glassesGold} />
      <Circle cx={129} cy={76} r={2.4} fill={c.glassesGold} />
      <Path
        d="M70 60C69 38 84 27 102 27C119 27 133 39 132 60C126 46 114 39 99 41C88 46 78 53 70 60Z"
        fill={paint(ids.hair)}
      />
      <Path d="M129 48C135 66 135 86 130 102" stroke={paint(ids.hair)} strokeWidth={8} strokeLinecap="round" fill="none" />
      <Path d="M71 50C66 66 66 86 70 100" stroke={paint(ids.hair)} strokeWidth={7} strokeLinecap="round" fill="none" />
      <Path d="M88 35Q104 30 120 38" stroke={c.hairHoney[1]} strokeOpacity={0.6} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Brows color={c.hairHoney[1]} width={2.4} lift={[1, 1]} />
      <Eyes />
      <Glasses style="round" color={c.glassesBlack} />
      <Nose />
      <Cheeks />
      <Mouth style="smile" />
    </ArtSvg>
  );
}
