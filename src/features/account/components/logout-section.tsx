/**
 * Logout text link (underlined, danger) → confirm Dialog → onboarding + wipe local data.
 * Followed by the app version footnote.
 */
import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { FinanzLogo } from '@/components/icons';
import { Dialog, HStack, iconSize, PressableScale, Text, VStack } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { spacing } from '@/theme';

import { ACCOUNT_COPY } from '../copy';
import { logout } from '../lib/logout';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export function LogoutSection() {
  const [confirming, setConfirming] = useState(false);
  const confirmed = useRef(false);
  const copy = ACCOUNT_COPY.logoutDialog;

  const confirm = () => {
    confirmed.current = true;
    haptics.medium();
    setConfirming(false);
  };

  // Navigate once the dialog has animated out, so no Modal is left over the next screen.
  const handleClosed = () => {
    if (!confirmed.current) return;
    confirmed.current = false;
    void logout();
  };

  return (
    <VStack gap="xxl" align="center" style={styles.root}>
      <PressableScale
        onPress={() => setConfirming(true)}
        haptic="light"
        scaleTo="small"
        hitSlop={spacing.sm}
        accessibilityRole="button"
        accessibilityLabel={ACCOUNT_COPY.logout}
        style={styles.link}>
        <Text variant="labelLg" color="dangerText" style={styles.underline}>
          {ACCOUNT_COPY.logout}
        </Text>
      </PressableScale>

      <VStack gap="xxs" align="center">
        <HStack gap="xs">
          <FinanzLogo size={iconSize.md} />
          <Text variant="labelSm" color="textTertiary">
            {ACCOUNT_COPY.version(APP_VERSION)}
          </Text>
        </HStack>
        <Text variant="bodySm" color="textTertiary">
          {ACCOUNT_COPY.madeIn}
        </Text>
      </VStack>

      <Dialog
        visible={confirming}
        onClose={() => setConfirming(false)}
        onClosed={handleClosed}
        tone="warning"
        badge={{ type: 'emoji', emoji: '👋' }}
        title={copy.title}
        message={copy.message}
        primaryAction={{ label: copy.confirm, onPress: confirm, variant: 'danger' }}
        secondaryAction={{ label: copy.cancel, onPress: () => setConfirming(false) }}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: spacing.xxl },
  link: { minHeight: spacing.xxl, justifyContent: 'center', paddingHorizontal: spacing.sm },
  underline: { textDecorationLine: 'underline' },
});
