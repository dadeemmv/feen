/**
 * Showcase: typography, buttons (every variant × size × state), icon buttons.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowLeft, ArrowRight, Flag, Plus, Send, Share, SquarePen, X } from 'lucide-react-native';

import { spacing, textVariants, type TextVariant } from '@/theme';

import { Button, type ButtonSize, type ButtonVariant } from '../button';
import { Card } from '../card';
import { IconButton, type IconButtonVariant } from '../icon-button';
import { Text } from '../text';
import { ShowcaseRow, ShowcaseSection } from './section';

const VARIANTS: ButtonVariant[] = ['primary', 'brand', 'secondary', 'outline', 'ghost', 'danger'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];
const ICON_VARIANTS: IconButtonVariant[] = ['plain', 'surface', 'brand', 'accent', 'glass'];

export function TypographyShowcase() {
  return (
    <ShowcaseSection title="Typography" note="textVariants — Bricolage Grotesque (display) + Plus Jakarta Sans (UI).">
      {(Object.keys(textVariants) as TextVariant[]).map((variant) => (
        <View key={variant} style={styles.typeRow}>
          <Text variant="labelSm" color="textTertiary" style={styles.typeLabel}>
            {variant}
          </Text>
          <Text variant={variant} numberOfLines={1} style={styles.flex}>
            {variant === 'numeric' ? '1.250 🥝' : variant === 'displayXl' ? '12' : variant.startsWith('display') ? 'Finanz 12' : 'Il tuo percorso'}
          </Text>
        </View>
      ))}
      <ShowcaseRow label="Colours">
        <Text color="textSecondary">textSecondary</Text>
        <Text color="textTertiary">textTertiary</Text>
        <Text color="brandText">brandText</Text>
        <Text color="dangerText">dangerText</Text>
        <Text color="successText">successText</Text>
      </ShowcaseRow>
    </ShowcaseSection>
  );
}

export function ButtonShowcase() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const fakeLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1600);
  };

  return (
    <ShowcaseSection title="Button" note="Pill CTA — primary lime · brand evergreen · secondary · outline · ghost · danger.">
      {SIZES.map((size) => (
        <ShowcaseRow key={size} label={`size ${size}`}>
          {VARIANTS.map((variant) => (
            <Button key={variant} title={variant} variant={variant} size={size} onPress={() => {}} />
          ))}
        </ShowcaseRow>
      ))}
      <ShowcaseRow label="disabled">
        {VARIANTS.map((variant) => (
          <Button key={variant} title={variant} variant={variant} size="md" disabled />
        ))}
      </ShowcaseRow>
      <ShowcaseRow label="icons · loading">
        <Button title="Continua" iconRight={ArrowRight} size="md" onPress={() => {}} />
        <Button title="Condividi" iconLeft={Share} variant="secondary" size="md" onPress={() => {}} />
        <Button title="Invia" iconLeft="🎁" variant="brand" size="md" onPress={() => {}} />
        <Button title="Acquista" variant="primary" size="md" loading={loading} onPress={fakeLoad} />
      </ShowcaseRow>
      <View style={styles.stack}>
        <Text variant="overline" color="textTertiary">
          Disabled ⇄ enabled glide (lesson “Continua”)
        </Text>
        <Button title="Continua" disabled={!enabled} fullWidth onPress={() => setEnabled(false)} />
        <Button
          title={enabled ? 'Deseleziona risposta' : 'Seleziona una risposta'}
          variant="ghost"
          size="sm"
          onPress={() => setEnabled((value) => !value)}
        />
      </View>
      <Card variant="brand" spotlight padding="lg" contentStyle={styles.stack}>
        <Text variant="overline" color="accentText">
          Brand surface
        </Text>
        <Text variant="displaySm">Il tuo percorso personale!</Text>
        <Button title="Continua il tuo viaggio!" shimmer glow fullWidth onPress={() => {}} />
        <View style={styles.row}>
          <Button title="Secondary" variant="secondary" size="sm" onPress={() => {}} />
          <Button title="Outline" variant="outline" size="sm" onPress={() => {}} />
          <Button title="Ghost" variant="ghost" size="sm" onPress={() => {}} />
        </View>
        <Button title="Disabled on brand" disabled size="md" />
      </Card>
    </ShowcaseSection>
  );
}

export function IconButtonShowcase() {
  return (
    <ShowcaseSection title="IconButton" note="Circular, sizes sm 36 · md 40 · lg 48. Always pass an Italian accessibilityLabel.">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ShowcaseRow key={size} label={`size ${size}`}>
          {ICON_VARIANTS.filter((v) => v !== 'glass').map((variant) => (
            <IconButton key={variant} icon={ArrowLeft} variant={variant} size={size} accessibilityLabel="Indietro" onPress={() => {}} />
          ))}
          <IconButton icon={Send} variant="accent" size={size} disabled accessibilityLabel="Invia" />
        </ShowcaseRow>
      ))}
      <ShowcaseRow label="lesson header · badge">
        <IconButton icon={X} variant="plain" accessibilityLabel="Chiudi" onPress={() => {}} />
        <IconButton icon={Flag} variant="plain" accessibilityLabel="Segnala" onPress={() => {}} />
        <IconButton icon={Share} variant="plain" accessibilityLabel="Condividi" onPress={() => {}} />
        <IconButton icon={SquarePen} accessibilityLabel="Nuova chat" badge onPress={() => {}} />
        <IconButton icon={Plus} accessibilityLabel="Aggiungi" badge={3} onPress={() => {}} />
      </ShowcaseRow>
      <Card variant="brand" padding="md" contentStyle={styles.row}>
        {ICON_VARIANTS.map((variant) => (
          <IconButton key={variant} icon={Share} variant={variant} accessibilityLabel="Condividi" onPress={() => {}} />
        ))}
      </Card>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  typeLabel: { width: spacing.huge + spacing.xl },
  flex: { flex: 1 },
  stack: { gap: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
