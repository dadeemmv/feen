/**
 * Coach tab (PRODUCT_SPEC §3.12): soft lime → canvas gradient, ≡ saved chats and ✎ new chat,
 * a breathing orb that greets you (typing dots → typed greeting → suggested questions) and then
 * glides into the top bar once the conversation starts. The composer floats above the tab bar
 * and the keyboard; replies come from the assistant engine and type out.
 *
 * Layers (back → front): gradient · intro or thread · top bar · orb · composer.
 */
import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, View, useWindowDimensions, type LayoutChangeEvent, type TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, useDerivedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useReduceMotion } from '@/components/ui';
import { duration, easing, gradients, spacing } from '@/theme';

import { openConversation, sendQuestion, startNewChat } from './chat-actions';
import { useChatStore } from './chat-store';
import { AssistantIntro } from './components/assistant-intro';
import { AssistantTopBar } from './components/assistant-top-bar';
import { ChatThread } from './components/chat-thread';
import { ComposerDock } from './components/composer-dock';
import { ConversationsSheet } from './components/conversations-sheet';
import { OrbStage } from './components/orb-stage';
import { useCoachLayout } from './lib/use-coach-layout';
import { orbSize } from './metrics';
import { useKeyboardInset } from './use-keyboard-inset';

/** Background: lime tint at the top melting into the canvas by ~70 % of the height. */
const GRADIENT_LOCATIONS = [0, 0.7] as const;
/** Composer height before the first layout pass (input + disclaimer + fade). */
const INITIAL_DOCK_HEIGHT = 180;

export function AssistantScreen() {
  const reduceMotion = useReduceMotion();
  const window = useWindowDimensions();
  const [screenHeight, setScreenHeight] = useState(window.height);
  const [dockHeight, setDockHeight] = useState(INITIAL_DOCK_HEIGHT);
  const [draft, setDraft] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [introThinking, setIntroThinking] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const activeId = useChatStore((s) => s.activeId);
  const conversation = useChatStore((s) =>
    s.activeId ? s.conversations.find((c) => c.id === s.activeId) : undefined,
  );
  const pendingId = useChatStore((s) => s.pendingId);
  const freshMessageId = useChatStore((s) => s.freshMessageId);
  const introKey = useChatStore((s) => s.introKey);

  const geometry = useCoachLayout(screenHeight);
  const keyboard = useKeyboardInset();
  const composerBottom = geometry.composerBottom;
  const lift = useDerivedValue(() => Math.max(0, keyboard.height.get() + spacing.sm - composerBottom));

  const chatting = !!conversation && conversation.messages.length > 0;
  const pending = activeId !== null && pendingId === activeId;
  const insetBottom = dockHeight + spacing.md;

  const handleLayout = (event: LayoutChangeEvent) => setScreenHeight(event.nativeEvent.layout.height);

  const send = (text: string) => {
    if (sendQuestion(text)) setDraft('');
  };

  const openSheet = () => {
    Keyboard.dismiss();
    setSheetOpen(true);
  };

  const newChat = () => {
    setSheetOpen(false);
    startNewChat();
  };

  /** Empty history → "Inizia a chiedere": a fresh chat with the keyboard up once the sheet is gone. */
  const startAsking = () => {
    newChat();
    setTimeout(() => inputRef.current?.focus(), duration.sheet);
  };

  const enterFade = reduceMotion ? undefined : FadeIn.duration(duration.base).easing(easing.enter);
  const exitFade = reduceMotion ? undefined : FadeOut.duration(duration.fast).easing(easing.exit);

  return (
    <View style={styles.root} onLayout={handleLayout}>
      <LinearGradient colors={gradients.assistant} locations={GRADIENT_LOCATIONS} style={StyleSheet.absoluteFill} />

      {chatting && conversation ? (
        <Animated.View key={conversation.id} entering={enterFade} exiting={exitFade} style={StyleSheet.absoluteFill}>
          <ChatThread
            conversation={conversation}
            pending={pending}
            freshMessageId={freshMessageId}
            insetTop={geometry.threadTop}
            insetBottom={insetBottom}
            keyboardLift={lift}
          />
        </Animated.View>
      ) : (
        <Animated.View key={`intro-${introKey}`} entering={enterFade} exiting={exitFade} style={StyleSheet.absoluteFill}>
          <AssistantIntro
            insetTop={geometry.introTop}
            insetBottom={insetBottom}
            onAsk={(prompt) => sendQuestion(prompt)}
            busy={pending}
            onThinkingChange={setIntroThinking}
            keyboardLift={lift}
          />
        </Animated.View>
      )}

      <AssistantTopBar
        insetTop={geometry.insetTop}
        onMenu={openSheet}
        onNewChat={newChat}
        newChatDisabled={!chatting}
      />

      <OrbStage
        docked={chatting}
        thinking={pending || (!chatting && introThinking)}
        heroSize={geometry.heroSize}
        dockedSize={orbSize.bar}
        heroCenterY={geometry.heroCenterY}
        dockedCenterY={geometry.dockedCenterY}
      />

      <ComposerDock
        value={draft}
        onChangeText={setDraft}
        onSend={send}
        busy={pending}
        restingBottom={composerBottom}
        lift={lift}
        onHeight={setDockHeight}
        inputRef={inputRef}
      />

      <ConversationsSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onOpen={(id) => {
          setSheetOpen(false);
          openConversation(id);
        }}
        onNewChat={newChat}
        onStartAsking={startAsking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
});
