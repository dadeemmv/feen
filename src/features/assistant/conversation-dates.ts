/**
 * Date labels and grouping for the conversations sheet ("Oggi", "Ieri", "Ultimi 7 giorni",
 * "Meno recenti"), in local time and without Intl (deterministic across devices).
 */
import { daysBetween, MONTH_NAMES_IT } from '@/lib/dates';

import { copy } from './copy';
import type { Conversation } from './types';

export type ConversationGroupId = 'today' | 'yesterday' | 'week' | 'older';

export type ConversationGroup = { id: ConversationGroupId; title: string; items: Conversation[] };

const GROUP_TITLES: Record<ConversationGroupId, string> = {
  today: copy.groupToday,
  yesterday: copy.groupYesterday,
  week: copy.groupWeek,
  older: copy.groupOlder,
};
const GROUP_ORDER: ConversationGroupId[] = ['today', 'yesterday', 'week', 'older'];
const WEEK_DAYS = 7;

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Calendar days between the activity and now (0 = today). */
const dayOffset = (timestamp: number, now: number): number => daysBetween(timestamp, now);

function groupOf(timestamp: number, now: number): ConversationGroupId {
  const offset = dayOffset(timestamp, now);
  if (offset <= 0) return 'today';
  if (offset === 1) return 'yesterday';
  if (offset < WEEK_DAYS) return 'week';
  return 'older';
}

/** "14:32" today, "Ieri, 09:10", "12 settembre" this year, "12 settembre 2025" before. */
export function formatConversationDate(timestamp: number, now: number): string {
  const date = new Date(timestamp);
  const time = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  const offset = dayOffset(timestamp, now);
  if (offset <= 0) return time;
  if (offset === 1) return `${copy.groupYesterday}, ${time}`;
  const dayMonth = `${date.getDate()} ${MONTH_NAMES_IT[date.getMonth()].toLowerCase()}`;
  return date.getFullYear() === new Date(now).getFullYear() ? dayMonth : `${dayMonth} ${date.getFullYear()}`;
}

/** Newest first, bucketed by the last activity. Empty buckets are omitted. */
export function groupConversations(conversations: readonly Conversation[], now: number): ConversationGroup[] {
  const buckets = new Map<ConversationGroupId, Conversation[]>();
  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  for (const conversation of sorted) {
    const id = groupOf(conversation.updatedAt, now);
    buckets.set(id, [...(buckets.get(id) ?? []), conversation]);
  }
  return GROUP_ORDER.filter((id) => buckets.has(id)).map((id) => ({
    id,
    title: GROUP_TITLES[id],
    items: buckets.get(id) ?? [],
  }));
}
