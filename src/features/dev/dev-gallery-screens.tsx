/**
 * Visual-QA pages mounting the foundation galleries: `/dev/ui`, `/dev/icons`,
 * `/dev/illustrations`. Each gets a floating back button (the galleries render their own title).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { IconGallery } from '@/components/icons/gallery';
import { IllustrationGallery } from '@/components/illustrations/gallery';
import { IconButton, Screen, zIndex } from '@/components/ui';
import { UiShowcase } from '@/components/ui/showcase';
import { layout, spacing } from '@/theme';

import { goBackOr } from './placeholder-screen';

function DevBackButton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.back, { bottom: Math.max(insets.bottom, spacing.md) + spacing.xs }]}>
      <IconButton icon={ArrowLeft} variant="brand" size="lg" accessibilityLabel="Indietro" onPress={() => goBackOr('/dev')} />
    </View>
  );
}

function GalleryPage({ children }: { children: ReactNode }) {
  return (
    <View style={styles.flex}>
      <Screen edges={['top', 'bottom']} padded={false}>
        {children}
      </Screen>
      <DevBackButton />
    </View>
  );
}

export function DevUiScreen() {
  return (
    <View style={styles.flex}>
      {/* The root layout already mounts the app ToastHost. */}
      <UiShowcase toastHost={false} />
      <DevBackButton />
    </View>
  );
}

export function DevIconsScreen() {
  return (
    <GalleryPage>
      <IconGallery />
    </GalleryPage>
  );
}

export function DevIllustrationsScreen() {
  return (
    <GalleryPage>
      <IllustrationGallery />
    </GalleryPage>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  back: { position: 'absolute', right: layout.screenX, zIndex: zIndex.tabBar },
});
