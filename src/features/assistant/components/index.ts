/**
 * Reusable chat pieces (Coach tab, lesson "Spiegami il perché" sheet, any future chat surface):
 *
 *   import { ChatBubble, ChatInput, SuggestedPrompts, TypingBubble } from '@/features/assistant/components';
 *   import { getAssistantReply } from '@/features/assistant/engine';
 *
 *   <Sheet footer={<ChatInput value={draft} onChangeText={setDraft} onSend={ask} busy={waiting} />} …>
 *     <ChatBubble role="user" text={EXPLAIN_MISTAKE_REQUEST} />
 *     {waiting ? <TypingBubble variant="bubble" /> : <ChatBubble role="assistant" variant="bubble" text={reply} typewriter />}
 *   </Sheet>
 */
export { BreathingOrb, type BreathingOrbProps } from './breathing-orb';
export { ChatBubble, type ChatBubbleProps, type ChatBubbleVariant } from './chat-bubble';
export { ChatInput, type ChatInputProps } from './chat-input';
export { MessageText, type MessageTextProps } from './message-text';
export { OrbAvatar, type OrbAvatarProps } from './orb-avatar';
export { SuggestedPrompts, type SuggestedPromptsProps } from './suggested-prompts';
export { TypingBubble, type TypingBubbleProps } from './typing-bubble';
