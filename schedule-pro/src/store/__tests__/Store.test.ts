import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';
import { useHistoryStore } from '../settingsStore';

describe('Zustand Stores', () => {
  beforeEach(() => {
    useAppStore.getState().clearData();
    useHistoryStore.getState().clearHistory();
  });

  it('should update app store data', () => {
    const store = useAppStore.getState();
    store.setData({
      teachers: [{ id: 't1', name: 'Test', subjects: [], maxHoursPerDay: 8, unavailableSlots: [], preferences: {} }],
      subjects: [],
      rooms: [],
      classes: [],
      slots: []
    });

    expect(useAppStore.getState().teachers).toHaveLength(1);
    expect(useAppStore.getState().teachers[0].name).toBe('Test');
  });

  it('should manage history correctly', () => {
    const historyStore = useHistoryStore.getState();
    const mockItem: any = { id: 'h1', timestamp: Date.now(), configName: 'Test Config', schedule: [] };

    historyStore.addToHistory(mockItem);
    expect(useHistoryStore.getState().history).toHaveLength(1);

    historyStore.removeFromHistory('h1');
    expect(useHistoryStore.getState().history).toHaveLength(0);
  });
});
