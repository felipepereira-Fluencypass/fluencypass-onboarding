'use client';

import React, { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Progress, CycleIcon } from '@fluencypassdevs/cycle';
import { CalendarDays, BarChart3, GraduationCap, Sparkles } from '@fluencypassdevs/cycle/icons/lucide';

function buildSteps(theoreticalLevel: string | null, practicalLevel: string | null) {
  const steps = [
    { text: 'Salvando seus horários...', icon: CalendarDays },
  ];

  if (theoreticalLevel && practicalLevel) {
    steps.push({ text: 'Ajustando seu nível...', icon: BarChart3 });
  }

  steps.push({ text: 'Organizando aulas e conversações...', icon: GraduationCap });
  steps.push({ text: 'Quase lá...', icon: Sparkles });

  return steps;
}

export function Step6Finalizing() {
  const {
    studyDays, studyTimeMinutes, preferredStudyTime, timezone,
    placementStrategy, liveBookingDate, mentoringMode,
    theoreticalLevel, practicalLevel,
    nextStep,
  } = useOnboardingStore();

  const steps = buildSteps(theoreticalLevel, practicalLevel);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    const submitOnboarding = async () => {
      const payload = {
        studyDays,
        studyTimeMinutes,
        preferredStudyTime,
        timezone,
        placementStrategy,
        theoreticalLevel,
        practicalLevel,
        liveBookingDate,
        mentoringMode,
      };

      console.log('Finalizing Onboarding Payload:', payload);
      await new Promise(resolve => setTimeout(resolve, 6000));
      nextStep();
    };

    submitOnboarding();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const totalDuration = 6000;
    const stepDuration = totalDuration / steps.length;

    const stepInterval = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setCurrentStepIndex((prev) => {
          const next = prev + 1;
          return next < steps.length ? next : prev;
        });
        setTextVisible(true);
      }, 200);
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgressValue((prev) => {
        const increment = 100 / (totalDuration / 50);
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[50vh] lg:min-h-[60vh] text-center gap-6 lg:gap-8 animate-fade-in-up">
      <div
        className="theme-brand text-primary transition-opacity duration-200"
        style={{ opacity: textVisible ? 1 : 0 }}
      >
        <CycleIcon icon={steps[currentStepIndex].icon} size="lg" decorative />
      </div>

      <div className="space-y-3 min-h-[80px] flex flex-col items-center justify-center">
        <h2
          className="text-2xl font-semibold tracking-tight text-foreground transition-opacity duration-200"
          style={{ opacity: textVisible ? 1 : 0 }}
        >
          {steps[currentStepIndex].text}
        </h2>
        <p className="text-muted-foreground text-base max-w-sm mx-auto">
          Ajustando a plataforma pra você
        </p>
      </div>

      <div className="w-full max-w-xs theme-brand">
        <Progress value={progressValue} className="h-1.5" />
      </div>
    </div>
  );
}
