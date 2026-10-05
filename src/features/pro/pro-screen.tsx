/**
 * Finanz Pro paywall (/pro, modal — docs/PRODUCT_SPEC.md §1, §3.6 CTA target, §5).
 *
 *   offer       hero · benefits · plan selector (yearly preselected) · "Prova 7 giorni gratis"
 *   processing  the CTA spins for a beat (simulated store sheet); plans are locked
 *   success     confetti + "Benvenuto in Finanz Pro!" once the DEMO trial is active
 *   member      opened while Pro is already active: membership summary, no plans
 *
 * This build has no payments: the CTA activates a 7-day demo Pro (`activatePro`), and the screen
 * says so next to the CTA ("Demo — nessun addebito") and in the footnote.
 */
import { useEffect, useState } from 'react';

import type { ProPrice } from '@/content/extra-types';
import { PRO_PLAN } from '@/content/shop';
import { goBackOr } from '@/features/shop/lib/navigation';
import { haptics } from '@/lib/haptics';
import { getStoreState, isProActive, useStore } from '@/store';
import { useNow } from '@/store/hooks';

import { ProBackdrop } from './components/pro-chrome';
import { ProMember } from './components/pro-member';
import { ProOffer } from './components/pro-offer';
import { ProSuccess } from './components/pro-success';
import { PRO_TRIAL_DAYS } from './copy';
import { proMetrics } from './metrics';

type Phase = 'offer' | 'processing' | 'success';

const close = () => goBackOr('/');

export function ProScreen() {
  const now = useNow();
  const proUntil = useStore((s) => s.proUntil);
  const [phase, setPhase] = useState<Phase>('offer');
  const [planId, setPlanId] = useState<ProPrice['id']>(PRO_PLAN.defaultPriceId);

  // Simulated purchase: a short processing beat, then the demo trial is granted.
  useEffect(() => {
    if (phase !== 'processing') return;
    const timer = setTimeout(() => {
      getStoreState().activatePro(PRO_TRIAL_DAYS, Date.now());
      haptics.success();
      setPhase('success');
    }, proMetrics.activationDelay);
    return () => clearTimeout(timer);
  }, [phase]);

  const startTrial = () => {
    if (phase !== 'offer') return;
    haptics.medium();
    setPhase('processing');
  };

  let content;
  if (phase === 'success' && proUntil !== null) {
    content = <ProSuccess proUntil={proUntil} onDone={close} />;
  } else if (phase === 'offer' && proUntil !== null && isProActive({ proUntil }, now)) {
    content = <ProMember proUntil={proUntil} now={now} onClose={close} />;
  } else {
    content = (
      <ProOffer
        planId={planId}
        onSelectPlan={setPlanId}
        processing={phase === 'processing'}
        onStartTrial={startTrial}
        onClose={close}
      />
    );
  }

  return <ProBackdrop>{content}</ProBackdrop>;
}
