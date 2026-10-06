/**
 * Cartoon toolkit of the four companion characters (Duolingo-like construction with an inked
 * outline): flat base colours, one cel shade, every silhouette outlined in the same ink.
 *
 * Construction
 * - Artboard 220 × 300, figure ≈ 3 heads tall: big head (face ≈ 70 × 86 at (110, 73)), chunky
 *   torso (shoulders y ≈ 118, hem y ≈ 222), short legs, big shoes on y ≈ 279, oversized hands.
 * - `Outlined` draws a group of shapes twice: first every shape in ink, widened by `OUT` on each
 *   side, then every shape in its colour. Shapes of one group therefore merge into a single
 *   silhouette with one clean outline (an arm = sleeve + cuff; a head = ears + face), while
 *   separate groups stay outlined against each other. `shades` are cel-shade shapes clipped to the
 *   group's filled paths.
 * - Hands are drawn at the origin (palm centre) and placed with `x`, `y`, `rotate`, `flip`.
 * - `framing="bust"` crops the same drawing to head and shoulders (avatars, list rows, compass).
 */
import type { ReactNode } from 'react';
import { ClipPath, Defs, Ellipse, G, Path } from 'react-native-svg';

import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { mascotColors as c } from '@/theme';

export const CHARACTER_SIZE = [220, 300] as const;
/** Head-and-shoulders window of the same artboard: [x, y, size]. */
export const BUST_FRAME = [50, 6, 120] as const;
/** Outline half-width (the ink shows OUT units outside every silhouette). */
export const OUT = 3;
export const INK = c.ink;

export type Framing = 'full' | 'bust';

export const framingProps = (framing: Framing) =>
  framing === 'bust'
    ? {
        size: [BUST_FRAME[2], BUST_FRAME[2]] as const,
        origin: [BUST_FRAME[0], BUST_FRAME[1]] as const,
      }
    : { size: CHARACTER_SIZE, origin: [0, 0] as const };

/** Circle as a path (so it can join an `Outlined` group or a clip). */
export const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;

/** Mirror "x y" pairs of an absolute path across the artboard centre (x = 110). */
export const mirror = (d: string) =>
  d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${220 - Number(x)} ${y}`);

/** A filled shape, or a round-capped tube when `tube` (its stroke width) is set. */
export type Part = { d: string; fill: string; tube?: number };
export type Shade = { d: string; fill: string };

export function Outlined({
  parts,
  shades,
  children,
}: {
  parts: readonly Part[];
  shades?: readonly Shade[];
  children?: ReactNode;
}) {
  const ids = useSvgIds('clip');
  const solids = parts.filter((p) => !p.tube);
  return (
    <G>
      {parts.map((p, i) =>
        p.tube ? (
          <Path
            key={`i${i}`}
            d={p.d}
            stroke={INK}
            strokeWidth={p.tube + OUT * 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <Path key={`i${i}`} d={p.d} fill={INK} stroke={INK} strokeWidth={OUT * 2} strokeLinejoin="round" />
        ),
      )}
      {parts.map((p, i) =>
        p.tube ? (
          <Path
            key={`f${i}`}
            d={p.d}
            stroke={p.fill}
            strokeWidth={p.tube}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <Path key={`f${i}`} d={p.d} fill={p.fill} />
        ),
      )}
      {shades && shades.length > 0 && solids.length > 0 ? (
        <>
          <Defs>
            <ClipPath id={ids.clip}>
              {solids.map((p, i) => (
                <Path key={i} d={p.d} />
              ))}
            </ClipPath>
          </Defs>
          <G clipPath={`url(#${ids.clip})`}>
            {shades.map((s, i) => (
              <Path key={i} d={s.d} fill={s.fill} />
            ))}
          </G>
        </>
      ) : null}
      {children}
    </G>
  );
}

/** Thin inner ink line (lapels, creases, fingers, mouth). */
export function Line({ d, width = 2.4, color = INK }: { d: string; width?: number; color?: string }) {
  return <Path d={d} stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
}

/* ── Body ─────────────────────────────────────────────────────────────────────────────────── */

export const TORSO =
  'M72 134C72 123 82 118 94 118H126C138 118 148 123 148 134L154 212C154 218 150 222 144 222H76C70 222 66 218 66 212Z';
