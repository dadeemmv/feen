/**
 * Il tuo profilo: live preview card, name field (same rules as onboarding), read-only email,
 * emoji avatar grid. "Salva modifiche" is enabled once something changed and the name is valid.
 */
import { useState } from 'react';
import Animated from 'react-native-reanimated';
import { AtSign, UserRound } from 'lucide-react-native';

import { Avatar, Button, Card, SectionHeader, Text, TextField, useBump, VStack } from '@/components/ui';
import { cleanName, NAME_ISSUE_MESSAGES, NAME_MAX_LENGTH, validateName } from '@/features/onboarding/data/name';
import { haptics } from '@/lib/haptics';
import { getStoreState, useStoreShallow } from '@/store';
import { showToast } from '@/store/ui';

import { AvatarPicker, avatarTone } from '../components/avatar-picker';
import { SectionPage } from '../components/section-page';
import { PROFILE_COPY } from '../copy';
import { backToAccount } from '../lib/navigation';
import { accountMetrics } from '../metrics';

export function ProfileSection() {
  const profile = useStoreShallow((s) => ({ name: s.name, email: s.email, avatar: s.avatar }));
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [touched, setTouched] = useState(false);
  const { style: bumpStyle, bump } = useBump();
  const copy = PROFILE_COPY;

  const issue = validateName(name);
  const cleaned = cleanName(name);
  const changed = cleaned !== profile.name || avatar !== profile.avatar;

  const pickAvatar = (emoji: string) => {
    setAvatar(emoji);
    bump();
  };

  const save = () => {
    setTouched(true);
    if (issue) {
      haptics.error();
      return;
    }
    getStoreState().updateProfile({ name: cleaned, avatar });
    haptics.success();
    showToast(copy.saved, { tone: 'success', icon: avatar });
    backToAccount();
  };

  return (
    <SectionPage
      title={copy.title}
      subtitle={copy.subtitle}
      keyboard
      footer={<Button title={copy.save} fullWidth disabled={!changed || issue !== null} onPress={save} />}>
      <Card padding="lg">
        <VStack gap="sm" align="center">
          <Animated.View style={bumpStyle}>
            <Avatar emoji={avatar} tone={avatarTone(avatar)} size={accountMetrics.profileAvatar} />
          </Animated.View>
          <VStack gap="xxxs" align="center">
            <Text variant="titleLg" align="center" numberOfLines={1}>
              {cleaned || copy.namePlaceholder}
            </Text>
            <Text variant="bodySm" color="textSecondary" align="center" numberOfLines={1}>
              {profile.email}
            </Text>
          </VStack>
        </VStack>
      </Card>

      <VStack gap="md">
        <TextField
          label={copy.name}
          placeholder={copy.namePlaceholder}
          value={name}
          onChangeText={(value) => {
            setName(value);
            setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          onSubmitEditing={save}
          leading={UserRound}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="done"
          maxLength={NAME_MAX_LENGTH}
          showCount
          error={touched && issue ? NAME_ISSUE_MESSAGES[issue] : undefined}
        />
        <TextField
          label={copy.email}
          value={profile.email}
          leading={AtSign}
          disabled
          helper={copy.emailHelper}
        />
      </VStack>

      <VStack gap="xs">
        <SectionHeader title={copy.avatar} />
        <Card padding="md">
          <AvatarPicker value={avatar} onChange={pickAvatar} accessibilityLabel={copy.avatar} />
        </Card>
      </VStack>
    </SectionPage>
  );
}
