import { describe, it, expect } from 'vitest';
import { RuleEngine } from '../RuleEngine';
import { Teacher, Room, TimeSlot, ScheduledItem, Constraint } from '../../types';

describe('RuleEngine', () => {
  const mockTeachers = new Map<string, Teacher>([
    ['t1', {
        id: 't1', name: 'John Doe', subjects: ['s1'], maxHoursPerDay: 2,
        unavailableSlots: ['slot3'], preferences: {}
    }]
  ]);

  const mockRooms = new Map<string, Room>([
    ['r1', { id: 'r1', name: 'Room 101', capacity: 30, type: 'General', unavailableSlots: [] }]
  ]);

  const mockSlots = new Map<string, TimeSlot>([
    ['slot1', { id: 'slot1', day: 'Monday', startTime: '08:00', endTime: '09:00', period: 1 }],
    ['slot2', { id: 'slot2', day: 'Monday', startTime: '09:00', endTime: '10:00', period: 2 }],
    ['slot3', { id: 'slot3', day: 'Monday', startTime: '10:00', endTime: '11:00', period: 3 }]
  ]);

  const engine = new RuleEngine(mockTeachers, mockRooms, mockSlots, []);

  it('should detect teacher overlap', () => {
    const schedule: ScheduledItem[] = [
      { id: '1', teacherId: 't1', roomId: 'r1', slotId: 'slot1', classGroupId: 'c1', subjectId: 's1' },
      { id: '2', teacherId: 't1', roomId: 'r1', slotId: 'slot1', classGroupId: 'c2', subjectId: 's2' }
    ];

    const result = engine.evaluate(schedule);
    expect(result.hardConflicts).toContain('Teacher t1 has overlapping slots at slot1');
  });

  it('should detect teacher unavailability', () => {
    const schedule: ScheduledItem[] = [
      { id: '1', teacherId: 't1', roomId: 'r1', slotId: 'slot3', classGroupId: 'c1', subjectId: 's1' }
    ];

    const result = engine.evaluate(schedule);
    expect(result.hardConflicts).toContain('Teacher John Doe is unavailable at slot slot3');
  });

  it('should detect room overlap', () => {
    const schedule: ScheduledItem[] = [
        { id: '1', teacherId: 't1', roomId: 'r1', slotId: 'slot1', classGroupId: 'c1', subjectId: 's1' },
        { id: '2', teacherId: 't2', roomId: 'r1', slotId: 'slot1', classGroupId: 'c2', subjectId: 's2' }
      ];

      const result = engine.evaluate(schedule);
      expect(result.hardConflicts).toContain('Room r1 has overlapping slots at slot1');
  });

  it('should detect soft violation: max hours per day', () => {
    const schedule: ScheduledItem[] = [
        { id: '1', teacherId: 't1', roomId: 'r1', slotId: 'slot1', classGroupId: 'c1', subjectId: 's1' },
        { id: '2', teacherId: 't1', roomId: 'r1', slotId: 'slot2', classGroupId: 'c2', subjectId: 's2' },
        { id: '3', teacherId: 't1', roomId: 'r1', slotId: 'slot3', classGroupId: 'c3', subjectId: 's3' }
      ];

      const result = engine.evaluate(schedule);
      expect(result.softViolations).toContain('Teacher John Doe exceeds max hours on Monday');
  });
});
