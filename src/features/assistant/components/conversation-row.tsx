/**
 * One saved chat in the conversations sheet: chat tile, first question as title, date ·
 * message count, "Aperta" tag on the open one, and a two-step delete (bin → "Elimina").
 *
 * Built like a ListGroup row, but the open area and the delete control are separate pressables
 * so both stay reachable by screen readers (a pressable ListItem would swallow the bin).
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { MessageCircle, Trash2 } from 'lucide-react-native';

import { Button, IconButton, IconTile, PressableScale, Tag, Text } from '@/components/ui';
import { duration, easing, layout, spacing, useTheme } from '@/theme';

import { copy } from '../copy';
import { formatConversationDate } from '../conversation-dates';
import type { Conversation } from '../types';

/** Same row height as ListItem (64). */
const ROW_MIN_HEIGHT = layout.minTouch + spacing.lg;

export type ConversationRowProps = {
  conversation: Conversation;
  now: number;
  active: boolean;
  /** The bin was tapped once: show the confirmation. */
  armed: boolean;
  onOpen: () => void;
  onArm: () => void;
  onDelete: () => void;
};

export function ConversationRow({ conversation, now, active, armed, onOpen, onArm, onDelete }: ConversationRowProps) {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const title = conversation.title || copy.untitled;
  const subtitle = `${formatConversationDate(conversation.updatedAt, now)} · ${copy.messagesCount(conversation.messages.length)}`;

  return (
    <Animated.View
      exiting={FadeOut.duration(duration.base).easing(easing.exit)}
      style={[styles.row, { backgroundColor: pressed ? theme.colors.fill : 'transparent' }]}>
      <PressableScale
        scaleTo={false}
        haptic="selection"
        onPress={onOpen}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityLabel={`${title}, ${subtitle}${active ? `, ${copy.activeTag}` : ''}`}
        accessibilityHint={copy.openChatHint}
        style={styles.main}>
        <IconTile icon={MessageCircle} tone={active ? 'accent' : 'mint'} size="md" />
        <View style={styles.texts}>
          <Text variant="titleSm" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="bodySm" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        {active && !armed ? <Tag label={copy.activeTag} tone="accent" size="sm" /> : null}
      </PressableScale>
      {armed ? (
        <Animated.View entering={FadeIn.duration(duration.fast)} exiting={FadeOut.duration(duration.fast)}>
          <Button
            title={copy.confirmDelete}
            variant="danger"
            size="sm"
            haptic="medium"
            accessibilityLabel={copy.confirmDeleteLabel(title)}
            onPress={onDelete}
          />
        </Animated.View>
      ) : (
        <IconButton
          icon={Trash2}
          variant="plain"
          iconColor="textTertiary"
          accessibilityLabel={`${copy.deleteChat}: ${title}`}
          accessibilityHint={copy.deleteChatHint}
          onPress={onArm}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: ROW_MIN_HEIGHT,
    paddingRight: spacing.sm,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'stretch',
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  texts: { flex: 1, gap: spacing.xxxs },
});
