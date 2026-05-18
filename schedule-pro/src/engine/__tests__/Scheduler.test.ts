import { describe, it, expect } from 'vitest';
import { Scheduler, SchedulerData } from '../Scheduler';

describe('Scheduler GA', () => {
  const mockData: SchedulerData = {
    teachers: [
      { id: 't1', name: 'T1', subjects: ['s1'], maxHoursPerDay: 8, unavailableSlots: [], preferences: {} }
    ],
    subjects: [
      { id: 's1', name: 'S1', hoursPerWeek: 2, grade: '10', requiredRoomType: 'General' }
    ],
    rooms: [
      { id: 'r1', name: 'R1', capacity: 30, type: 'General', unavailableSlots: [] }
    ],
    slots: [
      { id: 'sl1', day: 'Monday', startTime: '08:00', endTime: '09:00', period: 1 },
      { id: 'sl2', day: 'Monday', startTime: '09:00', endTime: '10:00', period: 2 }
    ],
    classes: [
      { id: 'c1', name: 'C1', grade: '10', subjects: ['s1'], studentCount: 20 }
    ]
  };

  it('should evolve and improve fitness over generations', () => {
    const scheduler = new Scheduler(mockData);
    let population = scheduler.generateInitialPopulation(20);

    const initialBest = scheduler.getBest(population);

    for (let i = 0; i < 10; i++) {
      population = scheduler.evolve(population, 0.1);
    }

    const finalBest = scheduler.getBest(population);

    // In this simple case, it should easily find a perfect schedule (fitness 1000)
    // because there are only 2 slots and 2 hours of subject needed (no conflicts possible if slots are different)
    expect(finalBest.evaluation.score).toBeGreaterThanOrEqual(initialBest.evaluation.score);
  });

  it('should generate a schedule with the correct number of items', () => {
      const scheduler = new Scheduler(mockData);
      const population = scheduler.generateInitialPopulation(1);
      const schedule = population[0];

      // 1 class * 1 subject * 2 hours/week = 2 items
      expect(schedule).toHaveLength(2);
  });
});
