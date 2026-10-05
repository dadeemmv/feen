import { Defs, G, Path, Rect } from 'react-native-svg';

import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { TROPHY_CUP, TrophyBody, TrophyDefs } from '@/components/icons/lib/trophy-shape';
import { gradients, illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { placeOnGrid } from '../lib/place';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

/** Tilted 18° towards each other so the rims touch at (120, ~70). */
const LEFT = placeOnGrid(82, 104, 2.4, 18);
const RIGHT = placeOnGrid(158, 104, 2.4, -18);
/** "Clink" burst above the contact point. */
const BURST = 'M120 50V36M109 53L101 42M131 53L139 42M102 61L90 57M138 61L150 57';
/** [x, y, rotation, colour] confetti ribbons. */
const CONFETTI = [
  [30, 44, -30, illustration.lime],
  [210, 40, 35, gradients.heart[0]],
  [60, 20, 20, illustration.sky],
  [182, 14, -20, illustration.lime],
  [20, 96, 60, gradients.gem[0]],
  [222, 94, -55, illustration.gold],
  [80, 50, -65, illustration.gold],
  [164, 46, 70, illustration.sky],
] as const;

export type TrophyCupsProps = IllustrationProps & {
  /** Greyscale, no celebration (course not completed yet). */
  muted?: boolean;
};

/** "TRAGUARDO RAGGIUNTO": two trophies toasting, with a clink burst and confetti. */
export function TrophyCups({ muted, ...props }: TrophyCupsProps) {
  const ids = useSvgIds('shadow', 'glow', 'cup', 'base');
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <GlowGradient id={ids.glow} color={illustration.gold} opacity={0.4} />
        <TrophyDefs ids={ids} muted={muted} />
      </Defs>
      {muted ? null : <SoftEllipse id={ids.glow} cx={120} cy={74} rx={76} ry={64} />}
      <SoftEllipse id={ids.shadow} cx={120} cy={164} rx={96} ry={8} />

      <TrophyBody ids={ids} muted={muted} transform={LEFT} />
      <G transform={`translate(-3 3) ${RIGHT}`}>
        <Path d={TROPHY_CUP} fill={illustration.ink} fillOpacity={0.12} />
      </G>
      <TrophyBody ids={ids} muted={muted} transform={RIGHT} />

      {muted ? null : (
        <>
          <Path d={BURST} stroke={illustration.gold} strokeWidth={3.4} strokeLinecap="round" />
          <G>
            {CONFETTI.map(([x, y, rotate, color]) => (
              <Rect
                key={`${x}-${y}`}
                x={x - 4}
                y={y - 2}
                width={8}
                height={4}
                rx={2}
                fill={color}
                transform={`rotate(${rotate} ${x} ${y})`}
              />
            ))}
          </G>
          <Sparkle x={40} y={124} r={7} color={illustration.gold} />
          <Sparkle x={204} y={128} r={9} color={illustration.kiwiFlesh} />
        </>
      )}
    </ArtSvg>
  );
}
