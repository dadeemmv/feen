/**
 * Course poster on the Academy story ("IL TUO PRIMO INVESTIMENTO"): the course cover art on an
 * evergreen card with a "Nuovo percorso" tag and the title in lime display type — a poster for
 * the upcoming path rather than the video's grey photo.
 */
import { StyleSheet, View } from 'react-native';

import { CourseCover } from '@/components/illustrations';
import { Card, Tag, Text } from '@/components/ui';
import { spacing } from '@/theme';

import { STORY_COPY } from '../../copy';

export type CoursePosterProps = {
  title: string;
  width: number;
  artHeight: number;
};

export function CoursePoster({ title, width, artHeight }: CoursePosterProps) {
  return (
    <Card variant="brand" padding="none" style={[styles.card, { width }]} accessibilityLabel={title}>
      <View style={{ height: artHeight }}>
        <CourseCover variant="course-first-investment" background="brand" width={width} height={artHeight} />
        <Tag label={STORY_COPY.posterTag} emoji="✨" tone="accent" solid size="sm" style={styles.tag} />
      </View>
      <View style={styles.caption}>
        <Text variant="displaySm" color="accentText" align="center">
          {title}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', alignSelf: 'center' },
  tag: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  caption: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
