/**
 * Animatable layers of the Coach orb (the static pearl is `AssistantOrb` from the illustration
 * set): a soft lime halo that breathes on its own, and an orbiting rim glint that rotates over
 * the pearl. Both are plain SVG so the parent animates them with transforms/opacity only.
 */
import Svg, { Circle, Defs, Ellipse } from 'react-native-svg';

import { Radial } from '@/components/icons/lib/gradients';
import { svgA11y } from '@/components/icons/lib/icon-svg';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

const VIEW = 100;
const C = VIEW / 2;

type LayerProps = { size: number };

/** Glow behind the pearl (fills the whole orb box). */
export function OrbHalo({ size }: LayerProps) {
  const ids = useSvgIds('halo');
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW} ${VIEW}`} {...svgA11y()}>
      <Defs>
        <Radial
          id={ids.halo}
          stops={[
            [0.5, illustration.lime, 0.5],
            [0.72, illustration.lime, 0.18],
            [1, illustration.lime, 0],
          ]}
        />
      </Defs>
      <Circle cx={C} cy={C} r={C} fill={paint(ids.halo)} />
    </Svg>
  );
}

/** Two rim glints (white + mint) on opposite sides; rotated by the parent. Pearl-sized. */
export function OrbSheen({ size }: LayerProps) {
  const ids = useSvgIds('glint', 'tint');
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW} ${VIEW}`} {...svgA11y()}>
      <Defs>
        <Radial id={ids.glint} stops={[[0, illustration.white, 0.85], [1, illustration.white, 0]]} />
        <Radial id={ids.tint} stops={[[0, illustration.mint, 0.7], [1, illustration.mint, 0]]} />
      </Defs>
      <Ellipse cx={C} cy={12} rx={30} ry={11} fill={paint(ids.glint)} />
      <Ellipse cx={C} cy={88} rx={26} ry={10} fill={paint(ids.tint)} />
    </Svg>
  );
}