/** Body types: broad shoulders, a round belly, a slimmer frame (the default is in between). */
export const TORSO_BROAD =
  'M64 132C64 121 77 116 92 116H128C143 116 156 121 156 132L150 212C150 218 146 222 140 222H80C74 222 70 218 70 212Z';
export const TORSO_ROUND =
  'M72 134C72 123 82 118 94 118H126C138 118 148 123 148 134C157 160 160 192 153 214C151 220 147 222 141 222H79C73 222 69 220 67 214C60 192 63 160 72 134Z';
export const TORSO_SLIM =
  'M77 134C77 123 86 118 97 118H123C134 118 143 123 143 134L150 212C150 218 146 222 140 222H80C74 222 70 218 70 212Z';
/** Cel shade of the torso: the right flank. */
export const TORSO_SHADE = 'M136 118C148 140 152 182 146 224H160V112Z';
export const PANTS = 'M72 214H148L146 266H115L110 232L105 266H74Z';
export const PANTS_SHADE = 'M128 214C134 232 136 250 132 268H152V210Z';
export const SHOE_LEFT = 'M64 280C62 268 72 261 87 261C100 261 107 267 107 273V281H64Z';
export const SHOE_RIGHT = mirror(SHOE_LEFT);

export function Legs({ pair, shoe = c.shoe }: { pair: readonly [string, string]; shoe?: string }) {
  return (
    <>
      <Ellipse cx={110} cy={284} rx={58} ry={6} fill={INK} fillOpacity={0.12} />
      <Outlined
        parts={[
          { d: SHOE_LEFT, fill: shoe },
          { d: SHOE_RIGHT, fill: shoe },
        ]}
        shades={[{ d: 'M60 276H160V284H60Z', fill: INK }]}
      />
      <Outlined parts={[{ d: PANTS, fill: pair[0] }]} shades={[{ d: PANTS_SHADE, fill: pair[1] }]} />
      <Line d="M76 270Q84 266 92 268M144 270Q136 266 128 268" width={1.6} color={c.paper[0]} />
    </>
  );
}

/* ── Head ─────────────────────────────────────────────────────────────────────────────────── */

export const FACE = 'M76 72C76 44 91 30 110 30C129 30 144 44 144 72C144 100 130 116 110 116C90 116 76 100 76 72Z';
export const FACE_SHADE = 'M131 36C148 56 148 100 118 120H152V28Z';

/** Neck, drawn before the torso so the collar sits over it. */
export function Neck({ pair }: { pair: readonly [string, string] }) {
  return <Outlined parts={[{ d: 'M110 104V122', fill: pair[1], tube: 20 }]} />;
}

/** Ears + face, one silhouette. */
export function Head({ pair }: { pair: readonly [string, string] }) {
  return (
    <>
      <Outlined
        parts={[
          { d: circle(75, 78, 9), fill: pair[0] },
          { d: circle(145, 78, 9), fill: pair[0] },
          { d: FACE, fill: pair[0] },
        ]}
        shades={[
          { d: FACE_SHADE, fill: pair[1] },
          { d: circle(147, 80, 6), fill: pair[1] },
        ]}>
        <Line d="M72 76Q75 73 78 78M148 76Q145 73 142 78" width={1.6} color={pair[1]} />
      </Outlined>
    </>
  );
}

export type EyeLook = 'front' | 'side' | 'up';

/** Almond eyes with a big pupil: x of left and right eye, shared y. */
export function Eyes({
  y = 76,
  look = 'front',
  size = 1,
  bare = false,
}: {
  y?: number;
  look?: EyeLook;
  size?: number;
  bare?: boolean;
}) {
  const dx = look === 'side' ? 1.6 : 0.6;
  const dy = look === 'up' ? -2.2 : 0.8;
  if (bare) {
    // Behind glasses: just the pupils, so the lenses stay readable.
    return (
      <>
        {[97, 123].map((x) => (
          <G key={x}>
            <Ellipse cx={x + dx} cy={y + dy} rx={3.8 * size} ry={4.4 * size} fill={INK} />
            <Ellipse cx={x + dx + 1.3} cy={y + dy - 1.7} rx={1.4} ry={1.4} fill={c.shirt[0]} />
          </G>
        ))}
      </>
    );
  }
  return (
    <>
      {[97, 123].map((x) => (
        <G key={x}>
          <Ellipse cx={x} cy={y} rx={6.8 * size} ry={7.8 * size} fill={c.shirt[0]} stroke={INK} strokeWidth={2.2} />
          <Ellipse cx={x + dx} cy={y + dy} rx={3.6 * size} ry={4.2 * size} fill={INK} />
          <Ellipse cx={x + dx + 1.2} cy={y + dy - 1.6} rx={1.3} ry={1.3} fill={c.shirt[0]} />
        </G>
      ))}
    </>
  );
}

