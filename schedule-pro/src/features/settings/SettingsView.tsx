import React from 'react';
import { BlurCard, GlassButton } from '../../components/ui';
import { useSettingsStore } from '../../store/settingsStore';
import { Settings, Cpu, Palette, Save, Bell } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const handleAlgorithmChange = (field: string, value: number) => {
    updateSettings({
      algorithm: {
        ...settings.algorithm,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-apple-gray-400">Configure application behavior and engine parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BlurCard>
          <div className="flex items-center space-x-2 mb-6">
            <Cpu className="text-apple-blue" size={20} />
            <h2 className="text-xl font-semibold">Algorithm Configuration</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-apple-gray-400 mb-2">
                Population Size: {settings.algorithm.populationSize}
              </label>
              <input
                type="range" min="10" max="200" step="10"
                value={settings.algorithm.populationSize}
                onChange={(e) => handleAlgorithmChange('populationSize', Number(e.target.value))}
                className="w-full accent-apple-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-gray-400 mb-2">
                Mutation Rate: {settings.algorithm.mutationRate}
              </label>
              <input
                type="range" min="0" max="0.5" step="0.01"
                value={settings.algorithm.mutationRate}
                onChange={(e) => handleAlgorithmChange('mutationRate', Number(e.target.value))}
                className="w-full accent-apple-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-gray-400 mb-2">
                Max Generations: {settings.algorithm.maxGenerations}
              </label>
              <input
                type="range" min="10" max="1000" step="10"
                value={settings.algorithm.maxGenerations}
                onChange={(e) => handleAlgorithmChange('maxGenerations', Number(e.target.value))}
                className="w-full accent-apple-blue"
              />
            </div>
          </div>
        </BlurCard>

        <div className="space-y-6">
          <BlurCard>
            <div className="flex items-center space-x-2 mb-6">
              <Palette className="text-apple-blue" size={20} />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            <div className="flex space-x-4">
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  onClick={() => updateSettings({ theme: t as any })}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    settings.theme === t
                      ? 'border-apple-blue bg-apple-blue/5 text-apple-blue'
                      : 'border-apple-gray-100 dark:border-apple-gray-700 text-apple-gray-400'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </BlurCard>

          <BlurCard>
            <div className="flex items-center space-x-2 mb-6">
              <Save className="text-apple-blue" size={20} />
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Enable Auto-save</span>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                  className="w-5 h-5 accent-apple-blue rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">In-app Notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-apple-blue rounded" />
              </label>
            </div>
          </BlurCard>
        </div>
      </div>
    </div>
  );
};
