import { create } from 'zustand';
import type { CheckResult, ThemeName, ColorMode } from '@/types';

interface AppStore {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  
  checkResults: CheckResult[];
  addCheckResult: (result: CheckResult) => void;
  setCheckResults: (results: CheckResult[]) => void;
  removeCheckResult: (id: string) => void;
  clearAllResults: () => void;
  
  currentResult: CheckResult | null;
  setCurrentResult: (result: CheckResult | null) => void;
  
  isChecking: boolean;
  setIsChecking: (checking: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'blue',
  setTheme: (theme) => set({ theme }),
  
  colorMode: 'light',
  setColorMode: (mode) => {
    set({ colorMode: mode });
    document.body.classList.toggle('dark', mode === 'dark');
  },
  toggleColorMode: () => set((state) => {
    const newMode = state.colorMode === 'light' ? 'dark' as ColorMode : 'light' as ColorMode;
    document.body.classList.toggle('dark', newMode === 'dark');
    return { colorMode: newMode };
  }),
  
  checkResults: [],
  addCheckResult: (result) => set((state) => ({
    checkResults: [result, ...state.checkResults].slice(0, 20),
  })),
  setCheckResults: (results) => set({ checkResults: results }),
  removeCheckResult: (id) => set((state) => ({
    checkResults: state.checkResults.filter(r => r.id !== id),
  })),
  clearAllResults: () => set({ checkResults: [] }),
  
  currentResult: null,
  setCurrentResult: (result) => set({ currentResult: result }),
  
  isChecking: false,
  setIsChecking: (checking) => set({ isChecking: checking }),
}));