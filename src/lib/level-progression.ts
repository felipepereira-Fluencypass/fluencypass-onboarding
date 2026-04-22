import { FLUENCYPASS_LEVELS, type FluencypassLevel } from '@/store/use-onboarding-store';

// Baseline: 45 min/dia × 5 dias/semana → 1 nível a cada 30 dias (≈ 4 semanas)
// 45 × 5 × 4 = 900 minutos de estudo por nível (5 unidades × 4 lessons + 1 review).
export const MINUTES_PER_LEVEL = 900;

export function daysToNextLevel(minutesPerDay: number, daysPerWeek: number): number {
  if (minutesPerDay <= 0 || daysPerWeek <= 0) return Infinity;
  return Math.ceil(MINUTES_PER_LEVEL / ((minutesPerDay * daysPerWeek) / 7));
}

export interface LevelStage {
  level: FluencypassLevel;
  daysFromStart: number;
  cumulativeDays: number;
  competencies: string[];
}

export function buildProgression(
  startLevel: FluencypassLevel,
  minutesPerDay: number,
  daysPerWeek: number,
): LevelStage[] {
  const startIndex = FLUENCYPASS_LEVELS.indexOf(startLevel);
  if (startIndex === -1) return [];
  const stepDays = daysToNextLevel(minutesPerDay, daysPerWeek);
  const stages: LevelStage[] = [];
  for (let i = startIndex + 1; i < FLUENCYPASS_LEVELS.length; i++) {
    const daysFromStart = stepDays * (i - startIndex);
    stages.push({
      level: FLUENCYPASS_LEVELS[i],
      daysFromStart: stepDays,
      cumulativeDays: daysFromStart,
      competencies: LEVEL_COMPETENCIES[FLUENCYPASS_LEVELS[i]],
    });
  }
  return stages;
}

// Placeholder: o time da Fluencypass revisa esse conteúdo depois.
export const LEVEL_COMPETENCIES: Record<FluencypassLevel, string[]> = {
  'Beginner 1': [
    'Se apresentar no trabalho ou em viagem',
    'Ler preços, horários e datas sem travar',
    'Pedir comida em um restaurante e fazer compras simples',
  ],
  'Beginner 2': [
    'Contar como foi seu dia pra um colega',
    'Descrever sua cidade, sua casa, pessoas próximas',
    'Seguir instruções no aeroporto, hotel ou Uber',
  ],
  'Basic 1': [
    'Contar um fim de semana pra um amigo gringo',
    'Combinar um rolê e dizer do que você gosta',
    'Pedir direção e resolver um imprevisto numa viagem',
  ],
  'Basic 2': [
    'Trocar mensagens com o hotel, Airbnb ou restaurante',
    'Recomendar um filme ou restaurante pra alguém',
    'Responder mensagens de trabalho no WhatsApp/Slack',
  ],
  'Intermediate 1': [
    'Debater um filme ou série com alguém',
    'Escrever emails de trabalho com clareza',
    'Defender sua opinião numa conversa casual',
  ],
  'Intermediate 2': [
    'Conversar sobre qualquer tema do seu dia sem travar',
    'Propor uma ideia num brainstorm de trabalho',
    'Acompanhar podcasts e notícias sem legenda',
  ],
  'Upper-Intermediate 1': [
    'Apresentar um projeto numa reunião de trabalho',
    'Ler o New York Times ou artigos da sua área',
    'Participar de reuniões com clientes estrangeiros',
  ],
  'Upper-Intermediate 2': [
    'Discordar de alguém com argumentos, sem parecer rude',
    'Escrever um relatório de trabalho em inglês',
    'Liderar uma call em inglês do início ao fim',
  ],
  'Advanced 1': [
    'Negociar contratos e fechar acordos em inglês',
    'Ler livros e pesquisas da sua área profissional',
    'Dar entrevista de emprego em inglês com naturalidade',
  ],
  'Advanced 2': [
    'Participar de debates e painéis técnicos',
    'Entender piadas, referências e ironia de nativos',
    'Escrever um artigo ou proposta em inglês',
  ],
  'Proficient': [
    'Trabalhar, viver e pensar em inglês sem esforço',
    'Se virar da sala de diretoria ao jantar casual',
    'Usar gírias, expressões e tom certo pra cada situação',
  ],
};

export function formatDays(days: number): string {
  if (!isFinite(days)) return '...';
  if (days < 30) return `${days} dias`;
  const months = Math.round(days / 30);
  if (months === 1) return '1 mês';
  if (months < 12) return `${months} meses`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return years === 1 ? '1 ano' : `${years} anos`;
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remMonths} ${remMonths === 1 ? 'mês' : 'meses'}`;
}
