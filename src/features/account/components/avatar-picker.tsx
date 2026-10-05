/**
 * Emoji avatar grid (profile editor). Four columns of round avatars; the selected one gets an
 * evergreen ring and a lime check. Radio-group semantics.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { Avatar, borderWidth, Icon, iconSize, iconStroke, PressableScale, useReduceMotion, type Tone } from '@/components/ui';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { accountMetrics } from '../metrics';

export type AvatarChoice = { emoji: string; label: string; tone: Tone };

export const AVATAR_CHOICES: readonly AvatarChoice[] = [
  { emoji: '🤠', label: 'Cowboy', tone: 'butter' },
  { emoji: '😎', label: 'Occhiali da sole', tone: 'sky' },
  { emoji: '🦊', label: 'Volpe', tone: 'blush' },
  { emoji: '🐼', label: 'Panda', tone: 'mint' },
  { emoji: '🦁', label: 'Leone', tone: 'butter' },
  { emoji: '🐨', label: 'Koala', tone: 'lilac' },
  { emoji: '🐸', label: 'Rana', tone: 'mint' },
  { emoji: '🦉', label: 'Gufo', tone: 'sky' },
  { emoji: '🚀', label: 'Razzo', tone: 'lilac' },
  { emoji: '🌱', label: 'Germoglio', tone: 'mint' },
  { emoji: '💎', label: 'Diamante', tone: 'sky' },
  { emoji: '🥝', label: 'Kiwi', tone: 'accent' },
];

/** Background tint of an avatar emoji (the video's 🤠 sits on butter). */
export const avatarTone = (emoji: string): Tone => AVATAR_CHOICES.find((c) => c.emoji === emoji)?.tone ?? 'butter';

export type AvatarPickerProps = {
  value: string;
  onChange: (emoji: string) => void;
  accessibilityLabel: string;
};

export function AvatarPicker({ value, onChange, accessibilityLabel }: AvatarPickerProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <View style={styles.grid} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      {AVATAR_CHOICES.map((choice) => {
        const selected = choice.emoji === value;
        return (
          <View key={choice.emoji} style={styles.cell}>
            <PressableScale
              onPress={() => onChange(choice.emoji)}
              scaleTo="small"
              haptic="selection"
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={choice.label}
              style={[styles.ring, { borderColor: selected ? colors.brandSolid : 'transparent' }]}>
              <Avatar emoji={choice.emoji} tone={choice.tone} size={accountMetrics.pickerAvatar} />
              {selected ? (
                <Animated.View
                  entering={reduceMotion ? undefined : ZoomIn.duration(duration.fast).easing(easing.enter)}
                  style={[styles.check, { backgroundColor: colors.accentSolid, borderColor: colors.surface }]}>
                  <Icon icon={Check} size={iconSize.xs} color="onAccent" strokeWidth={iconStroke.heavy} />
                </Animated.View>
              ) : null}
            </PressableScale>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.sm },
  cell: { width: `${100 / accountMetrics.pickerColumns}%`, alignItems: 'center' },
  ring: {
    padding: spacing.xxxs,
    borderRadius: radius.pill,
    borderWidth: borderWidth.ring,
  },
  check: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: spacing.xxxs,
    borderRadius: radius.pill,
    borderWidth: borderWidth.thick,
  },
});
