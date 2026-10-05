/**
 * ShieldInfoSheet — what a streak shield does (global overlay 'shield-info'). Opened from the
 * shield card of the Streak screen; "Acquista scudi" goes to the Shop once the sheet has closed.
 */
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ShieldIcon } from '@/components/icons';
import { ShieldPair } from '@/components/illustrations';
import { Button, Chip, HStack, Sheet, Text, VStack, iconSize, resolveTone } from '@/components/ui';
import { useStore } from '@/store';
import { radius, spacing, useTheme } from '@/theme';

import { SHIELD_INFO_COPY } from './copy';

export type ShieldInfoSheetProps = { visible: boolean; onClose: () => void };

const ART_WIDTH = 168;

export function ShieldInfoSheet({ visible, onClose }: ShieldInfoSheetProps) {
  const afterClose = useRef<(() => void) | null>(null);
  const handleClosed = () => {
    const action = afterClose.current;
    afterClose.current = null;
    action?.();
  };
  const buy = () => {
    afterClose.current = () => router.navigate('/shop');
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} onClosed={handleClosed} scrollable title={SHIELD_INFO_COPY.title}>
      <ShieldInfoContent onBuy={buy} onClose={onClose} />
    </Sheet>
  );
}

function ShieldInfoContent({ onBuy, onClose }: { onBuy: () => void; onClose: () => void }) {
  const theme = useTheme();
  const shields = useStore((s) => s.shields);
  const tone = resolveTone(theme, 'shield');

  return (
    <VStack gap="lg">
      <View style={styles.art} aria-hidden>
        <ShieldPair width={ART_WIDTH} />
      </View>
      <Text variant="bodyLg" color="textSecondary" align="center">
        {SHIELD_INFO_COPY.lead}
      </Text>
      <VStack gap="xs">
        {SHIELD_INFO_COPY.points.map((point) => (
          <HStack key={point.text} gap="sm" align="flex-start" style={[styles.point, { backgroundColor: tone.bg }]}>
            <Text style={styles.emoji} aria-hidden>
              {point.emoji}
            </Text>
            <Text variant="bodyMd" style={styles.flex}>
              {point.text}
            </Text>
          </HStack>
        ))}
      </VStack>
      <Chip
        icon={<ShieldIcon size={iconSize.sm} muted={shields === 0} />}
        label={SHIELD_INFO_COPY.owned(shields)}
        tone="shield"
        style={styles.chip}
      />
      <VStack gap="xs">
        <Button title={SHIELD_INFO_COPY.cta} fullWidth onPress={onBuy} />
        <Button title={SHIELD_INFO_COPY.close} variant="outline" fullWidth onPress={onClose} />
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  art: { alignItems: 'center' },
  point: { padding: spacing.md, borderRadius: radius.md },
  emoji: { fontSize: iconSize.md, lineHeight: iconSize.lg },
  flex: { flex: 1 },
  chip: { alignSelf: 'center' },
});
