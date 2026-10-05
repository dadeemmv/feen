/**
 * Elevation tokens as `boxShadow` strings (RN 0.76+ New Architecture + react-native-web, which
 * deprecates `shadow*`). Two-layer far + near recipe from Rainbow's design-system `shadow.ts`,
 * tinted with the evergreen ink instead of pure black.
 */
export const elevation = {
  none: undefined,
  /** Resting cards. */
  sm: '0px 1px 2px rgba(11, 46, 32, 0.06), 0px 2px 8px rgba(11, 46, 32, 0.04)',
  /** Chips, raised cards. */
  md: '0px 4px 14px rgba(11, 46, 32, 0.08), 0px 1px 3px rgba(11, 46, 32, 0.05)',
  /** Floating tab bar, FABs. */
  lg: '0px 10px 30px rgba(11, 46, 32, 0.14), 0px 2px 6px rgba(11, 46, 32, 0.06)',
  /** Bottom sheets and dialogs. */
  xl: '0px 18px 48px rgba(11, 46, 32, 0.22), 0px 4px 12px rgba(11, 46, 32, 0.08)',
  /** Coloured glow under the primary lime CTA on dark surfaces. */
  accentGlow: '0px 8px 24px rgba(189, 238, 99, 0.35)',
  /** Coloured glow for the AI sparkle button. */
  brandGlow: '0px 8px 22px rgba(20, 92, 60, 0.35)',
} as const;

export type ElevationToken = keyof typeof elevation;
