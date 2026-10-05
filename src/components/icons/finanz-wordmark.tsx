import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { illustration } from '@/theme';

import { FinanzLogoTile } from './finanz-logo';
import { svgA11y } from './lib/icon-svg';
import { useSvgIds } from './lib/svg-ids';

/**
 * "Finanz" set in the monogram's stroke construction: 6-unit round strokes, cap height 30,
 * x-height 20, baseline at y 34 on a 38-unit tall canvas.
 */
const LETTERS =
  // F
  'M5 31V7H18M5 19.5H15.5' +
  // i (stem; the dot is a circle)
  'M27 17V31' +
  // n
  'M37 31V17M37 24C37 19.5 40 17 44 17C48 17 51 19.5 51 24V31' +
  // a (bowl + stem)
  'M75 24A7 7 0 1 1 61 24A7 7 0 1 1 75 24ZM75 17V31' +
  // n
  'M85 31V17M85 24C85 19.5 88 17 92 17C96 17 99 19.5 99 24V31' +
  // z
  'M109 17H120L109 31H120';

const TEXT_WIDTH = 124;
const HEIGHT = 38;
const MARK_GAP = 10;

export type FinanzWordmarkTone = 'ink' | 'white' | 'lime';

export type FinanzWordmarkProps = {
  /** Rendered height in points; width follows the aspect ratio. Default 28. */
  height?: number;
  tone?: FinanzWordmarkTone;
  /** Prepend the lime FZ tile. Default false. */
  withMark?: boolean;
  style?: StyleProp<ViewStyle>;
};

const TONES: Record<FinanzWordmarkTone, string> = {
  ink: illustration.forestDeep,
  white: illustration.white,
  lime: illustration.lime,
};

/** Brand wordmark (optionally with the app mark). */
export function FinanzWordmark({ height = 28, tone = 'ink', withMark = false, style }: FinanzWordmarkProps) {
  const ids = useSvgIds('tile', 'gloss');
  const offset = withMark ? HEIGHT + MARK_GAP : 0;
  const width = offset + TEXT_WIDTH;
  const color = TONES[tone];
  return (
    <Svg
      width={(height * width) / HEIGHT}
      height={height}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      style={style}
      {...svgA11y('Finanz')}
    >
      {withMark ? (
        <G transform={`scale(${HEIGHT / 48})`}>
          <FinanzLogoTile tileId={ids.tile} glossId={ids.gloss} />
        </G>
      ) : null}
      <G transform={`translate(${offset} 0)`}>
        <Path d={LETTERS} stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Circle cx={27} cy={7.5} r={3.6} fill={color} />
      </G>
    </Svg>
  );
}
