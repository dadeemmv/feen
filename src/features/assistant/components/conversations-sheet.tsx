/**
 * ConversationsSheet (≡ in the Coach top bar): saved chats grouped by day ("Oggi", "Ieri",
 * "Ultimi 7 giorni", "Meno recenti"), tap to reopen, two-step delete, "Nuova chat" CTA.
 * States: loading (store hydrating → skeleton rows), empty (EmptyState), list.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SquarePen } from 'lucide-react-native';

import { AssistantOrb } from '@/components/illustrations';
import { Button, EmptyState, ListGroup, Sheet, Skeleton, Text, avatarSize, tileSize } from '@/components/ui';
import { useNow } from '@/store/hooks';
import { spacing } from '@/theme';

import { deleteConversation } from '../chat-actions';
import { useChatStore } from '../chat-store';
import { groupConversations } from '../conversation-dates';
import { copy } from '../copy';
import { ConversationRow } from './conversation-row';

/** The bin's confirmation disarms itself after this long. */
const DISARM_MS = 4000;
const SKELETON_ROWS = 3;

export type ConversationsSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** A saved chat was picked (the sheet closes itself first). */
  onOpen: (conversationId: string) => void;
  /** "Nuova chat" footer button. */
  onNewChat: () => void;
  /** Empty-state CTA ("Inizia a chiedere"). Defaults to `onNewChat`. */
  onStartAsking?: () => void;
};

export function ConversationsSheet({ visible, onClose, onOpen, onNewChat, onStartAsking }: ConversationsSheetProps) {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const hydrated = useChatStore((s) => s.hasHydrated);
  const now = useNow();
  const [armedId, setArmedId] = useState<string | null>(null);

  useEffect(() => {
    if (!armedId) return;
    const timer = setTimeout(() => setArmedId(null), DISARM_MS);
    return () => clearTimeout(timer);
  }, [armedId]);

  const close = () => {
    setArmedId(null);
    onClose();
  };
  const open = (id: string) => {
    setArmedId(null);
    onOpen(id);
  };
  const startNew = () => {
    setArmedId(null);
    onNewChat();
  };

  const groups = groupConversations(conversations, now);
  const empty = hydrated && conversations.length === 0;

  return (
    <Sheet
      visible={visible}
      onClose={close}
      title={copy.sheetTitle}
      scrollable
      footer={
        empty ? undefined : (
          <View style={styles.footer}>
            <Button title={copy.sheetNewChat} iconLeft={SquarePen} fullWidth onPress={startNew} />
          </View>
        )
      }>
      {!hydrated ? (
        <View accessibilityLabel={copy.loadingChats} style={styles.skeletons}>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <View key={index} style={styles.skeletonRow}>
              <Skeleton size={tileSize.md} radius="md" />
              <View style={styles.skeletonTexts}>
                <Skeleton height={spacing.md} width="70%" />
                <Skeleton height={spacing.sm} width="40%" />
              </View>
            </View>
          ))}
        </View>
      ) : empty ? (
        <EmptyState
          compact
          illustration={<AssistantOrb width={avatarSize.xl} />}
          title={copy.emptyTitle}
          message={copy.emptyMessage}
          action={{
            label: copy.emptyAction,
            onPress: () => {
              setArmedId(null);
              (onStartAsking ?? onNewChat)();
            },
          }}
          style={styles.empty}
        />
      ) : (
        <View style={styles.groups}>
          <Text variant="bodySm" color="textSecondary" align="center">
            {copy.historyCount(conversations.length)}
          </Text>
          {groups.map((group) => (
            <ListGroup key={group.id} title={group.title}>
              {group.items.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                  now={now}
                  active={conversation.id === activeId}
                  armed={conversation.id === armedId}
                  onOpen={() => open(conversation.id)}
                  onArm={() => setArmedId(conversation.id)}
                  onDelete={() => {
                    setArmedId(null);
                    deleteConversation(conversation.id);
                  }}
                />
              ))}
            </ListGroup>
          ))}
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  groups: { gap: spacing.lg, paddingBottom: spacing.md },
  footer: { paddingTop: spacing.sm },
  empty: { paddingBottom: spacing.md },
  skeletons: { gap: spacing.md, paddingVertical: spacing.sm },
  skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  skeletonTexts: { flex: 1, gap: spacing.xs },
});
