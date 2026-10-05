/**
 * useTypewriter — reveals `text` 2–3 characters per tick, like a streamed AI reply.
 *
 *   const { visible, done, skip } = useTypewriter(message.text, { enabled: isFresh });
 *
 * - Splits by code point, so emoji ("🦊") never render as broken halves.
 * - Short pauses after punctuation and line breaks make the rhythm feel written, not printed.
 * - Long answers speed up so no reply takes more than ~4 s to finish.
 * - Instant (no animation) when `enabled` is false, under reduced motion and while a screen
 *   reader is running (partial text would be read out piece by piece).
 * - `skip()` reveals everything at once (tap on a typing bubble).
 */
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { useReduceMotion } from '@/components/ui';
import { isWeb } from '@/lib/platform';

export type TypewriterOptions = {
  /** Animate the reveal. Default `true`. */
  enabled?: boolean;
  /** Characters per second before the long-text speed-up. Default 70. */
  cps?: number;
};

export type TypewriterState = {
  visible: string;
  done: boolean;
  /** Reveal the whole text immediately. */
  skip: () => void;
};

const DEFAULT_CPS = 70;
/** Characters revealed per tick (cycled): always 2–3. */
const CHUNKS = [2, 3, 3, 2, 3] as const;
const AVERAGE_CHUNK = CHUNKS.reduce<number>((sum, size) => sum + size, 0) / CHUNKS.length;
/** Upper bound for the whole reveal; longer texts type faster. */
const MAX_REVEAL_MS = 4000;
/** Extra ticks to wait after these characters. */
const PAUSE_TICKS = { sentence: 6, clause: 2, line: 4 } as const;

const SENTENCE_END = /[.!?…]/;
const CLAUSE_END = /[,;:]/;

function pauseAfter(chunk: readonly string[]): number {
  if (chunk.some((glyph) => SENTENCE_END.test(glyph))) return PAUSE_TICKS.sentence;
  if (chunk.includes('\n')) return PAUSE_TICKS.line;
  if (chunk.some((glyph) => CLAUSE_END.test(glyph))) return PAUSE_TICKS.clause;
  return 1;
}

/**
 * Native only: react-native-web's `isScreenReaderEnabled()` always resolves `true` (browsers do
 * not expose it), which would switch the typewriter off for every web user. On web the typed
 * text lives in a normal DOM node and assistive tech reads the final message instead.
 */
function useScreenReaderEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (isWeb) return;
    let alive = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (alive) setEnabled(value);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setEnabled);
    return () => {
      alive = false;
      subscription.remove();
    };
  }, []);
  return enabled;
}

type Progress = { text: string; count: number; skipped: boolean };

export function useTypewriter(text: string, opts: TypewriterOptions = {}): TypewriterState {
  const { enabled = true, cps = DEFAULT_CPS } = opts;
  const reduceMotion = useReduceMotion();
  const screenReader = useScreenReaderEnabled();
  const animate = enabled && !reduceMotion && !screenReader;

  const [progress, setProgress] = useState<Progress>({ text, count: 0, skipped: false });
  // A new text restarts the reveal (derived during render, no reset effect needed).
  const current: Progress = progress.text === text ? progress : { text, count: 0, skipped: false };
  const glyphs = Array.from(text);
  const total = glyphs.length;
  const count = !animate || current.skipped ? total : Math.min(current.count, total);
  const skipped = current.skipped;

  useEffect(() => {
    if (!animate || skipped) return;
    const chars = Array.from(text);
    const length = chars.length;
    if (length === 0) return;
    const speed = Math.max(cps, (length * 1000) / MAX_REVEAL_MS);
    const tickMs = (AVERAGE_CHUNK * 1000) / speed;
    let shown = 0;
    let step = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      const previous = shown;
      shown = Math.min(length, shown + CHUNKS[step % CHUNKS.length]);
      step += 1;
      setProgress({ text, count: shown, skipped: false });
      if (shown < length) timer = setTimeout(tick, tickMs * pauseAfter(chars.slice(previous, shown)));
    };
    timer = setTimeout(tick, tickMs);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [text, animate, cps, skipped]);

  const skip = () => setProgress({ text, count: total, skipped: true });

  const done = count >= total;
  return { visible: done ? text : glyphs.slice(0, count).join(''), done, skip };
}
