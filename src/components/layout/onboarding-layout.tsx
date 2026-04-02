'use client';

import React from 'react';
import { Button, Progress } from '@fluencypassdevs/cycle';
import { FluencypassLogo } from '@fluencypassdevs/cycle';
import { useOnboardingStore } from '@/store/use-onboarding-store';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const {
    currentStep, prevStep, nextStep,
    studyDays, placementStrategy, liveBookingDate, mentoringMode,
    theoreticalCompleted, practicalCompleted, videoWatched,
  } = useOnboardingStore();

  const progressValue = (currentStep / 7) * 100;

  const isNextDisabled = (): boolean => {
    switch (currentStep) {
      case 2: return studyDays.length === 0;
      case 3: return placementStrategy === null;
      case 4: return placementStrategy === 'discover' && !(theoreticalCompleted && practicalCompleted);
      case 5: return liveBookingDate === null && mentoringMode === null;
      case 6: return true;
      case 7: return true;
      case 1: return !videoWatched;
      default: return false;
    }
  };

  const showFooter = currentStep < 6;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top bar — clean progress */}
      <header className="fixed top-0 w-full z-10 bg-background/80 backdrop-blur-md">
        <div className="theme-brand">
          <Progress value={progressValue} className="h-1 rounded-none" />
        </div>
        <div className="flex items-center justify-center px-6 py-5 max-w-5xl mx-auto">
          <FluencypassLogo className="h-12 text-foreground" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-16 mt-16 pb-28 w-full">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="fixed bottom-0 w-full bg-background/95 backdrop-blur-md border-t border-border p-4 z-10">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={currentStep === 1 ? 'invisible' : ''}
            >
              Voltar
            </Button>

            <Button
              onClick={nextStep}
              className="min-w-36 theme-brand"
              disabled={isNextDisabled()}
            >
              Continuar
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
