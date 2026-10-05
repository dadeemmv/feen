/**
 * Layout aliases (Polaris-style alias group on top of the spacing scale).
 */
export const layout = {
  /** Horizontal screen gutter. */
  screenX: 20,
  cardPadding: 20,
  cardGap: 12,
  stackGap: 12,
  sectionGap: 32,
  /** Apple HIG minimum touch target. */
  minTouch: 44,
  /** Floating pill tab bar. */
  tabBarHeight: 64,
  tabBarSideInset: 16,
  tabBarBottomGap: 8,
  /** Status header (chips row) height. */
  headerHeight: 56,
  /** Phone-width column on web/tablet. */
  maxContentWidth: 480,
  breakpoints: { phone: 0, tablet: 768 },
} as const;
