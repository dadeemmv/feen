/**
 * Shared anatomy of the four companion characters. Every character stands on the same 200 × 320
 * artboard with 16Personalities-like proportions (≈ 4.3 heads tall: head centred at (100, 62),
 * shoulders at y ≈ 102, hips at y ≈ 206, shoes on y ≈ 296) and the illustration language of the
 * app: two-stop gradients, soft gloss, ink eyes with a catch-light, rosy cheeks.
 * `framing="bust"` crops the same drawing to head and shoulders for small sizes.
 */
import { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint } from '@/components/icons/lib/svg-ids';
import { illustration, mascotColors } from '@/theme';

export const CHARACTER_SIZE = [200, 320] as const;
/** Head-and-shoulders window of the same artboard: [x, y, size]. */
export const BUST_FRAME = [44, 18, 112] as const;

export type Framing = 'full' | 'bust';

export const framingProps = (framing: Framing) =>
  framing === 'bust'
    ? { size: [BUST_FRAME[2], BUST_FRAME[2]] as const, origin: [BUST_FRAME[0], BUST_FRAME[1]] as const }
    : { size: CHARACTER_SIZE, origin: [0, 0] as const };

/** Vertical two-stop gradient (light top → deep bottom), slightly diagonal. */
export function Grad({ id, pair }: { id: string; pair: readonly [string, string] }) {
  return <Linear id={id} stops={twoStops(pair)} from={[0.25, 0]} to={[0.75, 1]} />;
}

/** Soft floor shadow. */
export function FloorShadow({ id }: { id: string }) {
  return <Ellipse cx={100} cy={300} rx={54} ry={7} fill={paint(id)} />;
}

/** Torso outline (jacket, sweater or shirt), shoulders to hips. */
export const TORSO = 'M64 122C64 108 74 102 88 101L112 101C126 102 136 108 136 122L132 210L68 210Z';
export const LEG_LEFT = 'M70 204L99 204L97 292L77 292Z';
export const LEG_RIGHT = 'M101 204L130 204L123 292L103 292Z';

export function Legs({ fill }: { fill: string }) {
  return (
    <>
      <Path d={LEG_LEFT} fill={fill} stroke={fill} strokeWidth={2} strokeLinejoin="round" />
      <Path d={LEG_RIGHT} fill={fill} stroke={fill} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M100 210L100 288" stroke={illustration.ink} strokeOpacity={0.12} strokeWidth={2} />
    </>
  );
}

export function Shoes({ color = mascotColors.shoe }: { color?: string }) {
  return (
    <>
      <Ellipse cx={84} cy={295} rx={15} ry={6.5} fill={color} />
      <Ellipse cx={116} cy={295} rx={15} ry={6.5} fill={color} />
      <Ellipse cx={80} cy={292.5} rx={5} ry={1.6} fill={illustration.white} fillOpacity={0.3} />
      <Ellipse cx={112} cy={292.5} rx={5} ry={1.6} fill={illustration.white} fillOpacity={0.3} />
    </>
  );
}

/** A limb as a thick rounded stroke. */
export function Limb({ d, stroke, width = 17 }: { d: string; stroke: string; width?: number }) {
  return <Path d={d} stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
}

export function Hand({ x, y, skinId, r = 7.5 }: { x: number; y: number; skinId: string; r?: number }) {
  return <Circle cx={x} cy={y} r={r} fill={paint(skinId)} />;
}

/** Neck (drawn before the torso). */
export function Neck({ skinId }: { skinId: string }) {
  return (
    <>
      <Rect x={91} y={84} width={18} height={24} rx={6} fill={paint(skinId)} />
      <Rect x={91} y={92} width={18} height={8} fill={mascotColors.skinShade} fillOpacity={0.35} />
    </>
  );
}

/** Ears + head + gloss (drawn after the torso, before hair and face). */
export function Head({ skinId }: { skinId: string }) {
  return (
    <>
      <Ellipse cx={71} cy={66} rx={5.5} ry={8} fill={paint(skinId)} />
      <Ellipse cx={129} cy={66} rx={5.5} ry={8} fill={paint(skinId)} />
      <Ellipse cx={100} cy={62} rx={29} ry={33} fill={paint(skinId)} />
    </>
  );
}

export type EyeStyle = 'open' | 'happy';

