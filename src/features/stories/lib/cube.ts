/**
 * Cube transition between story groups (Instagram / birdwingo pattern), as a pure worklet.
 *
 * React Native has no `translateZ`, so instead of rotating the faces around the cube's centre we
 * hinge them on their shared edge, kept in the screen plane at x = h(s):
 *   - the outgoing face rotates around its RIGHT edge by −s·90°,
 *   - the incoming face rotates around its LEFT edge by (1 − s)·90°,
 * with s ∈ [0, 1] the progress between the two groups. The hinge moves so that the outgoing
 * face's far edge stays glued to the left screen edge (first half) and the incoming face's far
 * edge to the right screen edge (second half). With a perspective of (1 + √½)·W both rules meet
 * at h = 0 when s = ½, so the motion is continuous and the faces fill the screen like a cube.
 */
import type { TransformsStyle } from 'react-native';

export type CubeFace = {
  transform: NonNullable<TransformsStyle['transform']>;
  /** 0 when facing the viewer, 1 when edge-on. */
  turn: number;
  /** Whether any part of the face is on screen. */
  visible: boolean;
};

const QUARTER = Math.PI / 2;

/** Hinge x (from the screen centre) keeping the outgoing face's left edge on the screen edge. */
function hingeForAngle(angle: number, width: number, perspective: number): number {
  'worklet';
  return width * Math.cos(angle) - width / 2 - (width * width * Math.sin(angle)) / (2 * perspective);
}

/**
 * @param t face position relative to the viewport, in widths: 0 = in front, −1 = turned away to
 *          the left, +1 = waiting on the right.
 */
export function cubeFace(t: number, width: number, perspectiveRatio: number): CubeFace {
  'worklet';
  const clamped = Math.max(-1, Math.min(1, t));
  const perspective = width * perspectiveRatio;
  if (Math.abs(clamped) >= 1) {
    return {
      transform: [{ translateX: clamped * width }],
      turn: 1,
      visible: false,
    };
  }
  // Progress of the pair this face belongs to: s = 0 → left face in front, 1 → right face.
  const s = clamped <= 0 ? -clamped : 1 - clamped;
  const hinge =
    s <= 0.5 ? hingeForAngle(s * QUARTER, width, perspective) : -hingeForAngle((1 - s) * QUARTER, width, perspective);
  const angle = clamped * QUARTER; // radians, negative = turning away to the left
  const halfWidth = width / 2;
  return {
    transform: [
      { perspective },
      { translateX: hinge },
      { rotateY: `${angle}rad` },
      // Outgoing face (t ≤ 0) hinges on its right edge, incoming face on its left edge.
      { translateX: clamped <= 0 ? -halfWidth : halfWidth },
    ],
    turn: Math.abs(clamped),
    visible: true,
  };
}
