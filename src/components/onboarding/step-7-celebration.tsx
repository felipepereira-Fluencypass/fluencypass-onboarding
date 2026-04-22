'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { Button, Badge, CycleIcon } from '@fluencypassdevs/cycle';
import { Gift } from '@fluencypassdevs/cycle/icons/lucide';

export function Step7Celebration() {
  const {
    userName,
    studyDays, studyTimeMinutes, preferredStudyTime,
    theoreticalLevel, practicalLevel,
    mentoringMode, liveBookingDate,
    campaignBonus,
  } = useOnboardingStore();

  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.3, y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x: 0.7, y: 0.5 },
        });
      }, 300);
    };

    fire();
    const timer = setTimeout(fire, 1200);
    return () => clearTimeout(timer);
  }, []);

  const daysLabel = studyDays.length === 7
    ? 'Todos os dias'
    : studyDays.length === 5 && ['SEG', 'TER', 'QUA', 'QUI', 'SEX'].every(d => studyDays.includes(d))
      ? 'Segunda a Sexta'
      : `${studyDays.length} dias/semana`;

  const formatBookingDate = (dateStr: string | null): string => {
    if (!dateStr || dateStr === 'recorded') return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-6 lg:gap-8 text-center animate-fade-in-up py-4 lg:py-12 pb-20">
      {/* Trophy */}
      <div className="text-6xl animate-bounce">🏆</div>

      {/* Headline */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Tudo pronto, {userName}.
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          A Fluencypass está configurada do seu jeito: seu ritmo, seu nível e seu objetivo.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <div className="bg-card border border-border p-4 rounded-xl text-left">
          <p className="text-xs text-muted-foreground mb-1">Seus horários</p>
          <p className="font-semibold text-foreground">{daysLabel}</p>
          <p className="text-sm text-muted-foreground">
            {studyTimeMinutes} min/dia{preferredStudyTime ? ` às ${preferredStudyTime}` : ''}
          </p>
        </div>

        {theoreticalLevel && (
          <div className="bg-card border border-border p-4 rounded-xl text-left">
            <p className="text-xs text-muted-foreground mb-1">Leitura e gramática</p>
            <p className="font-semibold text-foreground">{theoreticalLevel}</p>
            <Badge variant="secondary" className="mt-1 text-xs">Videoaulas prontas</Badge>
          </div>
        )}

        {practicalLevel && (
          <div className="bg-card border border-border p-4 rounded-xl text-left">
            <p className="text-xs text-muted-foreground mb-1">Fala e pronúncia</p>
            <p className="font-semibold text-foreground">{practicalLevel}</p>
            <Badge variant="secondary" className="mt-1 text-xs">GroupTalk e PrivateTalk prontos</Badge>
          </div>
        )}

        <div className="bg-card border border-border p-4 rounded-xl text-left">
          <p className="text-xs text-muted-foreground mb-1">Live de boas-vindas</p>
          <p className="font-semibold text-foreground">
            {mentoringMode === 'live' ? 'Agendada' : 'Assistida (gravação)'}
          </p>
          {mentoringMode === 'live' && liveBookingDate && liveBookingDate !== 'recorded' && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {formatBookingDate(liveBookingDate)}
            </p>
          )}
        </div>
      </div>

      {/* Bonus card */}
      {campaignBonus && (
        <div className="theme-positive w-full bg-primary/5 border border-primary/20 p-5 rounded-2xl text-left animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0">
              <CycleIcon icon={Gift} size="sm" decorative />
            </div>
            <div className="space-y-1 flex-1">
              <p className="font-semibold text-foreground">{campaignBonus.title}</p>
              <p className="text-sm text-muted-foreground">{campaignBonus.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Os detalhes ficam em <span className="font-medium text-foreground">Minha assinatura</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA, desktop only (inline) */}
      <div className="hidden lg:block w-full theme-brand">
        <Button
          size="lg"
          className="w-full"
          onClick={() => { window.location.href = 'https://fluencypass.com/account'; }}
        >
          Começar agora
        </Button>
      </div>
    </div>
  );
}
