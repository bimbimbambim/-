import React, { useState } from 'react';
import { useSettingsStore } from './store/settingsStore';
import { Dashboard } from './features/dashboard/Dashboard';
import { GeneratorView } from './features/generator/GeneratorView';
import { HistoryView } from './features/history/HistoryView';
import { SettingsView } from './features/settings/SettingsView';
import { NotificationProvider } from './components/ui/NotificationSystem';
import { SplashScreen } from './components/ui/SplashScreen';
import { LayoutGrid, PlayCircle, History, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { settings, updateSettings } = useSettingsStore();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'generator', label: 'Generator', icon: PlayCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <NotificationProvider>
      {!isLoaded && <SplashScreen onComplete={() => setIsLoaded(true)} />}
      <div className={`min-h-screen transition-colors duration-500 ${settings.theme === 'dark' ? 'dark bg-apple-gray-900 text-white' : 'bg-apple-gray-50 text-apple-gray-900'}`}>

        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-apple-gray-200 dark:border-apple-gray-800 z-40 hidden md:block">
          <div className="p-8">
            <h2 className="text-2xl font-bold tracking-tighter flex items-center space-x-2">
              <span className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white text-lg">S</span>
              <span>SchedulePro</span>
            </h2>
          </div>

          <nav className="px-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                  ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/20'
                  : 'text-apple-gray-400 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-8 left-4 right-4">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl glass hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
            >
              {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-medium">Switch Theme</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:ml-64 p-8 md:p-12 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'generator' && <GeneratorView />}
              {activeTab === 'history' && <HistoryView />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </NotificationProvider>
  );
}

export default App;
