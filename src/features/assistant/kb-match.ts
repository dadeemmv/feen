/**
 * Knowledge-base matching on top of `@/content/assistant`:
 * 0. requests for personalised advice always get the polite no-advice answer;
 * 1. the content layer's exact matcher (`findKbEntry`: accent-free word-start stems, priorities);
 * 2. a typo-tolerant pass for single-word stems (one edit away, e.g. "inflazzione", "dividenti"),
 *    limited to real topics (small-talk entries with a negative priority are excluded).
 */
import { ASSISTANT_KB, findKbEntry, getKbEntry, normalizeQuery, type AssistantKbEntry } from '@/content';

/** Only stems/tokens this long are compared fuzzily (short words collide too easily). */
const FUZZY_MIN_LENGTH = 5;

/** True when `a` and `b` differ by at most one insertion, deletion or substitution. */
export function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const lengthGap = a.length - b.length;
  if (Math.abs(lengthGap) > 1) return false;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (short.length === long.length) i += 1;
    j += 1;
  }
  return edits + (long.length - j) + (short.length - i) <= 1;
}

/** Does `token` start with something one edit away from `stem`? */
function fuzzyStartsWith(token: string, stem: string): boolean {
  for (const length of [stem.length - 1, stem.length, stem.length + 1]) {
    if (length < FUZZY_MIN_LENGTH - 1 || length > token.length) continue;
    if (withinOneEdit(token.slice(0, length), stem)) return true;
  }
  return false;
}

type Candidate = { entry: AssistantKbEntry; score: number; priority: number };

function fuzzyMatch(question: string): AssistantKbEntry | undefined {
  const tokens = normalizeQuery(question)
    .trim()
    .split(' ')
    .filter((token) => token.length >= FUZZY_MIN_LENGTH);
  if (tokens.length === 0) return undefined;

  let best: Candidate | undefined;
  for (const entry of ASSISTANT_KB) {
    const priority = entry.priority ?? 0;
    if (priority < 0) continue;
    let score = 0;
    for (const keyword of entry.keywords) {
      const stem = normalizeQuery(keyword).trim();
      if (stem.includes(' ') || stem.length < FUZZY_MIN_LENGTH) continue;
      if (tokens.some((token) => fuzzyStartsWith(token, stem))) score += stem.length;
    }
    if (score === 0) continue;
    if (!best || priority > best.priority || (priority === best.priority && score > best.score)) {
      best = { entry, score, priority };
    }
  }
  return best?.entry;
}

/** KB entry that politely declines personalised advice (content guardrail). */
export const NO_ADVICE_ENTRY_ID = 'no-personal-advice';

/**
 * "What should *I* buy / where do I put my money" phrasings the content keywords miss
 * ("dimmi cosa comprare", "su cosa investo 1000 euro?", "dovrei vendere?"). Matched on the
 * normalised text (lowercase, no accents or punctuation, padded with spaces). Educational
 * questions ("quanto dovrei risparmiare?", "come si compra un ETF?") stay untouched.
 */
const ADVICE_PATTERNS: readonly RegExp[] = [
  / cosa (devo |dovrei |posso |mi conviene )?(compr|vend)/,
  / dimmi (cosa|quale|quali|dove|su cosa|in cosa) (\w+ )?(compr|vend|invest|scegl|mett)/,
  / (su|in) (cosa|che cosa) (devo |dovrei |posso )?invest/,
  / dove (devo |dovrei |posso |mi conviene )?(investire|investo|metto|mettere) /,
  / (dovrei|devo) (comprare|vendere|investire (in|su|tutto|i miei)) /,
  / (compro|vendo) (o|oppure) (vendo|compro|aspetto|tengo) /,
  / vale la pena (compr|invest)/,
  / (consigliami|consigliatemi|mi consigli) /,
];

export function isPersonalAdviceRequest(question: string): boolean {
  const haystack = normalizeQuery(question);
  return ADVICE_PATTERNS.some((pattern) => pattern.test(haystack));
}

/**
 * Best entry for a free-text question: the no-advice guardrail first, then the content matcher
 * (exact word-start stems), then the typo-tolerant pass.
 */
export function matchKnowledgeBase(question: string): AssistantKbEntry | undefined {
  if (isPersonalAdviceRequest(question)) {
    const guardrail = getKbEntry(NO_ADVICE_ENTRY_ID);
    if (guardrail) return guardrail;
  }
  return findKbEntry(question) ?? fuzzyMatch(question);
}
