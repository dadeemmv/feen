/**
 * Invite a friend (spec §3.2, route /invite): back button, "Invita un amico", the evergreen code
 * card (copy + share), "Come funziona" in three steps and the honest 0/3 friends tracker that
 * leads to "30 giorni di Finanz Pro".
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { StatusHeader } from '@/components/navigation';
import { Screen, ScreenTitle, SectionHeader } from '@/components/ui';
import { useStore } from '@/store';
import { duration, easing, layout, spacing } from '@/theme';

import { CodeCard } from './components/code-card';
import { HowItWorks } from './components/how-it-works';
import { InviteProgressCard } from './components/invite-progress-card';
import { INVITE_COPY } from './copy';
import { inviteMetrics } from './metrics';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

const enter = (index: number) =>
  FadeInDown.delay(index * inviteMetrics.sectionStagger).duration(duration.slow).easing(easing.enter);

export function InviteScreen() {
  const code = useStore((s) => s.referralCode);
  const invited = useStore((s) => s.invitedFriends);

  return (
    <Screen edges={['top', 'bottom']} header={<StatusHeader stats={[]} showAvatar={false} onBack={goBack} />}>
      <ScreenTitle title={INVITE_COPY.title} subtitle={INVITE_COPY.body} />
      <Animated.View entering={enter(0)}>
        <CodeCard code={code} />
      </Animated.View>
      <Animated.View entering={enter(1)} style={styles.section}>
        <SectionHeader variant="title" title={INVITE_COPY.howTitle} style={styles.sectionHeader} />
        <HowItWorks />
      </Animated.View>
      <Animated.View entering={enter(2)} style={styles.section}>
        <InviteProgressCard invited={invited} />
      </Animated.View>
      <View style={styles.bottom} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: layout.sectionGap },
  sectionHeader: { marginBottom: spacing.sm },
  bottom: { height: layout.stackGap },
});
