import { ScheduledItem, Teacher, Subject, Room, TimeSlot, ClassGroup } from '../types';
import { RuleEngine, EvaluationResult } from './RuleEngine';

export interface SchedulerData {
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  slots: TimeSlot[];
  classes: ClassGroup[];
}

export class Scheduler {
  private ruleEngine: RuleEngine;
  private teachersMap: Map<string, Teacher>;
  private roomsMap: Map<string, Room>;
  private slotsMap: Map<string, TimeSlot>;
  private subjectsMap: Map<string, Subject>;

  constructor(private data: SchedulerData) {
    this.teachersMap = new Map(data.teachers.map(t => [t.id, t]));
    this.roomsMap = new Map(data.rooms.map(r => [r.id, r]));
    this.slotsMap = new Map(data.slots.map(s => [s.id, s]));
    this.subjectsMap = new Map(data.subjects.map(s => [s.id, s]));

    this.ruleEngine = new RuleEngine(this.teachersMap, this.roomsMap, this.slotsMap, []);
  }

  generateInitialPopulation(size: number): ScheduledItem[][] {
    const population: ScheduledItem[][] = [];
    for (let i = 0; i < size; i++) {
      population.push(this.createRandomSchedule());
    }
    return population;
  }

  private createRandomSchedule(): ScheduledItem[] {
    const schedule: ScheduledItem[] = [];

    this.data.classes.forEach(cls => {
      cls.subjects.forEach(subId => {
        const subject = this.subjectsMap.get(subId);
        if (!subject) return;

        // For each hour of the subject per week
        for (let h = 0; h < subject.hoursPerWeek; h++) {
          const randomSlot = this.data.slots[Math.floor(Math.random() * this.data.slots.length)];
          const randomRoom = this.data.rooms[Math.floor(Math.random() * this.data.rooms.length)];

          // Find a teacher who teaches this subject
          const eligibleTeachers = this.data.teachers.filter(t => t.subjects.includes(subId));
          const randomTeacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];

          if (randomTeacher) {
            schedule.push({
              id: Math.random().toString(36).substr(2, 9),
              subjectId: subId,
              teacherId: randomTeacher.id,
              classGroupId: cls.id,
              roomId: randomRoom.id,
              slotId: randomSlot.id
            });
          }
        }
      });
    });

    return schedule;
  }

  evolve(population: ScheduledItem[][], mutationRate: number): ScheduledItem[][] {
    const scoredPopulation = population.map(s => ({
      schedule: s,
      fitness: this.ruleEngine.evaluate(s).score
    }));

    // Sort by fitness (descending)
    scoredPopulation.sort((a, b) => b.fitness - a.fitness);

    const newPopulation: ScheduledItem[][] = [];

    // Elitism: Keep top 10%
    const eliteSize = Math.floor(population.length * 0.1);
    for (let i = 0; i < eliteSize; i++) {
      newPopulation.push(scoredPopulation[i].schedule);
    }

    // Fill the rest with crossover and mutation
    while (newPopulation.length < population.length) {
      const parentA = this.tournamentSelect(scoredPopulation);
      const parentB = this.tournamentSelect(scoredPopulation);

      let offspring = this.crossover(parentA, parentB);
      offspring = this.mutate(offspring, mutationRate);

      newPopulation.push(offspring);
    }

    return newPopulation;
  }

  private tournamentSelect(scoredPopulation: { schedule: ScheduledItem[], fitness: number }[]): ScheduledItem[] {
    const tournamentSize = 5;
    let best = scoredPopulation[Math.floor(Math.random() * scoredPopulation.length)];

    for (let i = 0; i < tournamentSize; i++) {
      const contender = scoredPopulation[Math.floor(Math.random() * scoredPopulation.length)];
      if (contender.fitness > best.fitness) {
        best = contender;
      }
    }

    return best.schedule;
  }

  private crossover(parentA: ScheduledItem[], parentB: ScheduledItem[]): ScheduledItem[] {
    const midpoint = Math.floor(parentA.length / 2);
    return [...parentA.slice(0, midpoint), ...parentB.slice(midpoint)];
  }

  private mutate(schedule: ScheduledItem[], mutationRate: number): ScheduledItem[] {
    return schedule.map(item => {
      if (Math.random() < mutationRate) {
        const randomSlot = this.data.slots[Math.floor(Math.random() * this.data.slots.length)];
        const randomRoom = this.data.rooms[Math.floor(Math.random() * this.data.rooms.length)];
        return { ...item, slotId: randomSlot.id, roomId: randomRoom.id };
      }
      return item;
    });
  }

  getBest(population: ScheduledItem[][]) {
    const scored = population.map(s => ({
        schedule: s,
        evaluation: this.ruleEngine.evaluate(s)
    }));
    return scored.sort((a, b) => b.evaluation.score - a.evaluation.score)[0];
  }
}
