import { Defs } from 'react-native-svg';

import { useSvgIds } from '@/components/icons/lib/svg-ids';

import { ArtSvg, type IllustrationProps } from './lib/art-svg';
import { KiwiSlice, KiwiSliceGradient, type KiwiSliceMode } from './parts/kiwi-slice';

export type KiwiPatternDensity = 'sparse' | 'regular' | 'dense';

export type KiwiPatternProps = IllustrationProps & {
  /** sparse = 3 big cropped slices (invite card), regular = 6, dense = tiled confetti. */
  density?: KiwiPatternDensity;
  /** vivid (full colour) · ghost (translucent, on evergreen) · tint (watermark, on paper). */
  mode?: KiwiSliceMode;
};

export const KIWI_PATTERN_SIZE = [320, 200] as const;

/** [cx, cy, r, rotation] — hand-placed so crops look intentional at any aspect ratio. */
type Slot = readonly [number, number, number, number];
const LAYOUTS: Record<KiwiPatternDensity, readonly Slot[]> = {
  sparse: [
    [34, 20, 70, 0],
    [292, 12, 62, 20],
    [160, 146, 74, 10],
  ],
  regular: [
    [20, 30, 50, 0],
    [128, -6, 36, 30],
    [250, 26, 54, 12],
    [86, 132, 44, 18],
    [214, 160, 50, 6],
    [330, 150, 40, 24],
  ],
  dense: [
    [18, 18, 26, 0],
    [84, 44, 20, 20],
    [150, 10, 24, 8],
    [214, 50, 22, 28],
    [290, 16, 26, 14],
    [40, 96, 22, 32],
    [118, 112, 26, 4],
    [190, 118, 20, 22],
    [262, 100, 24, 10],
    [16, 172, 24, 18],
    [92, 188, 22, 6],
    [168, 184, 26, 26],
    [244, 176, 20, 2],
    [314, 172, 24, 16],
  ],
};

/** Decorative kiwi-slice pattern that fills its box (crops with `slice`). */
export function KiwiPattern({ density = 'sparse', mode = 'vivid', ...props }: KiwiPatternProps) {
  const ids = useSvgIds('flesh');
  return (
    <ArtSvg size={KIWI_PATTERN_SIZE} fit="slice" {...props}>
      <Defs>
        <KiwiSliceGradient id={ids.flesh} mode={mode} />
      </Defs>
      {LAYOUTS[density].map(([cx, cy, r, rotate]) => (
        <KiwiSlice key={`${cx}-${cy}`} fleshId={ids.flesh} mode={mode} cx={cx} cy={cy} r={r} rotate={rotate} />
      ))}
    </ArtSvg>
  );
}
