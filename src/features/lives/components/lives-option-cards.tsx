/**
 * The two cards of the Lives sheet (reference video t=17 s): the recommended PRO card
 * ("Vite illimitate", selected, check badge) next to the current-state card (hearts + "Piena!").
 * Both are tappable: PRO opens the paywall, the state card is informative.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckBadgeIcon, HeartInfinityIcon } from '@/components/icons';
import { PressableScale, Tag, Text, borderWidth, hairline, iconSize } from '@/components/ui';
import { elevation, radius, spacing, useTheme } from '@/theme';

import { LIVES_COPY } from '../copy';
import { HeartsRow } from './hearts-row';

/** Min height of the two cards (redlines: 150). */
const CARD_MIN_HEIGHT = 150;
const ART_SIZE = iconSize.xl + spacing.lg;
const HEART_SIZE = iconSize.xl;

export type LivesOptionCardsProps = {
  lives: number;
  max: number;
  onProPress: () => void;
};

export function LivesOptionCards({ lives, max, onProPress }: LivesOptionCardsProps) {
  const theme = useTheme();
  const status =
    lives >= max ? LIVES_COPY.statusFull : lives === 0 ? LIVES_COPY.statusEmpty : LIVES_COPY.statusPartial(lives, max);

  return (
    <View style={styles.row}>
      <PressableScale
        onPress={onProPress}
        haptic="selection"
        accessibilityRole="button"
        accessibilityState={{ selected: true }}
        accessibilityLabel={`${LIVES_COPY.proCard.title}, ${LIVES_COPY.proCard.subtitle}`}
        style={[
          styles.card,
          styles.proCard,
          { backgroundColor: theme.colors.proBg, borderColor: theme.colors.pro },
        ]}>
        <Tag label={LIVES_COPY.proCard.tag} tone="pro" solid size="sm" style={styles.tag} />
        <View style={styles.check} aria-hidden>
          <CheckBadgeIcon size={iconSize.lg} />
        </View>
        <CardBody
          art={<HeartInfinityIcon size={ART_SIZE} />}
          title={LIVES_COPY.proCard.title}
          subtitle={LIVES_COPY.proCard.subtitle}
        />
      </PressableScale>

      <View
        accessible
        accessibilityLabel={`${status.title}. ${status.subtitle}`}
        style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <CardBody
          art={<HeartsRow lives={lives} max={max} size={HEART_SIZE} />}
          title={status.title}
          subtitle={status.subtitle}
        />
      </View>
    </View>
  );
}

function CardBody({ art, title, subtitle }: { art: ReactNode; title: string; subtitle: string }) {
  return (
    <View style={styles.body}>
      <View style={styles.art}>{art}</View>
      <Text variant="titleMd" align="center" numberOfLines={1}>
        {title}
      </Text>
      <Text variant="bodySm" color="textSecondary" align="center" numberOfLines={2}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  card: {
    flex: 1,
    minHeight: CARD_MIN_HEIGHT,
    borderRadius: radius.xl,
    borderWidth: hairline,
    padding: spacing.md,
    justifyContent: 'center',
  },
  proCard: { borderWidth: borderWidth.thick, boxShadow: elevation.md },
  tag: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  check: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  body: { alignItems: 'center', gap: spacing.xxs, paddingTop: spacing.md },
  art: { height: ART_SIZE + spacing.xs, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxs },
});
