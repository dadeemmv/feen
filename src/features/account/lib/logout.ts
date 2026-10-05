/**
 * Logout = back to a fresh install: wipes the persisted root store (demo user, onboarding not
 * done, account preferences), the Coach conversations and any half-filled onboarding answers,
 * then shows the first-run flow.
 */
import { router } from 'expo-router';

import { clearChatHistory } from '@/features/assistant/chat-store';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { resetStore } from '@/store';

export async function clearAccountData() {
  useOnboardingDraft.getState().reset();
  await Promise.all([resetStore(), clearChatHistory()]);
}

/**
 * Navigates first, then clears: the Account page never re-renders with the wiped data while it
 * fades out. The tab stack underneath only redirects to onboarding when it gets focus again.
 */
export async function logout() {
  useOnboardingDraft.getState().reset();
  router.replace('/onboarding');
  await clearAccountData();
}
