/**
 * One day of the streak calendar: a 40 pt circle — flame gradient with a white number when
 * studied, sky tint with a small shield when a shield bridged it, plain otherwise — sitting on
 * the streak band that joins consecutive days. Today gets a 2 pt evergreen ring; days of the
 * adjacent months are greyed.
 */
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ShieldIcon } from '@/components/icons';
import { Text, borderWidth } from '@/components/ui';
import { gradients, radius, spacing, useTheme } from '@/theme';

import { STREAK_COPY } from '../copy';
import type { DayCellView } from '../lib/calendar';
import { streakMetrics } from '../metrics';

export type CalendarDayProps = {
  day: DayCellView;
  /** Circle diameter (40, smaller on very narrow screens). */
  size: number;
  /** "12 settembre" for screen readers. */
  label: string;
  /** Hide statuses while the calendar is loading. */
  plain?: boolean;
};

export function CalendarDay({ day, size, label, plain = false }: CalendarDayProps) {
  const { colors } = useTheme();
  const status = plain ? 'none' : day.status;
  const active = status === 'active';
  const shielded = status === 'shielded';
  const bandStyle = { backgroundColor: colors.streakBg };

  const textColor = !day.inMonth
    ? 'textDisabled'
    : active
      ? 'textInverse'
      : shielded
        ? 'infoText'
        : day.isToday
          ? 'brandText'
          : day.isFuture
            ? 'textTertiary'
            : 'text';

  return (
    <View
      style={[styles.cell, { height: size }]}
      accessible
      accessibilityLabel={STREAK_COPY.dayA11y(label, status, day.isToday)}>
      {!plain && day.joinsLeft ? <View style={[styles.band, styles.left, bandStyle]} /> : null}
      {!plain && day.joinsRight ? <View style={[styles.band, styles.right, bandStyle]} /> : null}

      <View
        style={[
          styles.circle,
          { width: size, height: size },
          shielded && { backgroundColor: colors.shieldBg },
          day.isToday && { borderWidth: borderWidth.thick, borderColor: colors.brandSolid },
        ]}>
        {active ? <LinearGradient colors={gradients.flame} style={[StyleSheet.absoluteFill, styles.round]} /> : null}
        <Text variant="labelMd" color={textColor} tabular>
          {day.dayOfMonth}
        </Text>
      </View>

      {shielded ? (
        <View style={[styles.shield, { marginRight: -size / 2 - spacing.xxxs }]} aria-hidden>
          <ShieldIcon size={streakMetrics.dayShield} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  band: { position: 'absolute', top: 0, bottom: 0 },
  left: { left: 0, right: '50%' },
  right: { left: '50%', right: 0 },
  circle: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  round: { borderRadius: radius.pill },
  shield: { position: 'absolute', top: -spacing.xxxs, right: '50%' },
});
