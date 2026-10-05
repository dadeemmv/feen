import { Circle, G, Path } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './gradients';
import { KiwiFace, KiwiFleshGradient, kiwiPalette, mutedKiwiPalette, type KiwiDetail } from './kiwi-face';
import { paint } from './svg-ids';

/**
 * The Kiwi coin, drawn around (0, 0) with a face radius of 1 (the minted edge peeks out
 * below). Reused by `KiwiCoinIcon` and every coin in the illustrations.
 */
export type CoinIds = { rim: string; bevel: string; flesh: string };

export function KiwiCoinDefs({ ids, muted }: { ids: CoinIds; muted?: boolean }) {
  return (
    <>
      <Linear id={ids.rim} stops={twoStops(muted ? gradients.muted : [illustration.kiwiRimLight, illustration.kiwiRim])} />
      <Linear id={ids.bevel} stops={twoStops(muted ? [illustration.white, illustration.mutedLight] : [gradients.gold[0], illustration.kiwiRimLight])} />
      <KiwiFleshGradient id={ids.flesh} palette={muted ? mutedKiwiPalette : kiwiPalette} />
    </>
  );
}

type KiwiCoinProps = {
  ids: CoinIds;
  detail?: KiwiDetail;
  muted?: boolean;
  /** Draw the white rim glint (skip on tiny coins inside dense illustrations). */
  glint?: boolean;
  transform?: string;
};

export function KiwiCoin({ ids, detail = 'mid', muted, glint = true, transform }: KiwiCoinProps) {
  const edge = muted ? illustration.mutedDeep : illustration.kiwiRim;
  return (
    <G transform={transform}>
      {/* minted edge (thickness) */}
      <Circle cy={0.075} r={1} fill={edge} />
      {/* rim face */}
      <Circle r={1} fill={paint(ids.rim)} />
      {/* lighter bevel ring */}
      <Circle r={0.84} fill={paint(ids.bevel)} />
      {/* recessed skin line */}
      <Circle r={0.76} fill={edge} fillOpacity={0.9} />
      <KiwiFace
        fleshId={ids.flesh}
        detail={detail}
        palette={muted ? mutedKiwiPalette : kiwiPalette}
        transform="scale(0.71)"
      />
      {glint ? (
        <Path
          d="M-0.74 -0.3A0.8 0.8 0 0 1 -0.3 -0.74"
          stroke={illustration.white}
          strokeOpacity={0.85}
          strokeWidth={0.09}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
    </G>
  );
}
