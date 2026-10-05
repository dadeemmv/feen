/**
 * Learning-path geometry — a PURE function (no React, no theme, no imports) so it can be unit
 * tested in isolation. Given the container width and the course levels it returns absolute
 * rects for every level banner and chapter node plus the SVG paths of the dashed connectors.
 *
 * Layout (docs/SCREEN_SPECS.md "Course path", reference video t=29–38 s):
 * - every level starts with a full-width banner, then its chapters zig-zag left / right
 *   (each level restarts on the left column, as in the video);
 * - consecutive nodes are joined by an elbow: out of the node side that faces the other column,
 *   horizontally to the next node's centre x, then down to its top edge (rounded corner);
 * - banner → first node is a short straight drop; the last node of a level elbows into the next
 *   banner; the last node of the course elbows into the goal card that follows the path
 *   (`goalAnchor`, the bottom edge of the laid-out area).
 *
 * Pattern: absolute node layout with offset lookup instead of flex (DareDev256/buildright
 * `app/learn/[moduleId].tsx`), so connectors can be drawn between known centres.
 */

export type PathColumn = 'left' | 'right';

export type PathLevelInput = {
  id: string;
  chapterIds: readonly string[];
};

export type PathMetrics = {
  /** Node width as a fraction of the container width (spec: 0.44). */
  nodeWidthRatio: number;
  /** Node height = width × aspect (spec: ≈ 0.9, square-ish). */
  nodeAspect: number;
  /** Floor for the node height so two title lines + a footer always fit. */
  nodeMinHeight: number;
  /** Inset of both columns from the container edges, as a fraction of the width (0 = flush). */
  columnInsetRatio: number;
  /** Vertical gap between two consecutive nodes of the same level. */
  nodeGap: number;
  /** Level banner height. */
  bannerHeight: number;
  /** Gap between a banner and the first node below it. */
  bannerGap: number;
  /** Gap between the last node of a level and the next banner. */
  levelGap: number;
  /** Gap between the last node and the goal card. */
  goalGap: number;
  /** Extra room below the node that shows the "INIZIA DA QUI" tooltip, when a full-width block follows. */
  tooltipSpace: number;
  /** Radius of the connector elbows. */
  cornerRadius: number;
};

export type PathLayoutInput = {
  width: number;
  levels: readonly PathLevelInput[];
  metrics: PathMetrics;
  /** Node that renders a tooltip below itself (the current chapter). */
  tooltipChapterId?: string;
};

export type PathRect = { x: number; y: number; width: number; height: number };

export type PathNodeLayout = PathRect & {
  chapterId: string;
  levelId: string;
  /** Position in the whole course (0-based). */
  index: number;
  /** Position inside its level (0-based). */
  indexInLevel: number;
  column: PathColumn;
  centerX: number;
  centerY: number;
};

export type PathBannerLayout = PathRect & { levelId: string; levelIndex: number };

export type PathConnectorKind = 'banner-node' | 'node-node' | 'node-banner' | 'banner-banner' | 'node-goal';

export type PathConnectorLayout = {
  /** Stable key: `${from}->${to}`. */
  id: string;
  kind: PathConnectorKind;
  /** Chapter id or `level:<id>`. */
  from: string;
  /** Chapter id, `level:<id>` or `goal`. */
  to: string;
  /** SVG path data in container coordinates. */
  d: string;
};

export type PathLayout = {
  width: number;
  /** Height of the laid-out area; the goal card starts right below it. */
  height: number;
  nodeWidth: number;
  nodeHeight: number;
  nodes: PathNodeLayout[];
  banners: PathBannerLayout[];
  connectors: PathConnectorLayout[];
  /** Where the last connector lands (top edge of the goal card), or null without chapters. */
  goalAnchor: { x: number; y: number } | null;
};

export const GOAL_ID = 'goal';
export const bannerKey = (levelId: string) => `level:${levelId}`;

const round = (value: number) => Math.round(value * 100) / 100;

/** Straight vertical segment. */
export function verticalPath(x: number, y1: number, y2: number): string {
  return `M ${round(x)} ${round(y1)} V ${round(y2)}`;
}

/**
 * Horizontal run from (x1, y1) to x2, then down to y2, with a rounded elbow of radius `r`
 * (clamped to the available run / drop). Sweep flag: right-then-down is clockwise (1),
 * left-then-down counter-clockwise (0) in SVG's y-down space.
 */
export function elbowPath(x1: number, y1: number, x2: number, y2: number, r: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (Math.abs(dx) < 0.5) return verticalPath(x2, y1, y2);
  const dir = dx > 0 ? 1 : -1;
  const radius = Math.max(0, Math.min(r, Math.abs(dx), Math.abs(dy)));
  const sweep = dir > 0 ? 1 : 0;
  return [
    `M ${round(x1)} ${round(y1)}`,
    `H ${round(x2 - dir * radius)}`,
    `A ${round(radius)} ${round(radius)} 0 0 ${sweep} ${round(x2)} ${round(y1 + radius)}`,
    `V ${round(y2)}`,
  ].join(' ');
}

