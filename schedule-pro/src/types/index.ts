export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimeSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  period: number;    // e.g. 1, 2, 3...
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[]; // Subject IDs
  maxHoursPerDay: number;
  unavailableSlots: string[]; // TimeSlot IDs
  preferences: {
    preferredDays?: DayOfWeek[];
    minimizeWindows?: boolean;
  };
}

export interface Subject {
  id: string;
  name: string;
  hoursPerWeek: number;
  grade: string;
  requiredRoomType?: RoomType;
}

export type RoomType = 'General' | 'Lab' | 'Gym' | 'Art' | 'Music';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  unavailableSlots: string[]; // TimeSlot IDs
}

export interface ClassGroup {
  id: string;
  name: string;
  grade: string;
  subjects: string[]; // Subject IDs
  studentCount: number;
}

export interface ScheduledItem {
  id: string;
  subjectId: string;
  teacherId: string;
  classGroupId: string;
  roomId: string;
  slotId: string;
}

export type ConstraintType = 'Hard' | 'Soft';

export interface Constraint {
  id: string;
  name: string;
  type: ConstraintType;
  weight: number; // 0 to 1 for Soft, typically ignored for Hard (must pass)
  enabled: boolean;
  description: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  configName: string;
  fitness: number;
  conflicts: number;
  schedule: ScheduledItem[];
  metadata: {
    duration: number;
    generations: number;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  algorithm: {
    populationSize: number;
    mutationRate: number;
    maxGenerations: number;
  };
}
