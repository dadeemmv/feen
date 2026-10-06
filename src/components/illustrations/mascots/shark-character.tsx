import { Path } from 'react-native-svg';

import { mascotColors as c } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import {
  Arm,
  Brows,
  framingProps,
  Hand,
  Head,
  Neck,
  INK,
  Lapels,
  Legs,
  Line,
  Mouth,
  Nose,
  Outlined,
  ShirtAndTie,
  TORSO_BROAD,
  TORSO_SHADE,
  type Framing,
} from './character-parts';

const SUIT = c.suitCharcoal;
const HAIR = c.hairDark;

/**
 * Max — "Lo Squalo" (risk · right): the hyped-up trader. Glossy slicked pompadour, black shades,
 * charcoal suit with gold buttons and a red tie, both arms thrown wide, palms up — "to the moon".
 */
export function SharkCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const full = framing === 'full';
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      <Legs pair={SUIT} />

      {/* arms thrown wide, behind the jacket */}
      {full ? (
        <Arm d="M84 132Q56 152 42 124" sleeve={SUIT[0]} cuff={{ d: 'M45 130L41 121', fill: c.shirt[0] }} />
      ) : null}
      {full ? (
        <Arm d="M136 132Q164 152 178 124" sleeve={SUIT[0]} cuff={{ d: 'M175 130L179 121', fill: c.shirt[0] }} />
      ) : null}

      <Neck pair={c.tan} />
      <Outlined parts={[{ d: TORSO_BROAD, fill: SUIT[0] }]} shades={[{ d: TORSO_SHADE, fill: SUIT[1] }]} />
      <ShirtAndTie tie={c.tieRed} />
      <Lapels shade={SUIT[1]} buttons={c.gold} />

      <Head pair={c.tan} />
      {/* slicked pompadour */}
      <Outlined
        parts={[
          {
            d: 'M76 72C72 56 74 44 80 36C84 20 100 8 120 8C142 8 156 22 151 42C149 54 147 64 145 72C142 60 136 53 127 51C122 53 115 55 107 55C96 55 88 58 82 64C79 66 77 69 76 72Z',
            fill: HAIR[0],
          },
        ]}
        shades={[
          {
            d: 'M124 50C138 50 146 60 146 76H158V16C154 34 142 48 124 50Z',
            fill: HAIR[1],
          },
        ]}>
        <Line d="M86 44C96 26 116 18 136 22M94 52C106 38 126 32 144 36" width={2} color={HAIR[1]} />
        <Line d="M98 22C110 14 126 13 136 16" width={2.6} color={c.shirt[0]} />
      </Outlined>

      {/* shades */}
      <Line d="M84 72L76 74M136 72L144 74" width={3} />
      <Path
        d="M84 68H136V72C136 84 129 88 122 88C116 88 112 82 111 76H109C108 82 104 88 98 88C91 88 84 84 84 72Z"
        fill={c.lens}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <Line d="M90 73L95 70M117 73L122 70" width={2} color={c.shirt[0]} />
      <Brows color={HAIR[1]} y={61} tilt={-1} />
      <Nose pair={c.tan} />
      <Mouth style="smirk" />

      {full ? <Hand x={36} y={110} pose="open" skin={c.tan} rotate={-24} scale={1.12} flip /> : null}
      {full ? <Hand x={184} y={110} pose="open" skin={c.tan} rotate={24} scale={1.12} /> : null}
    </ArtSvg>
  );
}