/** Exit point of a node towards the other column (its inner side, vertically centred). */
function exitPoint(node: PathNodeLayout): { x: number; y: number } {
  return { x: node.column === 'left' ? node.x + node.width : node.x, y: node.centerY };
}

type Previous = { kind: 'banner'; banner: PathBannerLayout } | { kind: 'node'; node: PathNodeLayout } | null;

export function computePathLayout({ width, levels, metrics, tooltipChapterId }: PathLayoutInput): PathLayout {
  const safeWidth = Math.max(0, width);
  const nodeWidth = Math.round(safeWidth * metrics.nodeWidthRatio);
  const nodeHeight = Math.max(Math.round(nodeWidth * metrics.nodeAspect), metrics.nodeMinHeight);
  const inset = Math.round(safeWidth * metrics.columnInsetRatio);
  const columnX: Record<PathColumn, number> = { left: inset, right: safeWidth - inset - nodeWidth };
  const columnCenter: Record<PathColumn, number> = {
    left: columnX.left + nodeWidth / 2,
    right: columnX.right + nodeWidth / 2,
  };
  const opposite = (column: PathColumn): PathColumn => (column === 'left' ? 'right' : 'left');

  const nodes: PathNodeLayout[] = [];
  const banners: PathBannerLayout[] = [];
  const connectors: PathConnectorLayout[] = [];
  const connect = (kind: PathConnectorKind, from: string, to: string, d: string) =>
    connectors.push({ id: `${from}->${to}`, kind, from, to, d });

  /** Space below the previous node before a full-width block (tooltip hangs under it). */
  const tooltipRoom = (node: PathNodeLayout) => (node.chapterId === tooltipChapterId ? metrics.tooltipSpace : 0);

  let y = 0;
  let previous: Previous = null;
  let index = 0;

  levels.forEach((level, levelIndex) => {
    // ── Banner ────────────────────────────────────────────────────────────────────────────
    if (previous?.kind === 'node') y = previous.node.y + previous.node.height + tooltipRoom(previous.node) + metrics.levelGap;
    const banner: PathBannerLayout = { levelId: level.id, levelIndex, x: 0, y, width: safeWidth, height: metrics.bannerHeight };
    banners.push(banner);

    if (previous?.kind === 'node') {
      const from = exitPoint(previous.node);
      connect('node-banner', previous.node.chapterId, bannerKey(level.id), elbowPath(from.x, from.y, columnCenter[opposite(previous.node.column)], banner.y, metrics.cornerRadius));
    } else if (previous?.kind === 'banner') {
      connect('banner-banner', bannerKey(previous.banner.levelId), bannerKey(level.id), verticalPath(columnCenter.left, previous.banner.y + previous.banner.height, banner.y));
    }
    previous = { kind: 'banner', banner };
    y = banner.y + banner.height + metrics.bannerGap;

    // ── Nodes ─────────────────────────────────────────────────────────────────────────────
    level.chapterIds.forEach((chapterId, indexInLevel) => {
      const column: PathColumn = indexInLevel % 2 === 0 ? 'left' : 'right';
      const node: PathNodeLayout = {
        chapterId,
        levelId: level.id,
        index,
        indexInLevel,
        column,
        x: columnX[column],
        y,
        width: nodeWidth,
        height: nodeHeight,
        centerX: columnCenter[column],
        centerY: y + nodeHeight / 2,
      };
      nodes.push(node);

      if (previous?.kind === 'banner') {
        const bannerBottom = previous.banner.y + previous.banner.height;
        connect('banner-node', bannerKey(previous.banner.levelId), chapterId, verticalPath(node.centerX, bannerBottom, node.y));
      } else if (previous?.kind === 'node') {
        const from = exitPoint(previous.node);
        connect('node-node', previous.node.chapterId, chapterId, elbowPath(from.x, from.y, node.centerX, node.y, metrics.cornerRadius));
      }

      previous = { kind: 'node', node };
      index += 1;
      y = node.y + node.height + metrics.nodeGap;
    });
  });

  // ── Goal ──────────────────────────────────────────────────────────────────────────────────
  let goalAnchor: PathLayout['goalAnchor'] = null;
  let height: number;
  const last = previous as Previous;
  if (last?.kind === 'node') {
    const goalY = last.node.y + last.node.height + tooltipRoom(last.node) + metrics.goalGap;
    const from = exitPoint(last.node);
    const x = columnCenter[opposite(last.node.column)];
    connect('node-goal', last.node.chapterId, GOAL_ID, elbowPath(from.x, from.y, x, goalY, metrics.cornerRadius));
    goalAnchor = { x, y: goalY };
    height = goalY;
  } else if (last?.kind === 'banner') {
    height = last.banner.y + last.banner.height;
  } else {
    height = 0;
  }

  return { width: safeWidth, height, nodeWidth, nodeHeight, nodes, banners, connectors, goalAnchor };
}
