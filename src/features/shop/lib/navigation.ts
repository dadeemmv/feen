/**
 * Navigation helpers shared by the economy features (shop, lives, streak, pro).
 * Tab roots are switched to with `navigate` (never a second tab stack); pages are pushed.
 */
import { router, type Href } from 'expo-router';

/** `router.back()` when there is history (a web refresh / deep link has none), else `fallback`. */
export function goBackOr(fallback: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export const openShop = () => router.navigate('/shop');
export const openHome = () => router.navigate('/');
export const openPro = () => router.push('/pro');
