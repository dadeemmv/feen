/**
 * "Tutto pronto": the celebration that closes onboarding. Evergreen screen, confetti burst,
 * the user's companion mascot (or, without a test result, the avatar) popping in, "Ciao <nome>, il tuo percorso è pronto", a recap of the answers
 * and the first course waiting. "Inizia il percorso" writes the profile and enters the app.
 * A returning user ("Ho già un account") gets "Bentornato" with the saved profile instead.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Redirect } from 'expo-router';
import { BellRing, Clock, Heart, Sparkles } from 'lucide-react-native';

import { SparkleIcon } from '@/components/icons';
import { MascotArt } from '@/components/illustrations';
import { Avatar, Button, Chip, Confetti, iconSize, Screen, Spotlight, Text, VStack } from '@/components/ui';
import { avatarTone } from '@/features/account/components/avatar-picker';
import { REMINDER_SLOTS } from '@/features/account/copy';
import { scorePersonality, isQuizComplete } from '@/features/mascots/lib/score';
import { mascotMetrics } from '@/features/mascots/metrics';
import { PopIn } from '@/features/rewards';
import { getMascot } from '@/content/personality';
import { selectMascot, useStoreShallow } from '@/store';
import { duration, spacing } from '@/theme';

import { FirstPathCard } from '../components/first-path-card';
import { ONBOARDING_COPY } from '../copy';
import { cleanName } from '../data/name';
import { getExperienceOption } from '../data/options';
import { useOnboardingDraft } from '../draft-store';
import { useEntering } from '../lib/entering';
import { allowedStep, finishOnboarding, STEP_HREF } from '../steps';

export function ReadyScreen() {
  const draft = useOnboardingDraft();
  const profile = useStoreShallow((s) => ({
    name: s.name,
    avatar: s.avatar,
    goalMinutes: s.goalMinutes,
    experience: s.experience,
    interests: s.interests.length,
    reminders: s.settings.notifications,
    reminderSlot: s.reminderSlot,
    mascot: selectMascot(s),
  }));
  const { rise } = useEntering();
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBurst(true), duration.base);
    return () => clearTimeout(timer);
  }, []);

  const allowed = allowedStep('ready', draft);
  if (allowed !== 'ready') return <Redirect href={STEP_HREF[allowed]} />;

  const copy = ONBOARDING_COPY.ready;
  const returning = draft.returning;

  // What the recap shows: the fresh answers, or the saved profile for a returning user.
  const name = returning ? profile.name : cleanName(draft.name);
  const goal = returning ? profile.goalMinutes : (draft.goalMinutes ?? profile.goalMinutes);
  const experience = getExperienceOption(returning ? profile.experience : (draft.experience ?? profile.experience));
  const interestCount = returning ? profile.interests : draft.interests.length;
  const reminders = returning ? profile.reminders : draft.reminders;
  const slot = REMINDER_SLOTS.find((s) => s.id === (returning ? profile.reminderSlot : draft.reminderSlot));
  const draftMascot = isQuizComplete(draft.quizAnswers) ? scorePersonality(draft.quizAnswers).mascot : null;
  const mascot = returning ? profile.mascot : draftMascot;

  return (
    <View style={styles.flex}>
      <Screen
        background="brand"
        edges={['top', 'bottom']}
        statusBar="light"
        footer={
          <Button
            title={returning ? copy.returningCta : copy.cta}
            glow
            shimmer
            fullWidth
            onPress={finishOnboarding}
          />
        }>
        <Spotlight reach={{ x: 0.9, y: 0.6 }} />

        <VStack gap="md" align="center" style={styles.hero}>
          <PopIn delay={duration.fast}>
            <View>
              {mascot ? (
                <MascotArt id={mascot} width={mascotMetrics.readyArt} accessibilityLabel={getMascot(mascot).animal} />
              ) : (
                <Avatar emoji={profile.avatar} tone={avatarTone(profile.avatar)} size="xl" />
              )}
              <SparkleIcon tone="lime" twin size={iconSize.xl} style={styles.sparkle} />
            </View>
          </PopIn>
          <Animated.View entering={rise(1)} style={styles.heading}>
            <Text variant="overline" color="accentText" align="center">
              {copy.overline}
            </Text>
            <Text variant="displayMd" align="center" accessibilityRole="header">
              {returning ? (
                copy.returningTitle(name)
              ) : (
                <>
                  {copy.titleStart}
                  <Text variant="displayMd" color="accentText">
                    {name}
                  </Text>
                  {copy.titleEnd}
                </>
              )}
            </Text>
            <Text variant="bodyMd" color="textSecondary" align="center">
              {returning ? copy.returningSubtitle : copy.subtitle}
            </Text>
          </Animated.View>
        </VStack>

        <Animated.View entering={rise(3)} style={styles.chips}>
          <Chip icon={Clock} label={ONBOARDING_COPY.pace.perDay(goal)} size="sm" />
          {mascot ? <Chip icon={Sparkles} label={copy.companion(getMascot(mascot).name)} size="sm" /> : null}
          {experience ? <Chip icon={experience.icon} label={experience.label} size="sm" /> : null}
          {interestCount > 0 ? <Chip icon={Heart} label={copy.interestsCount(interestCount)} size="sm" /> : null}
          {reminders && slot ? <Chip icon={BellRing} label={copy.reminderAt(slot.time)} size="sm" /> : null}
        </Animated.View>

        <Animated.View entering={rise(5)} style={styles.path}>
          <FirstPathCard />
        </Animated.View>
      </Screen>
      <Confetti run={burst} origin={{ x: 0.5, y: 0.18 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { paddingTop: spacing.xl },
  sparkle: { position: 'absolute', top: -spacing.xs, right: -spacing.xs },
  heading: { gap: spacing.xs, alignItems: 'center' },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  path: { marginTop: spacing.xl },
});
