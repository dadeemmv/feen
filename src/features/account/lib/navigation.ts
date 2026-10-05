/**
 * Navigation helpers of the Account feature.
 */
import { router, type Href } from 'expo-router';

export type AccountSection = 'settings' | 'language' | 'purchases' | 'interests' | 'support' | 'legal' | 'profile';

/** `router.back()` when there is history (deep links / web refresh have none), else `fallback`. */
export function goBackOr(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export const backToAccount = () => goBackOr('/account');
export const backToHome = () => goBackOr('/');

export const openSection = (section: AccountSection) =>
  router.push({ pathname: '/account/[section]', params: { section } });
