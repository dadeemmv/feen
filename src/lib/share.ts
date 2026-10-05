/**
 * Share a text (and optional link) everywhere.
 *
 *   const outcome = await shareText(`Usa il mio codice ${code} su Finanz!`, INVITE_URL);
 *
 * - iOS / Android: React Native `Share.share` (the system sheet). expo-sharing only shares
 *   local FILES, so it is not used for text on native.
 * - Web: the Web Share API when available (mobile browsers, recent desktop Chrome/Safari),
 *   otherwise the text is copied to the clipboard with a toast. The availability check is
 *   synchronous on purpose: `navigator.share` must run inside the tap's user activation.
 *
 * Never throws; resolves with what happened so callers can react (e.g. analytics, a toast).
 */
import { Share } from 'react-native';
import * as Sharing from 'expo-sharing';

import { copy } from './clipboard';
import { isIOS, isWeb } from './platform';

export type ShareOutcome = 'shared' | 'dismissed' | 'copied' | 'failed';

export type ShareTextOptions = {
  /** Android chooser / email subject / web share title. */
  title?: string;
  /** Toast shown when the web fallback copies the text. */
  copiedFeedback?: string;
};

export const SHARE_COPIED_FEEDBACK = 'Link copiato: incollalo dove vuoi';

export async function shareText(message: string, url?: string, options: ShareTextOptions = {}): Promise<ShareOutcome> {
  return isWeb ? shareOnWeb(message, url, options) : shareOnNative(message, url, options);
}

/**
 * Whether a real share sheet exists (web: Web Share API via expo-sharing; native: always).
 * Use it to label a button "Condividi" vs "Copia link"; `shareText` works either way.
 */
export async function isShareSheetAvailable(): Promise<boolean> {
  if (!isWeb) return true;
  try {
    return await Sharing.isAvailableAsync();
  } catch {
    return false;
  }
}

function joinMessage(message: string, url?: string): string {
  return url ? `${message}\n${url}` : message;
}

async function shareOnNative(message: string, url: string | undefined, { title }: ShareTextOptions): Promise<ShareOutcome> {
  try {
    // iOS takes the link as its own item (rich preview); Android only reads `message`.
    const content = isIOS && url ? { message, url, title } : { message: joinMessage(message, url), title };
    const result = await Share.share(content, { dialogTitle: title, subject: title });
    return result.action === Share.dismissedAction ? 'dismissed' : 'shared';
  } catch {
    return 'failed';
  }
}

function hasWebShare(data: ShareData): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  return typeof navigator.canShare === 'function' ? navigator.canShare(data) : true;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

async function shareOnWeb(
  message: string,
  url: string | undefined,
  { title, copiedFeedback = SHARE_COPIED_FEEDBACK }: ShareTextOptions,
): Promise<ShareOutcome> {
  const data: ShareData = { title, text: message, url };
  if (hasWebShare(data)) {
    try {
      await navigator.share(data);
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) return 'dismissed';
      // NotAllowedError / TypeError: fall back to the clipboard below.
    }
  }
  const copied = await copy(joinMessage(message, url), { feedback: copiedFeedback });
  return copied ? 'copied' : 'failed';
}
