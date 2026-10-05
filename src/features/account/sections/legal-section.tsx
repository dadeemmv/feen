/**
 * Informazioni legali: Termini di servizio · Privacy · Cookie as expandable sections. The texts
 * are placeholders and are labelled as such ("Testo di esempio") everywhere.
 */
import { Cookie, FileText, Info, LockKeyhole, type LucideIcon } from 'lucide-react-native';

import { Card, HStack, Icon, iconSize, Tag, Text, VStack, type Tone } from '@/components/ui';

import { Accordion, type AccordionEntry } from '../components/accordion';
import { SectionPage } from '../components/section-page';
import { LEGAL_COPY, MENU_COPY } from '../copy';
import { LEGAL_DOCUMENTS } from '../help-content';

const DOCUMENT_ICONS: Record<string, { icon: LucideIcon; tone: Tone }> = {
  terms: { icon: FileText, tone: 'neutral' },
  privacy: { icon: LockKeyhole, tone: 'mint' },
  cookie: { icon: Cookie, tone: 'butter' },
};

export function LegalSection() {
  const copy = LEGAL_COPY;
  const entries: AccordionEntry[] = LEGAL_DOCUMENTS.map((document) => ({
    ...document,
    icon: DOCUMENT_ICONS[document.id]?.icon,
    iconTone: DOCUMENT_ICONS[document.id]?.tone,
    footer: <Tag label={copy.sampleTag} tone="butter" size="sm" />,
  }));

  return (
    <SectionPage title={MENU_COPY.legal.title} subtitle={copy.subtitle}>
      <Card variant="outline" padding="md">
        <HStack gap="sm" align="flex-start">
          <Icon icon={Info} size={iconSize.md} color="warningText" />
          <VStack flex>
            <Text variant="bodySm" color="textSecondary">
              {copy.sampleNote}
            </Text>
          </VStack>
        </HStack>
      </Card>
      <VStack gap="sm">
        <Accordion entries={entries} />
        <Text variant="labelSm" color="textTertiary" align="center">
          {copy.updated}
        </Text>
      </VStack>
    </SectionPage>
  );
}
