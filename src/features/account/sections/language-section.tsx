/**
 * Lingua e Paese: Italiano (current) · English (coming soon, disabled) · Paese: Italia.
 */
import { StyleSheet } from 'react-native';

import { ChoiceRow, SectionHeader, Tag, Text, VStack } from '@/components/ui';
import { getStoreState, useStore } from '@/store';
import { spacing } from '@/theme';

import { SectionPage } from '../components/section-page';
import { LANGUAGE_COPY, MENU_COPY } from '../copy';

export function LanguageSection() {
  const language = useStore((s) => s.language);
  const copy = LANGUAGE_COPY;

  return (
    <SectionPage title={MENU_COPY.language.title} subtitle={copy.subtitle}>
      <VStack gap="xs">
        <SectionHeader title={copy.language} />
        <ChoiceRow
          emoji="🇮🇹"
          iconTone="neutral"
          label={copy.italian.label}
          description={copy.italian.description}
          selected={language === 'it'}
          onPress={() => getStoreState().setLanguage('it')}
        />
        <ChoiceRow
          emoji="🇬🇧"
          iconTone="neutral"
          label={copy.english.label}
          description={copy.english.description}
          selected={false}
          disabled
          onPress={() => undefined}
          trailing={<Tag label={copy.soon} tone="lilac" size="sm" />}
          accessibilityHint={copy.english.description}
        />
      </VStack>

      <VStack gap="xs">
        <SectionHeader title={copy.country} />
        <ChoiceRow
          emoji="🇮🇹"
          iconTone="neutral"
          label={copy.italy.label}
          description={copy.italy.description}
          selected
          onPress={() => undefined}
        />
        <Text variant="bodySm" color="textTertiary" style={styles.note}>
          {copy.countryNote}
        </Text>
      </VStack>
    </SectionPage>
  );
}

const styles = StyleSheet.create({
  note: { paddingHorizontal: spacing.xxs, paddingTop: spacing.xxs },
});
