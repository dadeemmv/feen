import { Ellipse, G, Path } from 'react-native-svg';

import { mascotColors as c } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import {
  Arm,
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
  TORSO_ROUND,
  TORSO_SHADE,
  type Framing,
} from './character-parts';

const SUIT = c.suitNavy;
const HAIR = c.hairWhite;

/**
 * Bruno — "Il Cassettista" (unrisk · right): the old-school value investor. White hair combed
 * back with fluffy sides, bushy white brows, big gold glasses, navy suit and red tie; raises a
 * can of cherry soda, the business paper tucked in the other hand.
 */
export function ValueCharacter({ framing = 'full', ...props }: IllustrationProps & { framing?: Framing }) {
  const full = framing === 'full';
  return (
    <ArtSvg {...framingProps(framing)} {...props}>
      <Legs pair={SUIT} />

      {/* soda arm, raised behind the jacket */}
      {full ? (
        <Arm d="M136 134Q170 162 164 126" sleeve={SUIT[0]} cuff={{ d: 'M165 132L164 124', fill: c.shirt[0] }} />
      ) : null}

      {/* paper arm hanging by the side */}
      {full ? (
        <Arm d="M82 134Q62 168 72 196" sleeve={SUIT[1]} cuff={{ d: 'M71 192L73 199', fill: c.shirt[0] }} />
      ) : null}

      <Neck pair={c.skin} />
      <Outlined parts={[{ d: TORSO_ROUND, fill: SUIT[0] }]} shades={[{ d: TORSO_SHADE, fill: SUIT[1] }]} />
      <ShirtAndTie tie={c.tieRed} />
      <Lapels shade={SUIT[1]} buttons={SUIT[1]} />

      {full ? (
        <>
          <G transform="rotate(-10 72 206)">
            <Outlined
              parts={[{ d: 'M56 184H90V236H56Z', fill: c.paper[0] }]}
              shades={[{ d: 'M80 184H92V238H80Z', fill: c.paper[1] }]}>
              <Line d="M61 192H85" width={3.6} />
              <Line d="M61 200H85M61 205H78M61 210H85" width={1.6} color={c.paper[1]} />
              <Line d="M61 228L68 222L73 225L84 214" width={2.2} color={c.tieRed[0]} />
            </Outlined>
          </G>
        </>
      ) : null}
      {full ? <Hand x={74} y={204} pose="hold" skin={c.skin} flip /> : null}

      <Head pair={c.skin} />
      {/* combed-back white hair with fluffy sides */}
      <Outlined
        parts={[
          {
            d: 'M78 68C76 44 92 28 112 28C132 28 146 44 142 66C138 54 128 46 116 46C104 46 92 50 86 58C82 62 80 65 78 68Z',
            fill: HAIR[0],
          },
          { d: 'M80 76C70 74 68 62 76 56C82 56 84 64 82 76Z', fill: HAIR[0] },
          {
            d: 'M140 76C150 74 152 62 144 56C138 56 136 64 138 76Z',
            fill: HAIR[0],
          },
        ]}
        shades={[
          {
            d: 'M120 46C134 48 142 58 142 70H150V30C146 40 136 46 120 46Z',
            fill: HAIR[1],
          },
        ]}>
        <Line d="M92 38Q108 31 126 34M98 44Q112 39 128 42" width={1.8} color={HAIR[1]} />
      </Outlined>

      {/* bushy white brows, big gold glasses */}
      <Line d="M86 62Q96 55 105 61M115 61Q124 55 134 62" width={9} />
      <Line d="M86 62Q96 55 105 61M115 61Q124 55 134 62" width={5} color={HAIR[0]} />
      <Eyes y={77} bare />
      <Ellipse cx={97} cy={77} rx={11.5} ry={10.5} stroke={INK} strokeWidth={5.6} fill="none" />
      <Ellipse cx={123} cy={77} rx={11.5} ry={10.5} stroke={INK} strokeWidth={5.6} fill="none" />
      <Ellipse
        cx={97}
        cy={77}
        rx={11.5}
        ry={10.5}
        stroke={c.frameGold}
        strokeWidth={2.6}
        fill={c.shirt[0]}
        fillOpacity={0.12}
      />
      <Ellipse
        cx={123}
        cy={77}
        rx={11.5}
        ry={10.5}
        stroke={c.frameGold}
        strokeWidth={2.6}
        fill={c.shirt[0]}
        fillOpacity={0.12}
      />
      <Line d="M108 76Q110 73 112 76" width={2.6} color={c.frameGold} />
      <Nose pair={c.skin} big />
      <Cheeks y={96} />
      <Mouth style="smile" />
      <Line d="M93 98Q94 103 98 105M127 98Q126 103 122 105" width={1.8} color={c.skin[1]} />

      {/* cherry soda */}
      {full ? (
        <>
          <Outlined
            parts={[
              {
                d: 'M154 92Q154 89 157 89H169Q172 89 172 92V124H154Z',
                fill: c.canRed,
              },
            ]}
            shades={[{ d: 'M166 88H174V126H166Z', fill: c.tieRed[1] }]}>
            <Path d="M154 102H172V109H154Z" fill={c.shirt[0]} />
            <Line d="M157 89V85H169V89" width={2} />
          </Outlined>
        </>
      ) : null}
      {full ? <Hand x={163} y={122} pose="hold" skin={c.skin} /> : null}
    </ArtSvg>
  );
}
