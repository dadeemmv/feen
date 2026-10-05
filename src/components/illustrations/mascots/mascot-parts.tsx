/**
 * Shared anatomy of the four companion mascots. Every mascot sits on the same 200 × 200 artboard
 * (chibi proportions: head ≈ 112 wide centred at y ≈ 94, body below, feet on y ≈ 188) so they
 * line up when shown side by side, and uses the same eyes, cheeks and gloss.
 */
import { Circle, Ellipse, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { illustration, mascotColors } from '@/theme';

export const MASCOT_SIZE = [200, 200] as const;

/** Diagonal fur gradient (light top-left → deep bottom-right). */
export function FurGradient({ id, from, to }: { id: string; from: string; to: string }) {
  return <Linear id={id} stops={twoStops([from, to])} from={[0.2, 0]} to={[0.8, 1]} />;
}

/** Open eye: ink pupil with a catch-light. */
export function Eye({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <Circle cx={x} cy={y} r={r} fill={illustration.ink} />
      <Circle cx={x + r * 0.34} cy={y - r * 0.38} r={r * 0.36} fill={illustration.white} />
      <Circle cx={x - r * 0.36} cy={y + r * 0.4} r={r * 0.14} fill={illustration.white} fillOpacity={0.7} />
    </>
  );
}

/** Closed, content eye (∩ arc). */
export function HappyEye({ x, y, w = 15 }: { x: number; y: number; w?: number }) {
  const h = w * 0.5;
  return (
    <Path
      d={`M${x - w / 2} ${y + h / 2}Q${x} ${y - h} ${x + w / 2} ${y + h / 2}`}
      stroke={illustration.ink}
      strokeWidth={3.6}
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** Winking eye (a soft ∪ lash line). */
export function WinkEye({ x, y, w = 16 }: { x: number; y: number; w?: number }) {
  return (
    <Path
      d={`M${x - w / 2} ${y - 1}Q${x} ${y + w * 0.42} ${x + w / 2} ${y - 1}`}
      stroke={illustration.ink}
      strokeWidth={3.6}
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** Rosy cheeks at ±dx from the centre line. */
export function Cheeks({ y, dx = 36, rx = 9 }: { y: number; dx?: number; rx?: number }) {
  return (
    <>
      <Ellipse cx={100 - dx} cy={y} rx={rx} ry={rx * 0.6} fill={mascotColors.cheek} fillOpacity={0.42} />
      <Ellipse cx={100 + dx} cy={y} rx={rx} ry={rx * 0.6} fill={mascotColors.cheek} fillOpacity={0.42} />
    </>
  );
}

/** Soft white highlight on the top-left of a round form. */
export function Gloss({ cx, cy, rx = 16, ry = 8, angle = -28 }: { cx: number; cy: number; rx?: number; ry?: number; angle?: number }) {
  return (
    <Ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      transform={`rotate(${angle} ${cx} ${cy})`}
      fill={illustration.white}
      fillOpacity={0.32}
    />
  );
}

/** Mirror an x coordinate across the artboard centre line. */
export const mirrorX = (x: number) => 200 - x;

/** Mirror an absolute path made of "x y" pairs (M/L/C/Q/Z commands only). */
export const mirrorPath = (d: string) =>
  d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${mirrorX(Number(x))} ${y}`);
