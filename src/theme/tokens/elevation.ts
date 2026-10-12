/**
 * Elevation tokens as `boxShadow` strings (RN 0.76+ New Architecture + react-native-web, which
 * deprecates `shadow*`). Two-layer far + near recipe from Rainbow's design-system `shadow.ts`,
 * in pure black (gallery: no elevation on resting UI).
 */
export const elevation = {
  none: undefined,
  /** Resting cards: none. The gallery is flat; cards separate by tint, never by shadow. */
  sm: undefined,
  /** Chips, raised cards: none, same rule. */
  md: undefined,
  /** Floating tab bar, FABs: the only UI that floats over content keeps a soft neutral shadow. */
  lg: '0px 12px 32px rgba(0, 0, 0, 0.12), 0px 2px 6px rgba(0, 0, 0, 0.06)',
  /** Bottom sheets and dialogs. */
  xl: '0px 18px 48px rgba(0, 0, 0, 0.22), 0px 4px 12px rgba(0, 0, 0, 0.08)',
  /** No coloured glow under CTAs. */
  accentGlow: undefined,
  /** The pact's sheet of paper: warm, diffuse (a physical object in the world). */
  paper: '0px 40px 80px -40px rgba(60, 40, 10, 0.35)',
  /** AI sparkle button: neutral float. */
  brandGlow: '0px 8px 22px rgba(0, 0, 0, 0.25)',
} as const;

export type ElevationToken = keyof typeof elevation;
