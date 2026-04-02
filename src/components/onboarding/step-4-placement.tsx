'use client';

import React, { useState } from 'react';
import { Button, Badge, ProgressStage, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, CycleIcon, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@fluencypassdevs/cycle';
import { Mic, BookOpen } from '@fluencypassdevs/cycle/icons/lucide';
import { cn } from '@fluencypassdevs/cycle/lib/utils';
import { useOnboardingStore, FLUENCYPASS_LEVELS } from '@/store/use-onboarding-store';
import type { FluencypassLevel } from '@/store/use-onboarding-store';

function simulateTestResult(): FluencypassLevel {
  const randomIndex = Math.floor(Math.random() * 6) + 2;
  return FLUENCYPASS_LEVELS[randomIndex];
}

const CEFR_STAGES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

function getCefrStage(level: FluencypassLevel): number {
  const index = FLUENCYPASS_LEVELS.indexOf(level);
  if (index <= 1) return 1;
  if (index <= 3) return 2;
  if (index <= 5) return 3;
  if (index <= 7) return 4;
  if (index <= 9) return 5;
  return 6;
}

function getCefrLabel(level: FluencypassLevel): string {
  const index = FLUENCYPASS_LEVELS.indexOf(level);
  if (index <= 1) return 'A1';
  if (index <= 3) return 'A2';
  if (index <= 5) return 'B1';
  if (index <= 7) return 'B2';
  if (index <= 9) return 'C1';
  return 'C2';
}

const CEFR_DESCRIPTORS: Record<string, string[]> = {
  'A1': [
    'Compreender e usar expressões familiares do dia a dia para necessidades básicas',
    'Apresentar-se e fazer perguntas simples sobre temas pessoais',
    'Interagir com outras pessoas de forma simples, desde que falem devagar',
  ],
  'A2': [
    'Entender frases e vocabulário frequente sobre temas do cotidiano',
    'Descrever sua rotina, formação e ambiente de forma direta',
    'Comunicar-se em situações simples que exijam troca de informações',
  ],
  'B1': [
    'Entender os pontos principais de assuntos do trabalho, escola e lazer',
    'Lidar com a maioria das situações em viagens onde a língua é falada',
    'Produzir textos simples sobre temas conhecidos e descrever experiências',
  ],
  'B2': [
    'Entender as ideias principais de textos complexos sobre temas concretos e abstratos',
    'Interagir com fluência e naturalidade com falantes nativos',
    'Produzir textos claros e detalhados sobre diversos assuntos',
  ],
  'C1': [
    'Compreender textos longos e exigentes, reconhecendo significados implícitos',
    'Expressar-se de forma fluente e espontânea em contextos sociais e profissionais',
    'Produzir textos bem estruturados sobre temas complexos com domínio de articulação',
  ],
  'C2': [
    'Compreender com facilidade praticamente tudo o que lê ou ouve',
    'Resumir informações de diversas fontes, reconstruindo argumentos de forma coerente',
    'Expressar-se com precisão, diferenciando nuances de significado em qualquer situação',
  ],
};

interface TestCardProps {
  title: string;
  subtitle: string;
  description: string;
  impactLabel: string;
  impactDescription: string;
  skills: string[];
  duration: string;
  isCompleted: boolean;
  level: FluencypassLevel | null;
  onStart: () => void;
  icon: React.ReactNode;
  showPreparation?: boolean;
}

function TestCard({ title, subtitle, description, impactLabel, impactDescription, skills, duration, isCompleted, level, onStart, icon, showPreparation }: TestCardProps) {
  const [prepOpen, setPrepOpen] = useState(false);

  const handleButtonClick = () => {
    if (showPreparation) {
      setPrepOpen(true);
    } else {
      onStart();
    }
  };

  const handleStartAfterPrep = () => {
    setPrepOpen(false);
    onStart();
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col rounded-2xl border-2 transition-all h-full",
          isCompleted
            ? "theme-positive border-primary bg-primary/[0.04] p-6"
            : "border-border bg-card p-6"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-xl bg-primary/10 text-primary", !isCompleted && "theme-brand")}>
              {icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-lg text-foreground">{title}</h3>
              <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          {isCompleted ? (
            <Badge variant="success" className="shrink-0">Concluído</Badge>
          ) : (
            <Badge variant="muted" size="sm" className="shrink-0">{duration}</Badge>
          )}
        </div>

        {/* Before test */}
        {!isCompleted && (
          <div className="flex flex-col flex-1 gap-5">
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            {/* Skills */}
            <div className="grid grid-cols-2 gap-2.5">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs">●</span>
                  <span className="text-muted-foreground font-medium">{skill}</span>
                </div>
              ))}
            </div>

            {/* Impact highlight */}
            <div className="border border-border bg-muted/50 rounded-xl px-5 py-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{impactLabel}</p>
              <p className="text-sm font-medium text-foreground leading-relaxed">{impactDescription}</p>
            </div>

            {/* Button */}
            <div className="mt-auto">
              <Button className="w-full" onClick={handleButtonClick}>
                Iniciar teste
              </Button>
            </div>
          </div>
        )}

        {/* After test — CEFR feedback */}
        {isCompleted && level && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-1">Seu nível</p>
              <p className="text-3xl font-bold text-primary">
                {getCefrLabel(level)} — {level}
              </p>
            </div>

            <div className="space-y-2">
              <ProgressStage stages={6} value={getCefrStage(level)} size="sm" />
              <div className="flex justify-between px-1">
                {CEFR_STAGES.map((label) => (
                  <span key={label} className={cn(
                    "text-xs font-medium",
                    label === getCefrLabel(level) ? "text-primary font-bold" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                O que você vai aprender
              </p>
              <ul className="space-y-1.5">
                {CEFR_DESCRIPTORS[getCefrLabel(level)]?.map((desc) => (
                  <li key={desc} className="flex items-start gap-2 text-sm text-neutral-900 leading-relaxed">
                    <span className="text-neutral-900 mt-1 text-xs">●</span>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Preparation dialog for practical test */}
      {showPreparation && (
        <Dialog open={prepOpen} onOpenChange={setPrepOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Antes de iniciar o teste prático</DialogTitle>
              <DialogDescription>
                Para uma avaliação precisa da sua pronúncia, siga estas recomendações:
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="flex items-start gap-3">
                <span className="theme-brand text-primary font-bold text-lg">1</span>
                <div>
                  <p className="font-medium text-foreground">Ambiente silencioso</p>
                  <p className="text-sm text-muted-foreground">Evite ruídos de fundo para a IA captar sua voz com clareza.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="theme-brand text-primary font-bold text-lg">2</span>
                <div>
                  <p className="font-medium text-foreground">Use fones de ouvido</p>
                  <p className="text-sm text-muted-foreground">Melhora a qualidade do áudio captado pelo microfone.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="theme-brand text-primary font-bold text-lg">3</span>
                <div>
                  <p className="font-medium text-foreground">Fale naturalmente</p>
                  <p className="text-sm text-muted-foreground">Não se preocupe com erros — o objetivo é avaliar seu nível atual.</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="theme-brand w-full">
                <Button className="w-full" onClick={handleStartAfterPrep}>
                  Continuar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export function Step4Placement() {
  const {
    theoreticalCompleted, practicalCompleted,
    theoreticalLevel, practicalLevel,
    setTheoreticalLevel, setPracticalLevel,
    nextStep,
  } = useOnboardingStore();

  const handleTheoreticalTest = () => {
    setTimeout(() => {
      setTheoreticalLevel(simulateTestResult());
    }, 1500);
  };

  const handlePracticalTest = () => {
    setTimeout(() => {
      setPracticalLevel(simulateTestResult());
    }, 1500);
  };

  const [skipDialogOpen, setSkipDialogOpen] = useState(false);

  const handleConfirmSkip = () => {
    setSkipDialogOpen(false);
    nextStep();
  };

  const bothCompleted = theoreticalCompleted && practicalCompleted;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-8 animate-fade-in-up py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Vamos descobrir seu nível
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Nosso curso segue o{' '}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-semibold text-foreground underline decoration-dotted underline-offset-4 cursor-help">CEFR</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm">
                O CEFR é o Quadro Comum Europeu de Referência para Línguas, uma escala de A1 (iniciante) a C2 (fluente) usada por universidades, empresas e certificações como IELTS e TOEFL.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          , o padrão internacional de fluência. O nivelamento define em qual módulo você começa, assim você pula o que já sabe e foca no que realmente importa.
        </p>
      </div>

      {/* Two test cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TestCard
          title="Nivelamento Teórico"
          subtitle="Conhecimento gramatical"
          description="Avalia sua compreensão de gramática, vocabulário, leitura e escrita. Mesmo quem consome muito conteúdo em inglês pode ter lacunas aqui."
          impactLabel="Impacto no seu curso"
          impactDescription="Define o nível das suas videoaulas e exercícios (Class)."
          skills={['Gramática', 'Vocabulário', 'Leitura', 'Escrita']}
          duration="~10-15 min"
          isCompleted={theoreticalCompleted}
          level={theoreticalLevel}
          onStart={handleTheoreticalTest}
          icon={<CycleIcon icon={BookOpen} size="sm" decorative />}
        />

        <TestCard
          title="Nivelamento Prático"
          subtitle="Habilidade de conversação"
          description="Avalia sua pronúncia, ritmo de fala e entonação com IA (ELSA Speak). É comum ter um nível prático diferente do teórico — isso é perfeitamente normal."
          impactLabel="Impacto no seu curso"
          impactDescription="Define o nível das suas conversações (GroupTalk e PrivateTalk)."
          skills={['Pronúncia', 'Ritmo de fala', 'Escuta ativa', 'Entonação']}
          duration="~5-10 min"
          isCompleted={practicalCompleted}
          level={practicalLevel}
          onStart={handlePracticalTest}
          icon={<CycleIcon icon={Mic} size="sm" decorative />}
          showPreparation
        />
      </div>

      {/* Skip option */}
      {!bothCompleted && (
        <>
          <button
            onClick={() => setSkipDialogOpen(true)}
            className="mx-auto text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            Prefiro fazer o nivelamento depois
          </button>

          <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tudo bem, sem pressa!</DialogTitle>
                <DialogDescription>
                  Entendemos que agora pode não ser o melhor momento. Veja o que acontece:
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="flex items-start gap-3">
                  <span className="theme-brand text-primary font-bold text-lg">1</span>
                  <p className="text-sm text-foreground leading-relaxed">
                    Seu curso será configurado para o nível <strong>Beginner 1</strong> (iniciante).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="theme-brand text-primary font-bold text-lg">2</span>
                  <p className="text-sm text-foreground leading-relaxed">
                    Quando fizer o nivelamento, a plataforma será ajustada automaticamente para o seu nível real.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="theme-brand text-primary font-bold text-lg">3</span>
                  <p className="text-sm text-foreground leading-relaxed">
                    O teste estará disponível na <strong>tela inicial</strong> do curso, sempre que quiser.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex gap-3">
                <Button variant="outline" onClick={() => setSkipDialogOpen(false)}>
                  Cancelar
                </Button>
                <div className="theme-brand">
                  <Button onClick={handleConfirmSkip}>
                    Confirmar e continuar
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}


      {/* Completion */}
      {bothCompleted && (
        <div className="theme-positive text-center p-5 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in-up">
          <p className="font-semibold text-foreground">
            Seus dois nivelamentos foram concluídos.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em &quot;Continuar&quot; para seguir.
          </p>
        </div>
      )}
    </div>
  );
}
