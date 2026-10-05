/**
 * Layout primitives for the visual-QA galleries (`IconGallery`, `IllustrationGallery`).
 * A section re-themes its subtree with `ColorModeProvider`, so the same grid is checked on the
 * paper canvas and on the evergreen brand surface.
 */
import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/text';
import { ColorModeProvider, createStyles, type ColorMode } from '@/theme';

export type GallerySurface = 'paper' | 'evergreen';

const MODE: Record<GallerySurface, ColorMode> = { paper: 'light', evergreen: 'brand' };

export const GALLERY_SURFACES: readonly GallerySurface[] = ['paper', 'evergreen'];

const useStyles = createStyles((t) => ({
  page: { gap: t.spacing.xl, padding: t.layout.screenX },
  section: {
    gap: t.spacing.md,
    padding: t.spacing.md,
    borderRadius: t.radius.xl,
    backgroundColor: t.colors.background,
    borderWidth: 1,
    borderColor: t.colors.borderSubtle,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  cell: {
    alignItems: 'center',
    gap: t.spacing.xs,
    padding: t.spacing.sm,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.borderSubtle,
  },
  previews: { flexDirection: 'row', alignItems: 'flex-end', gap: t.spacing.sm },
}));

type GalleryPageProps = {
  title: string;
  /** Wrap in a vertical ScrollView (standalone screen). Default false — embed in your own scroller. */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function GalleryPage({ title, scrollable = false, style, children }: GalleryPageProps) {
  const styles = useStyles();
  const content = (
    <View style={[styles.page, style]}>
      <Text variant="displayMd">{title}</Text>
      {children}
    </View>
  );
  return scrollable ? <ScrollView>{content}</ScrollView> : content;
}

export function GallerySection({ title, surface, children }: { title: string; surface: GallerySurface; children: ReactNode }) {
  return (
    <ColorModeProvider mode={MODE[surface]}>
      <SectionBody title={title}>{children}</SectionBody>
    </ColorModeProvider>
  );
}

function SectionBody({ title, children }: { title: string; children: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <Text variant="overline" color="textSecondary">
        {title}
      </Text>
      <View style={styles.grid}>{children}</View>
    </View>
  );
}

/** One labelled item: its previews side by side (large → small), label underneath. */
export function GalleryCell({ label, children }: { label: string; children: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.cell}>
      <View style={styles.previews}>{children}</View>
      <Text variant="labelSm" color="textSecondary" align="center">
        {label}
      </Text>
    </View>
  );
}
