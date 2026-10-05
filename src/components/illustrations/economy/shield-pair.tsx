import { Defs, G, Path } from 'react-native-svg';

import { FLAME_CORE, FLAME_OUTER } from '@/components/icons/flame-icon';
import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { SHIELD_PATH, ShieldDetails } from '@/components/icons/lib/shield-shape';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { placeOnGrid } from '../lib/place';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

export const SHIELD_PAIR_SIZE = [180, 156] as const;
const FRONT = placeOnGrid(106, 80, 2.9, 8);
const BACK = placeOnGrid(62, 72, 2.4, -12);
/** Streak flame emblem inside the front shield (shield-local 48 grid). */
const EMBLEM = placeOnGrid(24, 25.5, 0.44);

export type ShieldPairProps = IllustrationProps & {
  /** Greyscale (e.g. no shields owned). */
  muted?: boolean;
};

/**
 * "Scudo salva-streak": two overlapping streak shields — the front one carries the streak
 * flame to say "your streak is protected".
 */
export function ShieldPair({ muted, ...props }: ShieldPairProps) {
  const ids = useSvgIds('shadow', 'front', 'back');
  const front = muted ? gradients.muted : gradients.shield;
  const back: readonly [string, string] = muted
    ? [illustration.mutedLight, gradients.muted[0]]
    : [illustration.sky, gradients.shield[0]];
  return (
    <ArtSvg size={SHIELD_PAIR_SIZE} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <Linear id={ids.front} stops={twoStops(front)} />
        <Linear id={ids.back} stops={twoStops(back)} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={98} cy={146} rx={64} ry={6} />

      <G transform={BACK}>
        <Path d={SHIELD_PATH} fill={paint(ids.back)} />
        <ShieldDetails chevron={false} />
      </G>

      {/* the front shield casts a soft shadow onto the back one */}
      <G transform={`translate(-4 4) ${FRONT}`}>
        <Path d={SHIELD_PATH} fill={illustration.ink} fillOpacity={0.14} />
      </G>
      <G transform={FRONT}>
        <Path d={SHIELD_PATH} fill={paint(ids.front)} />
        <ShieldDetails chevron={false} />
        <G transform={EMBLEM}>
          <Path d={FLAME_OUTER} fill={illustration.white} fillOpacity={0.95} />
          <Path d={FLAME_CORE} fill={paint(ids.front)} />
        </G>
      </G>

      {muted ? null : (
        <>
          <Sparkle x={162} y={20} r={9} color={illustration.gold} />
          <Sparkle x={20} y={118} r={6} color={illustration.sky} />
        </>
      )}
    </ArtSvg>
  );
}
