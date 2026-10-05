/**
 * Step 1/4 — "Come ti chiami?": auto-focused name field (keyboard-aware), validated as you type
 * (errors only after the first blur / submit), and a friendly greeting once the name is valid.
 */
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { LockKeyhole, UserRound } from 'lucide-react-native';

import { Card, HStack, Icon, iconSize, Text, TextField, VStack } from '@/components/ui';
import { spacing } from '@/theme';

import { StepScreen } from '../components/step-screen';
import { ONBOARDING_COPY } from '../copy';
import { cleanName, NAME_ISSUE_MESSAGES, NAME_MAX_LENGTH, validateName } from '../data/name';
import { useOnboardingDraft } from '../draft-store';
import { useEntering } from '../lib/entering';
import { goToNextStep } from '../steps';

export function NameStepScreen() {
  const name = useOnboardingDraft((s) => s.name);
  const setName = useOnboardingDraft((s) => s.setName);
  const [showError, setShowError] = useState(false);
  const { rise, fadeOut } = useEntering();
  const copy = ONBOARDING_COPY.name;

  const issue = validateName(name);
  const valid = issue === null;

  const submit = () => {
    if (!valid) {
      setShowError(true);
      return;
    }
    setName(cleanName(name));
    goToNextStep('name');
  };

  return (
    <StepScreen
      step="name"
      title={copy.title}
      subtitle={copy.subtitle}
      valid={valid}
      keyboard
      onNext={() => setName(cleanName(name))}>
      <VStack gap="md">
        <TextField
          label={copy.label}
          placeholder={copy.placeholder}
          value={name}
          onChangeText={setName}
          onBlur={() => setShowError(name.length > 0)}
          onSubmitEditing={submit}
          autoFocus
          leading={UserRound}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          autoCorrect={false}
          returnKeyType="next"
          submitBehavior="submit"
          maxLength={NAME_MAX_LENGTH}
          textVariant="titleMd"
          error={issue && (showError || issue === 'chars') ? NAME_ISSUE_MESSAGES[issue] : undefined}
        />

        {valid ? (
          <Animated.View entering={rise()} exiting={fadeOut()}>
            <Card variant="accent" padding="md">
              <Text variant="titleSm" accessibilityLiveRegion="polite">
                {copy.greeting(cleanName(name))}
              </Text>
            </Card>
          </Animated.View>
        ) : null}

        <HStack gap="xs" style={styles.privacy}>
          <Icon icon={LockKeyhole} size={iconSize.sm} color="textTertiary" />
          <Text variant="bodySm" color="textTertiary" style={styles.flex}>
            {copy.privacy}
          </Text>
        </HStack>
      </VStack>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  privacy: { paddingHorizontal: spacing.xxs },
  flex: { flex: 1 },
});
