/**
 * Small building blocks shared by every illustration: sparkles, soft contact shadows and glows.
 * Soft shapes use radial gradients instead of blur filters (cheap on native, identical on web).
 */
import { Ellipse, Path } from 'react-native-svg';

import { sparklePath } from '@/components/icons/lib/geometry';
import { Radial } from '@/components/icons/lib/gradients';
import { paint } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

type SparkleProps = { x: number; y: number; r: number; color?: string; opacity?: number };

/** 4-point sparkle. */
export function Sparkle({ x, y, r, color = illustration.white, opacity = 1 }: SparkleProps) {
  return <Path d={sparklePath(x, y, r, 0.2)} fill={color} fillOpacity={opacity} />;
}

/** Radial fade used for contact shadows and glows: `color` at `opacity` → transparent. */
export function GlowGradient({ id, color = illustration.ink, opacity = 0.2 }: { id: string; color?: string; opacity?: number }) {
  return (
    <Radial
      id={id}
      stops={[
        [0, color, opacity],
        [0.55, color, opacity * 0.55],
        [1, color, 0],
      ]}
    />
  );
}

type SoftEllipseProps = { id: string; cx: number; cy: number; rx: number; ry: number };

/** Ellipse painted with a `GlowGradient` (contact shadow, floor glow, halo). */
export function SoftEllipse({ id, cx, cy, rx, ry }: SoftEllipseProps) {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={paint(id)} />;
}
