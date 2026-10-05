/**
 * Supporto: FAQ accordion (5 answers built from the real game rules) + "Scrivici" → mail app
 * (mailto: supporto@finanz.app). When no mail app can open the link, the address is copied.
 */
import { Linking } from 'react-native';
import { Headset, Mail } from 'lucide-react-native';

import { Button, Card, HStack, IconTile, SectionHeader, Text, VStack } from '@/components/ui';
import { copy } from '@/lib/clipboard';

import { Accordion } from '../components/accordion';
import { SectionPage } from '../components/section-page';
import { MENU_COPY, SUPPORT_COPY } from '../copy';
import { FAQ } from '../help-content';

async function writeToSupport() {
  const url = `mailto:${SUPPORT_COPY.email}?subject=${encodeURIComponent(SUPPORT_COPY.mailSubject)}`;
  try {
    await Linking.openURL(url);
  } catch {
    await copy(SUPPORT_COPY.email, { feedback: SUPPORT_COPY.mailFallback });
  }
}

export function SupportSection() {
  const text = SUPPORT_COPY;
  return (
    <SectionPage title={MENU_COPY.support.title} subtitle={text.subtitle}>
      <VStack gap="xs">
        <SectionHeader title={text.faqTitle} />
        <Accordion entries={FAQ} initialOpenId={FAQ[0]?.id} />
      </VStack>

      <Card padding="lg">
        <VStack gap="md">
          <HStack gap="sm">
            <IconTile icon={Headset} tone="sky" size="lg" />
            <VStack flex gap="xxxs">
              <Text variant="titleMd">{text.contactTitle}</Text>
              <Text variant="bodySm" color="textSecondary">
                {text.contactMessage}
              </Text>
            </VStack>
          </HStack>
          <Button
            title={text.write}
            variant="brand"
            size="md"
            iconLeft={Mail}
            fullWidth
            accessibilityHint={text.email}
            onPress={() => void writeToSupport()}
          />
          <Text variant="labelSm" color="textTertiary" align="center" selectable>
            {text.email}
          </Text>
        </VStack>
      </Card>
    </SectionPage>
  );
}
