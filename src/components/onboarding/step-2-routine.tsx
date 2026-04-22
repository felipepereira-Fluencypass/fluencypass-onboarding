'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore, type FluencypassLevel } from '@/store/use-onboarding-store';
import {
  Label, Slider, CycleIcon, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Badge, Button, Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, ScrollArea,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from '@fluencypassdevs/cycle';
import { Lightbulb, ChevronDown, Sparkles, ArrowRight, CheckCircle2, AlertTriangle } from '@fluencypassdevs/cycle/icons/lucide';
import { cn } from '@fluencypassdevs/cycle/lib/utils';
import { buildProgression, daysToNextLevel, formatDays, LEVEL_COMPETENCIES } from '@/lib/level-progression';

const STUDY_HOURS = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

function resolveStartLevel(theoreticalLevel: FluencypassLevel | null, placementStrategy: 'skip' | 'discover' | null): FluencypassLevel {
  if (placementStrategy === 'skip' || theoreticalLevel === null) return 'Beginner 1';
  return theoreticalLevel;
}

export function Step2Routine() {
  const {
    studyDays, studyTimeMinutes, preferredStudyTime, timezone,
    theoreticalLevel, placementStrategy,
    setStudyDays, setStudyTime, setPreferredStudyTime, showTimeHighlight,
  } = useOnboardingStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [progressionOpen, setProgressionOpen] = useState(false);

  const daysOfWeek = [
    { value: 'DOM', label: 'D', full: 'Domingo' },
    { value: 'SEG', label: 'S', full: 'Segunda-feira' },
    { value: 'TER', label: 'T', full: 'Terça-feira' },
    { value: 'QUA', label: 'Q', full: 'Quarta-feira' },
    { value: 'QUI', label: 'Q', full: 'Quinta-feira' },
    { value: 'SEX', label: 'S', full: 'Sexta-feira' },
    { value: 'SAB', label: 'S', full: 'Sábado' },
  ];

  useEffect(() => {
    if (studyDays.length === 0) {
      setStudyDays(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);
      setStudyTime(45);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLevel = resolveStartLevel(theoreticalLevel, placementStrategy);
  const progression = buildProgression(startLevel, studyTimeMinutes, studyDays.length);
  const nextStage = progression[0];
  const hasValidPace = studyDays.length > 0 && studyTimeMinutes > 0;
  const isIntensePace = studyTimeMinutes >= 90 && studyDays.length >= 6;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 lg:gap-8 animate-fade-in-up py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
          Quanto tempo você pode estudar?
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
          A gente recomenda 45 min, 5 vezes por semana. Mas escolha o ritmo que cabe na sua vida. Abaixo você vê onde chega em cada opção.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Schedule card */}
        <div className="order-1 lg:order-1 flex flex-col">
          <div className="bg-card border border-border rounded-2xl p-5 lg:p-7 space-y-5 lg:space-y-7 flex-1">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg text-foreground">Seu ritmo</h3>
            </div>

            {/* Study time slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-sm">Minutos por dia</Label>
                <div className="flex items-center gap-2">
                  {studyTimeMinutes === 45 && <span className="theme-positive"><Badge variant="muted" size="sm">Recomendado</Badge></span>}
                  <span className="theme-brand text-primary font-bold text-xl">{studyTimeMinutes} min</span>
                </div>
              </div>
              <div className="theme-brand">
                <Slider
                  value={[studyTimeMinutes]}
                  min={15}
                  max={120}
                  step={15}
                  onValueChange={(val) => setStudyTime(val[0])}
                  aria-label="Minutos por dia"
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15 min</span>
                <span>120 min</span>
              </div>
            </div>

            {/* Preferred study time */}
            <div className="space-y-3">
              <Label className={cn("font-semibold text-sm", showTimeHighlight && !preferredStudyTime && "text-destructive")}>
                Melhor horário pra estudar
              </Label>

              <div className="hidden lg:block">
                <Select value={preferredStudyTime} onValueChange={(val) => {
                  setPreferredStudyTime(val);
                  useOnboardingStore.setState({ showTimeHighlight: false });
                }}>
                  <SelectTrigger className={cn(
                    "w-full h-12 text-base px-4",
                    showTimeHighlight && !preferredStudyTime && "ring-2 ring-destructive border-destructive"
                  )}>
                    <SelectValue placeholder="Selecionar horário" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-72">
                    {STUDY_HOURS.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:hidden">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center justify-between w-full h-12 text-base px-4 rounded-md border bg-background transition-colors",
                        showTimeHighlight && !preferredStudyTime
                          ? "ring-2 ring-destructive border-destructive"
                          : "border-input",
                        preferredStudyTime ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <span>{preferredStudyTime || 'Selecionar horário'}</span>
                      <CycleIcon icon={ChevronDown} size="sm" decorative />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Melhor horário pra estudar</DrawerTitle>
                    </DrawerHeader>
                    <ScrollArea className="h-72 px-4 pb-6">
                      <div className="flex flex-col">
                        {STUDY_HOURS.map(h => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              setPreferredStudyTime(h);
                              useOnboardingStore.setState({ showTimeHighlight: false });
                              setDrawerOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 text-base rounded-lg transition-colors",
                              preferredStudyTime === h
                                ? "theme-brand bg-primary/10 text-primary font-semibold"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span>Fuso horário:</span>
              <select
                value={timezone}
                onChange={(e) => useOnboardingStore.setState({ timezone: e.target.value })}
                className="bg-transparent text-sm font-medium text-foreground cursor-pointer hover:text-foreground transition-colors border-none outline-none"
              >
                <option value="America/Sao_Paulo">Brasília (BRT)</option>
                <option value="America/Manaus">Manaus (AMT)</option>
                <option value="Europe/Lisbon">Lisboa (WET)</option>
                <option value="America/New_York">Nova York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Days + forecast */}
        <div className="order-2 lg:order-2 flex flex-col gap-5 lg:gap-6">
          {/* Day selector */}
          <div className="space-y-4 lg:space-y-5 lg:pt-7">
            <Label className="font-semibold text-base lg:text-lg">Em quais dias?</Label>
            <div className="flex justify-between gap-1.5 lg:gap-0 w-full" role="group">
              {daysOfWeek.map((day, index) => {
                const isActive = studyDays.includes(day.value);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isActive) setStudyDays(studyDays.filter(d => d !== day.value));
                      else setStudyDays([...studyDays, day.value]);
                    }}
                    aria-pressed={isActive}
                    aria-label={day.full}
                    className={cn(
                      "flex items-center justify-center rounded-full w-10 h-10 lg:w-12 lg:h-12 font-semibold text-sm lg:text-base transition-all border-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? 'theme-brand bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent text-foreground border-border hover:bg-muted'
                    )}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {studyDays.length === 5 && ['SEG','TER','QUA','QUI','SEX'].every(d => studyDays.includes(d)) && (
              <span className="theme-positive"><Badge variant="muted" size="sm">Seg a Sex, recomendado</Badge></span>
            )}
          </div>

          {/* Forecast card */}
          <div className="mt-auto">
            {hasValidPace && nextStage ? (
              <div className="rounded-2xl border border-blue-200/70 bg-blue-50/60 p-5 lg:p-6 space-y-4 dark:border-blue-500/20 dark:bg-blue-500/5">
                <div className="flex items-start gap-3">
                  <div className="theme-class shrink-0 bg-primary/10 text-primary p-2 rounded-xl">
                    <CycleIcon icon={Sparkles} size="sm" decorative />
                  </div>
                  <div className="space-y-1">
                    <p className="theme-class text-xs font-semibold text-primary uppercase tracking-wide">Sua projeção</p>
                    <p className="text-base lg:text-lg text-foreground leading-snug">
                      Neste ritmo, em <span className="theme-class text-primary font-bold">{formatDays(nextStage.cumulativeDays)}</span> você chega no <span className="font-bold">{nextStage.level}</span>.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Em {formatDays(nextStage.cumulativeDays)} você vai saber:</p>
                  <ul className="space-y-1.5">
                    {nextStage.competencies.slice(0, 3).map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="theme-class text-primary mt-0.5 shrink-0">
                          <CycleIcon icon={CheckCircle2} size="xs" decorative />
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isIntensePace && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                    <CycleIcon icon={AlertTriangle} size="xs" decorative className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Gostamos do pique!</span> Só um lembrete: ritmo alto todo dia costuma cansar depois de um mês. Se sentir que tá pesado, dá pra diminuir aqui mesmo.
                    </p>
                  </div>
                )}

                <Dialog open={progressionOpen} onOpenChange={setProgressionOpen}>
                  <DialogTrigger asChild>
                    <div className="theme-class">
                      <Button variant="ghost" size="sm" className="w-full justify-between text-primary hover:bg-primary/10">
                        <span>Ver evolução completa</span>
                        <CycleIcon icon={ArrowRight} size="xs" decorative />
                      </Button>
                    </div>
                  </DialogTrigger>
                  <ProgressionDialogContent
                    startLevel={startLevel}
                    minutesPerDay={studyTimeMinutes}
                    daysPerWeek={studyDays.length}
                    onChangeMinutes={setStudyTime}
                    onToggleDay={(value) => {
                      if (studyDays.includes(value)) setStudyDays(studyDays.filter(d => d !== value));
                      else setStudyDays([...studyDays, value]);
                    }}
                    studyDays={studyDays}
                    daysOfWeek={daysOfWeek}
                  />
                </Dialog>
              </div>
            ) : (
              <div className="theme-class rounded-xl border border-primary/20 bg-primary/5 p-4 lg:p-5 flex gap-3 lg:gap-4">
                <div className="shrink-0 mt-0.5 text-primary">
                  <CycleIcon icon={Lightbulb} size="sm" decorative />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Escolha pelo menos um dia para ver sua projeção de evolução.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProgressionDialogContentProps {
  startLevel: FluencypassLevel;
  minutesPerDay: number;
  daysPerWeek: number;
  onChangeMinutes: (value: number) => void;
  onToggleDay: (value: string) => void;
  studyDays: string[];
  daysOfWeek: Array<{ value: string; label: string; full: string }>;
}

function ProgressionDialogContent({
  startLevel, minutesPerDay, daysPerWeek, onChangeMinutes, onToggleDay, studyDays, daysOfWeek,
}: ProgressionDialogContentProps) {
  const progression = buildProgression(startLevel, minutesPerDay, daysPerWeek);
  const perStep = daysToNextLevel(minutesPerDay, daysPerWeek);

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Sua evolução no curso</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Ajuste o ritmo e veja em quanto tempo você chega em cada nível.
        </p>
      </DialogHeader>

      <div className="flex flex-col gap-5 overflow-hidden flex-1">
        {/* Inline pace controls */}
        <div className="bg-muted/40 rounded-xl p-4 space-y-4 shrink-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Meta diária</Label>
              <span className="theme-brand text-primary font-bold">{minutesPerDay} min</span>
            </div>
            <div className="theme-brand">
              <Slider
                value={[minutesPerDay]}
                min={15}
                max={120}
                step={15}
                onValueChange={(val) => onChangeMinutes(val[0])}
                aria-label="Minutos por dia"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Dias por semana</Label>
            <div className="flex gap-1.5 flex-wrap">
              {daysOfWeek.map((day) => {
                const active = studyDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    onClick={() => onToggleDay(day.value)}
                    aria-pressed={active}
                    aria-label={day.full}
                    className={cn(
                      "flex items-center justify-center rounded-full w-9 h-9 font-semibold text-xs transition-all border-2",
                      active
                        ? 'theme-brand bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent text-foreground border-border hover:bg-muted'
                    )}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Neste ritmo, você conclui 1 nível a cada <span className="font-semibold text-foreground">{formatDays(perStep)}</span>.
          </p>
        </div>

        {/* Progression list */}
        <ScrollArea className="flex-1 pr-3">
          <ol className="relative border-l-2 border-border ml-2 space-y-6 pb-2">
            {progression.map((stage, idx) => (
              <li key={stage.level} className="ml-6 relative">
                <span className={cn(
                  "absolute -left-[35px] top-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                  idx === 0 ? "theme-brand bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {idx + 1}
                </span>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h4 className="font-semibold text-base text-foreground">{stage.level}</h4>
                    <span className="text-sm text-muted-foreground">em {formatDays(stage.cumulativeDays)}</span>
                  </div>
                  <ul className="space-y-1">
                    {LEVEL_COMPETENCIES[stage.level].map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CycleIcon icon={CheckCircle2} size="xs" decorative className="text-primary mt-0.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </div>
    </DialogContent>
  );
}
