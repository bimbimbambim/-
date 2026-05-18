import { Scheduler, SchedulerData } from './Scheduler';

/* eslint-disable no-restricted-globals */
self.onmessage = (e: MessageEvent) => {
  const { data, config } = e.data as { data: SchedulerData, config: any };

  const scheduler = new Scheduler(data);
  let population = scheduler.generateInitialPopulation(config.populationSize || 50);

  const maxGenerations = config.maxGenerations || 100;
  const mutationRate = config.mutationRate || 0.1;

  for (let g = 0; g < maxGenerations; g++) {
    population = scheduler.evolve(population, mutationRate);

    if (g % 10 === 0 || g === maxGenerations - 1) {
      const best = scheduler.getBest(population);
      self.postMessage({
        type: 'PROGRESS',
        generation: g,
        maxGenerations,
        bestFitness: best.evaluation.score,
        conflicts: best.evaluation.hardConflicts.length
      });
    }
  }

  const finalBest = scheduler.getBest(population);
  self.postMessage({
    type: 'COMPLETE',
    schedule: finalBest.schedule,
    fitness: finalBest.evaluation.score,
    conflicts: finalBest.evaluation.hardConflicts.length
  });
};
