/**
 * Calendar helpers in the device's LOCAL time zone.
 *
 * Day keys ('YYYY-MM-DD') are the unit of the streak system: a day is "active" when at least one
 * chapter was completed on that local calendar day (react-duolingo `createStreakStore.ts` stores
 * the same kind of list). Arithmetic goes through `Date#setDate` / local components so it stays
 * correct across DST changes (a local day can be 23 or 25 hours long).
 */

/** Local calendar day, formatted 'YYYY-MM-DD'. */
export type DayKey = string;

export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

type DateInput = Date | number;

const toDate = (input: DateInput): Date => (input instanceof Date ? new Date(input.getTime()) : new Date(input));

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Local day key of a date or timestamp: `toDayKey(new Date(2026, 8, 1))` → '2026-09-01'. */
export function toDayKey(input: DateInput): DayKey {
  const d = toDate(input);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const DAY_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDayKey(value: unknown): value is DayKey {
  return typeof value === 'string' && DAY_KEY_RE.test(value);
}

/** Local midnight of a day key. Throws on malformed keys (programming error). */
export function fromDayKey(key: DayKey): Date {
  const match = DAY_KEY_RE.exec(key);
  if (!match) throw new Error(`Invalid day key: ${key}`);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** Local midnight of the given day. */
export function startOfDay(input: DateInput): Date {
  const d = toDate(input);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** First day of the month, local midnight. */
export function startOfMonth(input: DateInput): Date {
  const d = startOfDay(input);
  d.setDate(1);
  return d;
}

/** Adds calendar days (negative to go back), keeping the local time of day. */
export function addDays(input: DateInput, days: number): Date {
  const d = toDate(input);
  d.setDate(d.getDate() + days);
  return d;
}

/** Day key shifted by `days` calendar days: `addDaysToKey('2026-09-01', -1)` → '2026-08-31'. */
export function addDaysToKey(key: DayKey, days: number): DayKey {
  return toDayKey(addDays(fromDayKey(key), days));
}

export function isSameDay(a: DateInput, b: DateInput): boolean {
  return toDayKey(a) === toDayKey(b);
}

/** Calendar days from `a` to `b` (positive when `b` is later), ignoring the time of day. */
export function daysBetween(a: DateInput | DayKey, b: DateInput | DayKey): number {
  const utcDay = (input: DateInput | DayKey) => {
    const d = typeof input === 'string' ? fromDayKey(input) : toDate(input);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  };
  return Math.round((utcDay(b) - utcDay(a)) / DAY_MS);
}

/** Milliseconds left until the next local midnight (the daily reset of shop / daily reward). */
export function msUntilMidnight(now: DateInput): number {
  const d = toDate(now);
  const midnight = startOfDay(addDays(d, 1));
  return Math.max(0, midnight.getTime() - d.getTime());
}

/**
 * Compact countdown used by the shop and the lives refill: '2h 26min', '2h', '26min', '45s'.
 * Rounds UP to the next minute above one minute so a timer never shows "0min" while waiting.
 */
export function formatCountdown(ms: number): string {
  const safe = Math.max(0, ms);
  if (safe < MINUTE_MS) return `${Math.ceil(safe / 1000)}s`;
  const totalMinutes = Math.ceil(safe / MINUTE_MS);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}min`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
}

/** Clock-style countdown 'H:MM:SS' / 'MM:SS' for ticking timers (tabular digits). */
export function formatCountdownClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0 ? `${hours}:${pad2(minutes)}:${pad2(seconds)}` : `${pad2(minutes)}:${pad2(seconds)}`;
}

/* ------------------------------------------------------------------------------------------ */
/* Month grid for the streak calendar                                                          */
/* ------------------------------------------------------------------------------------------ */

export type CalendarDay = {
  key: DayKey;
  /** Local midnight. */
  date: Date;
  /** 1–31. */
  dayOfMonth: number;
  /** false for the greyed days of the previous / next month. */
  inCurrentMonth: boolean;
  /** 0 = Monday … 6 = Sunday. */
  weekdayIndex: number;
};

/** 6 rows × 7 columns, always the same height so the calendar card never jumps. */
export type MonthMatrix = CalendarDay[][];

export const CALENDAR_ROWS = 6;
export const CALENDAR_COLUMNS = 7;

/** Monday-first weekday index (0 = Monday … 6 = Sunday). */
export const mondayIndex = (input: DateInput): number => (toDate(input).getDay() + 6) % 7;

/**
 * Monday-first 6×7 grid for `month` (0-based, like `Date#getMonth`) of `year`, padded with the
 * trailing days of the previous month and the leading days of the next one.
 */
export function getMonthMatrix(year: number, month: number): MonthMatrix {
  const first = new Date(year, month, 1);
  const gridStart = addDays(first, -mondayIndex(first));
  const currentMonth = first.getMonth();

  const rows: MonthMatrix = [];
  for (let row = 0; row < CALENDAR_ROWS; row += 1) {
    const week: CalendarDay[] = [];
    for (let col = 0; col < CALENDAR_COLUMNS; col += 1) {
      const date = addDays(gridStart, row * CALENDAR_COLUMNS + col);
      week.push({
        key: toDayKey(date),
        date,
        dayOfMonth: date.getDate(),
        inCurrentMonth: date.getMonth() === currentMonth,
        weekdayIndex: col,
      });
    }
    rows.push(week);
  }
  return rows;
}

/** `{year, month}` shifted by `delta` months (month 0-based), for the calendar arrows. */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/* ------------------------------------------------------------------------------------------ */
/* Italian labels (deterministic: no dependency on the device's Intl data)                     */
/* ------------------------------------------------------------------------------------------ */

export const MONTH_NAMES_IT = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
] as const;

/** Monday-first single-letter headers: L M M G V S D. */
export const WEEKDAY_INITIALS_IT = ['L', 'M', 'M', 'G', 'V', 'S', 'D'] as const;

/** Monday-first short names: Lun Mar Mer Gio Ven Sab Dom. */
export const WEEKDAY_SHORT_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'] as const;

/** 'Settembre 2026' (month 0-based). */
export function formatMonthYear(year: number, month: number): string {
  const { year: y, month: m } = shiftMonth(year, month, 0);
  return `${MONTH_NAMES_IT[m]} ${y}`;
}

/** '29 settembre 2026' — used in purchase history and records. */
export function formatLongDate(input: DateInput): string {
  const d = toDate(input);
  return `${d.getDate()} ${MONTH_NAMES_IT[d.getMonth()].toLowerCase()} ${d.getFullYear()}`;
}
