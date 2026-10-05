/**
 * The dashed "journey" path of the timeline stories (redlines: 2 px, borderStrong, dash 6/6):
 * orthogonal connectors with rounded elbows from the bottom centre of a card to the top centre
 * of the next one. Like the original story, the path runs ACROSS pages: it enters from the left
 * screen edge on a continuation page and leaves through the right edge when another page
 * follows, so the three pages read as one road.
 */
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/theme';

import { storyMetrics } from '../../metrics';

export type CardFrame = { x: number; y: number; width: number; height: number };

export type TimelinePathProps = {
  frames: CardFrame[];
  /** Width of the cards column. */
  width: number;
  /** Height of the cards column (its padding already holds the entry / exit runs). */
  height: number;
  /** Horizontal distance from the column to the screen edges (the page gutter). */
  bleed: number;
  /** Space above the first card / below the last one, where the entry / exit run. */
  margin: number;
  enter: boolean;
  exit: boolean;
};

/** Orthogonal elbow from (x1, y1) down to (x2, y2), turning at mid-height with radius ≤ r. */
function elbow(x1: number, y1: number, x2: number, y2: number, midY: number, r: number): string {
  const dx = x2 - x1;
  if (Math.abs(dx) < 1) return `L ${x2} ${y2}`;
  const dir = Math.sign(dx);
  const radius = Math.min(r, Math.abs(dx) / 2, midY - y1, y2 - midY);
  return [
    `L ${x1} ${midY - radius}`,
    `Q ${x1} ${midY} ${x1 + dir * radius} ${midY}`,
    `L ${x2 - dir * radius} ${midY}`,
    `Q ${x2} ${midY} ${x2} ${midY + radius}`,
    `L ${x2} ${y2}`,
  ].join(' ');
}

/** Horizontal run at `y` from the screen edge into a vertical drop/rise at `x`. */
function cornerTo(fromX: number, y: number, x: number, toY: number, r: number): string {
  const dir = Math.sign(x - fromX) || 1;
  const vertical = Math.sign(toY - y) || 1;
  const radius = Math.min(r, Math.abs(x - fromX), Math.abs(toY - y));
  return [`L ${x - dir * radius} ${y}`, `Q ${x} ${y} ${x} ${y + vertical * radius}`, `L ${x} ${toY}`].join(' ');
}

export function buildTimelinePath({ frames, width, bleed, margin, enter, exit }: Omit<TimelinePathProps, 'height'>) {
  if (frames.length === 0) return '';
  const r = storyMetrics.connectorRadius;
  const cx = (f: CardFrame) => bleed + f.x + f.width / 2;
  const segments: string[] = [];

  const first = frames[0];
  if (enter) {
    const y = first.y - margin / 2;
    segments.push(`M 0 ${y}`, cornerTo(0, y, cx(first), first.y, r));
  }
  for (let i = 0; i < frames.length - 1; i += 1) {
    const a = frames[i];
    const b = frames[i + 1];
    const startY = a.y + a.height;
    segments.push(`M ${cx(a)} ${startY}`, elbow(cx(a), startY, cx(b), b.y, (startY + b.y) / 2, r));
  }
  if (exit) {
    const last = frames[frames.length - 1];
    const startY = last.y + last.height;
    const y = startY + margin / 2;
    const right = width + bleed * 2;
    // Drop from the card, turn right, run off the edge.
    segments.push(
      `M ${cx(last)} ${startY}`,
      `L ${cx(last)} ${y - Math.min(r, margin / 2)}`,
      `Q ${cx(last)} ${y} ${cx(last) + Math.min(r, margin / 2)} ${y}`,
      `L ${right} ${y}`,
    );
  }
  return segments.join(' ');
}

export function TimelinePath(props: TimelinePathProps) {
  const { colors } = useTheme();
  const { width, height, bleed } = props;
  const d = buildTimelinePath(props);
  if (!d) return null;
  return (
    <Svg width={width + bleed * 2} height={height} style={[styles.svg, { left: -bleed }]} aria-hidden>
      <Path
        d={d}
        stroke={colors.borderStrong}
        strokeWidth={storyMetrics.connectorWidth}
        strokeDasharray={storyMetrics.connectorDash.join(' ')}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: { position: 'absolute', top: 0, pointerEvents: 'none' },
});
