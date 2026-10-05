/**
 * Showcase: text fields, radios, choice rows, switches.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Mail, Search, Send, X } from 'lucide-react-native';

import { spacing, textVariants } from '@/theme';

import { Card } from '../card';
import { ChoiceRow } from '../choice-row';
import { IconButton } from '../icon-button';
import { Radio } from '../radio';
import { Switch } from '../switch';
import { TextField } from '../text-field';
import { ShowcaseRow, ShowcaseSection } from './section';

const POLL = [
  'Molto chiaro! Ho capito tutto al volo.',
  'Abbastanza chiaro, ma qualche chiarimento avrebbe reso le cose più facili.',
  'Un po’ confuso, ma sono riuscito a cavarmela.',
];
const INTERESTS = [
  { id: 'invest', emoji: '📈', label: 'Investire' },
  { id: 'save', emoji: '🐷', label: 'Risparmiare' },
  { id: 'crypto', emoji: '🪙', label: 'Crypto' },
];

export function TextFieldShowcase() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const codeError = code.length > 0 && code.length < 6 ? 'Il codice ha 6 caratteri' : undefined;

  return (
    <ShowcaseSection title="TextField" note="Focus ring evergreen (lime on brand), error ring + message.">
      <TextField label="Nome" placeholder="Come ti chiami?" value={name} onChangeText={setName} maxLength={24} showCount />
      <TextField label="Email" placeholder="nome@esempio.it" leading={Mail} keyboardType="email-address" autoCapitalize="none" helper="Non la condivideremo con nessuno." />
      <TextField
        label="Codice"
        placeholder="FZ-XXXX"
        value={code}
        onChangeText={(text) => setCode(text.toUpperCase())}
        autoCapitalize="characters"
        align="center"
        maxLength={6}
        error={codeError}
        textVariant="titleLg"
        inputStyle={styles.code}
      />
      <TextField
        placeholder="Cerca un argomento"
        leading={Search}
        size="md"
        trailing={<IconButton icon={X} variant="plain" size="sm" accessibilityLabel="Cancella" onPress={() => {}} />}
      />
      <TextField placeholder="Disabilitato" disabled />
      <TextField
        shape="pill"
        variant="surface"
        multiline
        placeholder="Chiedi qualcosa..."
        value={message}
        onChangeText={setMessage}
        trailing={
          <IconButton
            icon={Send}
            variant="accent"
            disabled={message.trim().length === 0}
            accessibilityLabel="Invia"
            onPress={() => setMessage('')}
          />
        }
      />
      <Card variant="brand" padding="md">
        <TextField placeholder="Su una superficie brand" />
      </Card>
    </ShowcaseSection>
  );
}

export function SelectionShowcase() {
  const [poll, setPoll] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>(['invest']);
  const [radio, setRadio] = useState(true);
  const [switches, setSwitches] = useState({ a: true, b: false });

  const toggleInterest = (id: string) =>
    setInterests((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  return (
    <ShowcaseSection title="Radio · ChoiceRow · Switch">
      <ShowcaseRow label="radio / checkbox">
        <Radio selected={radio} onPress={() => setRadio((v) => !v)} accessibilityLabel="Opzione" />
        <Radio selected={!radio} onPress={() => setRadio((v) => !v)} tone="brand" accessibilityLabel="Opzione" />
        <Radio selected={radio} shape="square" size="sm" onPress={() => setRadio((v) => !v)} accessibilityLabel="Opzione" />
        <Radio selected disabled />
        <Radio selected={false} disabled />
      </ShowcaseRow>
      <View style={styles.stack}>
        {POLL.map((label, index) => (
          <ChoiceRow
            key={label}
            label={label}
            labelVariant="bodyMd"
            selected={poll === index}
            onPress={() => setPoll(index)}
          />
        ))}
      </View>
      <View style={styles.stack}>
        {INTERESTS.map((item) => (
          <ChoiceRow
            key={item.id}
            multiple
            emoji={item.emoji}
            iconTone="mint"
            label={item.label}
            description="Scegli uno o più interessi"
            selected={interests.includes(item.id)}
            onPress={() => toggleInterest(item.id)}
            tone="brand"
          />
        ))}
      </View>
      <ShowcaseRow label="switch">
        <Switch value={switches.a} onValueChange={(a) => setSwitches((s) => ({ ...s, a }))} accessibilityLabel="Suoni" />
        <Switch value={switches.b} onValueChange={(b) => setSwitches((s) => ({ ...s, b }))} accessibilityLabel="Notifiche" />
        <Switch value disabled onValueChange={() => {}} accessibilityLabel="Disabilitato" />
      </ShowcaseRow>
      <Card variant="brand" padding="md" contentStyle={styles.row}>
        <Switch value={switches.a} onValueChange={(a) => setSwitches((s) => ({ ...s, a }))} accessibilityLabel="Suoni" />
        <Radio selected={radio} onPress={() => setRadio((v) => !v)} accessibilityLabel="Opzione" />
      </Card>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  code: { letterSpacing: textVariants.overline.letterSpacing * 3 },
});
