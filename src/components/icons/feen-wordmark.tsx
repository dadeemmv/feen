import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { galleryColors, illustration } from '@/theme';

import { FeenLogoTile } from './feen-logo';
import { svgA11y } from './lib/icon-svg';
import { useSvgIds } from './lib/svg-ids';

/**
 * "Feen" in Instrument Sans SemiBold (the app's own font, SIL OFL) as filled outlines, tracking
 * −2%: cap height 24, baseline at y 31 on a 38-unit tall canvas.
 */
const LETTERS =
  'M2 31V7H6.33V31ZM4.07 21.37V17.93H17.57V21.37ZM4.07 10.43V7H18.37V10.43ZM28.93 31.33Q26.23 31.33 24.22 30.2Q22.2 29.07 21.08 27.07Q19.97 25.07 19.97 22.47Q19.97 19.87 21.08 17.88Q22.2 15.9 24.2 14.78Q26.2 13.67 28.87 13.67Q31.4 13.67 33.27 14.72Q35.13 15.77 36.17 17.67Q37.2 19.57 37.2 22.1Q37.2 22.57 37.17 22.97Q37.13 23.37 37.07 23.77H22.57V20.83H33.83L32.97 21.63Q32.97 19.23 31.87 18.03Q30.77 16.83 28.8 16.83Q26.67 16.83 25.42 18.3Q24.17 19.77 24.17 22.53Q24.17 25.27 25.42 26.72Q26.67 28.17 28.97 28.17Q30.3 28.17 31.3 27.67Q32.3 27.17 32.77 26.13H36.73Q35.9 28.53 33.92 29.93Q31.93 31.33 28.93 31.33ZM47.3 31.33Q44.6 31.33 42.58 30.2Q40.57 29.07 39.45 27.07Q38.33 25.07 38.33 22.47Q38.33 19.87 39.45 17.88Q40.57 15.9 42.57 14.78Q44.57 13.67 47.23 13.67Q49.77 13.67 51.63 14.72Q53.5 15.77 54.53 17.67Q55.57 19.57 55.57 22.1Q55.57 22.57 55.53 22.97Q55.5 23.37 55.43 23.77H40.93V20.83H52.2L51.33 21.63Q51.33 19.23 50.23 18.03Q49.13 16.83 47.17 16.83Q45.03 16.83 43.78 18.3Q42.53 19.77 42.53 22.53Q42.53 25.27 43.78 26.72Q45.03 28.17 47.33 28.17Q48.67 28.17 49.67 27.67Q50.67 27.17 51.13 26.13H55.1Q54.27 28.53 52.28 29.93Q50.3 31.33 47.3 31.33ZM58.03 31V14H62.13V18H62.23V31ZM69.97 31V20.27Q69.97 18.7 69.17 17.9Q68.37 17.1 66.83 17.1Q65.5 17.1 64.45 17.7Q63.4 18.3 62.82 19.37Q62.23 20.43 62.23 21.83L61.8 17.77Q62.67 15.9 64.33 14.78Q66 13.67 68.33 13.67Q71.1 13.67 72.65 15.23Q74.2 16.8 74.2 19.4V31Z';

const TEXT_WIDTH = 76.2;
const HEIGHT = 38;
const MARK_GAP = 10;

export type FeenWordmarkTone = 'ink' | 'white' | 'brand';

export type FeenWordmarkProps = {
  /** Rendered height in points; width follows the aspect ratio. Default 28. */
  height?: number;
  tone?: FeenWordmarkTone;
  /** Prepend the app mark (indigo tile; white tile on the white tone). Default false. */
  withMark?: boolean;
  style?: StyleProp<ViewStyle>;
};

const TONES: Record<FeenWordmarkTone, string> = {
  ink: galleryColors.ink,
  white: illustration.white,
  brand: galleryColors.indigo,
};

/** Brand wordmark (optionally with the app mark). */
export function FeenWordmark({ height = 28, tone = 'ink', withMark = false, style }: FeenWordmarkProps) {
  const ids = useSvgIds('tile', 'gloss');
  const offset = withMark ? HEIGHT + MARK_GAP : 0;
  const width = offset + TEXT_WIDTH;
  return (
    <Svg
      width={(height * width) / HEIGHT}
      height={height}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      style={style}
      {...svgA11y('Feen')}
    >
      {withMark ? (
        <G transform={`scale(${HEIGHT / 48})`}>
          {/* On indigo the tile turns white so it doesn't vanish into the surface. */}
          <FeenLogoTile tone={tone === 'white' ? 'paper' : 'brand'} tileId={ids.tile} glossId={ids.gloss} />
        </G>
      ) : null}
      <G transform={`translate(${offset} 0)`}>
        <Path d={LETTERS} fill={TONES[tone]} />
      </G>
    </Svg>
  );
}