/** Eyebrows as thick strokes; `tilt` lifts the outer ends (negative frowns). */
export function Brows({
  color,
  y = 63,
  tilt = 0,
  width = 4.2,
}: {
  color: string;
  y?: number;
  tilt?: number;
  width?: number;
}) {
  return (
    <>
      <Line d={`M89 ${y + 1 - tilt}Q96 ${y - 3 - tilt / 2} 104 ${y}`} width={width} color={color} />
      <Line d={`M116 ${y}Q124 ${y - 3 - tilt / 2} 131 ${y + 1 - tilt}`} width={width} color={color} />
    </>
  );
}

export function Nose({ pair, big = false }: { pair: readonly [string, string]; big?: boolean }) {
  return big ? (
    <Path
      d="M108 80C103 90 101 97 108 99C113 100 117 98 116 93"
      fill={pair[1]}
      stroke={INK}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ) : (
    <Path d="M110 84C106 90 106 94 111 94" stroke={pair[1]} strokeWidth={3} strokeLinecap="round" fill="none" />
  );
}

export function Cheeks({ y = 92 }: { y?: number }) {
  return (
    <>
      <Ellipse cx={88} cy={y} rx={6} ry={3.6} fill={c.cheek} fillOpacity={0.45} />
      <Ellipse cx={132} cy={y} rx={6} ry={3.6} fill={c.cheek} fillOpacity={0.45} />
    </>
  );
}

export type MouthStyle = 'smile' | 'grin' | 'smirk' | 'open';

export function Mouth({ style }: { style: MouthStyle }) {
  switch (style) {
    case 'grin':
      return (
        <G>
          <Path
            d="M97 99Q110 101 123 99Q121 113 110 113Q99 113 97 99Z"
            fill={c.mouth}
            stroke={INK}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <Path d="M99 100Q110 102 121 100L120 104Q110 105 100 104Z" fill={c.shirt[0]} />
          <Path d="M103 110Q110 106 117 110Q114 113 110 113Q106 113 103 110Z" fill={c.tongue} />
        </G>
      );
    case 'open':
      return (
        <G>
          <Path
            d="M101 100Q110 98 119 100Q118 111 110 111Q102 111 101 100Z"
            fill={c.mouth}
            stroke={INK}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <Path d="M104 108Q110 104 116 108Q113 111 110 111Q107 111 104 108Z" fill={c.tongue} />
        </G>
      );
    case 'smirk':
      return <Line d="M100 103Q110 106 120 99" width={3} />;
    default:
      return <Line d="M99 101Q110 109 121 101" width={3} />;
  }
}

/* ── Hands ────────────────────────────────────────────────────────────────────────────────── */

export type HandPose = 'open' | 'fist' | 'point' | 'hold';

const FINGER = 5.4;
const FIST = 'M-9.5 -6Q-9.5 -10.5 -5 -10.5H6Q10.5 -10.5 10.5 -6V6Q10.5 11.5 5 11.5H-4Q-9.5 11.5 -9.5 6Z';

