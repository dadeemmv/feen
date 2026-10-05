/**
 * Data behind the `/dev` QA hub: every route of the app (so each one is one tap away) and the
 * state shortcuts testers need (reset, coins, lives, sheets, toasts).
 */
import { router, type Href } from 'expo-router';

import { MAIN_COURSE_ID } from '@/content/courses';
import { getStoreState, resetStore } from '@/store';
import { openSheet, showToast, type SheetName } from '@/store/ui';

export type DevRouteLink = { title: string; subtitle: string; href: Href; emoji: string };

export const DEV_PAGES: DevRouteLink[] = [
  { title: 'UI kit', subtitle: 'Tutti i componenti e i loro stati', href: '/dev/ui', emoji: '🧩' },
  { title: 'Icone', subtitle: 'Icone economia su carta ed evergreen', href: '/dev/icons', emoji: '💎' },
  { title: 'Illustrazioni', subtitle: 'Copertine, arte delle lezioni, composizioni', href: '/dev/illustrations', emoji: '🎨' },
  { title: 'Personaggi', subtitle: 'I quattro personaggi della bussola dei soldi', href: '/dev/mascots', emoji: '🧭' },
];

export const DEV_ROUTES: DevRouteLink[] = [
  { title: 'Home', subtitle: '/', href: '/', emoji: '🏠' },
  { title: 'Academy', subtitle: '/academy', href: '/academy', emoji: '📚' },
  { title: 'Assistente', subtitle: '/assistant', href: '/assistant', emoji: '💬' },
  { title: 'Shop', subtitle: '/shop', href: '/shop', emoji: '🛒' },
  { title: 'Percorso', subtitle: `/course/${MAIN_COURSE_ID}`, href: { pathname: '/course/[id]', params: { id: MAIN_COURSE_ID } }, emoji: '🗺️' },
  { title: 'Lezione Inflazione', subtitle: '/lesson/inflazione', href: { pathname: '/lesson/[id]', params: { id: 'inflazione' } }, emoji: '📈' },
  { title: 'Streak', subtitle: '/streak', href: '/streak', emoji: '🔥' },
  { title: 'Account', subtitle: '/account', href: '/account', emoji: '🤠' },
  { title: 'Impostazioni', subtitle: '/account/settings', href: { pathname: '/account/[section]', params: { section: 'settings' } }, emoji: '⚙️' },
  { title: 'Invita un amico', subtitle: '/invite', href: '/invite', emoji: '💌' },
  { title: 'Il tuo personaggio', subtitle: '/mascot', href: '/mascot', emoji: '🧭' },
  { title: 'Finanz Pro', subtitle: '/pro', href: '/pro', emoji: '💜' },
  { title: 'Storia Academy', subtitle: '/story/academy', href: { pathname: '/story/[id]', params: { id: 'academy' } }, emoji: '📖' },
  { title: 'Storia App', subtitle: '/story/app', href: { pathname: '/story/[id]', params: { id: 'app' } }, emoji: '📱' },
  { title: 'Onboarding', subtitle: '/onboarding', href: '/onboarding', emoji: '👋' },
  { title: 'Pagina inesistente', subtitle: '404', href: '/pagina-inesistente' as Href, emoji: '🧭' },
];

export type DevAction = { title: string; subtitle: string; emoji: string; run: () => void; destructive?: boolean };

export const DEV_ACTIONS: DevAction[] = [
  { title: '+1.000 kiwi', subtitle: 'Per provare gli acquisti nello Shop', emoji: '🥝', run: () => getStoreState().earn(1000) },
  { title: 'Perdi una vita', subtitle: 'Avvia il timer di ricarica', emoji: '💔', run: () => getStoreState().loseLife(Date.now()) },
  { title: 'Vite al massimo', subtitle: 'Ricarica tutte le vite', emoji: '❤️', run: () => getStoreState().addLives(getStoreState().maxLives, Date.now()) },
  {
    title: 'Toast di prova',
    subtitle: 'Dallo store UI (showToast)',
    emoji: '🍞',
    run: () => showToast('Codice copiato', { tone: 'success' }),
  },
  {
    title: 'Rivedi onboarding',
    subtitle: 'Segna l’onboarding come non completato',
    emoji: '🔁',
    run: () => {
      getStoreState().updateProfile({ onboardingDone: false });
      router.replace('/onboarding');
    },
  },
  {
    title: 'Reset dati demo',
    subtitle: 'Cancella i progressi salvati e riparte da zero',
    emoji: '🧨',
    destructive: true,
    run: () => {
      void resetStore().then(() => router.replace('/'));
    },
  },
];

export const DEV_SHEETS: { name: SheetName; title: string }[] = [
  { name: 'lives', title: 'Vite' },
  { name: 'out-of-lives', title: 'Vite finite' },
  { name: 'referral', title: 'Promo referral' },
  { name: 'rate', title: 'Valuta app' },
  { name: 'redeem', title: 'Utilizza codice' },
  { name: 'shield-info', title: 'Scudo salva-streak' },
];

export const openDevSheet = (name: SheetName) => openSheet(name);
