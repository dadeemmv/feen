/**
 * TypingBubble — "the Coach is writing": orb avatar + the kit's TypingDots in a soft pill.
 * On the Coach gradient the pill is white (`variant="plain"`), inside sheets it uses the raised
 * surface like assistant bubbles (`variant="bubble"`).
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { TypingDots, controlHeight } from '@/components/ui';
import { duration, easing, elevation, spacing, useTheme } from '@/theme';

import { copy } from '../copy';
import { orbSize } from '../metrics';
import type { ChatBubbleVariant } from './chat-bubble';
import { OrbAvatar } from './orb-avatar';

export type TypingBubbleProps = {
  /** Same meaning as ChatBubble's `variant`. Default `plain`. */
  variant?: ChatBubbleVariant;
  showAvatar?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function TypingBubble({ variant = 'plain', showAvatar = true, style }: TypingBubbleProps) {
  const theme = useTheme();
  const plain = variant === 'plain';
  return (
    <Animated.View
      entering={FadeIn.duration(duration.fast).easing(easing.enter)}
      exiting={FadeOut.duration(duration.fast).easing(easing.exit)}
      style={[styles.row, style]}>
      {showAvatar ? (
        <View style={styles.avatarSlot}>
          <OrbAvatar />
        </View>
      ) : null}
      <TypingDots
        bubble
        accessibilityLabel={copy.typing}
        style={[
          { backgroundColor: plain ? theme.colors.surface : theme.colors.surfaceRaised },
          plain && { boxShadow: elevation.sm },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  avatarSlot: { width: orbSize.avatar, height: controlHeight.sm, justifyContent: 'center' },
});
