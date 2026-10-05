/**
 * GlobalOverlays — the single mount point of app-wide sheets (docs/ARCHITECTURE.md §3).
 * Sheets are NOT routes: any screen opens one through the non-persisted UI store
 *   import { openSheet } from '@/store/ui';  openSheet('lives');
 * and this component renders the matching feature sheet above every navigator.
 *
 * Registered sheets (owner feature in brackets). Each receives `{ visible, onClose }` and is built
 * on `<Sheet visible onClose>` from `@/components/ui`, so it animates out before unmounting (every
 * registered overlay stays mounted, only `visible` flips):
 * - 'lives'        [features/lives]    "Vite al massimo!" / refill countdown, PRO card, "Ottieni vite illimitate"
 * - 'out-of-lives' [features/lives]    0 hearts: wait timer, refill with coins, Pro CTA
 * - 'referral'     [features/invite]   "30 giorni di Finanz Pro" promo (Home also renders it locally on launch)
 * - 'rate'         [features/account]  "Valuta app"
 * - 'redeem'       [features/account]  "Utilizza codice" (TextField + keyboard)
 * - 'shield-info'  [features/streak]   what a streak shield does + "Acquista scudi"
 *
 * It also bridges the store toasts (`showToast` from '@/store/ui') into the kit's single
 * `<ToastHost/>`, so both `showToast(...)` and `toast.show(...)` work app-wide.
 */
import { useEffect, type ComponentType } from 'react';

import { toast } from '@/components/ui/toast';
import { RateAppSheet } from '@/features/account/sheets/rate-app-sheet';
import { RedeemCodeSheet } from '@/features/account/sheets/redeem-code-sheet';
import { ReferralSheet } from '@/features/invite/referral-sheet';
import { LivesSheet } from '@/features/lives/lives-sheet';
import { OutOfLivesSheet } from '@/features/lives/out-of-lives-sheet';
import { ShieldInfoSheet } from '@/features/streak/shield-info-sheet';
import { useUi, type SheetName } from '@/store/ui';

export type GlobalOverlayProps = {
  visible: boolean;
  /** Clears `useUi().sheet`. Call it after a user dismiss (Sheet `onClose`) or a CTA. */
  onClose: () => void;
};

const OVERLAYS: Record<SheetName, ComponentType<GlobalOverlayProps> | null> = {
  lives: LivesSheet,
  'out-of-lives': OutOfLivesSheet,
  referral: ReferralSheet,
  rate: RateAppSheet,
  redeem: RedeemCodeSheet,
  'shield-info': ShieldInfoSheet,
};

const OVERLAY_ENTRIES = Object.entries(OVERLAYS) as [SheetName, ComponentType<GlobalOverlayProps> | null][];

/** Forwards `useUi().toast` to the kit toast host, then clears it from the store. */
function useStoreToastBridge() {
  const pending = useUi((s) => s.toast);
  const hideToast = useUi((s) => s.hideToast);
  useEffect(() => {
    if (!pending) return;
    toast.show({ message: pending.message, tone: pending.tone, icon: pending.icon });
    hideToast(pending.id);
  }, [pending, hideToast]);
}

/** A sheet without a registered overlay would leave `sheet` stuck: clear it (and say so in dev). */
function useUnregisteredSheetGuard(sheet: SheetName | null, closeSheet: () => void) {
  useEffect(() => {
    if (!sheet || OVERLAYS[sheet]) return;
    closeSheet();
    if (__DEV__) toast.show({ message: `Sheet "${sheet}" non ancora collegato`, tone: 'info' });
  }, [sheet, closeSheet]);
}

export function GlobalOverlays() {
  const sheet = useUi((s) => s.sheet);
  const closeSheet = useUi((s) => s.closeSheet);
  useStoreToastBridge();
  useUnregisteredSheetGuard(sheet, closeSheet);

  return (
    <>
      {OVERLAY_ENTRIES.map(([name, Overlay]) =>
        Overlay ? <Overlay key={name} visible={sheet === name} onClose={closeSheet} /> : null,
      )}
    </>
  );
}
