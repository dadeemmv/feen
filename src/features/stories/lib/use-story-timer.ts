/**
 * Page timer of the story viewer: drives the active segment's 0…1 progress on the UI thread and
 * calls `onFinish` when it fills. Changing `pageKey` restarts it from 0; `running = false`
 * freezes it where it is and `true` resumes it for the remaining time only.
 */
import { useEffect, useRef } from 'react';
import { cancelAnimation, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { easing } from '@/theme';

export function useStoryTimer({
  pageKey,
  durationMs,
  running,
  onFinish,
}: {
  pageKey: string;
  durationMs: number;
  running: boolean;
  onFinish: () => void;
}) {
  const progress = useSharedValue(0);
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  });

  // Last page seen by the effect below, so a page change resets before a resume.
  const pageRef = useRef<string | null>(null);

  useEffect(() => {
    const finished = () => finishRef.current();
    if (pageRef.current !== pageKey) {
      pageRef.current = pageKey;
      cancelAnimation(progress);
      progress.set(0);
    }
    if (!running) {
      cancelAnimation(progress);
      return;
    }
    const from = progress.get();
    if (from >= 1) {
      finished();
      return;
    }
    progress.set(
      withTiming(
        1,
        {
          duration: Math.max(0, (1 - from) * durationMs),
          easing: easing.linear,
        },
        (done) => {
          if (done) scheduleOnRN(finished);
        },
      ),
    );
    return () => cancelAnimation(progress);
  }, [pageKey, durationMs, running, progress]);

  return progress;
}
