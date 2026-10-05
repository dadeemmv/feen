/**
 * The big evergreen "IL TUO CODICE" card (spec §3.2): kiwi-slice band, lime display headline,
 * the referral code field with a copy button (clipboard + toast + icon swap to a check for 2 s)
 * and the "Condividi codice" CTA (native share sheet / Web Share / clipboard fallback).
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Check, Copy, Share } from 'lucide-react-native';

import { KiwiPattern } from '@/components/illustrations';
import { Button, Card, Icon, PressableScale, Text, controlHeight, hairline, iconSize } from '@/components/ui';
import { copy } from '@/lib/clipboard';
import { shareText } from '@/lib/share';
import { fitDisplayVariant } from '@/features/stories/lib/display-fit';
import { duration, easing, layout, radius, spacing, useTheme } from '@/theme';

import { INVITE_COPY } from '../copy';
import { inviteMetrics } from '../metrics';

export type CodeCardProps = { code: string };

export function CodeCard({ code }: CodeCardProps) {
  const { width } = useWindowDimensions();
  const inner = Math.min(width, layout.maxContentWidth) - (layout.screenX + layout.cardPadding) * 2;
  const headline = fitDisplayVariant(INVITE_COPY.codeHeadline, inner, ['displayLg', 'displayMd'], 'line');
  const [sharing, setSharing] = useState(false);

  const share = async () => {
    setSharing(true);
    await shareText(INVITE_COPY.shareMessage(code), undefined, {
      title: INVITE_COPY.shareTitle,
      copiedFeedback: INVITE_COPY.shareCopied,
    });
    setSharing(false);
  };

  return (
    <Card variant="brand" padding="none" spotlight>
      <View style={styles.band} aria-hidden>
        <KiwiPattern width="100%" height={inviteMetrics.kiwiBandHeight} density="regular" mode="vivid" />
      </View>
      <View style={styles.body}>
        <Text variant={headline} weight="extraBold" color="accentText" align="center" accessibilityRole="header">
          {INVITE_COPY.codeHeadline}
        </Text>
        <CodeField code={code} />
        <Button
          title={INVITE_COPY.shareCta}
          iconLeft={Share}
          glow
          fullWidth
          loading={sharing}
          onPress={() => void share()}
        />
      </View>
    </Card>
  );
}

/** Tapping anywhere on the field copies the code; the trailing glyph confirms with a check. */
function CodeField({ code }: { code: string }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), inviteMetrics.copiedResetMs);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = async () => {
    const ok = await copy(code, { feedback: INVITE_COPY.copied });
    if (ok) setCopied(true);
  };

  return (
    <PressableScale
      // `copy` fires its own haptic once the clipboard write succeeded.
      onPress={() => void onCopy()}
      accessibilityRole="button"
      accessibilityLabel={copied ? INVITE_COPY.copiedA11y : INVITE_COPY.copyA11y(code)}
      style={[
        styles.field,
        { backgroundColor: theme.colors.surfaceSunken, borderColor: copied ? theme.colors.accentSolid : theme.colors.border },
      ]}>
      <View style={styles.side} />
      <Text variant="titleLg" tabular style={styles.code} numberOfLines={1}>
        {code}
      </Text>
      <View style={styles.side}>
        <View style={[styles.copyDisc, { backgroundColor: copied ? theme.colors.accentSolid : theme.colors.fill }]}>
          {copied ? (
            <Animated.View key="check" entering={ZoomIn.duration(duration.fast).easing(easing.enter)}>
              <Icon icon={Check} size={iconSize.md} color="onAccent" />
            </Animated.View>
          ) : (
            <Icon icon={Copy} size={iconSize.md} color="text" />
          )}
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  band: {
    height: inviteMetrics.kiwiBandHeight,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    overflow: 'hidden',
  },
  body: { padding: layout.cardPadding, paddingTop: spacing.md, gap: spacing.lg, alignItems: 'stretch' },
  field: {
    height: controlHeight.lg,
    borderRadius: radius.md,
    borderWidth: hairline,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  side: { width: controlHeight.sm, alignItems: 'flex-end' },
  code: { flex: 1, textAlign: 'center', letterSpacing: inviteMetrics.codeTracking },
  copyDisc: {
    width: controlHeight.sm,
    height: controlHeight.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
