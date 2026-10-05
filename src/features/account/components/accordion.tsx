/**
 * Accordion card (Supporto FAQ, Informazioni legali): one white card, rows separated by
 * hairlines, one row open at a time. The chevron turns, the answer fades in and the rows below
 * glide to their new place.
 */
import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';

import { Divider, hairline, Icon, IconTile, PressableScale, Text, useReduceMotion, type IconSource, type Tone } from '@/components/ui';
import { duration, easing, elevation, layout, radius, spacing, useTheme } from '@/theme';

import { accountMetrics } from '../metrics';

export type AccordionEntry = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  icon?: IconSource;
  iconTone?: Tone;
  /** Extra node under the paragraphs (e.g. a sample-text tag). */
  footer?: ReactNode;
};

const HALF_TURN_DEG = 180;

function Chevron({ open }: { open: boolean }) {
  const reduceMotion = useReduceMotion();
  const turn = useSharedValue(open ? 1 : 0);
  useEffect(() => {
    const target = open ? 1 : 0;
    turn.set(reduceMotion ? target : withTiming(target, { duration: duration.base, easing: easing.standard }));
  }, [open, reduceMotion, turn]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get() * HALF_TURN_DEG}deg` }] }));
  return (
    <Animated.View style={style}>
      <Icon icon={ChevronDown} size={accountMetrics.chevron} color="textTertiary" />
    </Animated.View>
  );
}

function AccordionRow({ entry, open, onToggle }: { entry: AccordionEntry; open: boolean; onToggle: () => void }) {
  const reduceMotion = useReduceMotion();
  return (
    <Animated.View layout={reduceMotion ? undefined : LinearTransition.duration(duration.base).easing(easing.standard)}>
      <PressableScale
        onPress={onToggle}
        scaleTo={false}
        dimOnPress
        haptic="selection"
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={entry.title}
        style={styles.header}>
        {entry.icon ? <IconTile icon={entry.icon} tone={entry.iconTone ?? 'neutral'} size="sm" /> : null}
        <Text variant="titleSm" style={styles.flex}>
          {entry.title}
        </Text>
        <Chevron open={open} />
      </PressableScale>
      {open ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(duration.base).easing(easing.enter)}
          exiting={reduceMotion ? undefined : FadeOut.duration(duration.fast).easing(easing.exit)}
          style={styles.body}>
          {entry.paragraphs.map((paragraph, index) => (
            <Text key={index} variant="bodyMd" color="textSecondary">
              {paragraph}
            </Text>
          ))}
          {entry.footer}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export type AccordionProps = {
  entries: readonly AccordionEntry[];
  /** Row open on mount. */
  initialOpenId?: string;
};

export function Accordion({ entries, initialOpenId }: AccordionProps) {
  const { colors } = useTheme();
  const [openId, setOpenId] = useState<string | null>(initialOpenId ?? null);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
      {entries.map((entry, index) => (
        <Fragment key={entry.id}>
          {index > 0 ? <Divider /> : null}
          <AccordionRow
            entry={entry}
            open={openId === entry.id}
            onToggle={() => setOpenId((current) => (current === entry.id ? null : entry.id))}
          />
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: hairline,
    boxShadow: elevation.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: layout.minTouch + spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  body: { gap: spacing.xs, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  flex: { flex: 1 },
});
