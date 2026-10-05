/**
 * `/dev` — QA hub (dev builds only, see `src/app/dev/_layout.tsx`): design-system galleries,
 * a jump list of every route and state shortcuts.
 */
import { StyleSheet } from 'react-native';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { Chip, HStack, ListGroup, ListItem, Screen, ScreenTitle } from '@/components/ui';
import { spacing } from '@/theme';

import { DEV_ACTIONS, DEV_PAGES, DEV_ROUTES, DEV_SHEETS, openDevSheet } from './dev-catalog';
import { goBackOr, openHref } from './placeholder-screen';

export function DevIndexScreen() {
  return (
    <Screen edges={['top', 'bottom']} header={<ConnectedStatusHeader onBack={() => goBackOr()} />}>
      <ScreenTitle title="Dev" subtitle="Strumenti di QA: visibili solo nelle build di sviluppo." />

      <ListGroup title="Design system">
        {DEV_PAGES.map((page) => (
          <ListItem
            key={page.title}
            emoji={page.emoji}
            iconTone="mint"
            title={page.title}
            subtitle={page.subtitle}
            onPress={() => openHref(page.href)}
          />
        ))}
      </ListGroup>

      <ListGroup title="Stato" style={styles.group}>
        {DEV_ACTIONS.map((action) => (
          <ListItem
            key={action.title}
            emoji={action.emoji}
            iconTone={action.destructive ? 'danger' : 'butter'}
            title={action.title}
            subtitle={action.subtitle}
            destructive={action.destructive}
            trailing="none"
            onPress={action.run}
          />
        ))}
      </ListGroup>

      <ListGroup title="Sheet globali" style={styles.group}>
        <HStack gap="xs" wrap padding="md">
          {DEV_SHEETS.map((sheet) => (
            <Chip key={sheet.name} label={sheet.title} variant="outline" tone="brand" onPress={() => openDevSheet(sheet.name)} />
          ))}
        </HStack>
      </ListGroup>

      <ListGroup title="Tutte le schermate" style={styles.group}>
        {DEV_ROUTES.map((route) => (
          <ListItem
            key={route.title}
            emoji={route.emoji}
            iconTone="sky"
            title={route.title}
            subtitle={route.subtitle}
            onPress={() => openHref(route.href)}
          />
        ))}
      </ListGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { marginTop: spacing.xl },
});
