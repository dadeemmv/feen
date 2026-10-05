/**
 * Haptics wrapper (bluesky-social/social-app `src/lib/haptics.ts` pattern).
 *
 * - No-op on web (expo-haptics has no web implementation).
 * - Every call swallows rejections, so a missing Taptic Engine / disabled vibration never throws.
 * - A module-level switch mirrors the user's "Vibrazione" setting: the shell calls
 *   `setHapticsEnabled(settings.haptics)` whenever that setting changes.
 *
 *   import { haptics } from '@/lib/haptics';
 *   haptics.success();
 */
import * as Haptics from 'expo-haptics';

import { isWeb } from './platform';

export type HapticKind = 'selection' | 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

let enabled = true;

/** Turn every haptic on/off (user setting). */
export function setHapticsEnabled(value: boolean): void {
  enabled = value;
}

export function isHapticsEnabled(): boolean {
  return enabled;
}

function run(effect: () => Promise<void>): void {
  if (!enabled || isWeb) return;
  effect().catch(() => {});
}

/** Tab changes, radio/option selection, segmented controls. */
export function selection(): void {
  run(() => Haptics.selectionAsync());
}

/** Default button press. */
export function light(): void {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Heavier confirmations (claim reward, purchase). */
export function medium(): void {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

export function heavy(): void {
  run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}

/** Correct answer, reward granted, lesson complete. */
export function success(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Out of lives, streak at risk. */
export function warning(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

/** Wrong answer, failed purchase. */
export function error(): void {
  run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}

/** Fire a haptic by name (handy for `haptic` props). */
export function triggerHaptic(kind: HapticKind): void {
  haptics[kind]();
}

export const haptics = { selection, light, medium, heavy, success, warning, error } as const;
