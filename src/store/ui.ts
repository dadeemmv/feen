/**
 * NON-persisted UI store for global overlays rendered by <GlobalOverlays/> (tiny modal stores as
 * in sanidhyy/duolingo-clone `store/use-exit-modal.ts` / `use-hearts-modal.ts`).
 * Lesson-internal overlays (feedback, exit confirm, explain chat) are NOT here: they are phases
 * of the lesson screen state.
 */
import { create } from 'zustand';

export type SheetName = 'lives' | 'out-of-lives' | 'referral' | 'rate' | 'redeem' | 'shield-info';

export type ToastTone = 'neutral' | 'success' | 'danger';

export type Toast = {
  /** Increments on every toast so the same message twice still re-animates. */
  id: number;
  message: string;
  tone: ToastTone;
  /** Optional leading emoji/glyph. */
  icon?: string;
};

/** Flags that live for one app launch only. */
export type SessionFlags = {
  referralPromoShownThisLaunch: boolean;
  /** The "your shield saved the streak" toast was shown this launch. */
  shieldNoticeShownThisLaunch: boolean;
};

type UiState = {
  sheet: SheetName | null;
  toast: Toast | null;
  sessionFlags: SessionFlags;
  openSheet: (name: SheetName) => void;
  closeSheet: () => void;
  showToast: (message: string, options?: { tone?: ToastTone; icon?: string }) => void;
  hideToast: (id?: number) => void;
  setSessionFlag: <K extends keyof SessionFlags>(key: K, value: SessionFlags[K]) => void;
};

const initialSessionFlags: SessionFlags = {
  referralPromoShownThisLaunch: false,
  shieldNoticeShownThisLaunch: false,
};

let toastSeq = 0;

export const useUi = create<UiState>()((set) => ({
  sheet: null,
  toast: null,
  sessionFlags: initialSessionFlags,

  openSheet: (name) => set({ sheet: name }),
  closeSheet: () => set({ sheet: null }),

  showToast: (message, { tone = 'neutral', icon } = {}) => {
    toastSeq += 1;
    set({ toast: { id: toastSeq, message, tone, icon } });
  },
  /** Pass the id to avoid hiding a newer toast from an old timer. */
  hideToast: (id) => set((s) => (id === undefined || s.toast?.id === id ? { toast: null } : s)),

  setSessionFlag: (key, value) => set((s) => ({ sessionFlags: { ...s.sessionFlags, [key]: value } })),
}));

/** Imperative helpers for non-React callers (e.g. store side effects, event handlers). */
export const openSheet = (name: SheetName) => useUi.getState().openSheet(name);
export const closeSheet = () => useUi.getState().closeSheet();
export const showToast: UiState['showToast'] = (message, options) => useUi.getState().showToast(message, options);
