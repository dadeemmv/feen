/**
 * Shared chrome of the Pro paywall views: the evergreen backdrop (hero gradient + lime light from
 * the top), the top bar with the glass close button, the centred hero block (jewel, tag, title,
 * tagline) and the translucent glass panel used for benefits and the membership summary.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';

import { HStack, IconButton, Spotlight, Tag, Text, VStack, hairline, readableWidth, useReduceMotion } from '@/components/ui';
import { duration, easing, gradients, layout, radius, spacing, useTheme } from '@/theme';

import { PRO_COPY } from '../copy';
import { ProJewel } from './pro-jewel';

const LIGHT_ORIGIN = { x: 0.5, y: 0 };
const LIGHT_REACH = { x: 0.9, y: 0.5 };

/** Full-bleed evergreen gradient behind a transparent `Screen`. */
export function ProBackdrop({ children }: { children: ReactNode }) {
  return (
    <View style={styles.flex}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <Spotlight origin={LIGHT_ORIGIN} reach={LIGHT_REACH} />
      {children}
    </View>
  );
}

/** Lets the backdrop show through `Screen` (it paints its own background otherwise). */
export const transparentScreen: ViewStyle = { backgroundColor: 'transparent' };

export function ProTopBar({ onClose }: { onClose: () => void }) {
  return (
    <HStack justify="flex-end" style={styles.bar}>
      <IconButton icon={X} variant="glass" accessibilityLabel={PRO_COPY.close} onPress={onClose} />
    </HStack>
  );
}

export type ProHeroProps = {
  tag: string;
  tagTone?: 'pro' | 'accent';
  title: string;
  tagline: string;
  /** Lime display title (success moment). */
  accentTitle?: boolean;
  /** Pop the jewel in (success moment). */
  pop?: boolean;
};

export function ProHero({ tag, tagTone = 'pro', title, tagline, accentTitle = false, pop = false }: ProHeroProps) {
  const reduceMotion = useReduceMotion();
  const rise = reduceMotion ? undefined : FadeInDown.duration(duration.slow).easing(easing.enter);
  return (
    <VStack gap="xs" align="center" style={styles.hero}>
      <ProJewel pop={pop} />
      <Animated.View entering={rise}>
        <VStack gap="xs" align="center">
          <Tag label={tag} tone={tagTone} solid size="sm" />
          <Text
            variant="displayLg"
            align="center"
            color={accentTitle ? 'accentText' : 'text'}
            accessibilityRole="header">
            {title}
          </Text>
          <Text variant="bodyLg" color="textSecondary" align="center" style={styles.tagline}>
            {tagline}
          </Text>
        </VStack>
      </Animated.View>
    </VStack>
  );
}

export type GlassPanelProps = {
  title?: string;
  children: ReactNode;
  /** Fade-in delay (ms). */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function GlassPanel({ title, children, delay = 0, style }: GlassPanelProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(duration.base).delay(delay)}
      style={[styles.panel, { backgroundColor: colors.fill, borderColor: colors.borderSubtle }, style]}>
      {title ? (
        <Text variant="overline" color="accentText" accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bar: { height: layout.headerHeight, paddingHorizontal: layout.screenX },
  hero: { marginBottom: spacing.xl },
  tagline: { maxWidth: readableWidth },
  panel: {
    borderRadius: radius.xl,
    borderWidth: hairline,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
