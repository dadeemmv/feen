/**
 * Lesson-internal overlays and exits: the exit confirmation, the report sheet, the explain sheet,
 * the local toast and the hardware/keyboard ways out (Android back, web Escape → exit dialog).
 *
 * Toasts are rendered by a ToastHost INSIDE the lesson (controlled by local state): the lesson is
 * a native full-screen modal, which would cover the app-level host on iOS.
 */
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';

import type { ToastOptions } from '@/components/ui';
import type { Chapter } from '@/content/types';
import { isWeb } from '@/lib/platform';
import { shareText } from '@/lib/share';
import { useUi } from '@/store/ui';

import { COPY } from './copy';
import { explainModeFor } from './explain/explain-content';
import type { ExplainTopic } from './explain/use-explain-chat';
import type { ReportReasonId } from './components/report-sheet';
import type { LessonController, Notify } from './use-lesson-controller';

export type LessonNotice = ToastOptions & { id: number };

let noticeSeq = 0;

export function goBackToPath() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function useLessonNotice(initial: string | null) {
  const [notice, setNotice] = useState<LessonNotice | null>(() =>
    initial ? { id: ++noticeSeq, message: initial, tone: 'info' } : null,
  );
  const notify: Notify = (message, tone = 'neutral') => setNotice({ id: ++noticeSeq, message, tone });
  const hide = (id: number) => setNotice((current) => (current?.id === id ? null : current));
  return { notice, notify, hide };
}

export function useLessonOverlays(chapter: Chapter, controller: LessonController, notify: Notify) {
  const [exitOpen, setExitOpen] = useState(false);
  const leaving = useRef(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const reported = useRef(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainTopic, setExplainTopic] = useState<ExplainTopic | null>(null);
  const explainAfterRetry = useRef(false);
  const globalSheet = useUi((s) => s.sheet);

  const { phase } = controller.state;
  const completed = controller.completion !== null;
  const overlayOpen =
    reviewOpen ||
    exitOpen || reportOpen || explainOpen || globalSheet !== null || phase === 'feedback-correct' || phase === 'feedback-wrong';

  // ── Exit ──
  const requestExit = () => {
    if (completed) goBackToPath();
    else setExitOpen(true);
  };
  const stay = () => setExitOpen(false);
  const leave = () => {
    leaving.current = true;
    controller.saveProgress();
    setExitOpen(false);
  };
  const onExitClosed = () => {
    if (!leaving.current) return;
    leaving.current = false;
    goBackToPath();
  };

  // ── Explain ("Spiegami il perché") ──
  const openExplain = () => {
    const step = controller.steps[controller.state.index];
    if (!step) return;
    setExplainTopic({ step, mode: explainModeFor(controller.state, step), chapterTitle: chapter.title });
    setExplainOpen(true);
  };
  const closeExplain = () => setExplainOpen(false);
  /** From the wrong-answer dialog: close it (RETRY), then open the sheet once it has animated out. */
  const explainFromWrong = () => {
    explainAfterRetry.current = true;
    controller.retry();
  };
  const onWrongClosed = () => {
    if (!explainAfterRetry.current) return;
    explainAfterRetry.current = false;
    openExplain();
  };

  // ── Report ──
  const openReport = () => setReportOpen(true);
  const closeReport = () => setReportOpen(false);
  const submitReport = (reason: ReportReasonId) => {
    // No backend yet: the reason would be sent with the step id. The thanks toast follows the close.
    void reason;
    reported.current = true;
    setReportOpen(false);
  };
  const onReportClosed = () => {
    if (!reported.current) return;
    reported.current = false;
    notify(COPY.report.thanks, 'success');
  };

  const share = async () => {
    const outcome = await shareText(COPY.share.message(chapter.title), undefined, {
      title: COPY.share.title,
      copiedFeedback: COPY.share.copied,
    });
    if (outcome === 'failed') notify(COPY.share.failed, 'warning');
  };

  // ── Hardware back (Android) and Escape (web) open the exit dialog ──
  const onHardwareBack = useEffectEvent(() => {
    if (!overlayOpen) requestExit();
  });
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onHardwareBack();
      return true;
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return;
    // keyup, like react-native-web's Modal: an open dialog closes itself and we stay out of it.
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onHardwareBack();
    };
    document.addEventListener('keyup', onKeyUp);
    return () => document.removeEventListener('keyup', onKeyUp);
  }, []);

  return {
    exit: { open: exitOpen, request: requestExit, stay, leave, onClosed: onExitClosed },
    explain: { open: explainOpen, topic: explainTopic, show: openExplain, close: closeExplain, fromWrong: explainFromWrong, onWrongClosed },
    report: { open: reportOpen, show: openReport, close: closeReport, submit: submitReport, onClosed: onReportClosed },
    review: { open: reviewOpen, show: () => setReviewOpen(true), close: () => setReviewOpen(false) },
    share: () => void share(),
  };
}
