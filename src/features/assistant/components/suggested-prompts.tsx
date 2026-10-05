/**
 * SuggestedPrompts — tappable question pills. `layout="scroll"` is a horizontal row that bleeds
 * to the screen edges (greeting), `layout="wrap"` stacks them (follow-ups under a reply).
 * Each pill is 40 pt tall with a 44 pt touch target and fades in with a short stagger.
 *
 *   <SuggestedPrompts prompts={SUGGESTED_PROMPTS} onSelect={ask} bleed={layout.screenX} />
 */
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';

import { Icon, PressableScale, Text, controlHeight, hairline, uiOpacity, useReduceMotion } from '@/components/ui';
import { duration, easing, elevation, layout, radius, spacing, useTheme } from '@/theme';

import { copy } from '../copy';

/** Delay between pills entering (ms). */
const STAGGER_MS = 60;
const TOUCH_SLOP = (layout.minTouch - controlHeight.sm) / 2;

export type SuggestedPromptsProps = {
  prompts: readonly string[];
  onSelect: (prompt: string) => void;
  /** Default `scroll`. */
  layout?: 'scroll' | 'wrap';
  /** Scroll layout: horizontal gutter to bleed into (the parent's padding). Default 0. */
  bleed?: number;
  disabled?: boolean;
  /** Stagger the pills in on mount. Default `true`. */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SuggestedPrompts({
  prompts,
  onSelect,
  layout: arrangement = 'scroll',
  bleed = 0,
  disabled = false,
  animated = true,
  style,
}: SuggestedPromptsProps) {
  const reduceMotion = useReduceMotion();

  const pills = prompts.map((prompt, index) => {
    const entering = !animated
      ? undefined
      : reduceMotion
        ? FadeIn.duration(duration.fast)
        : (arrangement === 'scroll' ? FadeInRight : FadeIn)
            .duration(duration.base)
            .delay(index * STAGGER_MS)
            .easing(easing.enter);
    return (
      <Animated.View key={prompt} entering={entering} style={arrangement === 'wrap' ? styles.wrapItem : undefined}>
        <PromptPill label={prompt} disabled={disabled} onPress={() => onSelect(prompt)} />
      </Animated.View>
    );
  });

  if (arrangement === 'wrap') {
    return (
      <View accessibilityLabel={copy.suggestionsLabel} style={[styles.wrap, style]}>
        {pills}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel={copy.suggestionsLabel}
      style={[{ marginHorizontal: -bleed }, style]}
      contentContainerStyle={[styles.row, { paddingHorizontal: bleed }]}>
      {pills}
    </ScrollView>
  );
}

function PromptPill({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo="small"
      haptic="selection"
      hitSlop={{ top: TOUCH_SLOP, bottom: TOUCH_SLOP }}
      accessibilityLabel={label}
      accessibilityHint={copy.suggestionHint}
      style={[
        styles.pill,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        disabled && styles.disabled,
      ]}>
      <Icon icon={Sparkles} size="xs" color="brandText" />
      <Text variant="labelMd" numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs, paddingVertical: spacing.xxs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  wrapItem: { maxWidth: '100%' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: controlHeight.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: hairline,
    boxShadow: elevation.sm,
  },
  label: { flexShrink: 1 },
  disabled: { opacity: uiOpacity.disabled },
});
