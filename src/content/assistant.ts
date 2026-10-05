/**
 * Offline AI coach (the app has no backend): greeting, suggestion chips, a keyword-matched
 * knowledge base and the "Spiegami il perché" templates used inside lessons.
 * All replies are educational only — never personalised financial advice.
 */
import { ASSISTANT_KB } from './assistant-kb';
import type { AssistantKbEntry, AssistantReply } from './extra-types';

export { ASSISTANT_KB };

export const ASSISTANT_NAME = 'Assistente Finanz';

export const ASSISTANT_GREETING =
  'Ciao! 🦊 Sono il tuo assistente finanziario personale. Sono qui per aiutarti a capire risparmio, investimenti e tutto ciò che incontri nel percorso: chiedimi pure!';

export const ASSISTANT_INPUT_PLACEHOLDER = 'Chiedi qualcosa…';

/** Chips shown under the greeting; tapping one sends it as the user's message. */
export const SUGGESTED_PROMPTS: readonly string[] = [
  'Cos’è l’inflazione?',
  'Come funziona un ETF?',
  'Quanto dovrei risparmiare?',
  'Cos’è l’interesse composto?',
  'Che differenza c’è tra azioni e obbligazioni?',
  'Come riconosco una truffa?',
];

/** Short non-advice line shown under the chat and after sensitive answers. */
export const ASSISTANT_DISCLAIMER =
  'Le risposte hanno scopo educativo e non costituiscono consulenza finanziaria personalizzata.';

export const ASSISTANT_FALLBACK =
  'Bella domanda! 🤔 Su questo non ho ancora una risposta affidabile. Posso aiutarti con inflazione, interesse composto, azioni, obbligazioni, ETF, diversificazione, broker, tasse, PAC e budget. Prova a riformulare la domanda o tocca uno dei suggerimenti.';

/** User bubble sent when the learner taps "Spiegami il perché" after a wrong answer. */
export const EXPLAIN_MISTAKE_REQUEST = 'Spiegami perché ho sbagliato';

/** User bubble sent when the learner taps the ✨ button on a step without a wrong answer. */
export const EXPLAIN_STEP_REQUEST = 'Spiegami meglio questo passaggio';

// ─── Lesson explanations ─────────────────────────────────────────────────────────────────────

const MISTAKE_OPENERS = [
  'Nessun problema, sbagliando si impara! 💡',
  'Domanda insidiosa, capita a tutti! 💡',
  'Ottima occasione per fissare il concetto! 💡',
] as const;

const GENERIC_HINT =
  'Rileggi con calma la domanda: spesso la parola chiave è nascosta in un dettaglio, come “sempre”, “esattamente” o un numero.';

const CLOSING_LINE = 'Se hai altri dubbi, chiedimi pure qui sotto.';

/** Stable, render-safe pick (no Math.random: the same step always gets the same opener). */
function pickStable<T>(items: readonly T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return items[hash % items.length];
}

/**
 * Assistant reply to "Spiegami perché ho sbagliato".
 * `correctLabel` comes from `getCorrectAnswerLabel(step)`; multi-line labels (match/order) are
 * shown as a list.
 */
export function explainMistake(stepExplanation: string | undefined, correctLabel: string): string {
  const label = correctLabel.trim();
  const answerLine = label.includes('\n')
    ? `La risposta corretta è:\n${label}`
    : `La risposta corretta è “${label}”.`;
  return [
    pickStable(MISTAKE_OPENERS, label),
    answerLine,
    stepExplanation?.trim() || GENERIC_HINT,
    CLOSING_LINE,
  ].join('\n\n');
}

/** Assistant reply to the ✨ button on an info/definition step (or a correctly answered one). */
export function explainStep(stepExplanation: string | undefined): string {
  const body =
    stepExplanation?.trim() ||
    'Questo passaggio introduce un concetto che userai nelle prossime domande: leggilo con calma e prova a ripeterlo con parole tue.';
  return ['Ecco il punto chiave 💡', body, CLOSING_LINE].join('\n\n');
}

// ─── Knowledge-base matching ─────────────────────────────────────────────────────────────────

/** Lowercase, strip accents and punctuation, pad with spaces for word-start matching. */
export function normalizeQuery(text: string): string {
  const plain = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return ` ${plain} `;
}

/** Keyword → needle: word-start match, whole-word when the keyword ends with a space. */
function toNeedle(keyword: string): string {
  const core = normalizeQuery(keyword).trim();
  return keyword.endsWith(' ') ? ` ${core} ` : ` ${core}`;
}

type Scored = { entry: AssistantKbEntry; score: number; priority: number };

function scoreEntry(entry: AssistantKbEntry, haystack: string): Scored | null {
  let score = 0;
  for (const keyword of entry.keywords) {
    const needle = toNeedle(keyword);
    if (haystack.includes(needle)) score += needle.trim().length;
  }
  return score > 0 ? { entry, score, priority: entry.priority ?? 0 } : null;
}

/** Best knowledge-base entry for a message, or `undefined` when nothing matches. */
export function findKbEntry(message: string): AssistantKbEntry | undefined {
  const haystack = normalizeQuery(message);
  let best: Scored | null = null;
  for (const entry of ASSISTANT_KB) {
    const scored = scoreEntry(entry, haystack);
    if (!scored) continue;
    const better =
      !best ||
      scored.priority > best.priority ||
      (scored.priority === best.priority && scored.score > best.score);
    if (better) best = scored;
  }
  return best?.entry;
}

export function getKbEntry(entryId: string): AssistantKbEntry | undefined {
  return ASSISTANT_KB.find((entry) => entry.id === entryId);
}

/** Offline "AI" answer for a free-text question. */
export function answerQuestion(message: string): AssistantReply {
  const entry = findKbEntry(message);
  if (!entry) return { text: ASSISTANT_FALLBACK, entryId: null };
  return { text: entry.answer, entryId: entry.id, chapterId: entry.chapterId };
}
