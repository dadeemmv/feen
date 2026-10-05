/**
 * Price → balance → balance-after summary of the purchase sheet. The balance rolls when the
 * purchase goes through; a missing amount is spelled out in red before the user even taps.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { KiwiCoinIcon } from '@/components/icons';
import { Divider, HStack, RollingNumber, Text } from '@/components/ui';
import { formatCoins } from '@/lib/format';
import { radius, spacing, useTheme, type ColorToken, type TextVariant } from '@/theme';

import { SHOP_COPY } from '../copy';
import { shopMetrics } from '../metrics';

export type PurchaseSummaryProps = {
  price: number;
  balance: number;
  /** Hide the "after" row (success state). */
  settled?: boolean;
};

export function PurchaseSummary({ price, balance, settled = false }: PurchaseSummaryProps) {
  const { colors } = useTheme();
  const after = balance - price;
  const missing = Math.max(0, -after);

  return (
    <View style={[styles.box, { backgroundColor: colors.fill }]}>
      <Row label={SHOP_COPY.priceRow}>
        <CoinAmount value={price} />
      </Row>
      <Row label={SHOP_COPY.balanceRow}>
        <CoinAmount value={balance} rolling />
      </Row>
      {settled ? null : (
        <>
          <Divider color="border" />
          <Row label={missing > 0 ? SHOP_COPY.insufficientTitle : SHOP_COPY.afterRow} emphasis>
            {missing > 0 ? (
              <Text variant="labelLg" color="dangerText">
                {SHOP_COPY.missing(missing)}
              </Text>
            ) : (
              <CoinAmount value={after} variant="titleMd" />
            )}
          </Row>
        </>
      )}
    </View>
  );
}

function Row({ label, emphasis, children }: { label: string; emphasis?: boolean; children: ReactNode }) {
  return (
    <HStack gap="sm" justify="space-between" style={styles.row}>
      <Text variant={emphasis ? 'labelLg' : 'bodyMd'} color={emphasis ? 'text' : 'textSecondary'}>
        {label}
      </Text>
      {children}
    </HStack>
  );
}

function CoinAmount({
  value,
  rolling = false,
  variant = 'numeric',
  color = 'text',
}: {
  value: number;
  rolling?: boolean;
  variant?: TextVariant;
  color?: ColorToken;
}) {
  return (
    <HStack gap="xxs" accessible accessibilityLabel={`${formatCoins(value)} ${SHOP_COPY.kiwi}`}>
      {rolling ? (
        <RollingNumber value={value} format={formatCoins} variant={variant} color={color} />
      ) : (
        <Text variant={variant} color={color} tabular>
          {formatCoins(value)}
        </Text>
      )}
      <KiwiCoinIcon size={shopMetrics.priceIcon} />
    </HStack>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'stretch',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  row: { minHeight: spacing.xxxl - spacing.xs },
});
