/**
 * Section header of the Academy tab: a tinted icon tile replaces the video's emoji glyphs
 * ("📖 Continua a studiare", "🤓 Potrebbe interessarti"), title `titleLg`, optional subtitle.
 * Margins follow SCREEN_SPECS "Section header": top `sectionGap`, bottom `sm`.
 */
import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { IconTile, Text, type Tone } from '@/components/ui';
import { layout, spacing } from '@/theme';

export type AcademySectionProps = {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  subtitle?: string;
  /** First section right under the screen title: no top margin. */
  first?: boolean;
};

export function AcademySection({ icon, tone, title, subtitle, first = false }: AcademySectionProps) {
  return (
    <View style={[styles.row, !first && styles.spaced]}>
      <IconTile icon={icon} tone={tone} size="sm" />
      <View style={styles.text}>
        <Text variant="titleLg" accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  spaced: { marginTop: layout.sectionGap },
  text: { flex: 1 },
});
