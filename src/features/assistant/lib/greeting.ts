/**
 * The greeting is one content string ("Ciao! 🦊 Sono il tuo assistente…"). The Coach intro shows
 * its opening exclamation (plus a trailing emoji) as a headline and the rest as the lead.
 * `joinGreeting` gives the single string the typewriter reveals (headline, line break, body);
 * `splitTyped` cuts the revealed part back into the two pieces.
 */
export type GreetingParts = { headline: string; body: string };

/** Longest opening that still reads as a headline. */
const HEADLINE_MAX = 24;
const LETTER_OR_DIGIT = /[A-Za-z0-9À-ɏ]/;

export function splitGreeting(text: string): GreetingParts {
  const end = text.search(/[!?]\s/);
  if (end < 0 || end >= HEADLINE_MAX) return { headline: '', body: text };
  let cut = end + 1;
  const rest = text.slice(cut).trimStart();
  const firstToken = rest.split(/\s/, 1)[0] ?? '';
  // "Ciao! 🦊 Sono…": the emoji belongs to the headline.
  if (firstToken && !LETTER_OR_DIGIT.test(firstToken[0])) cut = text.indexOf(firstToken, cut) + firstToken.length;
  return { headline: text.slice(0, cut).trim(), body: text.slice(cut).trim() };
}

export function joinGreeting(parts: GreetingParts): string {
  return parts.headline ? `${parts.headline}\n${parts.body}` : parts.body;
}

export function splitTyped(visible: string, parts: GreetingParts): GreetingParts {
  if (!parts.headline) return { headline: '', body: visible };
  const breakAt = visible.indexOf('\n');
  return breakAt < 0 ? { headline: visible, body: '' } : { headline: visible.slice(0, breakAt), body: visible.slice(breakAt + 1) };
}
