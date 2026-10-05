/**
 * ChatInput — the Coach composer: a white pill TextField ("Chiedi qualcosa...") that grows with
 * the text, with a circular lime send button that stays grey while there is nothing to send (or
 * a reply is still being written). Web: Enter sends, Shift+Enter adds a line.
 *
 *   <ChatInput value={draft} onChangeText={setDraft} onSend={(text) => ask(text)} busy={pending} />
 *
 * Keyboard placement is the parent's job (the Coach tab lifts it above the keyboard, the lesson
 * sheet renders it as its footer, which already avoids the keyboard).
 */
import type { Ref } from 'react';
import type { NativeSyntheticEvent, StyleProp, TextInput, TextInputKeyPressEventData, ViewStyle } from 'react-native';
import { SendHorizontal } from 'lucide-react-native';

import { IconButton, TextField } from '@/components/ui';
import { isWeb } from '@/lib/platform';

import { copy } from '../copy';
import { MAX_QUESTION_LENGTH } from '../metrics';

export type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  /** Receives the trimmed text. The parent clears `value`. */
  onSend: (text: string) => void;
  /** A reply is being written: typing stays possible, sending waits. */
  busy?: boolean;
  /** The whole composer is inactive. */
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: Ref<TextInput>;
  style?: StyleProp<ViewStyle>;
};

type WebKeyEvent = TextInputKeyPressEventData & { shiftKey?: boolean; isComposing?: boolean };

export function ChatInput({
  value,
  onChangeText,
  onSend,
  busy = false,
  disabled = false,
  placeholder = copy.inputPlaceholder,
  autoFocus,
  onFocus,
  onBlur,
  inputRef,
  style,
}: ChatInputProps) {
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !busy && !disabled;

  const submit = () => {
    if (canSend) onSend(trimmed);
  };

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (!isWeb) return;
    const key = event.nativeEvent as WebKeyEvent;
    if (key.key !== 'Enter' || key.shiftKey || key.isComposing) return;
    event.preventDefault();
    submit();
  };

  return (
    <TextField
      ref={inputRef}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accessibilityLabel={copy.inputLabel}
      shape="pill"
      variant="surface"
      multiline
      maxLength={MAX_QUESTION_LENGTH}
      disabled={disabled}
      autoFocus={autoFocus}
      autoCapitalize="sentences"
      autoCorrect
      enterKeyHint={isWeb ? 'send' : undefined}
      onKeyPress={handleKeyPress}
      onFocus={onFocus}
      onBlur={onBlur}
      style={style}
      trailing={
        <IconButton
          icon={SendHorizontal}
          variant="accent"
          disabled={!canSend}
          haptic="light"
          accessibilityLabel={copy.send}
          accessibilityHint={copy.sendHint}
          onPress={submit}
        />
      }
    />
  );
}
