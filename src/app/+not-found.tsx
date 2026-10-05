/** Unmatched routes: a friendly Italian 404 with a way home. */
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { EmptyBox } from '@/components/illustrations';
import { EmptyState, Screen } from '@/components/ui';

const ILLUSTRATION_WIDTH = 176;

const goHome = () => router.replace('/');

export default function NotFoundScreen() {
  return (
    <Screen preset="fixed" edges={['top', 'bottom']} contentContainerStyle={styles.center}>
      <EmptyState
        illustration={<EmptyBox width={ILLUSTRATION_WIDTH} accessibilityLabel="Scatola vuota" />}
        title="Pagina non trovata"
        message="Qui non c’è niente da imparare… per ora! Torniamo al tuo percorso."
        action={{ label: 'Torna alla Home', onPress: goHome }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center' },
});
