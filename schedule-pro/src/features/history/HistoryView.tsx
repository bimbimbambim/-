import React from 'react';
import { BlurCard, GlassButton } from '../../components/ui';
import { useHistoryStore } from '../../store/settingsStore';
import { useAppStore } from '../../store/appStore';
import { Trash2, Download, ExternalLink, Calendar } from 'lucide-react';
import { ExcelExporter } from '../../services/ExcelExporter';

export const HistoryView: React.FC = () => {
  const { history, removeFromHistory, clearHistory } = useHistoryStore();
  const { teachers, subjects, rooms, classes, slots, setSchedule } = useAppStore();

  const handleExport = async (item: any) => {
    const exporter = new ExcelExporter();
    const buffer = await exporter.export(item.schedule, { teachers, subjects, rooms, classes, slots });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Schedule_${item.configName}.xlsx`;
    a.click();
  };

  const handleRestore = (item: any) => {
    setSchedule(item.schedule);
    alert('Schedule restored to current session');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">History</h1>
          <p className="mt-2 text-apple-gray-400">View and manage past generations.</p>
        </div>
        {history.length > 0 && (
          <GlassButton variant="danger" onClick={clearHistory}>Clear All History</GlassButton>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.map((item) => (
          <BlurCard key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-apple-gray-100 dark:bg-apple-gray-700">
                <Calendar className="text-apple-gray-400" />
              </div>
              <div>
                <h3 className="font-bold">{item.configName}</h3>
                <p className="text-sm text-apple-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-xs text-apple-gray-400 uppercase font-bold">Fitness</p>
                <p className="font-bold text-apple-blue">{item.fitness.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-xs text-apple-gray-400 uppercase font-bold">Conflicts</p>
                <p className={`font-bold ${item.conflicts === 0 ? 'text-apple-green' : 'text-apple-red'}`}>
                  {item.conflicts}
                </p>
              </div>
              <div>
                <p className="text-xs text-apple-gray-400 uppercase font-bold">Time</p>
                <p className="font-medium">{(item.metadata.duration / 1000).toFixed(1)}s</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleRestore(item)} className="p-2 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-700 rounded-full transition-colors" title="Restore">
                  <ExternalLink size={18} />
                </button>
                <button onClick={() => handleExport(item)} className="p-2 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-700 rounded-full transition-colors" title="Download">
                  <Download size={18} />
                </button>
                <button onClick={() => removeFromHistory(item.id)} className="p-2 hover:bg-apple-red/10 text-apple-red rounded-full transition-colors" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </BlurCard>
        ))}

        {history.length === 0 && (
          <div className="text-center py-20 text-apple-gray-300 italic">
            Your generation history will appear here.
          </div>
        )}
      </div>
    </div>
  );
};
