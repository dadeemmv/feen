/**
 * Kiwi coins in perspective: a stack seen slightly from above (edge bands + one kiwi top face).
 * Only the top coin draws a face; lower coins only show their minted edge.
 */
import { Ellipse, G, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { KiwiFace, KiwiFleshGradient } from '@/components/icons/lib/kiwi-face';
import { paint } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

export type CoinStackIds = { edge: string; face: string; flesh: string };

/** ry / r of a coin face seen from ~20° above. */
const SQUASH = 0.36;
const JITTER = [0, 0.05, -0.04, 0.07, -0.02, 0.04, -0.06, 0.02] as const;

export function CoinStackDefs({ ids }: { ids: CoinStackIds }) {
  return (
    <>
      <Linear
        id={ids.edge}
        from={[0, 0]}
        to={[1, 0]}
        stops={[
          [0, illustration.kiwiRim],
          [0.3, illustration.kiwiRimLight],
          [0.55, illustration.gold],
          [1, illustration.kiwiRim],
        ]}
      />
      <Linear id={ids.face} stops={twoStops([gradients.gold[0], illustration.kiwiRimLight])} />
      <KiwiFleshGradient id={ids.flesh} />
    </>
  );
}

type CoinStackProps = {
  ids: CoinStackIds;
  cx: number;
  /** y of the bottom edge of the lowest coin. */
  baseY: number;
  /** Coin radius (half width). */
  r: number;
  count: number;
  /** Coin thickness; defaults to 26% of r. */
  thickness?: number;
};

export function CoinStack({ ids, cx, baseY, r, count, thickness = r * 0.26 }: CoinStackProps) {
  const ry = r * SQUASH;
  const coins = Array.from({ length: count }, (_, i) => ({
    x: cx + JITTER[i % JITTER.length] * r,
    y: baseY - ry - (i + 1) * thickness,
  }));
  const top = coins[coins.length - 1];
  return (
    <G>
      {coins.map(({ x, y }) => (
        <G key={y}>
          <Path
            d={`M${x - r} ${y}V${y + thickness}A${r} ${ry} 0 0 0 ${x + r} ${y + thickness}V${y}Z`}
            fill={paint(ids.edge)}
          />
          <Path
            d={`M${x - r * 0.96} ${y + thickness * 0.5}A${r} ${ry} 0 0 0 ${x + r * 0.96} ${y + thickness * 0.5}`}
            stroke={illustration.kiwiRim}
            strokeOpacity={0.35}
            strokeWidth={Math.max(0.6, thickness * 0.1)}
            fill="none"
          />
        </G>
      ))}
      <Ellipse cx={top.x} cy={top.y} rx={r} ry={ry} fill={paint(ids.face)} />
      <Ellipse cx={top.x} cy={top.y} rx={r * 0.84} ry={ry * 0.84} fill={illustration.kiwiRim} fillOpacity={0.9} />
      <KiwiFace
        fleshId={ids.flesh}
        detail={r > 22 ? 'mid' : 'min'}
        transform={`translate(${top.x} ${top.y}) scale(${r * 0.76} ${r * 0.76 * SQUASH})`}
      />
      <Path
        d={`M${top.x - r * 0.72} ${top.y - ry * 0.55}A${r} ${ry} 0 0 1 ${top.x - r * 0.1} ${top.y - ry * 0.97}`}
        stroke={illustration.white}
        strokeOpacity={0.8}
        strokeWidth={Math.max(1, r * 0.07)}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}
