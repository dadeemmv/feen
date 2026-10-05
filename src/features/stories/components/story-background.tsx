/**
 * Full-bleed backdrop of a story face: a mint wash for the Academy group, the evergreen hero
 * gradient for the App group, each with a soft spotlight from the top so the page reads as a lit
 * stage rather than a flat fill. Ignores touches.
 */
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Spotlight } from '@/components/ui';
import type { StoryGroup } from '@/content/types';
import { gradients } from '@/theme';

/** Light cone of the mint page (a wide, gentle lime glow). */
const MINT_REACH = { x: 1.1, y: 0.7 };
const BRAND_REACH = { x: 0.9, y: 0.75 };

export function StoryBackground({ theme }: { theme: StoryGroup['theme'] }) {
  const mint = theme === 'mint';
  return (
    <View style={styles.fill}>
      <LinearGradient
        colors={mint ? gradients.academyStory : gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Spotlight reach={mint ? MINT_REACH : BRAND_REACH} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
});
