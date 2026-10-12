/**
 * Profile card (Account): the student's animal as avatar, their name, and who they are in the
 * village ("Volpe Esploratrice · Borgo Ginestra"). No email (nothing to sign up for) and no XP
 * levels: progress lives in the village. The whole card opens the profile editor.
 */
import { StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { MascotArt } from '@/components/illustrations';
import { Avatar, Card, HStack, Icon, Text, VStack, tileSize } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { VILLAGE_COPY } from '@/features/village/copy';
import { selectMascot, useStore, useStoreShallow } from '@/store';
import { spacing } from '@/theme';

import { ACCOUNT_COPY } from '../copy';
import { openSection } from '../lib/navigation';
import { avatarTone } from './avatar-picker';

export function ProfileCard() {
  const profile = useStoreShallow((s) => ({ name: s.name, avatar: s.avatar, villageName: s.villageName }));
  const mascotId = useStore(selectMascot);
  const mascot = mascotId ? getMascot(mascotId) : null;
  const village = VILLAGE_COPY.title(profile.villageName);
  const subtitle = mascot ? `${mascot.title} · ${village}` : village;

  return (
    <Card
      padding="md"
      onPress={() => openSection('profile')}
      accessibilityLabel={`${profile.name}, ${subtitle}`}
      accessibilityHint={ACCOUNT_COPY.profileHint}
      contentStyle={styles.content}>
      <HStack gap="sm">
        {mascot ? (
          <MascotArt id={mascot.id} framing="bust" width={tileSize.xl} />
        ) : (
          <Avatar emoji={profile.avatar} name={profile.name} size={tileSize.xl} tone={avatarTone(profile.avatar)} />
        )}
        <VStack flex gap="xxxs">
          <Text variant="titleMd" numberOfLines={1}>
            {profile.name}
          </Text>
          <Text variant="bodySm" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </Text>
        </VStack>
        <Icon icon={ChevronRight} size="md" color="textTertiary" />
      </HStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
});
