'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Button, VideoPlayer, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@fluencypassdevs/cycle';
import { CycleIcon } from '@fluencypassdevs/cycle';
import { Clock, Calendar, CircleCheck } from '@fluencypassdevs/cycle/icons/lucide';

function buildGoogleCalendarUrl(date: string): string {
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Mentoria de Boas-vindas Fluencypass',
    dates: `${format(startDate)}/${format(endDate)}`,
    details: 'Sua mentoria de boas-vindas personalizada com a equipe Fluencypass.',
    location: 'Online (link enviado por e-mail)',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

type ViewState = 'choosing' | 'confirmed' | 'recorded';

export function Step5LiveBooking() {
  const { setLiveBookingDate, setMentoringMode, nextStep } = useOnboardingStore();
  const [viewState, setViewState] = useState<ViewState>('choosing');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);

  const availableDates = [
    { id: '2026-04-02T19:00', label: 'Terça, 02 de Abril — 19h00' },
    { id: '2026-04-04T19:00', label: 'Quinta, 04 de Abril — 19h00' },
    { id: '2026-04-05T19:00', label: 'Sexta, 05 de Abril — 19h00' },
  ];

  const handleSelectDate = (dateId: string, label: string) => {
    setLiveBookingDate(dateId);
    setSelectedLabel(label);
    setMentoringMode('live');
    window.open(buildGoogleCalendarUrl(dateId), '_blank');
    setViewState('confirmed');
  };

  const handleWatchRecorded = () => {
    setMentoringMode('recorded');
    setLiveBookingDate('recorded');
    window.open('https://pub-457a0052e8424c87924878ef99fd9914.r2.dev/onboarding/video.mp4', '_blank');
    setSkipDialogOpen(false);
    nextStep();
  };

  const handleSkipMentoring = () => {
    setMentoringMode('recorded');
    setLiveBookingDate('skipped');
    setSkipDialogOpen(false);
    nextStep();
  };

  const handleContinue = () => {
    nextStep();
  };

  if (viewState === 'recorded') {
    return (
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-8 animate-fade-in-up py-4 lg:py-8">
        <div className="space-y-3 text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Mentoria gravada
          </h2>
          <p className="text-muted-foreground text-lg">
            Assista no seu próprio ritmo — o conteúdo é o mesmo da sessão ao vivo.
          </p>
        </div>
        <div className="w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-border">
          <VideoPlayer src="https://pub-457a0052e8424c87924878ef99fd9914.r2.dev/onboarding/video.mp4" />
        </div>
        <div className="theme-brand w-full">
          <Button size="lg" className="w-full" onClick={handleContinue}>
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  if (viewState === 'confirmed') {
    return (
      <div className="flex flex-col w-full max-w-lg mx-auto gap-8 animate-fade-in-up items-center text-center py-4 lg:py-8">
        <div className="theme-positive text-primary animate-scale-in">
          <CycleIcon icon={CircleCheck} size="lg" decorative />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Agendado com sucesso
          </h2>
          <p className="text-muted-foreground text-lg">
            A mentoria foi adicionada a sua agenda.
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl w-full">
          <div className="flex items-center gap-4">
            <div className="theme-brand bg-primary/10 text-primary p-2 rounded-xl shrink-0">
              <CycleIcon icon={Calendar} size="sm" decorative />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">{selectedLabel}</p>
              <p className="text-sm text-muted-foreground">Duração: 1 hora</p>
            </div>
          </div>
        </div>
        <div className="theme-brand w-full">
          <Button size="lg" className="w-full" onClick={handleContinue}>
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-8 animate-fade-in-up py-4 lg:py-8">
      <div className="space-y-3 text-center lg:text-left">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Sua mentoria de boas-vindas
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Alunos que participam da mentoria tendem a evoluir mais rápido e com mais confiança. Escolha um horário e adicionaremos à sua agenda.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {availableDates.map(date => (
          <button
            key={date.id}
            onClick={() => handleSelectDate(date.id, date.label)}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-card transition-all text-left cursor-pointer hover:border-primary/40 hover:bg-muted/20 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="bg-muted p-2.5 rounded-lg shrink-0">
              <CycleIcon icon={Clock} size="sm" decorative />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{date.label}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setSkipDialogOpen(true)}
        className="mx-auto text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer underline-offset-4 hover:underline"
      >
        Não tenho disponibilidade nestes horários
      </button>

      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tudo bem, sem pressa!</DialogTitle>
            <DialogDescription>
              Temos uma versão gravada da mentoria com o mesmo conteúdo da sessão ao vivo. Você pode assistir agora, no seu ritmo, e aproveitar todas as dicas para começar com o pé direito.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 sm:flex-col">
            <div className="theme-brand w-full">
              <Button className="w-full" onClick={handleWatchRecorded}>
                Assistir mentoria gravada
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={handleSkipMentoring}>
              Pular esta etapa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
