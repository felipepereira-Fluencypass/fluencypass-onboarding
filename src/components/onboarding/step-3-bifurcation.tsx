'use client';

import React from 'react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { SelectableCard } from '@/components/composites/selectable-card';
import { CycleIcon } from '@fluencypassdevs/cycle';
import { GraduationCap, TrendingUp } from '@fluencypassdevs/cycle/icons/lucide';

export function Step3Bifurcation() {
  const { placementStrategy, setPlacementStrategy } = useOnboardingStore();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-6 lg:gap-8 animate-fade-in-up py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
          Você já teve contato com inglês antes?
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
          Sua resposta define onde o curso começa. Sem certo ou errado.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <SelectableCard
          selected={placementStrategy === 'discover'}
          onSelect={() => setPlacementStrategy('discover')}
          title="Já sei alguma coisa"
          description="Quero fazer um teste rápido pra pular o que já sei."
          badge="Recomendado"
          icon={<CycleIcon icon={TrendingUp} size="sm" decorative />}
        />

        <SelectableCard
          selected={placementStrategy === 'skip'}
          onSelect={() => setPlacementStrategy('skip')}
          title="Estou começando do zero"
          description="Nunca estudei, ou estudei e esqueci. Quero começar do começo, sem atalho."
          icon={<CycleIcon icon={GraduationCap} size="sm" decorative />}
        />
      </div>
    </div>
  );
}
