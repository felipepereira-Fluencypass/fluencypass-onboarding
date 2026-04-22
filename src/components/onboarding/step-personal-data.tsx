'use client';

import { useState } from 'react';
import { useOnboardingStore, type StudyObjective } from '@/store/use-onboarding-store';
import { Input, Label, CycleIcon } from '@fluencypassdevs/cycle';
import { Heart, Briefcase, Film, Globe, Plane, MoreHorizontal, type LucideIcon } from '@fluencypassdevs/cycle/icons/lucide';
import { SelectableCard } from '@/components/composites/selectable-card';

function maskBirthDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

const OBJECTIVES: Array<{ value: StudyObjective; title: string; icon: LucideIcon }> = [
  { value: 'personal', title: 'Aprendizado e realização pessoal', icon: Heart },
  { value: 'professional', title: 'Crescimento profissional', icon: Briefcase },
  { value: 'entertainment', title: 'Entretenimento ou cultura', icon: Film },
  { value: 'abroad', title: 'Estudar e/ou morar no exterior', icon: Globe },
  { value: 'travel', title: 'Viagem ou turismo', icon: Plane },
  { value: 'other', title: 'Outros', icon: MoreHorizontal },
];

export function StepPersonalData() {
  const { birthDate, studyObjective, setBirthDate, setStudyObjective } = useOnboardingStore();

  // Captura quais campos estavam faltando na montagem. Não muda quando o user preenche.
  const [showBirthDate] = useState(() => birthDate === null);
  const [showObjective] = useState(() => studyObjective === null);

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(maskBirthDate(e.target.value));
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 lg:gap-8 animate-fade-in-up py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
          Queremos te conhecer melhor.
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
          Com o tempo, suas respostas ajudam a gente a trazer coisas relevantes pro seu momento e objetivo.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:gap-6">
        {/* Birth date card */}
        {showBirthDate && (
          <div className="rounded-2xl border border-border bg-card p-5 lg:p-7 space-y-4 lg:space-y-5">
            <div className="space-y-1">
              <h3 className="font-semibold text-base lg:text-lg text-foreground">Quando você nasceu?</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="sr-only">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="DD/MM/AAAA"
                value={birthDate ?? ''}
                onChange={handleBirthDateChange}
                autoComplete="off"
                className="max-w-xs"
              />
            </div>
          </div>
        )}

        {/* Objective card */}
        {showObjective && (
          <div className="rounded-2xl border border-border bg-card p-5 lg:p-7 space-y-4 lg:space-y-5">
            <div className="space-y-1">
              <h3 className="font-semibold text-base lg:text-lg text-foreground">O que te trouxe aqui?</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OBJECTIVES.map((opt) => (
                <SelectableCard
                  key={opt.value}
                  selected={studyObjective === opt.value}
                  onSelect={() => setStudyObjective(opt.value)}
                  title={opt.title}
                  icon={<CycleIcon icon={opt.icon} size="sm" decorative />}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
