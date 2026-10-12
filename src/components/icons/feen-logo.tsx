import { Circle, Defs, G, Path, Rect } from 'react-native-svg';

import { galleryColors, gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

/**
 * "fe" monogram on the 48 grid: Instrument Sans SemiBold outlines (the app's own font, SIL OFL),
 * filled, centred in the tile together with the sun dot. The same mark is the app icon.
 */
export const FE_MONOGRAM =
  'M10.52 33.84V18.99Q10.52 16.75 11.76 15.56Q13 14.38 15.48 14.38Q16.04 14.38 16.41 14.43Q16.78 14.48 17.13 14.59V17.2Q16.94 17.12 16.65 17.09Q16.36 17.05 15.98 17.05Q14.92 17.05 14.4 17.57Q13.88 18.09 13.88 19.07V33.84ZM8.06 22.88V20.24H16.84V22.88ZM24.62 34.11Q22.46 34.11 20.85 33.2Q19.24 32.3 18.34 30.7Q17.45 29.1 17.45 27.02Q17.45 24.94 18.34 23.35Q19.24 21.77 20.84 20.87Q22.44 19.98 24.57 19.98Q26.6 19.98 28.09 20.82Q29.58 21.66 30.41 23.18Q31.24 24.7 31.24 26.73Q31.24 27.1 31.21 27.42Q31.18 27.74 31.13 28.06H19.53V25.71H28.54L27.85 26.35Q27.85 24.43 26.97 23.47Q26.09 22.51 24.52 22.51Q22.81 22.51 21.81 23.69Q20.81 24.86 20.81 27.07Q20.81 29.26 21.81 30.42Q22.81 31.58 24.65 31.58Q25.72 31.58 26.52 31.18Q27.32 30.78 27.69 29.95H30.86Q30.2 31.87 28.61 32.99Q27.02 34.11 24.62 34.11Z';
/** The sun dot at the top right of the monogram (the palette's accent, like the old mark's dot). */
const DOT = { cx: 37.04, cy: 16.79, r: 2.9 } as const;

export type FeenLogoTone = 'brand' | 'paper';

export type FeenLogoProps = Omit<IconProps, 'muted'> & {
  /** 'brand' = indigo tile + white letters (default); 'paper' = white tile + indigo letters. */
  tone?: FeenLogoTone;
};

/** The monogram letters drawn on a 48 grid — used by the tile and the wax seals. */
export function FeMonogram({ color, transform }: { color: string; transform?: string }) {
  return <Path d={FE_MONOGRAM} transform={transform} fill={color} />;
}

export function FeenLogoTile({ tone = 'brand', tileId, glossId }: { tone?: FeenLogoTone; tileId: string; glossId: string }) {
  const tile = tone === 'brand' ? gradients.hero : ([illustration.white, illustration.white] as const);
  const ink = tone === 'brand' ? illustration.white : galleryColors.indigo;
  return (
    <G>
      <Defs>
        <Linear id={tileId} stops={twoStops(tile)} from={[0, 0]} to={[0.4, 1]} />
        <Linear id={glossId} stops={twoStops([illustration.white, illustration.white], [0.3, 0])} />
      </Defs>
      <Rect width={48} height={48} rx={12.5} fill={paint(tileId)} />
      <Rect x={3} y={2} width={42} height={20} rx={10} fill={paint(glossId)} />
      <FeMonogram color={ink} />
      <Circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill={galleryColors.sun} />
    </G>
  );
}

/** Feen app mark: rounded-square tile with the "fe" monogram and the sun dot. */
export function FeenLogo({ tone = 'brand', accessibilityLabel = 'Feen', ...rest }: FeenLogoProps) {
  const ids = useSvgIds('tile', 'gloss');
  return (
    <IconSvg accessibilityLabel={accessibilityLabel} {...rest}>
      <FeenLogoTile tone={tone} tileId={ids.tile} glossId={ids.gloss} />
    </IconSvg>
  );
}
