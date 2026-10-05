/**
 * Clipboard helper: expo-clipboard + a light haptic + an optional confirmation toast.
 *
 *   await copy(referralCode, { feedback: 'Codice copiato' });
 *   await copy(text, { feedback: false });   // silent
 *
 * Works on web (async Clipboard API; needs a secure context and a user gesture) and never throws.
 */
import * as Clipboard from 'expo-clipboard';

import { showToast } from '@/store/ui';

import { haptics } from './haptics';

export const COPY_FEEDBACK = 'Copiato negli appunti';
export const COPY_FAILED_FEEDBACK = 'Impossibile copiare, riprova';

export type CopyOptions = {
  /** Success toast text. Default `COPY_FEEDBACK`; `false` for no toast (haptic only). */
  feedback?: string | false;
};

/** Copies `text`; resolves `true` on success. Shows an error toast on failure unless silenced. */
export async function copy(text: string, { feedback = COPY_FEEDBACK }: CopyOptions = {}): Promise<boolean> {
  let copied = false;
  try {
    copied = await Clipboard.setStringAsync(text);
  } catch {
    copied = false;
  }

  if (copied) {
    haptics.light();
    if (feedback) showToast(feedback, { tone: 'success' });
  } else if (feedback !== false) {
    haptics.error();
    showToast(COPY_FAILED_FEEDBACK, { tone: 'danger' });
  }
  return copied;
}
