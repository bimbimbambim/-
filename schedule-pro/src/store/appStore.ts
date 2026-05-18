import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Teacher, Subject, Room, ClassGroup, TimeSlot, ScheduledItem } from '../types';

interface AppState {
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  classes: ClassGroup[];
  slots: TimeSlot[];
  currentSchedule: ScheduledItem[] | null;

  setData: (data: {
    teachers: Teacher[];
    subjects: Subject[];
    rooms: Room[];
    classes: ClassGroup[];
    slots: TimeSlot[]
  }) => void;

  setSchedule: (schedule: ScheduledItem[]) => void;
  clearData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      teachers: [],
      subjects: [],
      rooms: [],
      classes: [],
      slots: [],
      currentSchedule: null,

      setData: (data) => set({ ...data }),
      setSchedule: (schedule) => set({ currentSchedule: schedule }),
      clearData: () => set({
        teachers: [],
        subjects: [],
        rooms: [],
        classes: [],
        slots: [],
        currentSchedule: null
      }),
    }),
    {
      name: 'schedule-pro-app-storage',
    }
  )
);
