'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Label, Slider, CycleIcon, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge, Button, Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, ScrollArea } from '@fluencypassdevs/cycle';
import { Lightbulb, ChevronDown } from '@fluencypassdevs/cycle/icons/lucide';
import { cn } from '@fluencypassdevs/cycle/lib/utils';

const STUDY_HOURS = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

export function Step2Routine() {
  const {
    studyDays, studyTimeMinutes, preferredStudyTime, timezone,
    setStudyDays, setStudyTime, setPreferredStudyTime, showTimeHighlight,
  } = useOnboardingStore();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const daysOfWeek = [
    { value: 'DOM', label: 'D', full: 'Domingo' },
    { value: 'SEG', label: 'S', full: 'Segunda-feira' },
    { value: 'TER', label: 'T', full: 'Terça-feira' },
    { value: 'QUA', label: 'Q', full: 'Quarta-feira' },
    { value: 'QUI', label: 'Q', full: 'Quinta-feira' },
    { value: 'SEX', label: 'S', full: 'Sexta-feira' },
    { value: 'SAB', label: 'S', full: 'Sábado' },
  ];

  // Pre-apply Fluencypass recommendation on first visit
  useEffect(() => {
    if (studyDays.length === 0) {
      setStudyDays(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);
      setStudyTime(45);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 lg:gap-8 animate-fade-in-up py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
          Defina seu ritmo de estudo
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
          Preparamos nossa recomendação de estudo para acelerar sua fluência, mas fique à vontade para ajustar do seu jeito.
        </p>
      </div>

      {/* Grid: Schedule card (left on desktop) | Days + tip (right on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Schedule card — first on mobile, left on desktop */}
        <div className="order-1 lg:order-1 flex flex-col">
          <div className="bg-card border border-border rounded-2xl p-5 lg:p-7 space-y-5 lg:space-y-7 flex-1">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg text-foreground">Configure sua rotina</h3>
              <p className="text-sm text-muted-foreground">Tempo e horário ideal para seus estudos.</p>
            </div>

            {/* Study time slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-sm">Meta diária</Label>
                <div className="flex items-center gap-2">
                  {studyTimeMinutes === 45 && <span className="theme-positive"><Badge variant="muted" size="sm">Recomendado</Badge></span>}
                  <span className="theme-brand text-primary font-bold text-xl">{studyTimeMinutes} min</span>
                </div>
              </div>
              <div className="theme-brand">
                <Slider
                  defaultValue={[studyTimeMinutes]}
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
                Horário que deseja estudar
              </Label>

              {/* Desktop: Select dropdown */}
              <div className="hidden lg:block">
                <Select value={preferredStudyTime} onValueChange={(val) => {
                  setPreferredStudyTime(val);
                  useOnboardingStore.setState({ showTimeHighlight: false });
                }}>
                  <SelectTrigger className={cn(
                    "w-full h-12 text-base px-4",
                    showTimeHighlight && !preferredStudyTime && "ring-2 ring-destructive border-destructive"
                  )}>
                    <SelectValue placeholder="Escolha o horário desejado" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-72">
                    {STUDY_HOURS.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile: Drawer bottom sheet */}
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
                      <span>{preferredStudyTime || 'Escolha o horário desejado'}</span>
                      <CycleIcon icon={ChevronDown} size="sm" decorative />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Horário que deseja estudar</DrawerTitle>
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

            {/* Timezone */}
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

        {/* Days + study tip — second on mobile, right on desktop */}
        <div className="order-2 lg:order-2 flex flex-col">
          {/* Day selector */}
          <div className="space-y-4 lg:space-y-5 lg:pt-7">
            <Label className="font-semibold text-base lg:text-lg">Em quais dias você vai estudar?</Label>
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
              <span className="theme-positive"><Badge variant="muted" size="sm">Seg a Sex — Recomendado</Badge></span>
            )}
          </div>

          {/* Study tip — last on mobile, aligned to bottom on desktop */}
          <div className="theme-class mt-auto pt-4 lg:pt-6 lg:pb-7">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 lg:p-5 flex gap-3 lg:gap-4">
              <div className="shrink-0 mt-0.5 text-primary">
                <CycleIcon icon={Lightbulb} size="sm" decorative />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary">Dica Fluencypass</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O segredo da fluência não é estudar muitas horas por dia, mas manter uma frequência consistente. Poucos minutos todos os dias valem mais do que uma maratona no fim de semana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
