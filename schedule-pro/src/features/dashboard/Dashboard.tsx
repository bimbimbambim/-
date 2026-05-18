import React from 'react';
import { BlurCard, GlassButton } from '../../components/ui';
import { useAppStore } from '../../store/appStore';
import { useHistoryStore } from '../../store/settingsStore';
import { Users, BookOpen, MapPin, Calendar, Clock, History } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { teachers, subjects, rooms, classes, slots } = useAppStore();
  const { history } = useHistoryStore();

  const stats = [
    { label: 'Teachers', value: teachers.length, icon: Users, color: 'text-blue-500' },
    { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'text-green-500' },
    { label: 'Rooms', value: rooms.length, icon: MapPin, color: 'text-purple-500' },
    { label: 'Classes', value: classes.length, icon: Calendar, color: 'text-orange-500' },
    { label: 'Time Slots', value: slots.length, icon: Clock, color: 'text-pink-500' },
    { label: 'History', value: history.length, icon: History, color: 'text-gray-500' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-apple-gray-900 dark:text-white">
          Overview
        </h1>
        <p className="mt-2 text-apple-gray-400">
          Monitor your school resources and generation history.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <BlurCard className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl bg-white dark:bg-apple-gray-700 shadow-sm ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-apple-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-apple-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </BlurCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BlurCard>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-3 rounded-xl bg-apple-gray-100/50 dark:bg-apple-gray-700/50">
                  <div>
                    <p className="font-medium">{entry.configName}</p>
                    <p className="text-xs text-apple-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-apple-blue">{entry.fitness.toFixed(0)} pts</p>
                    <p className="text-xs text-apple-gray-400">{entry.conflicts} conflicts</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-apple-gray-400 italic text-center py-8">No history yet.</p>
            )}
          </div>
        </BlurCard>

        <BlurCard className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <p className="text-apple-gray-400 mb-6">
              Ready to generate a new schedule? Make sure your data is imported first.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <GlassButton className="w-full">Import Excel</GlassButton>
            <GlassButton variant="secondary" className="w-full">Settings</GlassButton>
          </div>
        </BlurCard>
      </div>
    </div>
  );
};
