/**
 * Hero of the completion screen: a lime "medal" carrying the chapter emoji, ringed by a soft
 * halo, with the success check badge pinned to its edge and two sparkles around it, all under a
 * radial spotlight. Finishing the last chapter of the course swaps the medal for the trophies.
 * Everything pops in with the bouncy spring (PopIn), staggered.
 */
import { StyleSheet, View } from 'react-native';

import { CheckBadgeIcon, SparkleIcon } from '@/components/icons';
import { TrophyCups } from '@/components/illustrations';
import { Spotlight, Text, iconSize } from '@/components/ui';
import { PopIn } from '@/features/rewards';
import { radius, spacing, useTheme } from '@/theme';

import { COMPLETION, EMOJI_LINE_HEIGHT } from '../metrics';

export type CompletionHeroProps = {
  emoji: string;
  /** Last chapter of the course, first completion: trophies instead of the medal. */
  courseDone: boolean;
  compact: boolean;
};

export function CompletionHero({ emoji, courseDone, compact }: CompletionHeroProps) {
  const theme = useTheme();
  const medal = compact ? COMPLETION.medalCompact : COMPLETION.medal;
  const halo = medal + COMPLETION.haloRing * 2;
  const emojiSize = Math.round(medal * COMPLETION.medalEmojiRatio);

  return (
    <View style={[styles.stage, { height: halo + spacing.xl }]} aria-hidden>
      <Spotlight style={StyleSheet.absoluteFill} reach={{ x: 0.7, y: 0.9 }} />
      {courseDone ? (
        <PopIn delay={COMPLETION.revealMs}>
          <TrophyCups height={halo} />
        </PopIn>
      ) : (
        <View style={{ width: halo, height: halo }}>
          <PopIn style={[styles.halo, { width: halo, height: halo, backgroundColor: theme.colors.fill }]}>
            <View style={[styles.medal, { width: medal, height: medal, backgroundColor: theme.colors.accentSolid }]}>
              <Text style={{ fontSize: emojiSize, lineHeight: Math.round(emojiSize * EMOJI_LINE_HEIGHT) }}>{emoji}</Text>
            </View>
          </PopIn>
          <PopIn delay={COMPLETION.revealMs * 2} style={styles.badge}>
            <CheckBadgeIcon size={iconSize.xl + spacing.xs} />
          </PopIn>
          <PopIn delay={COMPLETION.revealMs * 3} style={styles.sparkleTop}>
            <SparkleIcon size={iconSize.lg} tone="lime" />
          </PopIn>
          <PopIn delay={COMPLETION.revealMs * 4} style={styles.sparkleSide}>
            <SparkleIcon size={iconSize.md} tone="white" twin={false} />
          </PopIn>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  halo: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  medal: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', right: spacing.xxs, bottom: spacing.xxs },
  sparkleTop: { position: 'absolute', left: -spacing.md, top: spacing.xxs },
  sparkleSide: { position: 'absolute', right: -spacing.md, top: spacing.xl },
});
