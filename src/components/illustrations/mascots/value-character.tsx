import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

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
  Lapels,
  LEG_LEFT,
  LEG_RIGHT,
  Legs,
  Limb,
  Mouth,
  Neck,
  Nose,
  Pinstripes,
  ShirtFront,
  Shoes,
  Tie,
  TORSO,
  type Framing,
} from './character-parts';

/**
 * Bruno — "Il Cassettista" (unrisk · right): the old-school value investor. Silver swept-back
 * hair, bushy brows, thin gold glasses, navy pinstripe suit and red tie, the business paper under
 * one arm and a can of soda in the other hand.
 */
export function ValueCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const ids = useSvgIds('shadow', 'skin', 'suit', 'hair', 'clip');
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <Grad id={ids.skin} pair={c.skin} />
        <Grad id={ids.suit} pair={c.suitNavy} />
        <Grad id={ids.hair} pair={c.hairSilver} />
        <ClipPath id={ids.clip}>
          <Path d={TORSO} />
          <Path d={LEG_LEFT} />
          <Path d={LEG_RIGHT} />
        </ClipPath>
      </Defs>
      <FloorShadow id={ids.shadow} />

      {/* suit */}
      <Legs fill={paint(ids.suit)} />
      <Shoes />
      <Neck skinId={ids.skin} />
      <Path d={TORSO} fill={paint(ids.suit)} />
      <G clipPath={`url(#${ids.clip})`}>
        <Pinstripes />
      </G>
      <ShirtFront />
      <Tie color={c.tieRed} />
      <Lapels fill={c.suitNavy[1]} />

      {/* left arm: the paper under the arm */}
      <Limb d="M70 116C62 140 60 165 62 192" stroke={paint(ids.suit)} />
      <G transform="rotate(-10 60 192)">
        <Rect x={44} y={170} width={30} height={40} rx={2} fill={illustration.paper} />
        <Path d="M49 178H69M49 184H69M49 190H62M49 196H69M49 202H65" stroke={illustration.mutedDeep} strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
      </G>
      <Hand x={63} y={196} skinId={ids.skin} />

      {/* right arm: a can of soda at chest height */}
      <Limb d="M130 116C142 138 142 158 124 166" stroke={paint(ids.suit)} />
      <Rect x={112} y={140} width={15} height={24} rx={3.5} fill={c.canRed} />
      <Rect x={112} y={148} width={15} height={5} fill={illustration.white} fillOpacity={0.85} />
      <Rect x={114} y={141} width={3} height={20} rx={1.5} fill={illustration.white} fillOpacity={0.3} />
      <Hand x={120} y={164} skinId={ids.skin} />

      {/* head */}
      <Head skinId={ids.skin} />
      <Path
        d="M70 62C66 40 80 26 100 25C121 25 135 39 131 61C129 52 124 46 117 43C108 47 92 47 83 43C76 46 72 53 70 62Z"
        fill={paint(ids.hair)}
      />
      <Path d="M70 62C68 54 70 48 74 45L76 60Z M130 62C132 54 130 48 126 45L124 60Z" fill={paint(ids.hair)} />
      <Path d="M84 34Q100 28 116 34" stroke={c.hairSilver[1]} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Brows color={c.hairSilver[1]} width={4} lift={[1, 1]} />
      <Eyes />
      <Glasses style="wire" color={c.glassesGold} />
      <Nose />
      <Cheeks />
      <Mouth style="soft" />
      <Path d="M87 82Q89 86 92 87M113 82Q111 86 108 87" stroke={c.skinShade} strokeWidth={1.4} strokeLinecap="round" fill="none" />
    </ArtSvg>
  );
}
