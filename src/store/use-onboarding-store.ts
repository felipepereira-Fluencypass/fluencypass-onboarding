import { create } from 'zustand';

export type PlacementStrategy = 'skip' | 'discover';
export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type StudyObjective =
  | 'personal'
  | 'professional'
  | 'entertainment'
  | 'abroad'
  | 'travel'
  | 'other';

export const FLUENCYPASS_LEVELS = [
  'Beginner 1', 'Beginner 2',
  'Basic 1', 'Basic 2',
  'Intermediate 1', 'Intermediate 2',
  'Upper-Intermediate 1', 'Upper-Intermediate 2',
  'Advanced 1', 'Advanced 2',
  'Proficient',
] as const;

export type FluencypassLevel = typeof FLUENCYPASS_LEVELS[number];

interface OnboardingState {
  currentStep: OnboardingStep;
  birthDate: string | null;
  studyObjective: StudyObjective | null;
  studyDays: string[];
  studyTimeMinutes: number;
  preferredStudyTime: string;
  timezone: string;
  placementStrategy: PlacementStrategy | null;
  theoreticalLevel: FluencypassLevel | null;
  practicalLevel: FluencypassLevel | null;
  theoreticalCompleted: boolean;
  practicalCompleted: boolean;
  liveBookingDate: string | null;
  mentoringMode: 'live' | 'recorded' | null;
  campaignBonus: { title: string; description: string } | null;
  videoWatched: boolean;
  showTimeHighlight: boolean;

  // Actions
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBirthDate: (date: string) => void;
  setStudyObjective: (objective: StudyObjective) => void;
  setStudyDays: (days: string[]) => void;
  setStudyTime: (minutes: number) => void;
  setPreferredStudyTime: (time: string) => void;
  setTimezone: (timezone: string) => void;
  setPlacementStrategy: (strategy: PlacementStrategy) => void;
  setLiveBookingDate: (date: string | 'skip') => void;
  setTheoreticalLevel: (level: FluencypassLevel) => void;
  setPracticalLevel: (level: FluencypassLevel) => void;
  setTheoreticalCompleted: (completed: boolean) => void;
  setPracticalCompleted: (completed: boolean) => void;
  setMentoringMode: (mode: 'live' | 'recorded') => void;
  setCampaignBonus: (bonus: { title: string; description: string } | null) => void;
  setVideoWatched: (watched: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  birthDate: null,
  studyObjective: null,
  studyDays: [],
  studyTimeMinutes: 30,
  preferredStudyTime: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  placementStrategy: null,
  theoreticalLevel: null,
  practicalLevel: null,
  theoreticalCompleted: false,
  practicalCompleted: false,
  liveBookingDate: null,
  mentoringMode: null,
  campaignBonus: { title: '2 meses de PrivateTalk grátis', description: 'Seu bônus da campanha de matrícula já está ativo. Aproveite suas aulas particulares!' },
  videoWatched: false,
  showTimeHighlight: false,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => {
    // Step 5 (Routine) exige horário preferido
    if (state.currentStep === 5 && !state.preferredStudyTime) {
      return { showTimeHighlight: true };
    }
    const hasPersonalData = state.birthDate && state.studyObjective;
    let next = state.currentStep + 1;
    // Step 1 → pula Personal Data se dados já existem (vai para Bifurcation)
    if (state.currentStep === 1 && hasPersonalData) next = 3;
    // Step 3 (Bifurcation) → pula Placement se skip (vai direto para Routine)
    if (state.currentStep === 3 && state.placementStrategy === 'skip') next = 5;
    return { currentStep: Math.min(next, 8) as OnboardingStep, showTimeHighlight: false };
  }),
  prevStep: () => set((state) => {
    const hasPersonalData = state.birthDate && state.studyObjective;
    let prev = state.currentStep - 1;
    // Step 3 → volta para Welcome se Personal Data foi pulado
    if (state.currentStep === 3 && hasPersonalData) prev = 1;
    // Step 5 (Routine) → volta para Bifurcation se Placement foi pulado
    if (state.currentStep === 5 && state.placementStrategy === 'skip') prev = 3;
    return { currentStep: Math.max(prev, 1) as OnboardingStep };
  }),

  setBirthDate: (date) => set({ birthDate: date }),
  setStudyObjective: (objective) => set({ studyObjective: objective }),
  setStudyDays: (days) => set({ studyDays: days }),
  setStudyTime: (minutes) => set({ studyTimeMinutes: minutes }),
  setPreferredStudyTime: (time) => set({ preferredStudyTime: time }),
  setTimezone: (timezone) => set({ timezone }),
  setPlacementStrategy: (strategy) => set({ placementStrategy: strategy }),
  setLiveBookingDate: (date) => set({ liveBookingDate: date }),
  setTheoreticalLevel: (level) => set({ theoreticalLevel: level, theoreticalCompleted: true }),
  setPracticalLevel: (level) => set({ practicalLevel: level, practicalCompleted: true }),
  setTheoreticalCompleted: (completed) => set({ theoreticalCompleted: completed }),
  setPracticalCompleted: (completed) => set({ practicalCompleted: completed }),
  setMentoringMode: (mode) => set({ mentoringMode: mode }),
  setCampaignBonus: (bonus) => set({ campaignBonus: bonus }),
  setVideoWatched: (watched) => set({ videoWatched: watched }),
}));
