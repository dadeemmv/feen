import { Circle, Defs, Ellipse, Path } from 'react-native-svg';

import { Linear, Radial } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ArtSvg, type IllustrationProps } from './lib/art-svg';

export const ASSISTANT_ORB_SIZE = [200, 200] as const;
const C = 100;
const R = 62;
/** Rim light along the lower-right edge (from 110° to 200°, clockwise from 12 o'clock). */
const RIM = 'M154.5 119.8A58 58 0 0 1 80.2 154.5';

export type AssistantOrbProps = IllustrationProps & {
  /** Soft lime halo around the pearl. Default true. */
  halo?: boolean;
};

/**
 * The AI assistant's avatar: a glowing lime/mint pearl. Static artwork — the assistant screen
 * animates a wrapper (breathing scale/opacity) instead of the SVG itself.
 */
export function AssistantOrb({ halo = true, ...props }: AssistantOrbProps) {
  const ids = useSvgIds('halo', 'body', 'depth', 'spec', 'core');
  return (
    <ArtSvg size={ASSISTANT_ORB_SIZE} {...props}>
      <Defs>
        <Radial
          id={ids.halo}
          stops={[
            [0.55, illustration.lime, 0.4],
            [0.75, illustration.lime, 0.14],
            [1, illustration.lime, 0],
          ]}
        />
        <Radial
          id={ids.body}
          center={[0.4, 0.34]}
          r={0.72}
          stops={[
            [0, illustration.white],
            [0.42, gradients.assistant[0]],
            [0.8, illustration.mint],
            [1, illustration.lime],
          ]}
        />
        <Radial id={ids.depth} stops={[[0, gradients.storyRing[1], 0.5], [1, gradients.storyRing[1], 0]]} />
        <Linear id={ids.spec} stops={[[0, illustration.white, 0.95], [1, illustration.white, 0]]} />
        <Radial id={ids.core} stops={[[0, illustration.white, 0.75], [1, illustration.white, 0]]} />
      </Defs>

      {halo ? <Circle cx={C} cy={C} r={100} fill={paint(ids.halo)} /> : null}
      <Circle cx={C} cy={C} r={R} fill={paint(ids.body)} />
      {/* iridescent depth in the lower-right, inner glow at the centre */}
      <Ellipse cx={120} cy={124} rx={42} ry={32} transform="rotate(-30 120 124)" fill={paint(ids.depth)} />
      <Circle cx={C} cy={C} r={26} fill={paint(ids.core)} />
      {/* specular highlights */}
      <Ellipse cx={80} cy={72} rx={26} ry={15} transform="rotate(-35 80 72)" fill={paint(ids.spec)} />
      <Ellipse cx={72} cy={66} rx={7} ry={4.5} transform="rotate(-35 72 66)" fill={illustration.white} fillOpacity={0.9} />
      <Path d={RIM} stroke={illustration.white} strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" fill="none" />
    </ArtSvg>
  );
}
