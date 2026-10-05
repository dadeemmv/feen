/**
 * PurchaseSheet — confirmation of a paid Shop item (spec §3.7):
 *
 *   confirm      medallion + item + description, price → balance → balance after, "Acquista per n"
 *   insufficient the summary shakes, a danger callout explains the gap ("Kiwi insufficienti" +
 *                "Completa lezioni per guadagnare Kiwi") and the CTA becomes "Vai alle lezioni"
 *   success      the medallion bumps, the balance rolls down, the sheet closes itself after a
 *                beat and the confirmation toast shows once it is gone (native toasts render
 *                under an open Modal).
 *
 * The parent keeps `item` set until `onClosed` so the content stays stable while it animates out.
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { CircleAlert } from 'lucide-react-native';

import { KiwiCoinIcon } from '@/components/icons';
import {
  Button,
  HStack,
  Icon,
  Sheet,
  Text,
  VStack,
  hairline,
  iconSize,
  readableWidth,
  toast,
  useShake,
  type ToastOptions,
} from '@/components/ui';
import { MAIN_COURSE_ID } from '@/content/courses';
import { SHOP_ITEM_DESCRIPTIONS } from '@/content/shop';
import type { ShopItem } from '@/content/types';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { SHOP_COPY } from '../copy';
import { purchaseItem } from '../lib/purchase';
import { shopMetrics } from '../metrics';
import { ItemMedallion } from './item-medallion';
import { PurchaseSummary } from './purchase-summary';

export type PurchaseSheetProps = {
  /** Item being bought; keep it set until `onClosed` fires. */
  item: ShopItem | null;
  visible: boolean;
  /** Clear `visible` (user dismiss, Annulla, auto-close after success). */
  onClose: () => void;
  /** After the exit animation: clear `item` here. */
  onClosed?: () => void;
  onPurchased?: (item: ShopItem) => void;
};

type Phase = 'confirm' | 'insufficient' | 'success';

export function PurchaseSheet({ item, visible, onClose, onClosed, onPurchased }: PurchaseSheetProps) {
  // Phase resets every time the sheet opens and survives the exit animation.
  const [session, setSession] = useState<{ visible: boolean; phase: Phase }>({ visible, phase: 'confirm' });
  if (session.visible !== visible) setSession({ visible, phase: visible ? 'confirm' : session.phase });
  const phase = session.phase;
  const setPhase = (next: Phase) => setSession({ visible, phase: next });

  // Work to run once the sheet is gone: the success toast or a navigation.
  const afterClose = useRef<(() => void) | null>(null);
  const handleClosed = () => {
    const action = afterClose.current;
    afterClose.current = null;
    action?.();
    onClosed?.();
  };

  // Success holds for a beat (balance roll + medallion bump), then closes itself.
  useEffect(() => {
    if (phase !== 'success' || !visible) return;
    const timer = setTimeout(onClose, shopMetrics.successHold);
    return () => clearTimeout(timer);
  }, [phase, visible, onClose]);

  const succeed = (toastOptions: ToastOptions) => {
    afterClose.current = () => toast.show(toastOptions);
    setPhase('success');
  };

  const fail = (message: string) => {
    afterClose.current = () => toast.show({ message, tone: 'danger' });
    onClose();
  };

  const goEarn = () => {
    afterClose.current = () => router.push(`/course/${MAIN_COURSE_ID}`);
    onClose();
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      onClosed={handleClosed}
      scrollable
      dismissible={phase !== 'success'}
      accessibilityLabel={item?.title}>
      {item ? (
        <PurchaseContent
          item={item}
          phase={phase}
          onInsufficient={() => setPhase('insufficient')}
          onSuccess={(options) => {
            succeed(options);
            onPurchased?.(item);
          }}
          onFailure={fail}
          onEarn={goEarn}
          onCancel={onClose}
        />
      ) : null}
    </Sheet>
  );
}

type ContentProps = {
  item: ShopItem;
  phase: Phase;
  onInsufficient: () => void;
  onSuccess: (toast: ToastOptions) => void;
  onFailure: (message: string) => void;
  onEarn: () => void;
  onCancel: () => void;
};

function PurchaseContent({ item, phase, onInsufficient, onSuccess, onFailure, onEarn, onCancel }: ContentProps) {
  const coins = useStore((s) => s.coins);
  const { style: shakeStyle, shake } = useShake();
  const success = phase === 'success';

  const buy = () => {
    if (coins < item.price) {
      haptics.error();
      shake();
      onInsufficient();
      return;
    }
    const outcome = purchaseItem(item);
    if (outcome.ok) onSuccess(outcome.toast);
    else if (outcome.reason === 'insufficient-coins') {
      shake();
      onInsufficient();
    } else onFailure(SHOP_COPY.failure[outcome.reason]);
  };

  return (
    <VStack gap="lg" style={styles.content}>
      <VStack gap="sm" align="center">
        <ItemMedallion kind={item.kind} celebrate={success} />
        <VStack gap="xxs" align="center">
          <Text variant="overline" color={success ? 'successText' : 'textTertiary'}>
            {success ? SHOP_COPY.purchased : item.overline}
          </Text>
          <Text variant="titleLg" align="center" accessibilityRole="header" accessibilityLiveRegion="polite">
            {item.title}
          </Text>
          <Text variant="bodyMd" color="textSecondary" align="center" style={styles.description}>
            {SHOP_ITEM_DESCRIPTIONS[item.id] ?? ''}
          </Text>
        </VStack>
      </VStack>

      <Animated.View style={shakeStyle}>
        {/* Live balance: after paying it rolls down to the new value (the "after" row hides). */}
        <PurchaseSummary price={item.price} balance={coins} settled={success} />
      </Animated.View>

      {phase === 'insufficient' ? <InsufficientCallout /> : null}

      <VStack gap="xs">
        {phase === 'insufficient' ? (
          <Button title={SHOP_COPY.goToLessons} fullWidth onPress={onEarn} />
        ) : (
          <Button
            title={success ? SHOP_COPY.done : SHOP_COPY.buyFor(item.price)}
            iconRight={success ? undefined : <KiwiCoinIcon size={iconSize.md} />}
            haptic={success ? 'light' : false}
            fullWidth
            onPress={success ? onCancel : buy}
          />
        )}
        {success ? null : <Button title={SHOP_COPY.cancel} variant="outline" fullWidth onPress={onCancel} />}
      </VStack>
    </VStack>
  );
}

function InsufficientCallout() {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(duration.base).easing(easing.enter)}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={[styles.callout, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}>
      <HStack gap="sm" align="flex-start">
        <Icon icon={CircleAlert} size="md" color="dangerText" />
        <View style={styles.flex}>
          <Text variant="labelLg" color="dangerText">
            {SHOP_COPY.insufficientTitle}
          </Text>
          <Text variant="bodySm" color="textSecondary">
            {SHOP_COPY.insufficientHint}
          </Text>
        </View>
      </HStack>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xs },
  description: { maxWidth: readableWidth },
  callout: { padding: spacing.md, borderRadius: radius.lg, borderWidth: hairline },
  flex: { flex: 1, gap: spacing.xxxs },
});
