/**
 * PlaceholderScreen — temporary scaffold for feature screens that are not built yet, so every
 * route renders and is reachable end to end. Feature owners replace their `*-screen.tsx` file;
 * nothing else depends on this component.
 *
 *   <PlaceholderScreen title="Streak" header="status" links={[{ label: 'Shop', href: '/shop' }]} />
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { X } from 'lucide-react-native';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { Button, Card, IconButton, Screen, ScreenTitle, Tag, Text, VStack, type ButtonVariant } from '@/components/ui';
import { layout, spacing } from '@/theme';

export type PlaceholderLink = {
  label: string;
  /** Opened with `openHref` (pushed; tab roots are switched to). */
  href?: Href;
  onPress?: () => void;
  /** Default `secondary`. */
  variant?: ButtonVariant;
};

export type PlaceholderScreenProps = {
  title: string;
  subtitle?: string;
  /** `status`: chips row (with a back button unless `tab`) · `close`: an ✕ button · `none`. */
  header?: 'status' | 'close' | 'none';
  /** Tab root: clears the floating tab bar and hides the back button. */
  tab?: boolean;
  background?: 'background' | 'brand';
  links?: PlaceholderLink[];
  children?: ReactNode;
};

/** `router.back()` when there is history (deep links / web refresh have none), else `fallback`. */
export function goBackOr(fallback: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

const TAB_PATHS = new Set<string>(['/', '/academy', '/assistant', '/shop']);

/** Tab roots are switched to (`navigate`, never a second tab stack); everything else is pushed. */
export function openHref(href: Href) {
  if (typeof href === 'string' && TAB_PATHS.has(href)) router.navigate(href);
  else router.push(href);
}

const onBack = () => goBackOr();

function PlaceholderHeader({ kind, tab }: { kind: PlaceholderScreenProps['header']; tab: boolean }) {
  if (kind === 'status') return <ConnectedStatusHeader onBack={tab ? undefined : onBack} />;
  if (kind === 'close') {
    return (
      <View style={styles.bar}>
        <IconButton icon={X} variant="glass" accessibilityLabel="Chiudi" onPress={onBack} />
      </View>
    );
  }
  return null;
}

export function PlaceholderScreen({
  title,
  subtitle,
  header = 'status',
  tab = false,
  background = 'background',
  links = [],
  children,
}: PlaceholderScreenProps) {
  return (
    <Screen
      withTabBar={tab}
      edges={tab ? ['top'] : ['top', 'bottom']}
      background={background}
      statusBar={background === 'brand' ? 'light' : 'dark'}
      header={<PlaceholderHeader kind={header} tab={tab} />}>
      <ScreenTitle title={title} subtitle={subtitle} />
      <Card contentStyle={styles.card}>
        <Tag emoji="🚧" label="In costruzione" size="sm" style={styles.tag} />
        <Text variant="bodyMd" color="textSecondary">
          Schermata provvisoria: la versione definitiva è in arrivo.
        </Text>
        {children}
        {links.length > 0 ? (
          <VStack gap="sm">
            {links.map((link) => (
              <Button
                key={link.label}
                title={link.label}
                variant={link.variant ?? 'secondary'}
                size="md"
                fullWidth
                onPress={link.onPress ?? (link.href ? () => openHref(link.href as Href) : undefined)}
              />
            ))}
          </VStack>
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: { height: layout.headerHeight, justifyContent: 'center', paddingHorizontal: layout.screenX },
  card: { gap: spacing.md },
  tag: { alignSelf: 'flex-start' },
});
