/**
 * StreakCalendar — "Calendario dei progressi" (spec §3.5): month card with prev/next arrows
 * (the grid slides in from the side you navigate to), Monday-first Italian weekday initials,
 * studied days as flame circles joined by the streak band, shield-protected days, today ringed.
 * On first mount it shows the reference video's short loading beat (typing dots in place of the
 * month name) before the statuses fade in.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { FlameIcon, ShieldIcon } from '@/components/icons';
import { Card, HStack, IconButton, Text, TypingDots, VStack, borderWidth, iconSize, useReduceMotion } from '@/components/ui';
import { CALENDAR_COLUMNS, WEEKDAY_INITIALS_IT, formatMonthYear, shiftMonth, toDayKey, type DayKey } from '@/lib/dates';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { STREAK_COPY } from '../copy';
import { buildMonthView, earliestMonth, monthIndex, monthNameLower, type MonthCursor } from '../lib/calendar';
import { streakMetrics } from '../metrics';
import { CalendarDay } from './calendar-day';

export type StreakCalendarProps = {
  now: number;
  activeDays: readonly DayKey[];
  /** Shield-bridged days, the pending one (yesterday saved by an owned shield) included. */
  shieldedDays: readonly DayKey[];
};

export function StreakCalendar({ now, activeDays, shieldedDays }: StreakCalendarProps) {
  const reduceMotion = useReduceMotion();
  const today = new Date(now);
  const current: MonthCursor = { year: today.getFullYear(), month: today.getMonth() };
  const [view, setView] = useState({ cursor: current, direction: 0 });
  const [loading, setLoading] = useState(true);
  const [gridWidth, setGridWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), streakMetrics.calendarLoadingMs);
    return () => clearTimeout(timer);
  }, []);

  const { cursor, direction } = view;
  const oldest = earliestMonth(current, streakMetrics.calendarMonthsBack, activeDays[0]);
  const canGoBack = monthIndex(cursor) > monthIndex(oldest);
  const canGoForward = monthIndex(cursor) < monthIndex(current);
  const go = (delta: number) => setView({ cursor: shiftMonth(cursor.year, cursor.month, delta), direction: delta });

  const month = buildMonthView(cursor, new Set(activeDays), new Set(shieldedDays), toDayKey(now));
  const monthLabel = formatMonthYear(cursor.year, cursor.month);
  const monthName = monthNameLower(cursor.month);

  // 40 pt circles; narrower when the column cannot fit them (very small web windows).
  const cellWidth = gridWidth > 0 ? gridWidth / CALENDAR_COLUMNS : streakMetrics.dayCell;
  const circle = Math.min(streakMetrics.dayCell, Math.floor(cellWidth - streakMetrics.dayCellMinGap));
  const onGridLayout = (event: LayoutChangeEvent) => setGridWidth(event.nativeEvent.layout.width);

  const slide = reduceMotion
    ? FadeIn.duration(duration.fast)
    : (direction < 0 ? FadeInLeft : FadeInRight).duration(duration.base).easing(easing.enter);

  return (
    <Card padding="lg" contentStyle={styles.content}>
      <HStack justify="space-between">
        <IconButton
          icon={ChevronLeft}
          variant="plain"
          size="sm"
          disabled={loading || !canGoBack}
          accessibilityLabel={STREAK_COPY.prevMonth}
          onPress={() => go(-1)}
        />
        <View style={styles.title} accessibilityLiveRegion="polite">
          {loading ? (
            <TypingDots color="brandText" accessibilityLabel={STREAK_COPY.loading} />
          ) : (
            <Animated.View key={monthLabel} entering={FadeIn.duration(duration.fast)}>
              <Text variant="titleMd" color="brandText" accessibilityRole="header">
                {monthLabel}
              </Text>
            </Animated.View>
          )}
        </View>
        <IconButton
          icon={ChevronRight}
          variant="plain"
          size="sm"
          disabled={loading || !canGoForward}
          accessibilityLabel={STREAK_COPY.nextMonth}
          onPress={() => go(1)}
        />
      </HStack>

      <View style={styles.weekdays} aria-hidden>
        {WEEKDAY_INITIALS_IT.map((initial, index) => (
          <Text key={`${initial}-${index}`} variant="labelSm" color="textTertiary" align="center" style={styles.weekday}>
            {initial}
          </Text>
        ))}
      </View>

      <View onLayout={onGridLayout} style={styles.gridClip}>
        <Animated.View key={monthLabel} entering={direction === 0 ? undefined : slide} style={styles.grid}>
          {month.weeks.map((week) => (
            <View key={week[0].key} style={styles.week}>
              {week.map((day) => (
                <CalendarDay
                  key={day.key}
                  day={day}
                  size={circle}
                  plain={loading}
                  label={`${day.dayOfMonth} ${monthNameLower(Number(day.key.slice(5, 7)) - 1)}`}
                />
              ))}
            </View>
          ))}
        </Animated.View>
      </View>

      {loading ? null : (
        <Animated.View entering={FadeIn.duration(duration.base)}>
          <VStack gap="sm" style={styles.footer}>
            <Text variant="labelMd" color="textSecondary" align="center">
              {STREAK_COPY.monthSummary(month.activeCount, monthName)}
            </Text>
            <Legend />
          </VStack>
        </Animated.View>
      )}
    </Card>
  );
}

function Legend() {
  const { colors } = useTheme();
  return (
    <HStack gap="md" justify="center" wrap aria-hidden>
      <HStack gap="xxs">
        <FlameIcon size={iconSize.sm} />
        <Text variant="labelSm" color="textTertiary">
          {STREAK_COPY.legendActive}
        </Text>
      </HStack>
      <HStack gap="xxs">
        <ShieldIcon size={iconSize.sm} />
        <Text variant="labelSm" color="textTertiary">
          {STREAK_COPY.legendShield}
        </Text>
      </HStack>
      <HStack gap="xxs">
        <View style={[styles.todayDot, { borderColor: colors.brandSolid }]} />
        <Text variant="labelSm" color="textTertiary">
          {STREAK_COPY.legendToday}
        </Text>
      </HStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  title: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: iconSize.xl },
  weekdays: { flexDirection: 'row', marginTop: spacing.xxs },
  weekday: { flex: 1 },
  gridClip: { overflow: 'hidden' },
  grid: { gap: spacing.xs },
  week: { flexDirection: 'row' },
  footer: { marginTop: spacing.xs },
  todayDot: {
    width: iconSize.sm - spacing.xxxs,
    height: iconSize.sm - spacing.xxxs,
    borderRadius: radius.pill,
    borderWidth: borderWidth.thick,
  },
});
