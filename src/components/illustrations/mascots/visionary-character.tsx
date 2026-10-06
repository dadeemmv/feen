import { Circle, G, Path, Rect } from 'react-native-svg';

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
  Lapels,
  Legs,
  Line,
  Mouth,
  Nose,
  Outlined,
  ShirtAndTie,
  TORSO_SLIM,
  TORSO_SHADE,
  type Framing,
} from './character-parts';

const BLAZER = c.blazerBlue;
const HAIR = c.hairHoney;

/**
 * Vera — "La Visionaria" (risk · left): the conviction investor in disruptive tech. Honey bob
 * with a side-swept fringe, black glasses, gold studs, royal-blue blazer; one hand on the hip, the
 * other pointing at the rocket she just launched.
 */
export function VisionaryCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const full = framing === 'full';
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      {/* rocket, up and away */}
      {full ? (
        <>
          <G transform="translate(184 40) rotate(32)">
            <Outlined
              parts={[
                { d: 'M-5 14Q0 36 5 14Z', fill: c.flame },
                { d: 'M-8 2L-16 16L-7 14Z', fill: illustration.lime },
                { d: 'M8 2L16 16L7 14Z', fill: illustration.lime },
                {
                  d: 'M0 -26C8 -18 10 -4 8 15H-8C-10 -4 -8 -18 0 -26Z',
                  fill: c.rocket[0],
                },
              ]}
              shades={[{ d: 'M2 -26C8 -14 10 0 8 16H14V-28Z', fill: c.rocket[1] }]}>
              <Circle cx={0} cy={-6} r={4.6} fill={illustration.sky} stroke={INK} strokeWidth={2} />
              <Path d="M-2.5 15Q0 26 2.5 15Z" fill={c.flameCore} />
            </Outlined>
          </G>
        </>
      ) : null}
      {full ? (
        <>
          <Line d="M150 96Q156 80 166 72M144 90Q148 82 154 78" width={2} color={illustration.mutedLight} />
        </>
      ) : null}

      <Legs pair={c.trouser} />

      {/* bob, behind the head */}
      <Outlined
        parts={[
          {
            d: 'M66 80C62 42 86 20 112 20C140 20 158 42 154 80C156 98 156 112 150 122C140 126 130 122 128 112H92C90 122 80 126 70 122C64 112 64 98 66 80Z',
            fill: HAIR[0],
          },
        ]}
        shades={[{ d: 'M138 28C154 46 158 88 150 124H164V20Z', fill: HAIR[1] }]}
      />

      {/* pointing arm and hip arm, behind the blazer */}
      {full ? (
        <Arm d="M136 132Q158 118 160 90" sleeve={BLAZER[0]} cuff={{ d: 'M160 95L160 88', fill: c.shirt[0] }} />
      ) : null}
      {full ? <Arm d="M84 134Q50 160 70 186" sleeve={BLAZER[1]} /> : null}

      <Neck pair={c.skin} />
      <Outlined parts={[{ d: TORSO_SLIM, fill: BLAZER[0] }]} shades={[{ d: TORSO_SHADE, fill: BLAZER[1] }]} />
      <ShirtAndTie />
      <Lapels shade={BLAZER[1]} buttons={c.gold} />
      {full ? <Hand x={74} y={190} pose="fist" skin={c.skin} rotate={-60} /> : null}

      <Head pair={c.skin} />
      <Circle cx={75} cy={92} r={3.2} fill={c.gold} stroke={INK} strokeWidth={1.6} />
      <Circle cx={145} cy={92} r={3.2} fill={c.gold} stroke={INK} strokeWidth={1.6} />
      {/* side-swept fringe */}
      <Outlined
        parts={[
          {
            d: 'M75 76C72 46 92 29 113 29C134 29 148 44 146 68C139 55 125 47 108 49C96 51 86 60 81 72C79 74 77 75 75 76Z',
            fill: HAIR[0],
          },
        ]}
        shades={[{ d: 'M128 34C142 42 148 56 146 70H154V28Z', fill: HAIR[1] }]}>
        <Line d="M88 52Q104 40 128 40M96 40Q110 33 126 34" width={1.8} color={HAIR[1]} />
      </Outlined>

      <Brows color={HAIR[1]} y={61} tilt={2} width={3.4} />
      <Eyes y={76} bare look="up" />
      <Rect
        x={86}
        y={68}
        width={22}
        height={18}
        rx={8}
        stroke={c.frameBlack}
        strokeWidth={3.4}
        fill={c.shirt[0]}
        fillOpacity={0.1}
      />
      <Rect
        x={112}
        y={68}
        width={22}
        height={18}
        rx={8}
        stroke={c.frameBlack}
        strokeWidth={3.4}
        fill={c.shirt[0]}
        fillOpacity={0.1}
      />
      <Line d="M108 75H112M86 74L78 72M134 74L142 72" width={3} />
      <Nose pair={c.skin} />
      <Cheeks y={95} />
      <Mouth style="open" />

      {full ? <Hand x={161} y={80} pose="point" skin={c.skin} rotate={24} /> : null}
    </ArtSvg>
  );
}
