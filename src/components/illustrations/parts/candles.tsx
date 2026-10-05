/** Candlestick series (shared by the stocks cover and the stock-chart lesson art). */
import { G, Line, Rect } from 'react-native-svg';

import { illustration } from '@/theme';

/** [x, open, close, high, low] in artboard units (smaller y = higher price). */
export type Candle = readonly [x: number, open: number, close: number, high: number, low: number];

type CandlesProps = {
  data: readonly Candle[];
  /** Body width. */
  width: number;
  up: string;
  down?: string;
};

export function Candles({ data, width, up, down = illustration.red }: CandlesProps) {
  return (
    <G>
      {data.map(([x, open, close, high, low]) => {
        const color = close < open ? up : down;
        const top = Math.min(open, close);
        return (
          <G key={x}>
            <Line x1={x} y1={high} x2={x} y2={low} stroke={color} strokeWidth={width * 0.16} strokeLinecap="round" />
            <Rect x={x - width / 2} y={top} width={width} height={Math.abs(close - open)} rx={width * 0.22} fill={color} />
          </G>
        );
      })}
    </G>
  );
}
