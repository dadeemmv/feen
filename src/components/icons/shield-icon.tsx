import { Defs, Path } from 'react-native-svg';

import { gradients } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { SHIELD_PATH, ShieldDetails } from './lib/shield-shape';
import { paint, useSvgIds } from './lib/svg-ids';

/** Streak shield ("Scudo salva-streak"): sky gradient with a lighter inner chevron. */
export function ShieldIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('body');
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.body} stops={twoStops(muted ? gradients.muted : gradients.shield)} />
      </Defs>
      <Path d={SHIELD_PATH} fill={paint(ids.body)} />
      <ShieldDetails />
    </IconSvg>
  );
}
