/**
 * Visual-QA pages mounting the foundation galleries: `/dev/ui`, `/dev/icons`,
 * `/dev/illustrations`, `/dev/mascots`. Each gets a floating back button (the galleries render their own title).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { GalleryCell, GalleryPage as KitPage, GallerySection } from '@/components/icons/lib/gallery-kit';
import { IconGallery } from '@/components/icons/gallery';
import { MascotArt } from '@/components/illustrations';
import { IllustrationGallery } from '@/components/illustrations/gallery';
import { IconButton, Screen, zIndex } from '@/components/ui';
import { UiShowcase } from '@/components/ui/showcase';
import { MASCOT_IDS, MASCOTS } from '@/content/personality';
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

/** The four companion characters, full figure and as busts, on paper and on evergreen. */
export function DevMascotsScreen() {
  return (
    <GalleryPage>
      <KitPage title="Personaggi">
        <View style={styles.studio} testID="mascot-studio">
          {MASCOT_IDS.map((id) => (
            <MascotArt key={id} id={id} height={360} />
          ))}
        </View>
        {(['paper', 'evergreen'] as const).map((surface) => (
          <GallerySection key={surface} title={surface === 'paper' ? 'Su carta' : 'Su evergreen'} surface={surface}>
            {MASCOT_IDS.map((id) => (
              <GalleryCell key={id} label={`${MASCOTS[id].name} · ${MASCOTS[id].title} · ${MASCOTS[id].quadrant}`}>
                <MascotArt id={id} height={240} accessibilityLabel={MASCOTS[id].name} />
                <MascotArt id={id} framing="bust" width={64} />
                <MascotArt id={id} framing="bust" width={36} />
              </GalleryCell>
            ))}
          </GallerySection>
        ))}
      </KitPage>
    </GalleryPage>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  back: { position: 'absolute', right: layout.screenX, zIndex: zIndex.tabBar },
  studio: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
