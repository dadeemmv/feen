/**
 * Tiny, streaming-safe formatter for chat text: paragraphs (blank line), bullet lines ("- ",
 * "• ", "* "), numbered lines ("1. ") and **bold** spans. Nothing else is interpreted, so the
 * knowledge base and any future LLM output render the same way.
 *
 * Streaming-safe: a half-typed "**bol" renders as bold without asterisks, and a lone trailing
 * "*" (half of a marker) is hidden, so the typewriter never flashes raw markup.
 */

export type InlineSpan = { text: string; bold: boolean };

export type MessageBlock =
  | { kind: 'paragraph'; spans: InlineSpan[]; spaced: boolean }
  | { kind: 'bullet'; spans: InlineSpan[]; spaced: boolean }
  | { kind: 'numbered'; marker: string; spans: InlineSpan[]; spaced: boolean };

const BULLET = /^\s*[-•*]\s+(.*)$/;
const NUMBERED = /^\s*(\d{1,2})[.)]\s+(.*)$/;
const BOLD_MARKER = '**';

function stripDanglingMarker(line: string): string {
  return line.endsWith('*') && !line.endsWith(BOLD_MARKER) ? line.slice(0, -1) : line;
}

/** Splits a line into plain / bold spans; an unclosed marker makes the rest bold. */
export function parseInline(line: string): InlineSpan[] {
  const parts = stripDanglingMarker(line).split(BOLD_MARKER);
  const spans: InlineSpan[] = [];
  parts.forEach((text, index) => {
    if (text.length > 0) spans.push({ text, bold: index % 2 === 1 });
  });
  return spans;
}

/** Text → blocks. `spaced` marks a block that follows a blank line (paragraph gap). */
export function parseMessage(text: string): MessageBlock[] {
  const blocks: MessageBlock[] = [];
  let gapPending = false;
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    if (raw.trim().length === 0) {
      gapPending = blocks.length > 0;
      continue;
    }
    const spaced = gapPending;
    gapPending = false;
    const bullet = BULLET.exec(raw);
    if (bullet) {
      blocks.push({ kind: 'bullet', spans: parseInline(bullet[1]), spaced });
      continue;
    }
    const numbered = NUMBERED.exec(raw);
    if (numbered) {
      blocks.push({ kind: 'numbered', marker: `${numbered[1]}.`, spans: parseInline(numbered[2]), spaced });
      continue;
    }
    blocks.push({ kind: 'paragraph', spans: parseInline(raw.trim()), spaced });
  }
  return blocks;
}

/** Markup-free text for screen readers and the clipboard. */
export function toPlainText(text: string): string {
  return parseMessage(text)
    .map((block) => {
      const body = block.spans.map((span) => span.text).join('');
      if (block.kind === 'bullet') return `• ${body}`;
      if (block.kind === 'numbered') return `${block.marker} ${body}`;
      return body;
    })
    .join('\n');
}
