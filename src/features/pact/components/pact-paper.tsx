/**
 * The pact on paper (concept board, screen 3): warm paper with a dot grain, "Il patto del borgo ·
 * n. 0001" and the date in code, the title "Il *Patto*", five numbered articles and, below, the
 * signature area passed by the caller. When editable, the words in sprout can be tapped to cycle
 * through their options; article 4 is the partner's clause.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, VStack } from '@/components/ui';
import type { Mascot } from '@/content/personality';
import { elevation, fonts, galleryColors, radius, spacing, useTheme } from '@/theme';

import { PACT_COPY } from '../copy';
import { PARACHUTE, pactDate, pactNumber } from '../data';
import { PaperTexture } from './paper-texture';

export type PactTerms = { why: string; minutes: number; days: number; when: string };

export type PactPaperProps = {
  name: string;
  mascot: Mascot;
  terms: PactTerms;
  number: number;
  date: number;
  /** Tapping a sprout word: when set, the choices are live. */
  onCycle?: (field: 'why' | 'minutes' | 'when') => void;
  /** Signature and countersignature. */
  children?: ReactNode;
};

function Choice({ value, field, onCycle }: { value: string; field: 'why' | 'minutes' | 'when'; onCycle?: PactPaperProps['onCycle'] }) {
  if (!onCycle) return <Text variant="bodyLg">{value}</Text>;
  return (
    <Text
      variant="bodyLg"
      style={styles.choice}
      onPress={() => onCycle(field)}
      // No button role: on web it would turn the words into an inline-block and break the line.
      accessibilityLabel={PACT_COPY.changeA11y(value)}
      suppressHighlighting>
      {value}
    </Text>
  );
}

function Article({ n, title, children }: { n: number; title?: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.article, { borderTopColor: colors.borderStrong }]}>
      <Text variant="code" color="textSecondary">
        {title ? `${PACT_COPY.article(n)} · ${title}` : PACT_COPY.article(n)}
      </Text>
      <Text variant="bodyLg">{children}</Text>
    </View>
  );
}

export function PactPaper({ name, mascot, terms, number, date, onCycle, children }: PactPaperProps) {
  return (
    <View style={styles.paper}>
      <PaperTexture />
      <VStack gap="lg">
        <VStack gap="xs">
          <Text variant="code" color="textSecondary">
            {`${PACT_COPY.header(pactNumber(number))}\n${pactDate(date)}`}
          </Text>
          <Text variant="displayLg" accessibilityRole="header">
            {`${PACT_COPY.title} `}
            <Text variant="displayLg" style={styles.italic}>
              {PACT_COPY.titleWord}
            </Text>
          </Text>
        </VStack>

        <VStack gap="none">
          <Article n={1}>
            {`Io, ${name}, mi impegno a imparare a gestire i miei soldi `}
            <Choice value={terms.why} field="why" onCycle={onCycle} />.
          </Article>
          <Article n={2}>
            {'Ogni giorno dedico '}
            <Choice value={PACT_COPY.art2Minutes(terms.minutes)} field="minutes" onCycle={onCycle} />
            {` al mio borgo, per ${terms.days} giorni.`}
          </Article>
          <Article n={3}>
            <Choice value={terms.when} field="when" onCycle={onCycle} />
            {', apro il borgo.'}
          </Article>
          <Article n={4} title={PACT_COPY.art4Title(mascot.partner.name)}>
            {mascot.partner.clause}
          </Article>
          <Article n={5}>{PARACHUTE}</Article>
        </VStack>

        {onCycle ? (
          <Text variant="bodySm" color="textSecondary">
            {PACT_COPY.changeHint}
          </Text>
        ) : null}

        {children}
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    borderRadius: radius.xxl,
    padding: spacing.xl,
    overflow: 'hidden',
    backgroundColor: galleryColors.contract,
    boxShadow: elevation.paper,
  },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  article: {
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  choice: {
    backgroundColor: galleryColors.sprout,
    textDecorationLine: 'underline',
    textDecorationColor: galleryColors.sprout2,
    borderRadius: radius.xs,
  },
});
