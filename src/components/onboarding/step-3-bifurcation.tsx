'use client';

import React from 'react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { SelectableCard } from '@/components/composites/selectable-card';
import { CycleIcon } from '@fluencypassdevs/cycle';
import { GraduationCap, TrendingUp } from '@fluencypassdevs/cycle/icons/lucide';

export function Step3Bifurcation() {
  const { placementStrategy, setPlacementStrategy } = useOnboardingStore();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8 animate-fade-in-up py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Sua trilha, suas regras
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Escolha como quer começar para recomendarmos o melhor caminho para você.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <SelectableCard
          selected={placementStrategy === 'discover'}
          onSelect={() => setPlacementStrategy('discover')}
          title="Já tenho algum conhecimento"
          description="Quero descobrir meu nível atual para pular o que já sei e focar no que importa."
          badge="Recomendado"
          icon={<CycleIcon icon={TrendingUp} size="sm" decorative />}
        />

        <SelectableCard
          selected={placementStrategy === 'skip'}
          onSelect={() => setPlacementStrategy('skip')}
          title="Vou construir minha base do zero"
          description="Nunca estudei inglês ou sei muito pouco. Quero dar meus primeiros passos com segurança."
          icon={<CycleIcon icon={GraduationCap} size="sm" decorative />}
        />
      </div>
    </div>
  );
}
