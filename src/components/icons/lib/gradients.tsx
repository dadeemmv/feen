/**
 * Terse gradient definitions shared by icons and illustrations.
 *
 * Stops are `[offset, colour, opacity?]` tuples so a 2-stop token pair (`gradients.flame`)
 * becomes `twoStops(gradients.flame)`. Coordinates are in objectBoundingBox units (0…1)
 * unless `userSpace` is set, in which case they are in the SVG's viewBox units.
 *
 * NOTE: on native, react-native-svg reads `<Stop>` props from the gradient's *direct* children
 * (`extractGradient`), so stops must be rendered inline — never through a wrapper component.
 */
import { LinearGradient, RadialGradient, Stop } from 'react-native-svg';

export type StopSpec = readonly [offset: number, color: string, opacity?: number];
export type Point = readonly [x: number, y: number];

/** Token gradient pair → stop list. */
export const twoStops = (
  pair: readonly [string, string],
  opacity: readonly [number, number] = [1, 1],
): readonly StopSpec[] => [
  [0, pair[0], opacity[0]],
  [1, pair[1], opacity[1]],
];

const renderStops = (stops: readonly StopSpec[]) =>
  stops.map(([offset, color, opacity = 1], index) => (
    <Stop key={index} offset={offset} stopColor={color} stopOpacity={opacity} />
  ));

type LinearProps = {
  id: string;
  stops: readonly StopSpec[];
  /** Start point (default top). */
  from?: Point;
  /** End point (default bottom). */
  to?: Point;
  userSpace?: boolean;
};

export function Linear({ id, stops, from = [0, 0], to = [0, 1], userSpace }: LinearProps) {
  return (
    <LinearGradient
      id={id}
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      gradientUnits={userSpace ? 'userSpaceOnUse' : 'objectBoundingBox'}
    >
      {renderStops(stops)}
    </LinearGradient>
  );
}

type RadialProps = {
  id: string;
  stops: readonly StopSpec[];
  /** Centre (default middle). */
  center?: Point;
  /** Focal point (default = centre). */
  focus?: Point;
  r?: number;
  userSpace?: boolean;
};

export function Radial({ id, stops, center = [0.5, 0.5], focus, r = 0.5, userSpace }: RadialProps) {
  const f = focus ?? center;
  return (
    <RadialGradient
      id={id}
      cx={center[0]}
      cy={center[1]}
      fx={f[0]}
      fy={f[1]}
      r={r}
      gradientUnits={userSpace ? 'userSpaceOnUse' : 'objectBoundingBox'}
    >
      {renderStops(stops)}
    </RadialGradient>
  );
}
