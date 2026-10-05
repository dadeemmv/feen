/**
 * RedeemCodeSheet ("Utilizza codice"): upper-case code field → "Riscatta". Valid demo codes
 * (FINANZ100 → +100 Kiwi, STREAK → +1 shield) switch the sheet to a reward view; anything else
 * shakes the field with "Codice non valido". Each code works once.
 *
 * `{ visible, onClose }` matches `GlobalOverlayProps`, so it can be registered as 'redeem'.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { TicketPercent } from 'lucide-react-native';

import { KiwiCoinIcon, ShieldIcon } from '@/components/icons';
import { Button, Confetti, IconTile, Sheet, Text, TextField, VStack, useShake } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { spacing } from '@/theme';

import { REDEEM_COPY } from '../copy';
import { accountMetrics } from '../metrics';
import { normalizeCode, redeemCode, REDEEM_CODE_MAX_LENGTH, type RedeemOutcome } from '../redeem-codes';
import { RewardBurst } from './reward-burst';

export type RedeemCodeSheetProps = { visible: boolean; onClose: () => void };

type Success = Extract<RedeemOutcome, { ok: true }>;

const MIN_CODE_LENGTH = 3;

export function RedeemCodeSheet({ visible, onClose }: RedeemCodeSheetProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Success | null>(null);
  const { style: shakeStyle, shake } = useShake();

  const reset = () => {
    setCode('');
    setError(null);
    setSuccess(null);
  };

  const submit = () => {
    if (code.length < MIN_CODE_LENGTH) return;
    const outcome = redeemCode(code);
    if (outcome.ok) {
      haptics.success();
      setSuccess(outcome);
      return;
    }
    haptics.error();
    shake();
    setError(outcome.reason === 'already-used' ? REDEEM_COPY.alreadyUsed : REDEEM_COPY.invalid);
  };

  const onChange = (value: string) => {
    setCode(normalizeCode(value));
    if (error) setError(null);
  };

  return (
    <Sheet visible={visible} onClose={onClose} onClosed={reset} title={success ? undefined : REDEEM_COPY.title}>
      {success ? (
        <View style={styles.success}>
          <Confetti run origin={{ x: 0.5, y: 0.2 }} />
          <RewardBurst>
            {success.reward.kind === 'coins' ? <KiwiCoinIcon size={accountMetrics.rewardIcon} /> : <ShieldIcon size={accountMetrics.rewardIcon} />}
          </RewardBurst>
          <VStack gap="xxs" align="center">
            <Text variant="displaySm" align="center" accessibilityRole="header" accessibilityLiveRegion="polite">
              {success.title}
            </Text>
            <Text variant="bodyMd" color="textSecondary" align="center">
              {success.message}
            </Text>
          </VStack>
          <Button title={REDEEM_COPY.done} fullWidth onPress={onClose} />
        </View>
      ) : (
        <VStack gap="lg">
          <VStack gap="sm" align="center">
            <IconTile icon={TicketPercent} tone="mint" size="xl" round />
            <Text variant="bodyMd" color="textSecondary" align="center">
              {REDEEM_COPY.message}
            </Text>
          </VStack>
          <Animated.View style={shakeStyle}>
            <TextField
              label={REDEEM_COPY.label}
              placeholder={REDEEM_COPY.placeholder}
              value={code}
              onChangeText={onChange}
              onSubmitEditing={submit}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
              returnKeyType="done"
              maxLength={REDEEM_CODE_MAX_LENGTH}
              align="center"
              textVariant="titleLg"
              error={error ?? undefined}
              helper={REDEEM_COPY.demoHint}
            />
          </Animated.View>
          <Button title={REDEEM_COPY.cta} fullWidth disabled={code.length < MIN_CODE_LENGTH} onPress={submit} />
        </VStack>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  success: { alignItems: 'center', gap: spacing.lg, paddingTop: spacing.md },
});
