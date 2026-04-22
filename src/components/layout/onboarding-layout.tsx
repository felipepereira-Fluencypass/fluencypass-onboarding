'use client';

import React, { useEffect } from 'react';
import { Button, Progress } from '@fluencypassdevs/cycle';
import { FluencypassLogo } from '@fluencypassdevs/cycle';
import { cn } from '@fluencypassdevs/cycle/lib/utils';
import { useOnboardingStore } from '@/store/use-onboarding-store';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

function isValidBirthDate(value: string | null): boolean {
  if (!value || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [d, m, y] = value.split('/').map(Number);
  const now = new Date();
  if (y < 1900 || y > now.getFullYear()) return false;
  if (m < 1 || m > 12) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const {
    currentStep, prevStep, nextStep,
    birthDate, studyObjective,
    studyDays, placementStrategy, liveBookingDate, mentoringMode,
    theoreticalCompleted, practicalCompleted, videoWatched,
  } = useOnboardingStore();

  const hasPersonalData = !!birthDate && !!studyObjective;
  const totalSteps = hasPersonalData ? 7 : 8;
  const progressValue = (currentStep / totalSteps) * 100;

  // Reseta scroll pro topo a cada mudança de step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentStep]);

  const isNextDisabled = (): boolean => {
    switch (currentStep) {
      case 1: return !videoWatched;
      case 2: {
        // O user só está aqui porque algum dado faltava. Exige ambos preenchidos para avançar.
        if (!isValidBirthDate(birthDate)) return true;
        if (studyObjective === null) return true;
        return false;
      }
      case 3: return placementStrategy === null;
      case 4: return placementStrategy === 'discover' && !(theoreticalCompleted && practicalCompleted);
      case 5: return studyDays.length === 0;
      case 6: return liveBookingDate === null && mentoringMode === null;
      case 7: return true;
      case 8: return true;
      default: return false;
    }
  };

  const showFooter = currentStep < 7;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top bar: clean progress */}
      <header className="fixed top-0 w-full z-10 bg-background/80 backdrop-blur-md">
        <div className="theme-brand">
          <Progress value={progressValue} className="h-1 rounded-none" />
        </div>
        <div className="flex items-center justify-center px-6 py-3 lg:py-5 max-w-5xl mx-auto">
          <FluencypassLogo className="h-10 lg:h-12 text-foreground" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-start lg:justify-center px-6 lg:px-16 mt-20 lg:mt-16 pb-20 lg:pb-28 w-full overflow-x-hidden">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer: navigation (steps 1-6) */}
      {showFooter && (
        <footer className="fixed bottom-0 w-full bg-background/95 backdrop-blur-md border-t border-border p-4 z-10">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn(
                currentStep === 1 ? 'invisible' : '',
                'lg:flex-none flex-1'
              )}
            >
              Voltar
            </Button>

            <Button
              onClick={nextStep}
              className="min-w-36 theme-brand lg:flex-none flex-1"
              disabled={isNextDisabled()}
            >
              Continuar
            </Button>
          </div>
        </footer>
      )}

      {/* Footer: Step 8 Celebration CTA (mobile only, fixed) */}
      {currentStep === 8 && (
        <footer className="fixed bottom-0 w-full bg-background/95 backdrop-blur-md border-t border-border p-4 z-10 lg:hidden">
          <div className="max-w-5xl mx-auto">
            <div className="theme-brand">
              <Button
                size="lg"
                className="w-full"
                onClick={() => { window.location.href = 'https://fluencypass.com/account'; }}
              >
                Começar agora
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
