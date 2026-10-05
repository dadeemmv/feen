/**
 * TierTag — the course level pill ("⭐ BASE" in the video). One filled star per tier step
 * (Base 1 · Intermedio 2 · Avanzato 3) on the tier's tint, instead of an emoji.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Star } from 'lucide-react-native';

import { Icon, iconSize, Tag, type Tone } from '@/components/ui';
import type { CourseTier } from '@/content/types';
import { spacing, type ColorToken } from '@/theme';

import { COURSE_COPY } from '../copy';

const TIER_STYLE: Record<CourseTier, { tone: Tone; stars: number; star: ColorToken }> = {
  BASE: { tone: 'butter', stars: 1, star: 'warningSolid' },
  INTERMEDIO: { tone: 'sky', stars: 2, star: 'tintSkyText' },
  AVANZATO: { tone: 'lilac', stars: 3, star: 'tintLilacText' },
};

export type TierTagProps = {
  tier: CourseTier;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

export function TierTag({ tier, size = 'md', style }: TierTagProps) {
  const { tone, stars, star } = TIER_STYLE[tier];
  const glyph = size === 'sm' ? iconSize.xs - spacing.xxxs : iconSize.xs;
  const icon = (
    <View style={styles.stars}>
      {Array.from({ length: stars }, (_, index) => (
        <Icon key={index} icon={Star} size={glyph} color={star} fill={star} strokeWidth={0} />
      ))}
    </View>
  );
  return <Tag label={COURSE_COPY.tier[tier]} icon={icon} tone={tone} size={size} style={style} />;
}

const styles = StyleSheet.create({
  stars: { flexDirection: 'row', gap: spacing.xxxs / 2 },
});
