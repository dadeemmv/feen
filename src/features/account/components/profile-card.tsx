/**
 * Profile card (Account): avatar + name + email + chevron, and below a divider the level strip
 * (BoltIcon · "Livello n · Titolo" · XP progress). The whole card opens the profile editor.
 */
import { StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { BoltIcon } from '@/components/icons';
import { Avatar, Card, Divider, HStack, Icon, ProgressBar, Text, VStack, iconSize, tileSize } from '@/components/ui';
import { formatXp } from '@/lib/format';
import { useStoreShallow } from '@/store';
import { useUserLevel } from '@/store/hooks';
import { spacing } from '@/theme';

import { ACCOUNT_COPY } from '../copy';
import { openSection } from '../lib/navigation';
import { avatarTone } from './avatar-picker';

export function ProfileCard() {
  const profile = useStoreShallow((s) => ({ name: s.name, email: s.email, avatar: s.avatar }));
  const level = useUserLevel();
  const levelText = ACCOUNT_COPY.levelLabel(level.level, level.title);
  const xpText = level.isMaxLevel
    ? ACCOUNT_COPY.levelMax(formatXp(level.totalXp))
    : ACCOUNT_COPY.levelXp(level.currentXp, level.nextLevelXp);

  return (
    <Card
      padding="md"
      onPress={() => openSection('profile')}
      accessibilityLabel={`${profile.name}, ${profile.email}. ${levelText}, ${xpText}`}
      accessibilityHint={ACCOUNT_COPY.profileHint}
      contentStyle={styles.content}>
      <HStack gap="sm">
        <Avatar emoji={profile.avatar} name={profile.name} size={tileSize.xl} tone={avatarTone(profile.avatar)} />
        <VStack flex gap="xxxs">
          <Text variant="titleMd" numberOfLines={1}>
            {profile.name}
          </Text>
          <Text variant="bodySm" color="textSecondary" numberOfLines={1}>
            {profile.email}
          </Text>
        </VStack>
        <Icon icon={ChevronRight} size="md" color="textTertiary" />
      </HStack>
      <Divider />
      <VStack gap="xs">
        <HStack gap="xs">
          <BoltIcon size={iconSize.md} />
          <Text variant="labelMd" numberOfLines={1} style={styles.flex}>
            {levelText}
          </Text>
          <Text variant="labelSm" color="textSecondary" tabular>
            {xpText}
          </Text>
        </HStack>
        <ProgressBar value={level.ratio} size="sm" tone="accent" accessibilityLabel={`${levelText}: ${xpText}`} />
      </VStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  flex: { flex: 1 },
});
