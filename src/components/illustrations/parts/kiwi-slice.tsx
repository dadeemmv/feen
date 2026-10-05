/**
 * Decorative kiwi slice (skin ring + juicy flesh + fibres + seeds + cream core) in three colour
 * modes, used by `KiwiPattern` and reward art.
 */
import { Circle, G } from 'react-native-svg';

import { KiwiFace, KiwiFleshGradient, kiwiPalette, type KiwiPalette } from '@/components/icons/lib/kiwi-face';
import { illustration } from '@/theme';

/**
 * - `vivid`: full colour.
 * - `ghost`: translucent lime for evergreen surfaces (invite card, streak header).
 * - `tint`: pale green watermark for paper surfaces.
 */
export type KiwiSliceMode = 'vivid' | 'ghost' | 'tint';

const PALETTES: Record<KiwiSliceMode, KiwiPalette & { skin: string; opacity: number }> = {
  vivid: { ...kiwiPalette, skin: illustration.kiwiFleshDark, opacity: 1 },
  ghost: {
    flesh: illustration.lime,
    fleshLight: illustration.limeLight,
    fleshDark: illustration.kiwiFlesh,
    seed: illustration.forestDeep,
    core: illustration.limeLight,
    skin: illustration.kiwiFleshDark,
    opacity: 0.22,
  },
  tint: {
    flesh: illustration.forestLight,
    fleshLight: illustration.paper,
    fleshDark: illustration.forestLight,
    seed: illustration.forest,
    core: illustration.white,
    skin: illustration.forestLight,
    opacity: 0.55,
  },
};

export function KiwiSliceGradient({ id, mode }: { id: string; mode: KiwiSliceMode }) {
  return <KiwiFleshGradient id={id} palette={PALETTES[mode]} />;
}

type KiwiSliceProps = {
  fleshId: string;
  mode: KiwiSliceMode;
  cx: number;
  cy: number;
  r: number;
  /** Degrees; varies the seed orientation between slices. */
  rotate?: number;
};

export function KiwiSlice({ fleshId, mode, cx, cy, r, rotate = 0 }: KiwiSliceProps) {
  const palette = PALETTES[mode];
  return (
    <G transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${r})`} opacity={palette.opacity}>
      <Circle r={1} fill={palette.skin} />
      <Circle r={0.93} fill="none" stroke={palette.fleshLight} strokeOpacity={0.7} strokeWidth={0.025} />
      <KiwiFace fleshId={fleshId} detail="max" palette={palette} transform="scale(0.9)" />
    </G>
  );
}
