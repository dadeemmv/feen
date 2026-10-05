/**
 * Reduce-motion preference = OS setting (Reanimated `useReducedMotion`) OR the in-app
 * "Riduci animazioni" setting. The shell mirrors the persisted setting into this tiny store with
 * `setReduceMotionOverride(settings.reduceMotion)`; every primitive reads `useReduceMotion()`.
 */
import { useReducedMotion } from 'react-native-reanimated';
import { create } from 'zustand';

const useMotionPreference = create<{ forced: boolean }>(() => ({ forced: false }));

/** Force reduced motion from the app settings (in addition to the OS preference). */
export function setReduceMotionOverride(forced: boolean): void {
  useMotionPreference.setState({ forced });
}

/** True when animations should be minimised (skip confetti/shimmer, prefer fades). */
export function useReduceMotion(): boolean {
  const system = useReducedMotion();
  const forced = useMotionPreference((s) => s.forced);
  return system || forced;
}
