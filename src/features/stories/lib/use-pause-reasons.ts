/**
 * The story timer pauses for several independent reasons (a finger on the screen, a poll being
 * answered, the share sheet, the cube turning, the app in background, a screen reader). Each
 * reason is toggled on its own; the timer runs only when none is active.
 */
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';

import { isWeb } from '@/lib/platform';

export type PauseReason = 'touch' | 'interaction' | 'share' | 'transition' | 'background' | 'screenReader';

function toggle(current: ReadonlySet<PauseReason>, reason: PauseReason, on: boolean): ReadonlySet<PauseReason> {
  if (current.has(reason) === on) return current;
  const next = new Set(current);
  if (on) next.add(reason);
  else next.delete(reason);
  return next;
}

export function usePauseReasons() {
  const [reasons, setReasons] = useState<ReadonlySet<PauseReason>>(() => new Set());
  // Stable, so effects can depend on it.
  const setReason = useCallback(
    (reason: PauseReason, on: boolean) => setReasons((current) => toggle(current, reason, on)),
    [],
  );

  // App in background (or the iOS app switcher): freeze the page.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) =>
      setReasons((current) => toggle(current, 'background', state !== 'active')),
    );
    return () => subscription.remove();
  }, []);

  // With VoiceOver / TalkBack on, pages never auto-advance: the reader moves at their own pace.
  // (react-native-web always reports a screen reader and has no change event: native only.)
  useEffect(() => {
    if (isWeb) return;
    let mounted = true;
    void AccessibilityInfo.isScreenReaderEnabled().then((on) => {
      if (mounted) setReasons((current) => toggle(current, 'screenReader', on));
    });
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', (on) =>
      setReasons((current) => toggle(current, 'screenReader', on)),
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return {
    paused: reasons.size > 0,
    has: (reason: PauseReason) => reasons.has(reason),
    setReason,
  };
}
