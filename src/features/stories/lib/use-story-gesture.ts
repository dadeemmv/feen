/**
 * The viewer's touch model (Instagram / birdwingo):
 * - finger down anywhere on the page → pause; held past `holdDelay` → chrome hides;
 * - quick tap → left third = previous page, the rest = next page;
 * - horizontal drag → turns the cube between groups (snaps on distance or fling);
 * - vertical drag down → the story follows the finger and closes past the threshold.
 *
 * The gesture lives on an untransformed layer BEHIND the faces (faces pass touches through
 * everywhere except interactive bits like the poll), so its coordinates are never affected by
 * the cube or the drag-down transforms.
 */
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { duration, easing, spring } from '@/theme';

import { storyMetrics } from '../metrics';

export type StoryGestureHandlers = {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTapLeft: () => void;
  onTapRight: () => void;
  /** A horizontal drag was released (or cancelled): animate `position` to `target` and settle. */
  onSwitchRelease: (target: number) => void;
  onDismiss: () => void;
};

type Axis = 0 | 1 | 2; // 0 undecided, 1 horizontal, 2 vertical

export function useStoryGesture({
  size,
  groupCount,
  settledGroup,
  position,
  dragY,
  handlers,
}: {
  size: { width: number; height: number };
  groupCount: number;
  /** Settled group index, mirrored for worklets. */
  settledGroup: SharedValue<number>;
  position: SharedValue<number>;
  dragY: SharedValue<number>;
  handlers: StoryGestureHandlers;
}) {
  const axis = useSharedValue<Axis>(0);
  /** Set once `onEnd` has decided what the drag does; a cancelled drag snaps back instead. */
  const released = useSharedValue(false);
  const { width, height } = size;
  const { onTouchStart, onTouchEnd, onTapLeft, onTapRight, onSwitchRelease, onDismiss } = handlers;

  const pan = Gesture.Pan()
    .minDistance(storyMetrics.panActivate)
    .onBegin(() => {
      axis.set(0);
      released.set(false);
      scheduleOnRN(onTouchStart);
    })
    .onStart((event) => {
      axis.set(Math.abs(event.translationX) > Math.abs(event.translationY) ? 1 : 2);
    })
    .onUpdate((event) => {
      if (axis.get() === 1) {
        const last = groupCount - 1;
        let next = settledGroup.get() - event.translationX / width;
        // Rubber band past the first / last group.
        if (next < 0) next *= storyMetrics.edgeResistance;
        if (next > last) next = last + (next - last) * storyMetrics.edgeResistance;
        position.set(next);
      } else if (axis.get() === 2) {
        const dy = event.translationY;
        dragY.set(dy > 0 ? dy : dy * storyMetrics.edgeResistance);
      }
    })
    .onEnd((event) => {
      released.set(true);
      if (axis.get() === 1) {
        const current = settledGroup.get();
        const dx = event.translationX;
        const fling = Math.abs(event.velocityX) > storyMetrics.switchVelocity;
        const far = Math.abs(dx) > width * storyMetrics.switchFraction;
        let target = current;
        if ((far || fling) && dx < 0) target = Math.min(groupCount - 1, current + 1);
        if ((far || fling) && dx > 0) target = Math.max(0, current - 1);
        scheduleOnRN(onSwitchRelease, target);
      } else if (axis.get() === 2) {
        const dismiss =
          event.translationY > height * storyMetrics.dismissFraction || event.velocityY > storyMetrics.dismissVelocity;
        if (dismiss) {
          dragY.set(
            withTiming(height, { duration: duration.base, easing: easing.exit }, (finished) => {
              if (finished) scheduleOnRN(onDismiss);
            }),
          );
        } else {
          dragY.set(withSpring(0, spring.gentle));
        }
      }
    })
    .onFinalize(() => {
      if (!released.get()) {
        // Interrupted mid-drag (system gesture, incoming call…): put everything back.
        if (axis.get() === 1) scheduleOnRN(onSwitchRelease, settledGroup.get());
        if (axis.get() === 2) dragY.set(withSpring(0, spring.gentle));
      }
      axis.set(0);
      scheduleOnRN(onTouchEnd);
    });

  const tap = Gesture.Tap()
    .maxDuration(storyMetrics.holdDelay)
    .maxDistance(storyMetrics.tapSlop)
    .onEnd((event, success) => {
      if (!success) return;
      if (event.x < width * storyMetrics.backZone) scheduleOnRN(onTapLeft);
      else scheduleOnRN(onTapRight);
    });

  return Gesture.Race(pan, tap);
}
