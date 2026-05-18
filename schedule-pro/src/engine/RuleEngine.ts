import { ScheduledItem, Teacher, Room, TimeSlot, Constraint } from '../types';

export interface EvaluationResult {
  score: number;
  hardConflicts: string[];
  softViolations: string[];
}

export class RuleEngine {
  constructor(
    private teachers: Map<string, Teacher>,
    private rooms: Map<string, Room>,
    private slots: Map<string, TimeSlot>,
    private constraints: Constraint[]
  ) {}

  evaluate(schedule: ScheduledItem[]): EvaluationResult {
    let score = 1000; // Starting score
    const hardConflicts: string[] = [];
    const softViolations: string[] = [];

    // Maps to track occupancy
    const teacherSchedule = new Map<string, Set<string>>(); // teacherId -> Set<slotId>
    const roomSchedule = new Map<string, Set<string>>();    // roomId -> Set<slotId>
    const classSchedule = new Map<string, Set<string>>();   // classId -> Set<slotId>

    for (const item of schedule) {
      // 1. Hard: Teacher Overlap
      if (!teacherSchedule.has(item.teacherId)) teacherSchedule.set(item.teacherId, new Set());
      if (teacherSchedule.get(item.teacherId)!.has(item.slotId)) {
        hardConflicts.push(`Teacher ${item.teacherId} has overlapping slots at ${item.slotId}`);
        score -= 100;
      }
      teacherSchedule.get(item.teacherId)!.add(item.slotId);

      // 2. Hard: Room Overlap
      if (!roomSchedule.has(item.roomId)) roomSchedule.set(item.roomId, new Set());
      if (roomSchedule.get(item.roomId)!.has(item.slotId)) {
        hardConflicts.push(`Room ${item.roomId} has overlapping slots at ${item.slotId}`);
        score -= 100;
      }
      roomSchedule.get(item.roomId)!.add(item.slotId);

      // 3. Hard: Class Group Overlap
      if (!classSchedule.has(item.classGroupId)) classSchedule.set(item.classGroupId, new Set());
      if (classSchedule.get(item.classGroupId)!.has(item.slotId)) {
        hardConflicts.push(`Class ${item.classGroupId} has overlapping slots at ${item.slotId}`);
        score -= 100;
      }
      classSchedule.get(item.classGroupId)!.add(item.slotId);

      // 4. Hard: Teacher Availability
      const teacher = this.teachers.get(item.teacherId);
      if (teacher?.unavailableSlots.includes(item.slotId)) {
        hardConflicts.push(`Teacher ${teacher.name} is unavailable at slot ${item.slotId}`);
        score -= 100;
      }

      // 5. Hard: Room Availability
      const room = this.rooms.get(item.roomId);
      if (room?.unavailableSlots.includes(item.slotId)) {
        hardConflicts.push(`Room ${room.name} is unavailable at slot ${item.slotId}`);
        score -= 100;
      }
    }

    // 6. Soft: Teacher Max Hours Per Day
    this.teachers.forEach(teacher => {
      const teacherSlots = schedule.filter(s => s.teacherId === teacher.id);
      const slotsByDay = new Map<string, number>();

      teacherSlots.forEach(s => {
        const slot = this.slots.get(s.slotId);
        if (slot) {
          slotsByDay.set(slot.day, (slotsByDay.get(slot.day) || 0) + 1);
        }
      });

      slotsByDay.forEach((count, day) => {
        if (count > teacher.maxHoursPerDay) {
          softViolations.push(`Teacher ${teacher.name} exceeds max hours on ${day}`);
          score -= 10 * (count - teacher.maxHoursPerDay);
        }
      });
    });

    // Normalize score
    score = Math.max(0, score);

    return {
      score,
      hardConflicts,
      softViolations
    };
  }
}
