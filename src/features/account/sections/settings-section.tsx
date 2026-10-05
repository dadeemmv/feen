/**
 * Impostazioni: haptics, sounds, reduced motion, study reminders (+ preferred time).
 * Every switch writes `meta.settings` right away (iOS-style, no Save button). The root layout
 * mirrors haptics / reduced motion into the kit; haptics are also applied here immediately so
 * the confirming tick of the switch itself follows the new value.
 */
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { BellRing, Sparkles, Vibrate, Volume2 } from 'lucide-react-native';

import { ListGroup, ListItem, Switch, Text, VStack } from '@/components/ui';
import { useEntering } from '@/features/onboarding/lib/entering';
import { haptics, setHapticsEnabled } from '@/lib/haptics';
import { getStoreState, useStore, type ReminderSlot, type Settings } from '@/store';
import { spacing } from '@/theme';

import { SectionPage } from '../components/section-page';
import { SegmentedOptions } from '../components/segmented-options';
import { MENU_COPY, REMINDER_SLOTS, SETTINGS_COPY } from '../copy';

function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  if (key === 'haptics') setHapticsEnabled(value as boolean);
  getStoreState().setSetting(key, value);
  if (key === 'haptics' && value) haptics.selection();
}

const SLOT_OPTIONS = REMINDER_SLOTS.map((slot) => ({ id: slot.id, label: slot.label, caption: slot.time }));

export function SettingsSection() {
  const settings = useStore((s) => s.settings);
  const reminderSlot = useStore((s) => s.reminderSlot);
  const { fade } = useEntering();
  const copy = SETTINGS_COPY;

  const toggle = (key: keyof Settings, label: string) => (
    <Switch value={settings[key]} onValueChange={(value) => setSetting(key, value)} accessibilityLabel={label} />
  );

  return (
    <SectionPage title={MENU_COPY.settings.title} subtitle={copy.subtitle}>
      <ListGroup title={copy.general}>
        <ListItem icon={Vibrate} iconTone="mint" {...copy.haptics} trailing={toggle('haptics', copy.haptics.title)} />
        <ListItem icon={Volume2} iconTone="sky" {...copy.sound} trailing={toggle('sound', copy.sound.title)} />
        <ListItem
          icon={Sparkles}
          iconTone="lilac"
          {...copy.reduceMotion}
          trailing={toggle('reduceMotion', copy.reduceMotion.title)}
        />
      </ListGroup>

      <VStack gap="sm">
        <ListGroup title={copy.reminders}>
          <ListItem
            icon={BellRing}
            iconTone="butter"
            {...copy.notifications}
            trailing={toggle('notifications', copy.notifications.title)}
          />
        </ListGroup>
        {settings.notifications ? (
          <Animated.View entering={fade()} style={styles.slots}>
            <Text variant="labelMd" color="textSecondary" style={styles.inset}>
              {copy.reminderTime}
            </Text>
            <SegmentedOptions<ReminderSlot>
              options={SLOT_OPTIONS}
              value={reminderSlot}
              onChange={(slot) => getStoreState().setReminderSlot(slot)}
              accessibilityLabel={copy.reminderTime}
            />
          </Animated.View>
        ) : null}
        <Text variant="bodySm" color="textTertiary" style={styles.inset}>
          {copy.demoNote}
        </Text>
      </VStack>
    </SectionPage>
  );
}

const styles = StyleSheet.create({
  slots: { gap: spacing.xs, marginTop: spacing.xs },
  inset: { paddingHorizontal: spacing.xxs },
});
