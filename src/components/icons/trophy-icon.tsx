import { Defs } from 'react-native-svg';

import { IconSvg, type IconProps } from './lib/icon-svg';
import { useSvgIds } from './lib/svg-ids';
import { TrophyBody, TrophyDefs } from './lib/trophy-shape';

export { TROPHY_CUP, TROPHY_HANDLES, TROPHY_STEM } from './lib/trophy-shape';

/** Gold cup trophy. */
export function TrophyIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('cup', 'base');
  return (
    <IconSvg {...rest}>
      <Defs>
        <TrophyDefs ids={ids} muted={muted} />
      </Defs>
      <TrophyBody ids={ids} muted={muted} />
    </IconSvg>
  );
}