/** Palm-centred hand shapes; the thumb sits on the left (flip for the other hand). */
function handParts(pose: HandPose, skin: string): Part[] {
  switch (pose) {
    case 'open':
      return [
        {
          d: 'M-10 -2Q-10 -9 -3 -10H4Q10 -9 10 -2V5Q10 12 2 13H-3Q-10 12 -10 5Z',
          fill: skin,
        },
        { d: 'M-7.2 -6L-10.4 -21', fill: skin, tube: FINGER },
        { d: 'M-2.4 -8L-3.4 -25.5', fill: skin, tube: FINGER },
        { d: 'M2.6 -8L3.8 -24', fill: skin, tube: FINGER },
        { d: 'M7.2 -5L10.4 -18', fill: skin, tube: FINGER },
        { d: 'M-8 3L-18.5 -4', fill: skin, tube: FINGER + 0.6 },
      ];
    case 'point':
      return [
        { d: FIST, fill: skin },
        { d: 'M-5.2 -8L-6 -29', fill: skin, tube: FINGER + 0.4 },
      ];
    default:
      return [{ d: FIST, fill: skin }];
  }
}

/** Parts drawn over the hand with their own outline (the thumb folded across a fist). */
function handOverlay(pose: HandPose, skin: string): Part[] {
  return pose === 'open' ? [] : [{ d: 'M-8.5 3.5L0.5 1', fill: skin, tube: FINGER + 0.6 }];
}

const HAND_CREASES: Record<HandPose, string> = {
  open: 'M-3 7Q1 9 5 6',
  point: 'M1 -10.5V-5M5.5 -10.5V-5',
  hold: 'M-4 -10.5V-5M1 -10.5V-5M6 -10.5V-5',
  fist: 'M-4 -10.5V-5M1 -10.5V-5M6 -10.5V-5',
};

export type HandProps = {
  x: number;
  y: number;
  pose: HandPose;
  skin: readonly [string, string];
  rotate?: number;
  /** Mirror horizontally (thumb on the other side). */
  flip?: boolean;
  scale?: number;
};

export function Hand({ x, y, pose, skin, rotate = 0, flip = false, scale = 1 }: HandProps) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -scale : scale} ${scale})`}>
      <Outlined parts={handParts(pose, skin[0])}>
        <Line d={HAND_CREASES[pose]} width={1.8} color={pose === 'open' ? skin[1] : INK} />
      </Outlined>
      {pose === 'open' ? null : <Outlined parts={handOverlay(pose, skin[0])} />}
    </G>
  );
}

/** Sleeve as an outlined tube from the shoulder through the elbow, ending in a cuff. */
export function Arm({
  d,
  cuff,
  sleeve,
  width = 18,
}: {
  d: string;
  cuff?: { d: string; fill: string };
  sleeve: string;
  width?: number;
}) {
  const parts: Part[] = [{ d, fill: sleeve, tube: width }];
  if (cuff) parts.push({ d: cuff.d, fill: cuff.fill, tube: width - 1 });
  return <Outlined parts={parts} />;
}

/* ── Collars & tailoring ──────────────────────────────────────────────────────────────────── */

/** White shirt V, collar points and a tie, inside a jacket's neckline. */
export function ShirtAndTie({ tie }: { tie?: readonly [string, string] }) {
  return (
    <>
      <Outlined parts={[{ d: 'M95 118L110 160L125 118Z', fill: c.shirt[0] }]} />
      {tie ? (
        <Outlined
          parts={[
            { d: 'M105 125H115L117 131H103Z', fill: tie[0] },
            { d: 'M104 132H116L120 168L110 180L100 168Z', fill: tie[0] },
          ]}
          shades={[{ d: 'M112 130H124V184H112Z', fill: tie[1] }]}
        />
      ) : null}
      <Outlined
        parts={[
          { d: 'M95 116L103 133L110 122Z', fill: c.shirt[0] },
          { d: 'M125 116L117 133L110 122Z', fill: c.shirt[0] },
        ]}
      />
    </>
  );
}

/** Jacket lapels as inked folds plus buttons. */
export function Lapels({ shade, buttons }: { shade: string; buttons?: string }) {
  return (
    <>
      <Line d="M110 176V221" width={2.2} />
      <Path d="M94 118L108 168L98 160L86 128Z" fill={shade} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <Path d="M126 118L112 168L122 160L134 128Z" fill={shade} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      {buttons ? (
        <>
          <Ellipse cx={110} cy={190} rx={3.4} ry={3.4} fill={buttons} stroke={INK} strokeWidth={1.6} />
          <Ellipse cx={110} cy={205} rx={3.4} ry={3.4} fill={buttons} stroke={INK} strokeWidth={1.6} />
        </>
      ) : null}
    </>
  );
}
