/**
 * Pure view model of the streak calendar: a Monday-first 6×7 month grid (`getMonthMatrix`) where
 * every in-month day knows its status (studied / bridged by a shield / nothing), whether it is
 * today or in the future, and whether it joins its neighbours in the streak band.
 */
import { MONTH_NAMES_IT, getMonthMatrix, shiftMonth, type DayKey } from '@/lib/dates';

export type DayStatus = 'active' | 'shielded' | 'none';

export type DayCellView = {
  key: DayKey;
  dayOfMonth: number;
  inMonth: boolean;
  status: DayStatus;
  isToday: boolean;
  isFuture: boolean;
  /** The streak band continues to the previous / next cell of the same week row. */
  joinsLeft: boolean;
  joinsRight: boolean;
};

export type MonthView = {
  weeks: DayCellView[][];
  /** Studied days in this month. */
  activeCount: number;
};

export type MonthCursor = { year: number; month: number };

export function buildMonthView(
  { year, month }: MonthCursor,
  activeDays: ReadonlySet<DayKey>,
  shieldedDays: ReadonlySet<DayKey>,
  todayKey: DayKey,
): MonthView {
  let activeCount = 0;
  const weeks = getMonthMatrix(year, month).map((week) => {
    const cells = week.map((day) => {
      const status: DayStatus = !day.inCurrentMonth
        ? 'none'
        : activeDays.has(day.key)
          ? 'active'
          : shieldedDays.has(day.key)
            ? 'shielded'
            : 'none';
      if (status === 'active') activeCount += 1;
      return {
        key: day.key,
        dayOfMonth: day.dayOfMonth,
        inMonth: day.inCurrentMonth,
        status,
        isToday: day.key === todayKey,
        // Day keys sort chronologically.
        isFuture: day.key > todayKey,
        joinsLeft: false,
        joinsRight: false,
      };
    });
    cells.forEach((cell, col) => {
      const chained = cell.status !== 'none';
      cell.joinsLeft = chained && col > 0 && cells[col - 1].status !== 'none';
      cell.joinsRight = chained && col < cells.length - 1 && cells[col + 1].status !== 'none';
    });
    return cells;
  });
  return { weeks, activeCount };
}

/** Months as a single comparable index. */
export const monthIndex = ({ year, month }: MonthCursor) => year * 12 + month;

/** Oldest month reachable with the arrows: `monthsBack` months, or the first studied day if older. */
export function earliestMonth(today: MonthCursor, monthsBack: number, firstActiveDay: DayKey | undefined): MonthCursor {
  const window = shiftMonth(today.year, today.month, -(monthsBack - 1));
  if (!firstActiveDay) return window;
  const [y, m] = firstActiveDay.split('-').map(Number);
  const first = { year: y, month: m - 1 };
  return monthIndex(first) < monthIndex(window) ? first : window;
}

/** Lower-case month name for running text ("a settembre"). */
export const monthNameLower = (month: number) => MONTH_NAMES_IT[month].toLowerCase();
