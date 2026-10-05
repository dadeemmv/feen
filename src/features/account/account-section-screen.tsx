/**
 * Account sub-pages (/account/[section]). An unknown section goes straight back (to Account when
 * there is no history, e.g. a mistyped deep link).
 */
import { useEffect, type ComponentType } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui';

import { backToAccount, type AccountSection } from './lib/navigation';
import { InterestsSection } from './sections/interests-section';
import { LanguageSection } from './sections/language-section';
import { LegalSection } from './sections/legal-section';
import { ProfileSection } from './sections/profile-section';
import { PurchasesSection } from './sections/purchases-section';
import { SettingsSection } from './sections/settings-section';
import { SupportSection } from './sections/support-section';

const SECTIONS: Record<AccountSection, ComponentType> = {
  settings: SettingsSection,
  language: LanguageSection,
  purchases: PurchasesSection,
  interests: InterestsSection,
  support: SupportSection,
  legal: LegalSection,
  profile: ProfileSection,
};

const isSection = (value: string): value is AccountSection =>
  Object.prototype.hasOwnProperty.call(SECTIONS, value);

function UnknownSection() {
  useEffect(() => {
    backToAccount();
  }, []);
  return <Screen preset="fixed" />;
}

export function AccountSectionScreen() {
  const { section = '' } = useLocalSearchParams<{ section: string }>();
  const Section = isSection(section) ? SECTIONS[section] : UnknownSection;
  return <Section />;
}
