import { Defs } from 'react-native-svg';

import { KiwiCoin, KiwiCoinDefs } from './lib/kiwi-coin-shape';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { useSvgIds } from './lib/svg-ids';

/**
 * The Finanz currency: a gold-rimmed coin with a kiwi-slice face. Seeds are simplified below
 * 24 px so it still reads as a kiwi inside 16 px chips.
 */
export function KiwiCoinIcon({ muted, size = 24, ...rest }: IconProps) {
  const ids = useSvgIds('rim', 'bevel', 'flesh');
  const detail = size < 24 ? 'min' : size >= 64 ? 'max' : 'mid';
  return (
    <IconSvg size={size} {...rest}>
      <Defs>
        <KiwiCoinDefs ids={ids} muted={muted} />
      </Defs>
      <KiwiCoin ids={ids} detail={detail} muted={muted} transform="translate(24 23) scale(21)" />
    </IconSvg>
  );
}
