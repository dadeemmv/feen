import { Defs, G, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { HEART_PATH, HeartDepth, HeartGloss } from '@/components/icons/lib/heart-shape';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { placeOnGrid } from '../lib/place';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

export const HEARTS_TRIO_SIZE = [220, 132] as const;

/**
 * Slots in paint order (sides first, centre on top). `index` is the fill order
 * (left → centre → right): 1 life = left heart, 2 lives = left + centre.
 */
const SLOTS = [
  { index: 0, transform: placeOnGrid(58, 76, 1.75, -14) },
  { index: 2, transform: placeOnGrid(162, 76, 1.75, 14) },
  { index: 1, transform: placeOnGrid(110, 64, 2.3) },
] as const;
const CENTRE = SLOTS[2].transform;

export type HeartsTrioVariant = 'rose' | 'gold';

export type HeartsTrioProps = IllustrationProps & {
  /** How many of the three hearts are full (0–3); the rest render greyed out. Default 3. */
  filled?: number;
  /** 'rose' = lives (default); 'gold' = unlimited lives. */
  variant?: HeartsTrioVariant;
};

/** Three hearts — the lives sheet ("Piena!") and out-of-lives states. */
export function HeartsTrio({ filled = 3, variant = 'rose', ...props }: HeartsTrioProps) {
  const ids = useSvgIds('shadow', 'full', 'empty');
  const full = variant === 'gold' ? gradients.gold : gradients.heart;
  const depth = variant === 'gold' ? illustration.kiwiRim : illustration.ink;
  return (
    <ArtSvg size={HEARTS_TRIO_SIZE} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <Linear id={ids.full} stops={twoStops(full)} from={[0.2, 0]} to={[0.7, 1]} />
        <Linear id={ids.empty} stops={twoStops([illustration.mutedLight, gradients.muted[0]])} from={[0.2, 0]} to={[0.7, 1]} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={110} cy={120} rx={92} ry={7} />

      {SLOTS.map(({ index, transform }) => {
        const on = index < filled;
        return (
          <G key={index}>
            {index === 1 ? (
              <G transform={`translate(0 4) ${CENTRE}`}>
                <Path d={HEART_PATH} fill={illustration.ink} fillOpacity={0.14} />
              </G>
            ) : null}
            <G transform={transform}>
              <Path d={HEART_PATH} fill={paint(on ? ids.full : ids.empty)} />
              <HeartDepth color={on ? depth : illustration.mutedDeep} opacity={on ? 0.14 : 0.1} />
              <HeartGloss opacity={on ? 0.6 : 0.45} />
            </G>
          </G>
        );
      })}

      {filled > 0 ? (
        <>
          <Sparkle x={196} y={22} r={8} color={variant === 'gold' ? illustration.gold : gradients.heart[0]} />
          <Sparkle x={24} y={30} r={5} color={illustration.gold} />
        </>
      ) : null}
    </ArtSvg>
  );
}
