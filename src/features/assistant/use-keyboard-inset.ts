/**
 * Keyboard overlap for views pinned to the bottom of the window (the Coach composer floats above
 * the tab bar, so a KeyboardAvoidingView around the screen cannot place it).
 *
 * Returns a shared value with the part of the window the keyboard covers, animated with the
 * keyboard's own duration on iOS. The overlap is measured as `window height - keyboard top`, so
 * it is correct both when the window is not resized (iOS, Android edge-to-edge) and when Android
 * resizes it (the overlap is then ~0). Web: browsers resize the visual viewport, so it stays 0.
 * (Reanimated's `useAnimatedKeyboard` is deprecated in v4, hence the Keyboard events.)
 */
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, type KeyboardEvent } from 'react-native';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { isIOS, isWeb } from '@/lib/platform';
import { duration, easing } from '@/theme';

export type KeyboardInset = {
  /** Covered height in pt (animated). */
  height: SharedValue<number>;
  /** Keyboard currently shown (JS state, for layout decisions). */
  visible: boolean;
};

export function useKeyboardInset(): KeyboardInset {
  const height = useSharedValue(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isWeb) return;
    const animateTo = (value: number, event?: KeyboardEvent) => {
      const ms = isIOS && event?.duration ? event.duration : duration.base;
      height.set(withTiming(value, { duration: ms, easing: easing.sheet }));
    };
    const onShow = (event: KeyboardEvent) => {
      const overlap = Math.max(0, Dimensions.get('window').height - event.endCoordinates.screenY);
      animateTo(overlap, event);
      setVisible(overlap > 0);
    };
    const onHide = (event?: KeyboardEvent) => {
      animateTo(0, event);
      setVisible(false);
    };
    const subscriptions = isIOS
      ? [
          Keyboard.addListener('keyboardWillShow', onShow),
          Keyboard.addListener('keyboardWillChangeFrame', onShow),
          Keyboard.addListener('keyboardWillHide', onHide),
        ]
      : [Keyboard.addListener('keyboardDidShow', onShow), Keyboard.addListener('keyboardDidHide', onHide)];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [height]);

  return { height, visible };
}
