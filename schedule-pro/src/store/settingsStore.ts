import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GenerationHistoryItem, AppSettings } from '../types';

interface HistoryState {
  history: GenerationHistoryItem[];
  addToHistory: (item: GenerationHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (item) => set((state) => ({
        history: [item, ...state.history].slice(0, 50) // Keep last 50
      })),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter(i => i.id !== id)
      })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'schedule-pro-history-storage' }
  )
);

interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        theme: 'system',
        autoSave: true,
        algorithm: {
          populationSize: 50,
          mutationRate: 0.1,
          maxGenerations: 100
        }
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    { name: 'schedule-pro-settings-storage' }
  )
);
