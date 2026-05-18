import React, { useState, useRef, useEffect } from 'react';
import { BlurCard, GlassButton, ProgressBar } from '../../components/ui';
import { useAppStore } from '../../store/appStore';
import { useSettingsStore, useHistoryStore } from '../../store/settingsStore';
import { Play, Square, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ExcelParser } from '../../services/ExcelParser';
import { ExcelExporter } from '../../services/ExcelExporter';

export const GeneratorView: React.FC = () => {
  const { teachers, subjects, rooms, classes, slots, setData, setSchedule, currentSchedule } = useAppStore();
  const { settings } = useSettingsStore();
  const { addToHistory } = useHistoryStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<any>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const parser = new ExcelParser();
    const data = await parser.parseData(buffer);
    setData(data);
  };

  const startGeneration = () => {
    if (teachers.length === 0) return alert('Please import data first');

    setIsGenerating(true);
    setProgress(0);
    setStartTime(Date.now());

    workerRef.current = new Worker(new URL('../../engine/Scheduler.worker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'PROGRESS') {
        setProgress((msg.generation / msg.maxGenerations) * 100);
        setStatus(msg);
      } else if (msg.type === 'COMPLETE') {
        setIsGenerating(false);
        setProgress(100);
        setSchedule(msg.schedule);
        setStatus(msg);

        addToHistory({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          configName: `Generation ${new Date().toLocaleTimeString()}`,
          fitness: msg.bestFitness || msg.fitness,
          conflicts: msg.conflicts,
          schedule: msg.schedule,
          metadata: {
            duration: Date.now() - (startTime || Date.now()),
            generations: settings.algorithm.maxGenerations
          }
        });
      }
    };

    workerRef.current.postMessage({
      data: { teachers, subjects, rooms, classes, slots },
      config: settings.algorithm
    });
  };

  const stopGeneration = () => {
    workerRef.current?.terminate();
    setIsGenerating(false);
  };

  const handleExport = async () => {
    if (!currentSchedule) return;
    const exporter = new ExcelExporter();
    const buffer = await exporter.export(currentSchedule, { teachers, subjects, rooms, classes, slots });

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Schedule_${new Date().toISOString().slice(0,10)}.xlsx`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-apple-gray-900 dark:text-white">Generator</h1>
          <p className="mt-2 text-apple-gray-400">Configure and run the scheduling engine.</p>
        </div>
        {!isGenerating ? (
          <GlassButton onClick={startGeneration} className="flex items-center space-x-2 h-12 px-8">
            <Play size={20} fill="currentColor" />
            <span>Generate Schedule</span>
          </GlassButton>
        ) : (
          <GlassButton variant="danger" onClick={stopGeneration} className="flex items-center space-x-2 h-12 px-8">
            <Square size={20} fill="currentColor" />
            <span>Stop Engine</span>
          </GlassButton>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BlurCard className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Engine Status</h2>
          {isGenerating ? (
            <div className="space-y-8 py-4">
              <ProgressBar
                progress={progress}
                label="Genetic Evolution Progress"
                status={`Generation ${status?.generation || 0} of ${settings.algorithm.maxGenerations}`}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-700">
                  <p className="text-xs text-apple-gray-400 uppercase tracking-wider font-bold">Best Fitness</p>
                  <p className="text-2xl font-bold text-apple-blue">{status?.bestFitness?.toFixed(0) || 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-apple-gray-100 dark:bg-apple-gray-700">
                  <p className="text-xs text-apple-gray-400 uppercase tracking-wider font-bold">Hard Conflicts</p>
                  <p className={`text-2xl font-bold ${status?.conflicts === 0 ? 'text-apple-green' : 'text-apple-red'}`}>
                    {status?.conflicts || 0}
                  </p>
                </div>
              </div>
            </div>
          ) : progress === 100 ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-apple-green/10 text-apple-green">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold">Generation Complete</h3>
              <p className="text-apple-gray-400 max-w-sm mx-auto">
                Successfully generated a schedule with {status?.conflicts || 0} conflicts.
              </p>
              <GlassButton onClick={handleExport} className="mt-4">
                <Download size={20} className="mr-2" />
                Download Excel
              </GlassButton>
            </div>
          ) : (
            <div className="text-center py-12 text-apple-gray-300 italic">
              Ready to start. {teachers.length === 0 ? 'Please import data first.' : 'Press Generate to begin.'}
            </div>
          )}
        </BlurCard>

        <div className="space-y-6">
          <BlurCard>
            <h3 className="text-lg font-semibold mb-4">Input Data</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <label
                  htmlFor="excel-upload"
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-apple-gray-200 dark:border-apple-gray-700 rounded-2xl cursor-pointer hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
                >
                  <Download size={32} className="text-apple-gray-300 mb-2" />
                  <span className="text-sm font-medium">Upload Excel</span>
                  <span className="text-xs text-apple-gray-400 mt-1">.xlsx template files</span>
                </label>
              </div>

              {teachers.length > 0 && (
                <div className="flex items-center space-x-2 text-apple-green text-sm font-medium">
                  <CheckCircle2 size={16} />
                  <span>Data loaded successfully</span>
                </div>
              )}
            </div>
          </BlurCard>

          <BlurCard className="bg-apple-blue/5 border-apple-blue/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-apple-blue mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-bold text-apple-blue uppercase tracking-wider">Algorithm Tip</h4>
                <p className="text-xs text-apple-gray-500 mt-1 leading-relaxed">
                  Higher population size improves results but increases generation time. Adjust in settings.
                </p>
              </div>
            </div>
          </BlurCard>
        </div>
      </div>
    </div>
  );
};
