import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-apple-gray-900"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="w-24 h-24 bg-apple-blue rounded-[2rem] flex items-center justify-center shadow-2xl shadow-apple-blue/30">
              <span className="text-white text-5xl font-bold tracking-tighter">S</span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-apple-gray-900 dark:text-white">SchedulePro</h1>
              <p className="text-apple-gray-400 font-medium">Professional Resource Planning</p>
            </div>

            <div className="w-48 h-1.5 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-full overflow-hidden mt-8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-apple-blue"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
