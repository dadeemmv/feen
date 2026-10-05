/**
 * ComposerDock — the Coach composer floating above the tab bar (and above the keyboard while it
 * is open), with the educational disclaimer underneath and a fade that lets messages dissolve
 * behind it. Reports its height so the thread can leave room for it.
 */
import type { Ref } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type TextInput } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui';
import { layout, spacing, useTheme } from '@/theme';

import { copy } from '../copy';
import { alpha } from '../lib/alpha';
import { ChatInput } from './chat-input';

export type ComposerDockProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (text: string) => void;
  busy: boolean;
  /** Distance from the screen bottom to the composer's resting bottom edge (above the tab bar). */
  restingBottom: number;
  /** Extra lift while the keyboard covers the resting position (animated). */
  lift: SharedValue<number>;
  onHeight: (height: number) => void;
  inputRef?: Ref<TextInput>;
};

export function ComposerDock({ value, onChangeText, onSend, busy, restingBottom, lift, onHeight, inputRef }: ComposerDockProps) {
  const theme = useTheme();
  const canvas = theme.colors.background;
  const liftStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -lift.get() }] }));

  const handleLayout = (event: LayoutChangeEvent) => onHeight(event.nativeEvent.layout.height);

  return (
    <Animated.View onLayout={handleLayout} style={[styles.dock, { paddingBottom: restingBottom }, liftStyle]}>
      <LinearGradient
        colors={[alpha(canvas, 0), alpha(canvas, 0.92), canvas]}
        locations={[0, 0.3, 1]}
        style={[StyleSheet.absoluteFill, styles.passThrough]}
      />
      <View style={styles.column}>
        <ChatInput value={value} onChangeText={onChangeText} onSend={onSend} busy={busy} inputRef={inputRef} />
        <Text variant="bodySm" color="textTertiary" align="center" numberOfLines={2} style={styles.disclaimer}>
          {copy.disclaimer}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dock: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: spacing.xl, pointerEvents: 'box-none' },
  column: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenX,
    gap: spacing.xs,
    pointerEvents: 'box-none',
  },
  disclaimer: { paddingHorizontal: spacing.md },
  passThrough: { pointerEvents: 'none' },
});
