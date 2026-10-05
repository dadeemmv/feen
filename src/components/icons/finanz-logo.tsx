import { Defs, G, Path, Rect } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

/** "FZ" monogram strokes on the 48 grid (drawn with round caps/joins, width `FZ_STROKE`). */
export const FZ_MONOGRAM = 'M11.5 33V15H20M11.5 23.8H18.5M28 15H36.5L28 33H36.5';
export const FZ_STROKE = 6.2;

export type FinanzLogoTone = 'lime' | 'brand';

export type FinanzLogoProps = Omit<IconProps, 'muted'> & {
  /** 'lime' = lime tile + evergreen letters (default); 'brand' = evergreen tile + lime letters. */
  tone?: FinanzLogoTone;
};

/** The monogram drawn at the origin of a 48 grid — used by the tile, the wordmark and wax seals. */
export function FzMonogram({ color, transform, strokeWidth = FZ_STROKE }: { color: string; transform?: string; strokeWidth?: number }) {
  return (
    <Path
      d={FZ_MONOGRAM}
      transform={transform}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

export function FinanzLogoTile({ tone = 'lime', tileId, glossId }: { tone?: FinanzLogoTone; tileId: string; glossId: string }) {
  const tile = tone === 'lime' ? gradients.accent : gradients.hero;
  const ink = tone === 'lime' ? illustration.forestDeep : illustration.lime;
  return (
    <G>
      <Defs>
        <Linear id={tileId} stops={twoStops(tile)} from={[0, 0]} to={[0.4, 1]} />
        <Linear id={glossId} stops={twoStops([illustration.white, illustration.white], [0.45, 0])} />
      </Defs>
      <Rect width={48} height={48} rx={12.5} fill={paint(tileId)} />
      <Rect x={3} y={2} width={42} height={20} rx={10} fill={paint(glossId)} />
      <FzMonogram color={ink} />
    </G>
  );
}

/** Finanz app mark: rounded-square tile with the FZ monogram. */
export function FinanzLogo({ tone = 'lime', accessibilityLabel = 'Finanz', ...rest }: FinanzLogoProps) {
  const ids = useSvgIds('tile', 'gloss');
  return (
    <IconSvg accessibilityLabel={accessibilityLabel} {...rest}>
      <FinanzLogoTile tone={tone} tileId={ids.tile} glossId={ids.gloss} />
    </IconSvg>
  );
}
