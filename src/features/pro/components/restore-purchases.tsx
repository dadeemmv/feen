/**
 * "Ripristina acquisti" — simulated restore (demo build, no store account): a short lookup with
 * a spinner, then an inline answer under the link (a toast would render under the native modal on
 * iOS). Pro already active → its expiry date; otherwise "nothing to restore".
 */
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button, Text, VStack, readableWidth } from '@/components/ui';
import { formatLongDate } from '@/lib/dates';
import { haptics } from '@/lib/haptics';
import { getStoreState, isProActive } from '@/store';
import { duration } from '@/theme';

import { PRO_COPY } from '../copy';
import { proMetrics } from '../metrics';

export function RestorePurchases({ disabled = false }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      const state = getStoreState();
      const active = isProActive(state, Date.now()) && state.proUntil !== null;
      if (active) haptics.success();
      else haptics.warning();
      setMessage(active && state.proUntil !== null ? PRO_COPY.restoreActive(formatLongDate(state.proUntil)) : PRO_COPY.restoreNone);
      setLoading(false);
    }, proMetrics.restoreDelay);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <VStack gap="xxs" align="center">
      <Button
        title={PRO_COPY.restore}
        variant="ghost"
        size="sm"
        haptic="selection"
        loading={loading}
        disabled={disabled}
        onPress={() => {
          setMessage(null);
          setLoading(true);
        }}
      />
      {message ? (
        <Animated.View key={message} entering={FadeIn.duration(duration.base)}>
          <Text
            variant="bodySm"
            color="textSecondary"
            align="center"
            accessibilityLiveRegion="polite"
            style={styles.message}>
            {message}
          </Text>
        </Animated.View>
      ) : null}
    </VStack>
  );
}

const styles = StyleSheet.create({
  message: { maxWidth: readableWidth },
});
