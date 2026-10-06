import { G, Path, Rect } from 'react-native-svg';

import { illustration, mascotColors as c } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import {
  Arm,
  Brows,
  Cheeks,
  Eyes,
  framingProps,
  Hand,
  Head,
  Neck,
  INK,
  Legs,
  Line,
  Mouth,
  Nose,
  Outlined,
  ShirtAndTie,
  TORSO,
  TORSO_SHADE,
  type Framing,
} from './character-parts';

const SWEATER = c.sweater;
const HAIR = c.hairAsh;

/**
 * Teo — "Il Filantropo" (unrisk · left): the calm builder who gives back. Neat ash hair with a
 * side part, black rectangular glasses, a huge grin, periwinkle V-neck over a white shirt and
 * khakis; waves with one hand and offers the little dream house on the other.
 */
export function GiverCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const full = framing === 'full';
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      <Legs pair={c.khaki} shoe={c.shoeBrown} />

      {/* waving arm, behind the sweater */}
      {full ? (
        <Arm d="M136 134Q170 150 174 112" sleeve={SWEATER[0]} cuff={{ d: 'M174 116L174 110', fill: SWEATER[1] }} />
      ) : null}

      <Neck pair={c.skin} />
      <Outlined parts={[{ d: TORSO, fill: SWEATER[0] }]} shades={[{ d: TORSO_SHADE, fill: SWEATER[1] }]}>
        <Line d="M70 212H150" width={2} color={SWEATER[1]} />
      </Outlined>
      <ShirtAndTie />
      <Path d="M93 117L110 154L127 117" stroke={INK} strokeWidth={8} strokeLinejoin="round" fill="none" />
      <Path d="M93 117L110 154L127 117" stroke={SWEATER[1]} strokeWidth={4} strokeLinejoin="round" fill="none" />

      {/* offering arm, in front, with the house */}
      {full ? (
        <Arm d="M84 134Q60 164 56 168" sleeve={SWEATER[0]} cuff={{ d: 'M60 165L54 169', fill: SWEATER[1] }} />
      ) : null}
      {full ? (
        <>
          <G transform="translate(-2 0)">
            <Outlined
              parts={[
                { d: 'M40 136H72V164H40Z', fill: c.wallCream },
                { d: 'M62 112H69V126H62Z', fill: c.roof[1] },
                { d: 'M34 139L56 118L78 139Z', fill: c.roof[0] },
              ]}
              shades={[{ d: 'M56 118L78 139H34Z M64 136H74V166H64Z', fill: c.roof[1] }]}>
              <Rect
                x={51}
                y={146}
                width={10}
                height={18}
                rx={1.5}
                fill={illustration.lime}
                stroke={INK}
                strokeWidth={2}
              />
              <Rect x={43} y={143} width={6} height={6} rx={1} fill={illustration.sky} stroke={INK} strokeWidth={1.6} />
            </Outlined>
          </G>
        </>
      ) : null}
      {full ? <Hand x={54} y={170} pose="hold" skin={c.skin} rotate={-10} flip /> : null}

      <Head pair={c.skin} />
      {/* neat side part */}
      <Outlined
        parts={[
          {
            d: 'M77 72C74 44 90 27 112 27C134 27 147 46 143 70C141 58 135 50 127 47C113 49 98 46 91 39C85 47 80 58 77 72Z',
            fill: HAIR[0],
          },
        ]}
        shades={[
          {
            d: 'M126 46C138 50 144 60 144 72H152V30C146 40 138 46 126 46Z',
            fill: HAIR[1],
          },
        ]}>
        <Line d="M91 39Q104 34 122 36M100 31Q114 28 130 32" width={1.8} color={HAIR[1]} />
      </Outlined>

      <Brows color={HAIR[1]} y={61} tilt={1} width={3.6} />
      <Eyes y={77} bare />
      <Rect
        x={86}
        y={68}
        width={22}
        height={17}
        rx={4}
        stroke={c.frameBlack}
        strokeWidth={3.4}
        fill={c.shirt[0]}
        fillOpacity={0.1}
      />
      <Rect
        x={112}
        y={68}
        width={22}
        height={17}
        rx={4}
        stroke={c.frameBlack}
        strokeWidth={3.4}
        fill={c.shirt[0]}
        fillOpacity={0.1}
      />
      <Line d="M108 75H112M86 74L78 72M134 74L142 72" width={3} />
      <Nose pair={c.skin} />
      <Cheeks y={95} />
      <Mouth style="grin" />

      {full ? <Hand x={175} y={98} pose="open" skin={c.skin} rotate={12} /> : null}
    </ArtSvg>
  );
}