export function Eyes({ style = 'open', y = 64 }: { style?: EyeStyle; y?: number }) {
  if (style === 'happy') {
    return (
      <>
        {[89, 111].map((x) => (
          <Path
            key={x}
            d={`M${x - 4.5} ${y + 1.5}Q${x} ${y - 4} ${x + 4.5} ${y + 1.5}`}
            stroke={illustration.ink}
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </>
    );
  }
  return (
    <>
      {[89, 111].map((x) => (
        <OpenEye key={x} x={x} y={y} />
      ))}
    </>
  );
}

function OpenEye({ x, y }: { x: number; y: number }) {
  return (
    <>
      <Circle cx={x} cy={y} r={3.9} fill={illustration.ink} />
      <Circle cx={x + 1.3} cy={y - 1.5} r={1.4} fill={illustration.white} />
    </>
  );
}

/** Eyebrows: [left lift, right lift] in units (positive raises the outer end). */
export function Brows({ color, width = 2.6, lift = [0, 0] }: { color: string; width?: number; lift?: readonly [number, number] }) {
  return (
    <>
      <Path
        d={`M83 ${55 - lift[0]}Q89 ${51 - lift[0]} 95 ${54}`}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d={`M105 54Q111 ${51 - lift[1]} 117 ${55 - lift[1]}`}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

export function Nose() {
  return <Path d="M100 66Q97.5 72 100.5 73.5" stroke={mascotColors.skinShade} strokeWidth={2} strokeLinecap="round" fill="none" />;
}

export function Cheeks() {
  return (
    <>
      <Ellipse cx={84} cy={75} rx={5.5} ry={3.4} fill={mascotColors.cheek} fillOpacity={0.4} />
      <Ellipse cx={116} cy={75} rx={5.5} ry={3.4} fill={mascotColors.cheek} fillOpacity={0.4} />
    </>
  );
}

export type MouthStyle = 'smile' | 'grin' | 'soft';

export function Mouth({ style = 'smile' }: { style?: MouthStyle }) {
  if (style === 'grin') {
    return (
      <>
        <Path d="M90 79Q100 92 110 79Z" fill={illustration.white} stroke={illustration.ink} strokeWidth={2.2} strokeLinejoin="round" />
        <Path d="M93 84Q100 89 107 84" stroke={mascotColors.cheek} strokeWidth={2} strokeLinecap="round" fill="none" />
      </>
    );
  }
  if (style === 'soft') {
    return <Path d="M94 80Q100 84 106 80" stroke={illustration.ink} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
  }
  return <Path d="M92 79Q100 87 108 79" stroke={illustration.ink} strokeWidth={2.4} strokeLinecap="round" fill="none" />;
}

export type GlassesStyle = 'wire' | 'rect' | 'round';

export function Glasses({ style, color }: { style: GlassesStyle; color: string }) {
  const frame = { wire: { h: 14, rx: 6, w: 1.8 }, rect: { h: 12, rx: 3, w: 2.8 }, round: { h: 15, rx: 7.5, w: 2.6 } }[style];
  const top = 64 - frame.h / 2;
  return (
    <>
      <Rect x={79} y={top} width={20} height={frame.h} rx={frame.rx} stroke={color} strokeWidth={frame.w} fill={illustration.white} fillOpacity={0.14} />
      <Rect x={101} y={top} width={20} height={frame.h} rx={frame.rx} stroke={color} strokeWidth={frame.w} fill={illustration.white} fillOpacity={0.14} />
      <Path d="M99 63Q100 61 101 63" stroke={color} strokeWidth={frame.w} fill="none" />
      <Path d={`M79 ${top + 3}L72 ${top + 1}M121 ${top + 3}L128 ${top + 1}`} stroke={color} strokeWidth={frame.w} strokeLinecap="round" />
    </>
  );
}

/** White shirt opening with collar points, between the lapels. */
export function ShirtFront({ depth = 140 }: { depth?: number }) {
  return (
    <>
      <Path d={`M86 101L100 ${depth}L114 101Z`} fill={mascotColors.shirt} />
      <Path d="M86 101L94 116L100 106L106 116L114 101Z" fill={mascotColors.shirt} stroke={mascotColors.shirtShade} strokeWidth={1.2} strokeLinejoin="round" />
    </>
  );
}

export function Tie({ color, tilt = 0 }: { color: string; tilt?: number }) {
  return (
    <Path
      d="M97.5 107L102.5 107L104 112L106 146L100 154L94 146L96 112Z"
      fill={color}
      transform={`rotate(${tilt} 100 107)`}
    />
  );
}

/** Lapels of a jacket (darker V either side of the shirt). */
export function Lapels({ fill }: { fill: string }) {
  return (
    <>
      <Path d="M86 101L100 140L90 146L78 112Z" fill={fill} />
      <Path d="M114 101L100 140L110 146L122 112Z" fill={fill} />
    </>
  );
}

/** Thin vertical pinstripes over the torso and legs. */
export function Pinstripes() {
  const xs = [70, 78, 86, 114, 122, 130];
  return (
    <>
      {xs.map((x) => (
        <Path key={x} d={`M${x} 104L${x} 292`} stroke={illustration.white} strokeOpacity={0.16} strokeWidth={1} />
      ))}
    </>
  );
}
