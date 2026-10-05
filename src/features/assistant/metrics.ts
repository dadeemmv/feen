/**
 * Assistant component metrics (SCREEN_SPECS "Assistant" redlines), expressed through kit sizes
 * where one exists so the feature never hard-codes control geometry.
 */
import { iconSize, tileSize } from '@/components/ui';

/** Visible pearl diameters of the orb. */
export const orbSize = {
  /** Empty chat, centred at ~22 % of the window height. */
  hero: 120,
  /** Empty chat on short phones (iPhone SE class). */
  heroCompact: 96,
  /**
   * Chatting: parked in the top bar between the two 40 pt buttons. SCREEN_SPECS asks for 56, but
   * a 56 pearl (plus its breathing swell) fills the 56 pt bar edge to edge and touches the screen
   * edge where there is no status-bar inset (web, some Androids); 48 keeps a 4 pt margin.
   */
  bar: tileSize.lg,
  /** Avatar next to assistant messages. */
  avatar: iconSize.lg,
} as const;

/** Windows shorter than this use the compact hero orb. */
export const COMPACT_WINDOW_HEIGHT = 720;

/** The orb's vertical centre in the empty state, as a fraction of the window height. */
export const ORB_HERO_CENTER = 0.22;

/** Share of the orb artwork box occupied by the pearl (AssistantOrb: r 62 in a 200 box). */
export const ORB_PEARL_RATIO = 0.62;

/** Bubble width caps (fraction of the thread width). */
export const bubbleMaxWidth = { user: '80%', assistant: '88%' } as const;

/** Bullet dot diameter inside messages. */
export const bulletSize = 6;

/** Distance from the bottom (pt) within which the thread keeps following new content. */
export const STICK_TO_BOTTOM_THRESHOLD = 96;

/** Orb loops: breathing uses `duration.orbBreath`; one full turn of the rotating highlight. */
export const ORB_SPIN_MS = 9000;
/** Thinking (reply pending): breath and spin speed-up factor. */
export const ORB_THINKING_SPEEDUP = 2.2;
/** Breathing amplitude (scale) at rest and while thinking. */
export const ORB_BREATH_SCALE = { rest: 1.05, thinking: 1.1 } as const;

/** Delay before the greeting starts typing on a fresh chat (typing dots are visible). */
export const GREETING_THINK_MS = 900;

/** Longest question accepted by the composer (characters). */
export const MAX_QUESTION_LENGTH = 500;
