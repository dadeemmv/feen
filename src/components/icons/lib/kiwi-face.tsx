import { Circle, Defs, Ellipse, G, Line } from 'react-native-svg';

import { illustration } from '@/theme';

import { Radial } from './gradients';
import { ring } from './geometry';
import { paint } from './svg-ids';

/**
 * Kiwi-slice face (flesh + seeds + cream core) drawn around (0, 0) with radius 1 so the same
 * artwork serves the 16 px coin icon, coin illustrations and the big decorative slices:
 * place it with `transform="translate(cx cy) scale(r)"`.
 *
 * `detail` trades seeds/fibres for legibility: 'min' (6 chunky seeds, for ≤ 24 px),
 * 'mid' (10 seeds) and 'max' (14 seeds + radial fibres, for large art).
 */
export type KiwiDetail = 'min' | 'mid' | 'max';

const SEEDS = {
  min: { points: ring(0, 0, 0.6, 6, 0), rx: 0.1, ry: 0.17 },
  mid: { points: ring(0, 0, 0.6, 10, 0), rx: 0.072, ry: 0.14 },
  max: { points: ring(0, 0, 0.61, 14, 0), rx: 0.05, ry: 0.11 },
} as const;
const FIBRES = ring(0, 0, 1, 14, 360 / 28);

export type KiwiPalette = {
  flesh: string;
  fleshLight: string;
  fleshDark: string;
  seed: string;
  core: string;
};

export const kiwiPalette: KiwiPalette = {
  flesh: illustration.kiwiFlesh,
  fleshLight: illustration.limeLight,
  fleshDark: illustration.kiwiFleshDark,
  seed: illustration.kiwiSeed,
  core: illustration.kiwiCore,
};

export const mutedKiwiPalette: KiwiPalette = {
  flesh: illustration.mutedLight,
  fleshLight: illustration.white,
  fleshDark: illustration.mutedDeep,
  seed: illustration.mutedDeep,
  core: illustration.white,
};

/** Radial flesh gradient; render once inside `<Defs>` and pass the same id to `KiwiFace`. */
export function KiwiFleshGradient({ id, palette = kiwiPalette }: { id: string; palette?: KiwiPalette }) {
  return (
    <Radial
      id={id}
      stops={[
        [0, palette.fleshLight],
        [0.42, palette.flesh],
        [1, palette.fleshDark],
      ]}
    />
  );
}

type KiwiFaceProps = {
  fleshId: string;
  detail?: KiwiDetail;
  palette?: KiwiPalette;
  transform?: string;
};

export function KiwiFace({ fleshId, detail = 'mid', palette = kiwiPalette, transform }: KiwiFaceProps) {
  const seeds = SEEDS[detail];
  return (
    <G transform={transform}>
      <Circle r={1} fill={paint(fleshId)} />
      {detail === 'max' ? (
        <G stroke={palette.core} strokeOpacity={0.55} strokeWidth={0.035} strokeLinecap="round">
          {FIBRES.map((p) => (
            <Line key={p.angle} x1={p.x * 0.34} y1={p.y * 0.34} x2={p.x * 0.86} y2={p.y * 0.86} />
          ))}
        </G>
      ) : null}
      <G fill={palette.seed}>
        {seeds.points.map((p) => (
          <Ellipse key={p.angle} cx={p.x} cy={p.y} rx={seeds.rx} ry={seeds.ry} transform={`rotate(${p.angle} ${p.x} ${p.y})`} />
        ))}
      </G>
      <Circle r={detail === 'min' ? 0.32 : 0.3} fill={palette.core} />
    </G>
  );
}

/** Convenience: a defs + face pair for standalone use. */
export function KiwiFaceDefs({ fleshId, palette }: { fleshId: string; palette?: KiwiPalette }) {
  return (
    <Defs>
      <KiwiFleshGradient id={fleshId} palette={palette} />
    </Defs>
  );
}
