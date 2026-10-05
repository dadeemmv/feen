/**
 * Showcase: cards, list rows & groups, headers, avatars, tiles, stat tiles, empty state.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Globe, LogOut, Settings, ShoppingBag, Target, Vibrate } from 'lucide-react-native';

import { GemIcon, KiwiCoinIcon, LockIcon } from '@/components/icons';
import { spacing } from '@/theme';

import { Avatar, StoryRing } from '../avatar';
import { Badge } from '../badge';
import { Card, type CardPadding, type CardVariant } from '../card';
import { Chip } from '../chip';
import { EmptyState } from '../empty-state';
import { IconTile } from '../icon-tile';
import { ListGroup } from '../list-group';
import { ListItem } from '../list-item';
import { iconSize } from '../metrics';
import { ScreenTitle } from '../screen-title';
import { SectionHeader } from '../section-header';
import { StatTile } from '../stat-tile';
import { Switch } from '../switch';
import { Text } from '../text';
import type { Tone } from '../tones';
import { ShowcaseRow, ShowcaseSection } from './section';

const CARD_VARIANTS: CardVariant[] = ['surface', 'elevated', 'accent', 'outline', 'locked', 'brand'];
const TILE_TONES: Tone[] = ['neutral', 'brand', 'accent', 'mint', 'sky', 'blush', 'butter', 'lilac', 'streak', 'pro'];
const PADDINGS: CardPadding[] = ['none', 'sm', 'md', 'lg'];

export function CardShowcase() {
  return (
    <ShowcaseSection title="Card" note="One idea per card. `brand` switches its children to brand tokens.">
      <View style={styles.grid}>
        {CARD_VARIANTS.map((variant) => (
          <Card key={variant} variant={variant} padding="md" style={styles.gridItem} contentStyle={styles.cardBody}>
            {variant === 'locked' ? <LockIcon size={iconSize.lg} muted /> : null}
            <Text variant="titleSm">{variant}</Text>
            <Text variant="bodySm" color="textSecondary">
              Testo secondario
            </Text>
          </Card>
        ))}
      </View>
      <Card variant="brand" spotlight padding="lg" contentStyle={styles.cardBody}>
        <Text variant="overline" color="accentText">
          Spotlight
        </Text>
        <Text variant="titleLg">30 giorni di Finanz Pro</Text>
        <Text variant="bodyMd" color="textSecondary">
          Invita 3 amici e riscattalo gratis!
        </Text>
      </Card>
      <Card onPress={() => {}} haptic="light" accessibilityLabel="Card premibile" contentStyle={styles.cardBody}>
        <Text variant="titleSm">Pressable card</Text>
        <Text variant="bodySm" color="textSecondary">
          Scala a 0.97 alla pressione
        </Text>
      </Card>
      <ShowcaseRow label="padding">
        {PADDINGS.map((padding) => (
          <Card key={padding} variant="outline" padding={padding}>
            <Text variant="labelSm">{padding}</Text>
          </Card>
        ))}
      </ShowcaseRow>
    </ShowcaseSection>
  );
}

export function ListShowcase() {
  const [haptic, setHaptic] = useState(true);
  return (
    <ShowcaseSection title="ListItem · ListGroup · SectionHeader">
      <ScreenTitle title="Account" trailing={<Chip label="23:59:12" icon="⏱️" variant="surface" />} />
      <ListItem
        variant="card"
        leading={<Avatar emoji="🤠" size="md" tone="butter" />}
        title="alberto"
        subtitle="alberto.rossi@example.com"
        onPress={() => {}}
      />
      <ListGroup title="Menu" action={{ label: 'Vedi tutti', onPress: () => {} }}>
        <ListItem icon={Settings} title="Impostazioni" subtitle="Modifica le impostazioni" onPress={() => {}} />
        <ListItem icon={Globe} iconTone="sky" title="Lingua e Paese" subtitle="Italiano · Italia" onPress={() => {}} />
        <ListItem icon={ShoppingBag} iconTone="blush" title="Acquisti" value="3" onPress={() => {}} />
        <ListItem
          icon={<GemIcon size={iconSize.md} />}
          iconTone="lilac"
          title="Finanz Pro"
          trailing={<Badge count={1} ring={false} />}
          onPress={() => {}}
        />
        <ListItem
          icon={Vibrate}
          iconTone="mint"
          title="Vibrazione"
          trailing={<Switch value={haptic} onValueChange={setHaptic} accessibilityLabel="Vibrazione" />}
        />
        <ListItem icon={LogOut} iconTone="danger" title="Esci" destructive onPress={() => {}} />
      </ListGroup>
      <SectionHeader variant="title" emoji="📖" title="Continua a studiare" action={{ label: 'Tutti', onPress: () => {} }} />
      <SectionHeader title="Altro" />
    </ShowcaseSection>
  );
}

export function IdentityShowcase() {
  return (
    <ShowcaseSection title="Avatar · StoryRing · IconTile · StatTile">
      <ShowcaseRow label="avatar sizes">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Avatar key={size} emoji="🤠" size={size} tone="butter" />
        ))}
        <Avatar name="Alberto Rossi" size="lg" />
        <Avatar name="Sara" size="md" tone="mint" />
      </ShowcaseRow>
      <ShowcaseRow label="story rings">
        <View style={styles.story}>
          <Avatar emoji="📚" size="lg" tone="mint" ring="unseen" onPress={() => {}} accessibilityLabel="Storia Academy" />
          <Text variant="labelSm">Academy</Text>
        </View>
        <View style={styles.story}>
          <Avatar emoji="📱" size="lg" tone="sky" ring="seen" onPress={() => {}} accessibilityLabel="Storia App" />
          <Text variant="labelSm" color="textSecondary">
            App
          </Text>
        </View>
        <StoryRing size={iconSize.xl * 2}>
          <IconTile emoji="🎯" tone="accent" size="xl" round />
        </StoryRing>
      </ShowcaseRow>
      <ShowcaseRow label="icon tiles">
        {TILE_TONES.map((tone) => (
          <IconTile key={tone} icon={Target} tone={tone} />
        ))}
      </ShowcaseRow>
      <ShowcaseRow label="solid · emoji · sizes">
        <IconTile icon={Target} tone="brand" solid />
        <IconTile emoji="📚" tone="mint" size="sm" />
        <IconTile emoji="📚" tone="mint" size="md" />
        <IconTile emoji="📚" tone="mint" size="lg" />
        <IconTile emoji="📚" tone="mint" size="xl" round />
      </ShowcaseRow>
      <View style={styles.statRow}>
        <StatTile icon="⚡" value="120" label="XP totali" />
        <StatTile icon={<KiwiCoinIcon size={iconSize.lg} />} value="1.250" label="Kiwi" />
        <StatTile icon="🎯" value="92%" label="Precisione" tone="mint" />
      </View>
      <Card variant="brand" padding="md" contentStyle={styles.statRow}>
        <StatTile size="lg" icon="⚡" value="+40" label="XP" />
        <StatTile size="lg" icon={<KiwiCoinIcon size={iconSize.xl} />} value="+50" label="Kiwi" />
        <StatTile size="lg" icon="🎯" value="100%" label="Precisione" />
      </Card>
    </ShowcaseSection>
  );
}

export function EmptyStateShowcase() {
  return (
    <ShowcaseSection title="EmptyState">
      <Card padding="none">
        <EmptyState
          emoji="🛍️"
          title="Nessun acquisto"
          message="Gli oggetti che compri nello Shop compariranno qui."
          action={{ label: 'Vai allo Shop', onPress: () => {} }}
          compact
        />
      </Card>
      <EmptyState
        illustration={<KiwiCoinIcon size={iconSize.xl * 3} />}
        title="Ancora nessun amico"
        message="Invita un amico: riceverete entrambi 500 kiwi."
        action={{ label: 'Invita un amico', onPress: () => {}, variant: 'brand' }}
        secondaryAction={{ label: 'Più tardi', onPress: () => {} }}
      />
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  gridItem: { width: '48%', flexGrow: 1 },
  cardBody: { gap: spacing.xxs },
  story: { alignItems: 'center', gap: spacing.xxs },
  statRow: { flexDirection: 'row', gap: spacing.xs },
});
