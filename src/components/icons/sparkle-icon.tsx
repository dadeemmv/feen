import { Defs, Path } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { sparklePath } from './lib/geometry';
import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

export type SparkleTone = 'white' | 'lime' | 'gold' | 'brand';

export type SparkleIconProps = IconProps & {
  tone?: SparkleTone;
  /** Adds the small companion sparkle (top-right). Default true. */
  twin?: boolean;
};

const TONES: Record<SparkleTone, readonly [string, string]> = {
  white: [illustration.white, illustration.limeLight],
  lime: gradients.accent,
  gold: gradients.gold,
  brand: [illustration.forest, illustration.forestDeep],
};

const MAIN = sparklePath(21, 27, 18, 0.2);
const TWIN = sparklePath(38.5, 9.5, 6.5, 0.2);

/** 4-point AI sparkle (assistant button, "Spiegami il perchè", celebrations). */
export function SparkleIcon({ tone = 'white', twin = true, muted, ...rest }: SparkleIconProps) {
  const ids = useSvgIds('body');
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.body} stops={twoStops(muted ? gradients.muted : TONES[tone])} />
      </Defs>
      <Path d={MAIN} fill={paint(ids.body)} />
      {twin ? <Path d={TWIN} fill={paint(ids.body)} /> : null}
    </IconSvg>
  );
}
