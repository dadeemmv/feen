/**
 * Pure helpers over story content: emphasis splitting, page reading time, title emoji handling.
 */
import type { StoryPage } from '@/content/types';

import { storyMetrics } from '../metrics';

export type TextRun = { text: string; bold: boolean };

/**
 * Splits `text` into runs where every occurrence of an `emphasis` substring is bold
 * (earliest match first, longest match on ties; overlapping matches are skipped).
 */
export function splitEmphasis(text: string, emphasis: readonly string[] = []): TextRun[] {
  const needles = emphasis.filter((e) => e.length > 0);
  if (needles.length === 0) return [{ text, bold: false }];

  const runs: TextRun[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    let best: { start: number; end: number } | null = null;
    for (const needle of needles) {
      const start = text.indexOf(needle, cursor);
      if (start === -1) continue;
      const end = start + needle.length;
      if (!best || start < best.start || (start === best.start && end > best.end)) best = { start, end };
    }
    if (!best) break;
    if (best.start > cursor) runs.push({ text: text.slice(cursor, best.start), bold: false });
    runs.push({ text: text.slice(best.start, best.end), bold: true });
    cursor = best.end;
  }
  if (cursor < text.length) runs.push({ text: text.slice(cursor), bold: false });
  return runs;
}

function pageText(page: StoryPage): string {
  switch (page.kind) {
    case 'academy-intro':
      return [page.title, page.subtitle, page.body, page.posterTitle, page.sticker].join(' ');
    case 'poll':
      return [page.title, page.subtitle, page.body, page.question].join(' ');
    case 'timeline':
      return [page.title ?? '', ...page.cards.map((card) => card.text)].join(' ');
  }
}

/** Auto-advance time of a page: the base segment, stretched for text-heavy pages (capped). */
export function pageDuration(page: StoryPage): number {
  const { segmentBase, segmentCharsPerSecond, segmentMaxFactor } = storyMetrics;
  const readingMs = (pageText(page).length / segmentCharsPerSecond) * 1000;
  return Math.round(Math.min(segmentBase * segmentMaxFactor, Math.max(segmentBase, readingMs)));
}

const EMOJI_EDGE = /^(\p{Extended_Pictographic}️?)\s*|\s*(\p{Extended_Pictographic}️?)$/gu;

/** "💞 AIUTACI A MIGLIORARE 💞" → { lead: '💞', words: 'AIUTACI A MIGLIORARE', trail: '💞' }. */
export function splitTitleEmoji(title: string): {
  lead?: string;
  words: string;
  trail?: string;
} {
  const lead = /^(\p{Extended_Pictographic}️?)/u.exec(title)?.[1];
  const trail = /(\p{Extended_Pictographic}️?)$/u.exec(title)?.[1];
  const words = title.replace(EMOJI_EDGE, '').trim();
  return {
    lead,
    words,
    trail: trail && (trail !== lead || title.length > (lead?.length ?? 0)) ? trail : undefined,
  };
}
