'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { OnboardingLayout } from '@/components/layout/onboarding-layout';

import { Step1Welcome } from '@/components/onboarding/step-1-welcome';
import { Step2Routine } from '@/components/onboarding/step-2-routine';
import { Step3Bifurcation } from '@/components/onboarding/step-3-bifurcation';
import { Step4Placement } from '@/components/onboarding/step-4-placement';
import { Step5LiveBooking } from '@/components/onboarding/step-5-live-booking';
import { Step6Finalizing } from '@/components/onboarding/step-6-finalizing';
import { Step7Celebration } from '@/components/onboarding/step-7-celebration';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.98,
  }),
};

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore();
  const [prevStep, setPrevStep] = useState(currentStep);
  const direction = currentStep > prevStep ? 1 : -1;

  useEffect(() => {
    setPrevStep(currentStep);
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Welcome key="step1" />;
      case 2: return <Step2Routine key="step2" />;
      case 3: return <Step3Bifurcation key="step3" />;
      case 4: return <Step4Placement key="step4" />;
      case 5: return <Step5LiveBooking key="step5" />;
      case 6: return <Step6Finalizing key="step6" />;
      case 7: return <Step7Celebration key="step7" />;
      default: return <Step1Welcome key="fallback" />;
    }
  };

  return (
    <OnboardingLayout>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.35 },
            opacity: { duration: 0.25, ease: "easeOut" },
            scale: { duration: 0.35, ease: "easeOut" },
          }}
          className="w-full"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  );
}
