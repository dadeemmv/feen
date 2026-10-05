/**
 * Coach top bar: ≡ (saved chats) on the left, ✎ (new chat) on the right, over a fade so the
 * thread can scroll underneath. The orb parks in the middle while chatting (OrbStage).
 */
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, SquarePen } from 'lucide-react-native';

import { IconButton } from '@/components/ui';
import { gradients, layout, spacing } from '@/theme';

import { copy } from '../copy';
import { alpha } from '../lib/alpha';

export type AssistantTopBarProps = {
  /** Safe-area top inset. */
  insetTop: number;
  onMenu: () => void;
  onNewChat: () => void;
  /** Already on an empty chat. */
  newChatDisabled?: boolean;
};

export function AssistantTopBar({ insetTop, onMenu, onNewChat, newChatDisabled = false }: AssistantTopBarProps) {
  const top = gradients.assistant[0];
  return (
    <View style={[styles.root, { paddingTop: insetTop }]}>
      <LinearGradient
        colors={[top, alpha(top, 0.94), alpha(top, 0)]}
        locations={[0, 0.7, 1]}
        style={[styles.fade, styles.passThrough]}
      />
      <View style={styles.bar}>
        <IconButton
          icon={Menu}
          accessibilityLabel={copy.menu}
          accessibilityHint={copy.menuHint}
          onPress={onMenu}
        />
        <IconButton
          icon={SquarePen}
          accessibilityLabel={copy.newChat}
          accessibilityHint={copy.newChatHint}
          disabled={newChatDisabled}
          onPress={onNewChat}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'box-none' },
  fade: { position: 'absolute', top: 0, left: 0, right: 0, bottom: -spacing.lg },
  passThrough: { pointerEvents: 'none' },
  bar: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    height: layout.headerHeight,
    paddingHorizontal: layout.screenX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
});
