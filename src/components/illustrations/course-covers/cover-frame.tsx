import type { ReactNode } from 'react';
import { Defs, G, Path, Rect } from 'react-native-svg';

import { Linear, Radial, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';

export type CoverBackground = 'brand' | 'paper';

export type CourseCoverProps = IllustrationProps & {
  /** 'brand' = evergreen hero surface (default), 'paper' = light card header. */
  background?: CoverBackground;
};

/** Colours that change with the cover background so the artwork keeps contrast. */
export type CoverInk = {
  /** Chart lines, positive candles. */
  line: string;
  /** Grid lines. */
  grid: string;
  gridOpacity: number;
  /** Contact shadows. */
  shadow: string;
  shadowOpacity: number;
  /** Outline that separates foreground strokes from the background. */
  halo: string;
  sparkle: string;
};

export const coverInk: Record<CoverBackground, CoverInk> = {
  brand: {
    line: illustration.lime,
    grid: illustration.white,
    gridOpacity: 0.07,
    shadow: illustration.forestDeep,
    shadowOpacity: 0.9,
    halo: illustration.forestDeep,
    sparkle: illustration.white,
  },
  paper: {
    line: illustration.forest,
    grid: illustration.forest,
    gridOpacity: 0.09,
    shadow: illustration.ink,
    shadowOpacity: 0.16,
    halo: illustration.white,
    sparkle: illustration.gold,
  },
};

const GRID = 'M0 45H320M0 90H320M0 135H320M80 0V180M160 0V180M240 0V180';

type CoverFrameProps = CourseCoverProps & { children: ReactNode; defs?: ReactNode };

/**
 * 16:9 cover artboard that fills its box (`slice`): background, spotlight glow and chart grid.
 * Keep key content inside the central ~240 × 150 so crops at other ratios stay safe.
 */
export function CoverFrame({ background = 'brand', defs, children, ...props }: CoverFrameProps) {
  const ids = useSvgIds('bg', 'glow');
  const ink = coverInk[background];
  return (
    <ArtSvg size={ART.cover} fit="slice" {...props}>
      <Defs>
        {background === 'brand' ? (
          <Linear id={ids.bg} stops={twoStops(gradients.hero)} />
        ) : (
          <Linear id={ids.bg} stops={twoStops([illustration.paper, illustration.limeLight])} from={[0, 0]} to={[1, 1]} />
        )}
        <Radial
          id={ids.glow}
          center={[0.78, 0.12]}
          r={0.75}
          stops={[
            [0, background === 'brand' ? illustration.lime : illustration.white, background === 'brand' ? 0.22 : 0.9],
            [1, background === 'brand' ? illustration.lime : illustration.white, 0],
          ]}
        />
        {defs}
      </Defs>
      <Rect width={320} height={180} fill={paint(ids.bg)} />
      <Rect width={320} height={180} fill={paint(ids.glow)} />
      <Path d={GRID} stroke={ink.grid} strokeOpacity={ink.gridOpacity} strokeWidth={1} />
      <G>{children}</G>
    </ArtSvg>
  );
}
