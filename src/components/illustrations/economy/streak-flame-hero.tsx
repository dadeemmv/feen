import { Circle, Defs, G, Path } from 'react-native-svg';

import { FLAME_CORE, FLAME_OUTER } from '@/components/icons/flame-icon';
import { Linear, twoStops, type StopSpec } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { placeOnGrid } from '../lib/place';
import { GlowGradient, SoftEllipse } from '../parts/basics';

export const STREAK_FLAME_SIZE = [200, 240] as const;

/** Middle tongue between the outer flame and the core (48 grid). */
const FLAME_MID =
  'M25.2 11.5C27.2 18 35.5 22.6 35.5 32C35.5 39 30.4 43.2 24 43.2C17.6 43.2 12.6 38.9 12.6 32.8' +
  'C12.6 28.6 14.6 25.6 17 23.9C17.2 26.8 18.5 28.6 20.5 29.4C19.8 22.6 21.4 16 25.2 11.5Z';
const FLAME_GLOSS = 'M14.2 33C13.9 29.6 14.9 26.8 16.6 24.8';

const MAIN = placeOnGrid(100, 128, 5);
const DROPLET = placeOnGrid(160, 46, 1.15, 14);
/** [x, y, r] rising sparks. */
const EMBERS = [
  [44, 72, 3.2],
  [162, 100, 2.6],
  [34, 124, 2],
  [176, 152, 1.8],
  [60, 36, 1.8],
  [138, 22, 1.4],
] as const;

export type StreakFlameTone = 'ghost' | 'vivid';

export type StreakFlameHeroProps = IllustrationProps & {
  /**
   * 'ghost' (default) = translucent lime watermark for the evergreen streak header;
   * 'vivid' = full-colour flame with glow and embers (streak celebrations, paper cards).
   */
  tone?: StreakFlameTone;
};

type ToneSpec = {
  outer: readonly StopSpec[];
  mid: readonly StopSpec[];
  core: readonly StopSpec[];
  ember: string;
  emberOpacity: number;
  glow: boolean;
};

const TONES: Record<StreakFlameTone, ToneSpec> = {
  ghost: {
    outer: [
      [0, illustration.lime, 0.16],
      [1, illustration.lime, 0.05],
    ],
    mid: [
      [0, illustration.white, 0.03],
      [1, illustration.white, 0.07],
    ],
    core: [
      [0, illustration.white, 0.04],
      [1, illustration.white, 0.1],
    ],
    ember: illustration.lime,
    emberOpacity: 0.22,
    glow: false,
  },
  vivid: {
    outer: twoStops(gradients.flame),
    mid: twoStops([illustration.orange, gradients.flame[0]]),
    core: twoStops([gradients.flame[0], illustration.flameCore]),
    ember: illustration.flameCore,
    emberOpacity: 1,
    glow: true,
  },
};

/** Big layered streak flame (streak header watermark, streak celebrations). */
export function StreakFlameHero({ tone = 'ghost', ...props }: StreakFlameHeroProps) {
  const ids = useSvgIds('glow', 'outer', 'mid', 'core');
  const spec = TONES[tone];
  return (
    <ArtSvg size={STREAK_FLAME_SIZE} {...props}>
      <Defs>
        <GlowGradient id={ids.glow} color={illustration.orange} opacity={0.32} />
        <Linear id={ids.outer} stops={spec.outer} from={[0.3, 0]} to={[0.6, 1]} />
        <Linear id={ids.mid} stops={spec.mid} />
        <Linear id={ids.core} stops={spec.core} />
      </Defs>

      {spec.glow ? <SoftEllipse id={ids.glow} cx={100} cy={150} rx={100} ry={92} /> : null}

      <G transform={MAIN}>
        <Path d={FLAME_OUTER} fill={paint(ids.outer)} />
        <Path d={FLAME_MID} fill={paint(ids.mid)} />
        <Path d={FLAME_CORE} fill={paint(ids.core)} />
        {spec.glow ? (
          <Path d={FLAME_GLOSS} stroke={illustration.white} strokeOpacity={0.5} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        ) : null}
      </G>

      <G transform={DROPLET}>
        <Path d={FLAME_CORE} fill={paint(ids.outer)} />
      </G>
      <G fill={spec.ember} fillOpacity={spec.emberOpacity}>
        {EMBERS.map(([x, y, r]) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </G>
    </ArtSvg>
  );
}
